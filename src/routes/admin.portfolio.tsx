import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, LogOut, Plus, Pencil, Trash2, Image as ImageIcon, X, Upload,
  ExternalLink, Eye, EyeOff, ShieldAlert, Languages, ArrowRight, Save,
} from "lucide-react";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({ meta: [{ title: "إدارة معرض الأعمال" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PortfolioAdminPage,
});

const SUPER_ADMIN_EMAIL = "admin@khalid.com";

type Lang = "ar" | "en";

type PortfolioRow = {
  id: string;
  title_ar: string;
  title_en: string | null;
  description_ar: string;
  description_en: string | null;
  short_description_ar: string | null;
  short_description_en: string | null;
  thumbnail_url: string | null;
  images: string[];
  external_url: string | null;
  category: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

type FormState = {
  id?: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  short_description_ar: string;
  short_description_en: string;
  external_url: string;
  category: string;
  display_order: number;
  is_published: boolean;
  thumbnail_url: string;
  images: string[];
};

const T = {
  ar: {
    dir: "rtl" as const,
    title: "إدارة معرض الأعمال",
    subtitle: "أضف وعدّل واحذف أعمالك المعروضة على الموقع",
    backHome: "الرئيسية",
    logout: "خروج",
    newItem: "عمل جديد",
    edit: "تعديل",
    delete: "حذف",
    deleteConfirm: "هل أنت متأكد من حذف هذا العمل؟",
    publish: "منشور",
    draft: "مسودة",
    noItems: "لا توجد أعمال بعد. ابدأ بإضافة عمل جديد.",
    formTitle: "بيانات العمل",
    titleAr: "العنوان (عربي)",
    titleEn: "العنوان (English)",
    shortAr: "وصف مختصر (عربي)",
    shortEn: "Short description (English)",
    descAr: "الوصف المفصل (عربي)",
    descEn: "Detailed description (English)",
    category: "التصنيف",
    externalUrl: "الرابط الخارجي",
    order: "ترتيب العرض",
    published: "نشر العمل",
    thumb: "الصورة المصغرة",
    gallery: "صور إضافية",
    upload: "رفع صور",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
    cancel: "إلغاء",
    accessDenied: "صلاحية غير كافية",
    accessDeniedDesc: "هذه الصفحة مخصصة للمسؤول الرئيسي فقط.",
    saveSuccess: "تم حفظ العمل بنجاح",
    deleteSuccess: "تم حذف العمل",
    uploadSuccess: "تم رفع الصور",
    errorPrefix: "حدث خطأ:",
    requiredField: "هذا الحقل مطلوب",
  },
  en: {
    dir: "ltr" as const,
    title: "Portfolio Management",
    subtitle: "Add, edit and delete portfolio items shown on the site",
    backHome: "Home",
    logout: "Logout",
    newItem: "New Item",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Delete this item?",
    publish: "Published",
    draft: "Draft",
    noItems: "No items yet. Start by adding one.",
    formTitle: "Item Details",
    titleAr: "Title (Arabic)",
    titleEn: "Title (English)",
    shortAr: "Short description (Arabic)",
    shortEn: "Short description (English)",
    descAr: "Full description (Arabic)",
    descEn: "Full description (English)",
    category: "Category",
    externalUrl: "External link",
    order: "Display order",
    published: "Publish",
    thumb: "Thumbnail",
    gallery: "Gallery images",
    upload: "Upload images",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    accessDenied: "Access denied",
    accessDeniedDesc: "This page is for the super admin only.",
    saveSuccess: "Item saved",
    deleteSuccess: "Item deleted",
    uploadSuccess: "Images uploaded",
    errorPrefix: "Error:",
    requiredField: "Required",
  },
};

function emptyForm(): FormState {
  return {
    title_ar: "", title_en: "",
    description_ar: "", description_en: "",
    short_description_ar: "", short_description_en: "",
    external_url: "", category: "",
    display_order: 0, is_published: true,
    thumbnail_url: "", images: [],
  };
}

function PortfolioAdminPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = T[lang];
  const [bootLoading, setBootLoading] = useState(true);
  const [session, setSession] = useState<{ userId: string; email: string | null } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s?.user ? { userId: s.user.id, email: s.user.email ?? null } : null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session?.user ? { userId: data.session.user.id, email: data.session.user.email ?? null } : null);
      setBootLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.userId);
      const hasRole = !!data?.some(r => r.role === "admin");
      setIsAdmin(hasRole && session.email === SUPER_ADMIN_EMAIL);
    })();
  }, [session]);

  if (bootLoading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <LoginCard lang={lang} setLang={setLang} t={t} />;
  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!isAdmin) return <NotAdmin t={t} email={session.email} />;
  return <Dashboard lang={lang} setLang={setLang} t={t} />;
}

