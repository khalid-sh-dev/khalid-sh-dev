import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Eye, MousePointerClick, Briefcase, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "التحليلات — لوحة التحكم" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AnalyticsPage,
});

type EventRow = { event_type: string; path: string | null; label: string | null; created_at: string };

function AnalyticsPage() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { setOk(false); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", sess.session.user.id);
      const admin = !!roles?.some(r => r.role === "admin");
      setOk(admin);
      if (!admin) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any).from("page_events")
        .select("event_type,path,label,created_at")
        .order("created_at", { ascending: false })
        .limit(2000);
      if (data) setRows(data as EventRow[]);
      setLoading(false);
    })();
  }, []);

  if (ok === null) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>;
  if (!ok) return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-3" />
        <div className="font-display text-xl mb-2">مطلوب صلاحية مدير</div>
        <Link to="/admin" className="text-primary text-sm">← الذهاب لتسجيل الدخول</Link>
      </div>
    </div>
  );

  const now = Date.now();
  const in24h = rows.filter(r => now - new Date(r.created_at).getTime() < 24 * 3600 * 1000);
  const in7d = rows.filter(r => now - new Date(r.created_at).getTime() < 7 * 24 * 3600 * 1000);
  const views = rows.filter(r => r.event_type === "page_view").length;
  const clicksContact = rows.filter(r => r.event_type === "contact_click").length;
  const portfolioViews = rows.filter(r => r.event_type === "portfolio_view").length;

  // Group daily views for last 14 days
  const days: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 24 * 3600 * 1000);
    const key = d.toISOString().slice(0, 10);
    const count = rows.filter(r => r.event_type === "page_view" && r.created_at.startsWith(key)).length;
    days.push({ day: key.slice(5), count });
  }
  const max = Math.max(1, ...days.map(d => d.count));

  const stats = [
    { icon: Eye, label: "زيارات الصفحة (إجمالي)", value: views, color: "from-cyan-500/20 to-blue-500/20" },
    { icon: MousePointerClick, label: "نقرات زر تواصل معي", value: clicksContact, color: "from-emerald-500/20 to-cyan-500/20" },
    { icon: Briefcase, label: "عرض بطاقات الأعمال", value: portfolioViews, color: "from-violet-500/20 to-fuchsia-500/20" },
    { icon: BarChart3, label: "نشاط اليوم", value: in24h.length, color: "from-amber-500/20 to-orange-500/20" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl">لوحة التحليلات</h1>
            <p className="text-sm text-muted-foreground mt-1">نشاط الزوار، النقرات، وأداء الموقع.</p>
          </div>
          <Link to="/admin" className="text-xs glass rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 hover:border-primary/40 transition">
            <ArrowRight className="h-3.5 w-3.5" /> عودة للوحة
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary inline"/></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className={`glass-strong rounded-2xl p-5 relative overflow-hidden`}>
                  <div className={`absolute -top-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} blur-2xl opacity-60`} />
                  <div className="relative">
                    <s.icon className="h-5 w-5 text-primary" />
                    <div className="font-display text-3xl mt-3">{s.value.toLocaleString("ar-SA")}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-strong rounded-2xl p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold">زيارات آخر 14 يوماً</div>
                <div className="text-xs text-muted-foreground">{in7d.filter(r=>r.event_type==="page_view").length} زيارة/أسبوع</div>
              </div>
              <div className="flex items-end gap-1.5 h-40">
                {days.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md bg-[image:var(--gradient-cyan)]" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 2, opacity: d.count ? 1 : 0.15 }} title={`${d.day}: ${d.count}`} />
                    <div className="text-[9px] text-muted-foreground" dir="ltr">{d.day}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-5 mt-6">
              <div className="font-bold mb-3">آخر 20 حدثاً</div>
              <div className="divide-y divide-border/40 text-sm">
                {rows.slice(0, 20).map((r, i) => (
                  <div key={i} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-primary">{r.event_type}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{r.label || r.path || "—"}</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString("ar-SA")}</div>
                  </div>
                ))}
                {rows.length === 0 && <div className="text-center text-muted-foreground py-6 text-sm">لا توجد أحداث مسجّلة بعد.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
