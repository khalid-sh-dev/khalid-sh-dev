import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Send, MessageSquare, Mail, ShieldAlert, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — دردشة العملاء" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Conversation = {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  last_message_at: string;
  last_message_preview: string | null;
  unread_admin_count: number;
};

type Message = {
  id: string;
  conversation_id: string;
  sender: "user" | "admin";
  content: string;
  created_at: string;
};

function AdminPage() {
  const [session, setSession] = useState<{ userId: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user ? { userId: s.user.id } : null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ? { userId: data.session.user.id } : null);
      setBootLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.userId);
      setIsAdmin(!!data?.some(r => r.role === "admin"));
    })();
  }, [session]);

  if (bootLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <LoginCard />;
  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <NotAdmin userId={session.userId} />;
  return <Inbox />;
}

function LoginCard() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` }
        });
        if (error) throw error;
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="font-display text-2xl">لوحة التحكم</div>
          <div className="text-xs text-muted-foreground mt-1">دخول المهندس خالد فقط</div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
          <input type="password" required minLength={6} placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
          {err && <div className="text-xs text-destructive">{err}</div>}
          <button type="submit" disabled={busy}
            className="w-full rounded-xl text-background py-2.5 font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition"
            style={{ background: "var(--gradient-cyan)" }}>
            {busy ? "..." : mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
          </button>
        </form>
        <button onClick={() => setMode(m => m === "login" ? "signup" : "login")} className="text-xs text-primary mt-4 w-full text-center">
          {mode === "login" ? "إنشاء حساب جديد" : "لدي حساب — تسجيل الدخول"}
        </button>
      </div>
    </div>
  );
}

function NotAdmin({ userId }: { userId: string }) {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-3" />
        <div className="font-display text-xl mb-2">صلاحية غير كافية</div>
        <p className="text-sm text-muted-foreground mb-4">
          هذا الحساب ليس له صلاحية مدير. لتفعيل لوحة التحكم، يجب إضافة دور <code className="text-primary">admin</code> لمعرف المستخدم التالي عبر قاعدة البيانات:
        </p>
        <code className="block break-all text-[11px] bg-input rounded-lg p-2 mb-4">{userId}</code>
        <p className="text-[11px] text-muted-foreground mb-4">
          نفّذ في محرر SQL: <br />
          <code>insert into user_roles (user_id, role) values ('{userId}', 'admin');</code>
        </p>
        <button onClick={() => supabase.auth.signOut()} className="rounded-xl glass px-4 py-2 text-sm inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" /> خروج
        </button>
      </div>
    </div>
  );
}

function Inbox() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  async function loadConvos() {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false })
      .limit(200);
    if (data) setConvos(data as Conversation[]);
    setLoading(false);
  }

  useEffect(() => {
    loadConvos();
    const ch = supabase.channel("admin-convos")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => loadConvos())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const m = payload.new as Message;
        setMsgs(prev => activeId && m.conversation_id === activeId && !prev.some(x => x.id === m.id) ? [...prev, m] : prev);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    if (!activeId) { setMsgs([]); return; }
    (async () => {
      const { data } = await supabase.from("messages").select("*").eq("conversation_id", activeId).order("created_at", { ascending: true });
      if (data) setMsgs(data as Message[]);
      // mark as read
      await supabase.from("conversations").update({ unread_admin_count: 0 }).eq("id", activeId);
    })();
  }, [activeId]);

  useEffect(() => { scrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !activeId || sending) return;
    setSending(true);
    try {
      const content = reply.trim();
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeId, sender: "admin", content,
      });
      if (error) throw error;
      await supabase.from("conversations").update({
        last_message_at: new Date().toISOString(),
        last_message_preview: content.slice(0, 140),
        unread_user_count: 1,
        unread_admin_count: 0,
      }).eq("id", activeId);
      setReply("");
    } catch (err) {
      console.error(err);
      alert("فشل الإرسال: " + (err as Error).message);
    } finally { setSending(false); }
  }

  const active = convos.find(c => c.id === activeId);
  const totalUnread = convos.reduce((s, c) => s + (c.unread_admin_count || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}>
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm">صندوق الدردشة</div>
            <div className="text-[11px] text-muted-foreground">
              {convos.length} محادثة · <span className="text-primary">{totalUnread}</span> غير مقروءة
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadConvos} className="rounded-lg glass px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> تحديث
          </button>
          <button onClick={() => supabase.auth.signOut()} className="rounded-lg glass px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden">
        {/* Conversation list */}
        <aside className={`border-l border-border/50 overflow-y-auto ${activeId ? "hidden md:block" : ""}`}>
          {loading && <div className="p-6 text-center text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /></div>}
          {!loading && convos.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">لا توجد محادثات بعد.</div>}
          {convos.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`w-full text-right p-4 border-b border-border/40 hover:bg-secondary/50 transition ${activeId === c.id ? "bg-secondary/70" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="font-bold text-sm truncate">{c.visitor_name || "زائر"}</div>
                {c.unread_admin_count > 0 && (
                  <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                    {c.unread_admin_count}
                  </span>
                )}
              </div>
              {c.visitor_email && <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" />{c.visitor_email}</div>}
              <div className="text-xs text-muted-foreground truncate mt-1">{c.last_message_preview || "..."}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{new Date(c.last_message_at).toLocaleString("ar-SA")}</div>
            </button>
          ))}
        </aside>

        {/* Conversation view */}
        <section className={`flex flex-col overflow-hidden ${!activeId ? "hidden md:flex" : ""}`}>
          {!active ? (
            <div className="flex-1 grid place-items-center text-sm text-muted-foreground">اختر محادثة من القائمة</div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{active.visitor_name || "زائر"}</div>
                  {active.visitor_email && <div className="text-[11px] text-muted-foreground">{active.visitor_email}</div>}
                </div>
                <button onClick={() => setActiveId(null)} className="md:hidden text-xs text-primary">رجوع</button>
              </div>
              <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgs.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "user" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.sender === "user" ? "glass border border-border/60 rounded-bl-sm" : "bg-primary text-primary-foreground rounded-br-sm"}`}>
                      {m.content}
                      <div className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString("ar-SA")}</div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendReply} className="p-3 border-t border-border/50 flex items-center gap-2">
                <input value={reply} onChange={e => setReply(e.target.value)} placeholder="اكتب ردك..."
                  className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <button type="submit" disabled={sending || !reply.trim()}
                  className="h-10 w-10 grid place-items-center rounded-xl text-background disabled:opacity-50 hover:scale-105 active:scale-95 transition"
                  style={{ background: "var(--gradient-cyan)" }}>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