function LoginCard({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: typeof T.ar }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success(lang === "ar" ? "تم تسجيل الدخول" : "Signed in");
    } catch (e) {
      toast.error(t.errorPrefix + " " + (e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div dir={t.dir} className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md w-full">
        <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-xs text-primary mb-4 inline-flex items-center gap-1">
          <Languages className="h-3.5 w-3.5" /> {lang === "ar" ? "English" : "العربية"}
        </button>
        <div className="text-center mb-6">
          <div className="font-display text-2xl">{t.title}</div>
          <div className="text-xs text-muted-foreground mt-1">{lang === "ar" ? "الدخول للمسؤول الرئيسي" : "Super Admin only"}</div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"} value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
          <input type="password" required minLength={6} placeholder={lang === "ar" ? "كلمة المرور" : "Password"} value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
          <button type="submit" disabled={busy}
            className="w-full rounded-xl text-background py-2.5 font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition"
            style={{ background: "var(--gradient-cyan)" }}>
            {busy ? "..." : (lang === "ar" ? "تسجيل الدخول" : "Sign in")}
          </button>
        </form>
      </div>
    </div>
  );
}

function NotAdmin({ t, email }: { t: typeof T.ar; email: string | null }) {
  return (
    <div dir={t.dir} className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-3xl p-8 max-w-md w-full text-center">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-3" />
        <div className="font-display text-xl mb-2">{t.accessDenied}</div>
        <p className="text-sm text-muted-foreground mb-3">{t.accessDeniedDesc}</p>
        {email && <code className="block break-all text-[11px] bg-input rounded-lg p-2 mb-4">{email}</code>}
        <button onClick={() => supabase.auth.signOut()} className="rounded-xl glass px-4 py-2 text-sm inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" /> {t.logout}
        </button>
      </div>
    </div>
  );
}

function Dashboard({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: typeof T.ar }) {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormState | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_items").select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(t.errorPrefix + " " + error.message);
    else setItems((data || []) as PortfolioRow[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm(t.deleteConfirm)) return;
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) toast.error(t.errorPrefix + " " + error.message);
    else { toast.success(t.deleteSuccess); load(); }
  }

  function startEdit(row: PortfolioRow) {
    setEditing({
      id: row.id,
      title_ar: row.title_ar,
      title_en: row.title_en || "",
      description_ar: row.description_ar,
      description_en: row.description_en || "",
      short_description_ar: row.short_description_ar || "",
      short_description_en: row.short_description_en || "",
      external_url: row.external_url || "",
      category: row.category || "",
      display_order: row.display_order,
      is_published: row.is_published,
      thumbnail_url: row.thumbnail_url || "",
      images: row.images || [],
    });
  }

  return (
    <div dir={t.dir} className="min-h-screen flex flex-col">
      <header className="glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl grid place-items-center text-background shrink-0" style={{ background: "var(--gradient-cyan)" }}>
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{t.title}</div>
            <div className="text-[11px] text-muted-foreground truncate">{t.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="rounded-lg glass px-2.5 py-1.5 text-xs inline-flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5" /> {lang === "ar" ? "EN" : "AR"}
          </button>
          <Link to="/" className="rounded-lg glass px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
            <ArrowRight className={`h-3.5 w-3.5 ${lang === "ar" ? "rotate-180" : ""}`} /> {t.backHome}
          </Link>
          <button onClick={() => supabase.auth.signOut()} className="rounded-lg glass px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> {t.logout}
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm text-muted-foreground">{items.length} {lang === "ar" ? "عمل" : "items"}</div>
          <button onClick={() => setEditing(emptyForm())}
            className="inline-flex items-center gap-2 rounded-xl text-background px-4 py-2.5 font-bold hover:scale-[1.02] active:scale-95 transition"
            style={{ background: "var(--gradient-cyan)" }}>
            <Plus className="h-4 w-4" /> {t.newItem}
          </button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-strong rounded-3xl p-12 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-primary/60" />
            <p className="mt-4 text-muted-foreground">{t.noItems}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(row => (
              <article key={row.id} className="glass-strong rounded-2xl overflow-hidden flex flex-col">
                <div className="relative h-36 bg-secondary/30">
                  {row.thumbnail_url ? (
                    <img src={row.thumbnail_url} alt={row.title_ar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground"><ImageIcon className="h-10 w-10" /></div>
                  )}
                  <div className={`absolute top-2 ${lang === "ar" ? "left-2" : "right-2"} text-[10px] font-bold rounded-full px-2 py-0.5 inline-flex items-center gap-1 ${row.is_published ? "bg-emerald-500/20 text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                    {row.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {row.is_published ? t.publish : t.draft}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-sm">{row.title_ar}</div>
                  {row.category && <div className="text-[11px] text-muted-foreground mt-0.5">{row.category}</div>}
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{row.short_description_ar || row.description_ar}</p>
                  <div className="mt-auto pt-3 flex items-center gap-2">
                    <button onClick={() => startEdit(row)} className="flex-1 rounded-lg glass text-xs py-1.5 inline-flex items-center justify-center gap-1 hover:border-primary/40">
                      <Pencil className="h-3 w-3" /> {t.edit}
                    </button>
                    {row.external_url && (
                      <a href={row.external_url} target="_blank" rel="noopener noreferrer" className="rounded-lg glass text-xs px-2 py-1.5 inline-flex items-center justify-center hover:border-primary/40">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <button onClick={() => remove(row.id)} className="rounded-lg bg-destructive/10 text-destructive text-xs px-2 py-1.5 inline-flex items-center justify-center hover:bg-destructive/20">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <ItemDialog
          lang={lang} t={t}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ItemDialog({ lang, t, initial, onClose, onSaved }: {
  lang: Lang; t: typeof T.ar; initial: FormState; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) { setForm(p => ({ ...p, [k]: v })); }

  async function uploadFiles(files: FileList | null, kind: "thumb" | "gallery") {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      if (kind === "thumb") update("thumbnail_url", urls[0]);
      else update("images", [...form.images, ...urls]);
      toast.success(t.uploadSuccess);
    } catch (e) {
      toast.error(t.errorPrefix + " " + (e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      if (thumbRef.current) thumbRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    update("images", form.images.filter(u => u !== url));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.description_ar.trim()) {
      toast.error(t.requiredField);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title_ar: form.title_ar.trim(),
        title_en: form.title_en.trim() || null,
        description_ar: form.description_ar.trim(),
        description_en: form.description_en.trim() || null,
        short_description_ar: form.short_description_ar.trim() || null,
        short_description_en: form.short_description_en.trim() || null,
        thumbnail_url: form.thumbnail_url || null,
        images: form.images,
        external_url: form.external_url.trim() || null,
        category: form.category.trim() || null,
        display_order: form.display_order || 0,
        is_published: form.is_published,
      };
      if (form.id) {
        const { error } = await supabase.from("portfolio_items").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("portfolio_items").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
      }
      toast.success(t.saveSuccess);
      onSaved();
    } catch (e) {
      toast.error(t.errorPrefix + " " + (e as Error).message);
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass-strong rounded-3xl w-full max-w-3xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="font-bold">{t.formTitle}</div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary/50"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={save} className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t.titleAr} required>
              <input value={form.title_ar} onChange={e => update("title_ar", e.target.value)} className={inputCls} required dir="rtl" />
            </Field>
            <Field label={t.titleEn}>
              <input value={form.title_en} onChange={e => update("title_en", e.target.value)} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t.shortAr}>
              <input value={form.short_description_ar} onChange={e => update("short_description_ar", e.target.value)} className={inputCls} dir="rtl" />
            </Field>
            <Field label={t.shortEn}>
              <input value={form.short_description_en} onChange={e => update("short_description_en", e.target.value)} className={inputCls} dir="ltr" />
            </Field>
            <Field label={t.descAr} required className="sm:col-span-2">
              <textarea value={form.description_ar} onChange={e => update("description_ar", e.target.value)} rows={3} className={inputCls + " min-h-[80px]"} required dir="rtl" />
            </Field>
            <Field label={t.descEn} className="sm:col-span-2">
              <textarea value={form.description_en} onChange={e => update("description_en", e.target.value)} rows={3} className={inputCls + " min-h-[80px]"} dir="ltr" />
            </Field>
            <Field label={t.category}>
              <input value={form.category} onChange={e => update("category", e.target.value)} className={inputCls} placeholder={lang === "ar" ? "مثلاً: SaaS, Ads, Automation" : "e.g. SaaS, Ads"} />
            </Field>
            <Field label={t.externalUrl}>
              <input type="url" value={form.external_url} onChange={e => update("external_url", e.target.value)} className={inputCls} placeholder="https://..." dir="ltr" />
            </Field>
            <Field label={t.order}>
              <input type="number" value={form.display_order} onChange={e => update("display_order", parseInt(e.target.value) || 0)} className={inputCls} />
            </Field>
            <Field label={t.published}>
              <label className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={form.is_published} onChange={e => update("is_published", e.target.checked)} className="h-4 w-4 accent-primary" />
                <span className="text-sm">{t.published}</span>
              </label>
            </Field>
          </div>

          {/* Thumbnail */}
          <Field label={t.thumb}>
            <div className="flex items-center gap-3">
              {form.thumbnail_url && (
                <div className="relative h-20 w-32 rounded-lg overflow-hidden border border-border">
                  <img src={form.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => update("thumbnail_url", "")} className="absolute top-1 right-1 h-5 w-5 grid place-items-center rounded-full bg-destructive text-destructive-foreground"><X className="h-3 w-3" /></button>
                </div>
              )}
              <label className="cursor-pointer rounded-lg glass px-3 py-2 text-xs inline-flex items-center gap-1.5 hover:border-primary/40">
                <Upload className="h-3.5 w-3.5" /> {t.upload}
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={e => uploadFiles(e.target.files, "thumb")} />
              </label>
            </div>
          </Field>

          {/* Gallery */}
          <Field label={t.gallery}>
            <div className="flex flex-wrap gap-2">
              {form.images.map(url => (
                <div key={url} className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 right-0.5 h-4 w-4 grid place-items-center rounded-full bg-destructive text-destructive-foreground"><X className="h-2.5 w-2.5" /></button>
                </div>
              ))}
              <label className="cursor-pointer h-16 w-16 rounded-lg border-2 border-dashed border-border grid place-items-center hover:border-primary/40 transition">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => uploadFiles(e.target.files, "gallery")} />
              </label>
            </div>
          </Field>

          {uploading && <div className="text-xs text-primary inline-flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> {t.upload}...</div>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
            <button type="button" onClick={onClose} className="rounded-xl glass px-4 py-2 text-sm">{t.cancel}</button>
            <button type="submit" disabled={saving || uploading}
              className="rounded-xl text-background px-5 py-2 text-sm font-bold disabled:opacity-50 inline-flex items-center gap-2"
              style={{ background: "var(--gradient-cyan)" }}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-input border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary";

function Field({ label, required, children, className }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className || ""}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}{required && <span className="text-destructive">*</span>}</div>
      {children}
    </label>
  );
}
