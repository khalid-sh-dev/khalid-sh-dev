import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "ما الخدمات اللي تقدّمها؟",
  "كم تكلفة بناء نظام أتمتة؟",
  "كيف تشتغل حملات Snapchat؟",
  "أبغى عرض سعر لمشروعي",
];

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "أهلاً! 👋 أنا المساعد الذكي للمهندس خالد. اسألني عن الخدمات، الأتمتة، الحملات الإعلانية، أو أي تفاصيل عن مشروعك.",
    },
  ]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
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
      setMessages(m => [
        ...m,
        { role: "assistant", content: "حصل خلل بالاتصال. جرّب لاحقاً أو راسلني عبر النموذج." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        onClick={() => setOpen(o => !o)}
        aria-label="مساعد الذكاء الاصطناعي"
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

      {/* Hint label */}
      {!open && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6 }}
          className="hidden sm:flex fixed bottom-9 left-24 z-[60] glass-strong rounded-full px-3 py-1.5 text-xs items-center gap-1.5 pointer-events-none"
        >
          <Bot className="h-3.5 w-3.5 text-primary" />
          مساعد ذكي
        </motion.div>
      )}

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 left-2 right-2 sm:left-6 sm:right-auto z-[59] sm:w-[400px] max-w-[calc(100vw-1rem)] glass-strong rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(560px, calc(100vh - 8rem))" }}
            role="dialog"
            aria-label="نافذة المساعد الذكي"
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
                <div className="font-bold text-sm">المساعد الذكي</div>
                <div className="text-[11px] text-muted-foreground">يجيب عن استفساراتك فوراً · مدعوم بالذكاء الاصطناعي</div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "glass border border-border/60 rounded-bl-sm"
                    }`}
                  >
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

            {/* Quick starters */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full glass hover:border-primary/40 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border/50 flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="إرسال"
                className="h-10 w-10 grid place-items-center rounded-xl text-background disabled:opacity-50 hover:scale-105 active:scale-95 transition"
                style={{ background: "var(--gradient-cyan)" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
