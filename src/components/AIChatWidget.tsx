// Direct chat widget — talk to Khalid only, no AI/credits.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LiveMsg = { id: string; sender: "user" | "admin"; content: string; created_at: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const [liveInput, setLiveInput] = useState("");
  const [liveMsgs, setLiveMsgs] = useState<LiveMsg[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user?.id ?? null);
      setUserEmail(s?.user?.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setUserEmail(data.session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) { setConvoId(null); setLiveMsgs([]); return; }
    let cancel = false;
    (async () => {
      const { data: existing } = await supabase
        .from("conversations").select("id").eq("user_id", userId)
        .order("last_message_at", { ascending: false }).limit(1).maybeSingle();
      if (!cancel && existing?.id) setConvoId(existing.id);
    })();
    return () => { cancel = true; };
  }, [userId]);

  useEffect(() => {
    if (!convoId) return;
    let cancel = false;
    (async () => {
      const { data } = await supabase.from("messages").select("id,sender,content,created_at")
        .eq("conversation_id", convoId).order("created_at");
      if (!cancel && data) setLiveMsgs(data as LiveMsg[]);
    })();
    const ch = supabase.channel(`convo-${convoId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convoId}` }, (payload) => {
        const m = payload.new as LiveMsg;
        setLiveMsgs(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m]);
      }).subscribe();
    return () => { cancel = true; supabase.removeChannel(ch); };
  }, [convoId]);

  useEffect(() => { scrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [liveMsgs, liveLoading, open]);

  async function ensureConversation(): Promise<string | null> {
    if (!userId) return null;
    if (convoId) return convoId;
    const { data, error } = await supabase.from("conversations").insert({
      user_id: userId, visitor_id: userId,
      visitor_name: userEmail?.split("@")[0] || null, visitor_email: userEmail,
    }).select("id").single();
    if (error) { alert("تعذّر بدء المحادثة: " + error.message); return null; }
    setConvoId(data.id);
    return data.id;
  }

  async function sendLive(text: string) {
    const trimmed = text.trim();
    if (!trimmed || liveLoading || !userId) return;
    setLiveLoading(true);
    try {
      const cid = await ensureConversation();
      if (!cid) return;
      const { error } = await supabase.from("messages").insert({ conversation_id: cid, sender: "user", content: trimmed });
      if (error) throw error;
      await supabase.from("conversations").update({
        last_message_at: new Date().toISOString(),
        last_message_preview: trimmed.slice(0, 140),
        unread_admin_count: 1, unread_user_count: 0, status: "open",
      }).eq("id", cid);
      setLiveInput("");
    } catch (e) {
      alert("تعذّر إرسال الرسالة: " + (e as Error).message);
    } finally { setLiveLoading(false); }
  }

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr(null); setAuthBusy(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail, password: authPass,
          options: { data: { full_name: authName }, emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
      }
    } catch (err) { setAuthErr((err as Error).message); }
    finally { setAuthBusy(false); }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen(o => !o)} aria-label="دردشة مع خالد"
        className="fixed bottom-20 md:bottom-5 left-5 sm:left-6 z-[60] h-14 w-14 sm:h-16 sm:w-16 rounded-full grid place-items-center text-background shadow-2xl glow-cyan hover:scale-105 active:scale-95 transition"
        style={{ background: "var(--gradient-cyan)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open
            ? <motion.span key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><X className="h-6 w-6"/></motion.span>
            : <motion.span key="s" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} className="relative"><MessageSquare className="h-6 w-6"/><span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse border-2 border-background"/></motion.span>}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-36 md:bottom-24 left-2 right-2 sm:left-6 sm:right-auto z-[59] sm:w-[400px] max-w-[calc(100vw-1rem)] glass-strong rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(580px, calc(100vh - 10rem))" }} role="dialog"
          >
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3" style={{ background: "var(--gradient-card)" }}>
              <div className="relative">
                <div className="h-10 w-10 rounded-xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}><MessageSquare className="h-5 w-5"/></div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">دردشة مع المهندس خالد</div>
                <div className="text-[11px] text-muted-foreground">راسل خالد مباشرة — رد خلال 24 ساعة</div>
              </div>
            </div>

            {!userId ? (
              <form onSubmit={submitAuth} className="flex-1 flex flex-col items-center justify-center px-6 gap-3 text-center">
                <div className="h-14 w-14 rounded-2xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}><User className="h-7 w-7"/></div>
                <div>
                  <div className="font-bold">{authMode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}</div>
                  <div className="text-xs text-muted-foreground mt-1">لبدء الدردشة مع خالد يجب إنشاء حساب مجاني.</div>
                </div>
                {authMode === "signup" && (
                  <input value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="اسمك الكامل" className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"/>
                )}
                <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" dir="ltr"/>
                <input type="password" required minLength={6} value={authPass} onChange={(e) => setAuthPass(e.target.value)} placeholder="كلمة المرور (6+ أحرف)" className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" dir="ltr"/>
                {authErr && <div className="text-xs text-destructive">{authErr}</div>}
                <button type="submit" disabled={authBusy} className="w-full rounded-xl text-background py-2.5 font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition" style={{ background: "var(--gradient-cyan)" }}>
                  {authBusy ? "..." : authMode === "login" ? "دخول" : "إنشاء حساب"}
                </button>
                <button type="button" onClick={() => setAuthMode(m => m === "login" ? "signup" : "login")} className="text-xs text-primary">
                  {authMode === "login" ? "ليس لديك حساب؟ سجّل الآن" : "لدي حساب — تسجيل الدخول"}
                </button>
              </form>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>مسجّل: <span className="text-primary">{userEmail}</span></span>
                  <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1 hover:text-destructive"><LogOut className="h-3 w-3"/> خروج</button>
                </div>
                <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {liveMsgs.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-8">
                      أهلاً {userEmail?.split("@")[0]} 👋<br />
                      ابدأ الدردشة وسيرد عليك خالد في أقرب وقت.
                    </div>
                  )}
                  {liveMsgs.map((m) => (
                    <motion.div key={m.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`flex ${m.sender === "user" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.sender === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "glass border border-border/60 rounded-bl-sm"}`}>
                        {m.sender === "admin" && <div className="text-[10px] font-bold text-primary mb-0.5">المهندس خالد</div>}
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {liveLoading && <div className="flex justify-start"><div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary"/> جارٍ الإرسال...</div></div>}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); sendLive(liveInput); }} className="p-3 border-t border-border/50 flex items-center gap-2">
                  <input value={liveInput} onChange={(e) => setLiveInput(e.target.value)} placeholder="اكتب رسالتك لخالد..." className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition" disabled={liveLoading}/>
                  <button type="submit" disabled={liveLoading || !liveInput.trim()} aria-label="إرسال" className="h-10 w-10 grid place-items-center rounded-xl text-background disabled:opacity-50 hover:scale-105 active:scale-95 transition" style={{ background: "var(--gradient-cyan)" }}><Send className="h-4 w-4"/></button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
