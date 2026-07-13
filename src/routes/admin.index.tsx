import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, GraduationCap, Link as LinkIcon, MessageSquare } from "lucide-react";

// Hub page shown at /admin (uses admin.tsx as the entry; kept for completeness).
export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "لوحة التحكم" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Hub,
});

function Hub() {
  const cards = [
    { to: "/admin", icon: MessageSquare, label: "الدردشات", desc: "الرد على رسائل الزوار المسجّلين" },
    { to: "/admin/portfolio", icon: Briefcase, label: "معرض الأعمال", desc: "إضافة/تعديل/حذف المشاريع" },
    { to: "/admin/qualifications", icon: GraduationCap, label: "المؤهلات والشهادات", desc: "إدارة الشهادات الأكاديمية والمهنية" },
    { to: "/admin/links", icon: LinkIcon, label: "روابط التواصل", desc: "إدارة روابط السوشيال والتواصل" },
  ];
  return (
    <div className="min-h-screen p-6">
      <h1 className="font-display text-2xl mb-6">لوحة التحكم</h1>
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="glass-strong rounded-2xl p-5 hover:border-primary/40 transition flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl grid place-items-center text-background" style={{ background: "var(--gradient-cyan)" }}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">{c.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
