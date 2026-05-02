import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Loader2, MessageSquare, User, CheckCircle2, Ticket } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };
type LiveMsg = { id: string; sender: "user" | "admin"; content: string; created_at: string };

const STARTERS = [
  "ما الخدمات اللي تقدّمها؟",
  "كم تكلفة بناء نظام أتمتة؟",
  "كيف تشتغل حملات Snapchat؟",
  "أبغى عرض سعر لمشروعي",
];

const VISITOR_ID_KEY = "khalid_visitor_id";
const CONVO_ID_KEY = "khalid_convo_id";
const VISITOR_NAME_KEY = "khalid_visitor_name";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  let v = localStorage.getItem(VISITOR_ID_KEY);
  if (!v) {
    v = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, v);
  }
  return v;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"ai" | "live">("ai");

  // AI tab state
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "أهلاً! 👋 أنا المساعد الذكي للمهندس خالد. اسألني عن الخدمات، الأتمتة، الحملات الإعلانية، أو أي تفاصيل عن مشروعك. وللتواصل المباشر مع خالد اضغط على تبويب \"دردشة مباشرة\".",
    },
  ]);

  // Live chat state
  const [liveInput, setLiveInput] = useState("");
  const [liveMsgs, setLiveMsgs] = useState<LiveMsg[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [needsName, setNeedsName] = useState(true);
  const [justSent, setJustSent] = useState<{ ticket: string; preview: string } | null>(null);
  const [visitorId, setVisitorId] = useState<string>("");

  // A dedicated supabase client that always sends the x-visitor-id header,
  // so RLS policies allow the visitor to read only their own conversation/messages.
  const visitorClient = useMemo(() => {
    if (!visitorId) return null;
    const url = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_URL;
    const key = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: { headers: { "x-visitor-id": visitorId } },
      realtime: { params: { eventsPerSecond: 5, headers: { "x-visitor-id": visitorId } } as Record<string, unknown> },
    });
  }, [visitorId]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const liveScrollerRef = useRef<HTMLDivElement>(null);

  // Init visitor / load existing convo
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = getOrCreateVisitorId();
    setVisitorId(v);
    const savedName = localStorage.getItem(VISITOR_NAME_KEY) || "";
    if (savedName) { setName(savedName); setNeedsName(false); }
    const savedConvo = localStorage.getItem(CONVO_ID_KEY);
    if (savedConvo) { setConvoId(savedConvo); }
  }, []);

  // Load messages when convo opens — uses visitorClient with x-visitor-id header
  useEffect(() => {
    if (!convoId || !visitorClient) return;
    let cancelled = false;
    (async () => {
      const { data } = await visitorClient
        .from("messages")
        .select("id,sender,content,created_at")
        .eq("conversation_id", convoId)
        .order("created_at", { ascending: true });
      if (!cancelled && data) setLiveMsgs(data as LiveMsg[]);
    })();
    const channel = visitorClient
      .channel(`convo-${convoId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convoId}` },
        (payload) => {
          setLiveMsgs(m => {
            const newMsg = payload.new as LiveMsg;
            if (m.some(x => x.id === newMsg.id)) return m;
            return [...m, newMsg];
          });
        })
      .subscribe();
    return () => { cancelled = true; visitorClient.removeChannel(channel); };
  }, [convoId, visitorClient]);

  function ticketFromConvo(id: string): string {
    return "KS-" + id.replace(/-/g, "").slice(0, 8).toUpperCase();
  }

  useEffect(() => { scrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages, loading, open]);
  useEffect(() => { liveScrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [liveMsgs, liveLoading, tab]);

  async function sendAI(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: next.map(m => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      const reply = (data as { reply?: string; error?: string })?.reply
        || (data as { error?: string })?.error
        || "تعذّر الحصول على رد الآن.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages(m => [...m, { role: "assistant", content: "حصل خلل بالاتصال. جرّب لاحقاً أو راسلني عبر النموذج." }]);
    } finally { setLoading(false); }
  }

  async function sendLive(text: string) {
    const trimmed = text.trim();
    if (!trimmed || liveLoading) return;
    if (needsName) return;
    setLiveLoading(true);
    const wasFirst = liveMsgs.length === 0;
    try {
      const v = getOrCreateVisitorId();
      const { data, error } = await supabase.functions.invoke("chat-send", {
        body: {
          visitor_id: v,
          conversation_id: convoId,
          visitor_name: name || null,
          content: trimmed,
        },
      });
      if (error) throw error;
      const newConvoId = (data as { conversation_id?: string })?.conversation_id;
      if (newConvoId && newConvoId !== convoId) {
        setConvoId(newConvoId);
        localStorage.setItem(CONVO_ID_KEY, newConvoId);
      }
      setLiveInput("");
      if (wasFirst && newConvoId) {
        setJustSent({
          ticket: ticketFromConvo(newConvoId),
          preview: trimmed.slice(0, 120),
        });
      }
    } catch (e) {
      console.error(e);
      alert("تعذّر إرسال الرسالة، حاول مرة أخرى.");
    } finally { setLiveLoading(false); }
  }

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    const t = name.trim();
    if (t.length < 2) return;
    localStorage.setItem(VISITOR_NAME_KEY, t);
    setNeedsName(false);
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen(o => !o)}
        aria-label="مساعد ودردشة مباشرة"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[60] h-14 w-14 sm:h-16 sm:w-16 rounded-full grid place-items-center text-background shadow-2xl glow-cyan hover:scale-105 active:scale-95 transition"
        style={{ background: "var(--gradient-cyan)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <Sparkles className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse border-2 border-background" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {!open && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}
          className="hidden sm:flex fixed bottom-9 left-24 z-[60] glass-strong rounded-full px-3 py-1.5 text-xs items-center gap-1.5 pointer-events-none">
          <Bot className="h-3.5 w-3.5 text-primary" />
          ذكاء + دردشة
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 left-2 right-2 sm:left-6 sm:right-auto z-[59] sm:w-[400px] max-w-[calc(100vw-1rem)] glass-strong rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(580px, calc(100vh - 8rem))" }}
            role="dialog"
            aria-label="نافذة الدردشة"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3" style={{ background: "var(--gradient-card)" }}>
              <div className="relative">
                <div className="h-10 w-10 rounded-xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}>
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">دردشة المهندس خالد</div>
                <div className="text-[11px] text-muted-foreground">رد فوري بالذكاء الاصطناعي · أو راسل خالد مباشرة</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border/50">
              <button
                onClick={() => setTab("ai")}
                className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition ${tab === "ai" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                مساعد ذكي
              </button>
              <button
                onClick={() => setTab("live")}
                className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition ${tab === "live" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                دردشة مباشرة
              </button>
            </div>

            {tab === "ai" ? (
              <>
                <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "glass border border-border/60 rounded-bl-sm"}`}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-end">
                      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        يكتب الرد...
                      </div>
                    </div>
                  )}
                </div>
                {messages.length <= 1 && !loading && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {STARTERS.map(s => (
                      <button key={s} onClick={() => sendAI(s)} className="text-[11px] px-2.5 py-1 rounded-full glass hover:border-primary/40 transition">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); sendAI(input); }} className="p-3 border-t border-border/50 flex items-center gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب سؤالك هنا..."
                    className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition" disabled={loading} />
                  <button type="submit" disabled={loading || !input.trim()} aria-label="إرسال"
                    className="h-10 w-10 grid place-items-center rounded-xl text-background disabled:opacity-50 hover:scale-105 active:scale-95 transition" style={{ background: "var(--gradient-cyan)" }}>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                {needsName ? (
                  <form onSubmit={saveName} className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
                    <div className="h-14 w-14 rounded-2xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}>
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="font-bold">قبل ما نبدأ الدردشة</div>
                      <div className="text-xs text-muted-foreground mt-1">اكتب اسمك حتى يقدر خالد يرد عليك بشكل شخصي.</div>
                    </div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكريم" autoFocus
                      className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-center focus:outline-none focus:border-primary" />
                    <button type="submit" disabled={name.trim().length < 2}
                      className="w-full rounded-xl text-background py-2.5 font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition"
                      style={{ background: "var(--gradient-cyan)" }}>
                      ابدأ الدردشة
                    </button>
                  </form>
                ) : (
                  <>
                    {justSent && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="mx-3 mt-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-emerald-300">تم استلام رسالتك بنجاح</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">سيتواصل خالد معك في أقرب وقت داخل نفس النافذة.</div>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                            <Ticket className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">رقم تذكرتك:</span>
                            <code className="font-bold text-primary tracking-wider">{justSent.ticket}</code>
                          </div>
                        </div>
                        <button onClick={() => setJustSent(null)} className="text-muted-foreground hover:text-foreground" aria-label="إخفاء">
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    )}
                    <div ref={liveScrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                      {liveMsgs.length === 0 && !justSent && (
                        <div className="text-center text-xs text-muted-foreground py-8">
                          مرحباً {name} 👋<br />
                          ابدأ الدردشة وسيرد عليك خالد في أقرب وقت.
                        </div>
                      )}
                      {liveMsgs.map((m) => (
                        <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex ${m.sender === "user" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "glass border border-border/60 rounded-bl-sm"}`}>
                            {m.sender === "admin" && <div className="text-[10px] font-bold text-primary mb-0.5">المهندس خالد</div>}
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                      {liveLoading && (
                        <div className="flex justify-start">
                          <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                            جارٍ الإرسال...
                          </div>
                        </div>
                      )}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); sendLive(liveInput); }} className="p-3 border-t border-border/50 flex items-center gap-2">
                      <input value={liveInput} onChange={(e) => setLiveInput(e.target.value)} placeholder="اكتب رسالتك لخالد..."
                        className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition" disabled={liveLoading} />
                      <button type="submit" disabled={liveLoading || !liveInput.trim()} aria-label="إرسال"
                        className="h-10 w-10 grid place-items-center rounded-xl text-background disabled:opacity-50 hover:scale-105 active:scale-95 transition" style={{ background: "var(--gradient-cyan)" }}>
                        <Send className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
