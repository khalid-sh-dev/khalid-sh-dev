import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Save, ArrowRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/qualifications")({
  head: () => ({ meta: [{ title: "إدارة المؤهلات" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Page,
});

type Q = {
  id: string;
  title_ar: string;
  title_en: string | null;
  institution_ar: string | null;
  institution_en: string | null;
  year: string | null;
  type: string | null;
  url: string | null;
  display_order: number;
  is_published: boolean;
};

const empty: Omit<Q, "id"> = {
  title_ar: "", title_en: "", institution_ar: "", institution_en: "",
  year: "", type: "certificate", url: "", display_order: 0, is_published: true,
};

function Page() {
  const [items, setItems] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState<Omit<Q, "id">>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { setIsAdmin(false); setLoading(false); return; }
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", s.session.user.id);
      const admin = !!r?.some(x => x.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      setLoading(false);
    })();
  }, []);

  async function load() {
    const { data } = await (supabase as any).from("qualifications").select("*").order("display_order");
    if (data) setItems(data as unknown as Q[]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_ar.trim()) { toast.error("العنوان بالعربية مطلوب"); return; }
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await (supabase as any).from("qualifications").update(form).eq("id", editingId);
        if (error) throw error;
        toast.success("تم التحديث");
      } else {
        const { error } = await (supabase as any).from("qualifications").insert(form);
        if (error) throw error;
        toast.success("تمت الإضافة");
      }
      setForm(empty); setEditingId(null);
      await load();
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا العنصر؟")) return;
    const { error } = await (supabase as any).from("qualifications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    await load();
  }

  function edit(q: Q) {
    setEditingId(q.id);
    setForm({ ...q });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <div className="min-h-screen grid place-items-center text-sm">تحتاج صلاحية مدير. <Link to="/admin" className="text-primary underline mr-2">دخول</Link></div>;

  return (
    <div className="min-h-screen">
      <header className="glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/admin" className="text-xs glass rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1"><ArrowRight className="h-3.5 w-3.5"/> اللوحة</Link>
          <div className="font-bold text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary"/> إدارة المؤهلات والشهادات</div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl p-4 space-y-6">
        <form onSubmit={save} className="glass-strong rounded-2xl p-4 grid sm:grid-cols-2 gap-3">
          <input required placeholder="العنوان بالعربية *" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Title (EN)" value={form.title_en || ""} onChange={e => setForm({...form, title_en: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <input placeholder="الجهة المانحة (عربي)" value={form.institution_ar || ""} onChange={e => setForm({...form, institution_ar: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <input placeholder="Institution (EN)" value={form.institution_en || ""} onChange={e => setForm({...form, institution_en: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <input placeholder="السنة (مثال: 2024)" value={form.year || ""} onChange={e => setForm({...form, year: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <select value={form.type || "certificate"} onChange={e => setForm({...form, type: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm">
            <option value="degree">شهادة أكاديمية</option>
            <option value="certificate">شهادة مهنية</option>
            <option value="course">دورة</option>
          </select>
          <input placeholder="رابط التحقق (اختياري)" value={form.url || ""} onChange={e => setForm({...form, url: e.target.value})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm sm:col-span-2" />
          <input type="number" placeholder="ترتيب العرض" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} className="bg-input border border-border rounded-xl px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-xs px-2">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} />
            منشور للعموم
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 rounded-xl text-background py-2.5 font-bold disabled:opacity-50 inline-flex items-center justify-center gap-2" style={{ background: "var(--gradient-cyan)" }}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : editingId ? <Save className="h-4 w-4"/> : <Plus className="h-4 w-4"/>}
              {editingId ? "حفظ التعديلات" : "إضافة"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="rounded-xl glass px-4 text-sm">إلغاء</button>
            )}
          </div>
        </form>

        <div className="space-y-2">
          {items.map(q => (
            <div key={q.id} className="glass rounded-xl p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{q.title_ar} {!q.is_published && <span className="text-[10px] text-destructive">(مخفي)</span>}</div>
                <div className="text-[11px] text-muted-foreground truncate">{q.institution_ar} · {q.year}</div>
              </div>
              <button onClick={() => edit(q)} className="text-xs glass rounded-lg px-2.5 py-1.5">تعديل</button>
              <button onClick={() => remove(q.id)} className="text-xs rounded-lg px-2.5 py-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5"/></button>
            </div>
          ))}
          {items.length === 0 && <div className="text-center text-sm text-muted-foreground py-8">لا توجد شهادات بعد.</div>}
        </div>
      </div>
    </div>
  );
}
