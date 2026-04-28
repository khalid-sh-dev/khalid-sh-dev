import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, Sparkles, Bot, BarChart3,
  Megaphone, Workflow, LineChart, Package, FileSpreadsheet,
  ShoppingCart, MapPin, Briefcase, Send, MessageCircle, Phone,
  Star, Quote, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import portrait from "@/assets/khalid-portrait.png";
import dashboard from "@/assets/dashboard-mockup.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المهندس خالد الشريف — أتمتة التسويق والنمو" },
      { name: "description", content: "متخصص في بناء أنظمة الأتمتة وإدارة الحملات الإعلانية الذكية للسوق السعودي. ندمج التقنية بالتسويق لأتمتة نمو أعمالكم." },
      { property: "og:title", content: "المهندس خالد الشريف — أتمتة التسويق والنمو" },
      { property: "og:description", content: "بناء أنظمة SaaS وأتمتة العمليات وإدارة حملات Snapchat & TikTok للسوق السعودي." },
      { name: "theme-color", content: "#0b1426" },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

function Nav() {
  const links = [
    { id: "about", label: "من أنا" },
    { id: "product", label: "النظام" },
    { id: "services", label: "الخدمات" },
    { id: "testimonials", label: "آراء العملاء" },
    { id: "contact", label: "تواصل" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <nav className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between">
          <button onClick={() => smoothScrollTo("top")} className="flex items-center gap-2 font-display text-lg">
            <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-cyan)] grid place-items-center text-background font-bold">خ</span>
            <span className="hidden sm:inline">خالد الشريف</span>
          </button>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {links.map(l => (
              <button key={l.id} onClick={() => smoothScrollTo(l.id)} className="hover:text-primary transition-colors">{l.label}</button>
            ))}
          </div>
          <button onClick={() => smoothScrollTo("contact")} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:opacity-90 transition">
            تواصل معي
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-32 sm:pt-36 pb-20 sm:pb-24 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center lg:text-right order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            متخصص أتمتة التسويق والنمو
          </span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.2]">
            المهندس <span className="text-gradient-cyan">خالد الشريف</span>:
            <br />
            ندمج التقنية بالتسويق
            <br />
            لأتمتة <span className="text-gradient-cyan">نمو أعمالكم</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            متخصص في بناء أنظمة الأتمتة وإدارة الحملات الإعلانية الذكية للسوق السعودي.
          </p>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <button onClick={() => smoothScrollTo("contact")} className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-cyan)] text-background px-6 py-3.5 font-bold glow-cyan hover:scale-[1.03] active:scale-95 transition-all">
              تواصل معي
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
            </button>
            <button onClick={() => smoothScrollTo("product")} className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 font-bold hover:border-primary/40 hover:scale-[1.03] active:scale-95 transition-all">
              استعرض أعمالي
            </button>
          </div>
          <div className="mt-10 flex justify-center lg:justify-start gap-6 sm:gap-8 text-sm">
            <div><div className="font-display text-2xl text-primary">+20</div><div className="text-muted-foreground">حملة إعلانية</div></div>
            <div className="border-r border-border pr-6 sm:pr-8"><div className="font-display text-2xl text-primary">SaaS</div><div className="text-muted-foreground">نظام مطوّر</div></div>
            <div className="border-r border-border pr-6 sm:pr-8"><div className="font-display text-2xl text-primary">24/7</div><div className="text-muted-foreground">أتمتة كاملة</div></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 lg:order-2 mx-auto"
        >
          <div className="relative w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[440px] lg:h-[440px]">
            {/* Animated rotating glow ring */}
            <div className="absolute -inset-6 rounded-full bg-[conic-gradient(from_0deg,transparent,oklch(0.85_0.2_200/0.6),transparent_60%)] blur-2xl animate-[spin_8s_linear_infinite]" />
            <div className="absolute -inset-2 rounded-full bg-[image:var(--gradient-cyan)] opacity-30 blur-2xl" />

            {/* Glassmorphism circular frame */}
            <div className="relative h-full w-full rounded-full glass-strong p-2 glow-cyan">
              <div className="h-full w-full rounded-full overflow-hidden border border-primary/30">
                <img
                  src={portrait}
                  alt="المهندس خالد الشريف"
                  className="w-full h-full object-cover"
                  width={440}
                  height={440}
                />
              </div>
            </div>

            {/* Status badge */}
            <div className="absolute bottom-2 -right-2 sm:-right-4 glass-strong rounded-2xl px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-2xl">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-[10px] sm:text-xs"><div className="font-bold">متاح للعمل</div><div className="text-muted-foreground">عن بُعد · السعودية</div></div>
            </div>

            {/* Floating tag */}
            <div className="hidden sm:flex absolute top-4 -left-4 glass-strong rounded-xl px-3 py-2 items-center gap-2 shadow-xl">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold">AI Automation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const items = [
    { icon: MapPin, title: "مهندس يمني", text: "مقيم في المملكة العربية السعودية" },
    { icon: Briefcase, title: "21 عاماً", text: "متاح للعمل عن بُعد بكل احترافية" },
    { icon: Bot, title: "خبرة تقنية", text: "أتمتة العمليات وأنظمة SaaS" },
  ];
  return (
    <section id="about" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <span className="text-primary text-sm font-bold">_ من أنا</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3 leading-tight">
            أساعد الشركات على <span className="text-gradient-cyan">توفير الوقت والمال</span> من خلال تحويل العمليات اليدوية إلى أنظمة أوتوماتيكية ذكية
          </h2>
        </motion.div>
        <div className="mt-14 grid sm:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center text-primary">
                <it.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 font-display text-xl">{it.title}</div>
              <div className="mt-2 text-muted-foreground text-sm leading-relaxed">{it.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Product() {
  const features = [
    { icon: ShoppingCart, title: "إدارة المبيعات", text: "تتبع كل عملية بيع لحظياً مع إشعارات ذكية وتقارير تلقائية." },
    { icon: Package, title: "أتمتة المخزون", text: "تنبيهات نفاد المخزون، إعادة طلب تلقائية، وربط متعدد المستودعات." },
    { icon: BarChart3, title: "تحليل البيانات", text: "لوحات قياس بصرية تكشف الفرص والمشاكل قبل وقوعها." },
    { icon: FileSpreadsheet, title: "تصدير التقارير", text: "تقارير PDF و Excel جاهزة للإدارة بضغطة واحدة." },
  ];
  return (
    <section id="product" className="relative py-24 scroll-mt-24">
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto">
          <span className="text-primary text-sm font-bold">_ المنتج الرئيسي</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">
            نظام <span className="text-gradient-cyan">SaaS</span> متكامل لإدارة أعمالك
          </h2>
          <p className="mt-5 text-muted-foreground">منصة سحابية طوّرتُها لأتمتة عمليات المبيعات والمخزون والتقارير في مكان واحد.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-14 relative"
        >
          <div className="absolute -inset-4 bg-[image:var(--gradient-cyan)] opacity-20 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-3xl p-3 overflow-hidden">
            <img src={dashboard} alt="لوحة تحكم النظام" className="rounded-2xl w-full" loading="lazy" width={1280} height={800} />
          </div>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:bg-card/60 transition group"
            >
              <div className="h-11 w-11 rounded-lg bg-[image:var(--gradient-cyan)] grid place-items-center text-background group-hover:scale-110 transition">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg">{f.title}</div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: Megaphone,
      title: "إدارة الحملات الإعلانية",
      desc: "حملات احترافية على Snapchat و TikTok مصممة للسوق السعودي بنتائج قابلة للقياس.",
      tags: ["Snapchat Ads", "TikTok Ads", "تحسين ROAS"],
    },
    {
      icon: Workflow,
      title: "بناء أنظمة الأتمتة المخصصة",
      desc: "تصميم وتطوير حلول أوتوماتيكية ذكية تربط أنظمتك وتختصر ساعات من العمل اليدوي.",
      tags: ["Make / Zapier", "أتمتة CRM", "ربط APIs"],
    },
    {
      icon: LineChart,
      title: "تحليل البيانات ولوحات الأداء",
      desc: "بناء Dashboards تفاعلية تحوّل بيانات أعمالك إلى قرارات استراتيجية سريعة.",
      tags: ["Looker Studio", "Power BI", "KPI تتبع"],
    },
  ];
  return (
    <section id="services" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <span className="text-primary text-sm font-bold">_ خدماتنا</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">حلول مصممة <span className="text-gradient-cyan">لتنمو أعمالك</span></h2>
        </motion.div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1 }}
              className="relative glass-strong rounded-3xl p-7 group hover:-translate-y-2 transition duration-500"
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500" style={{ background: "var(--gradient-card)" }} />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground border border-border">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const stats = [
    { value: "+300%", label: "نمو في معدل التحويل" },
    { value: "70%", label: "توفير في الوقت اليومي" },
    { value: "4.2x", label: "متوسط عائد الإعلانات" },
    { value: "+50", label: "عميل راضٍ عن النتائج" },
  ];
  const items = [
    {
      name: "أحمد العتيبي",
      role: "مدير تسويق · متجر إلكتروني",
      text: "أتمتة المخزون وفّرت علينا ساعات يومية، والحملات الإعلانية رفعت المبيعات بشكل ملحوظ في أول شهر.",
      rating: 5,
    },
    {
      name: "نورة الزهراني",
      role: "صاحبة براند تجميل",
      text: "احترافية عالية في إدارة حملات Snapchat. النتائج فاقت توقعاتي والتقارير واضحة وشفافة.",
      rating: 5,
    },
    {
      name: "خالد الدوسري",
      role: "مؤسس شركة خدمات",
      text: "النظام اللي بناه ربط لنا كل العمليات. الفريق صار يشتغل أسرع والإدارة عندها رؤية كاملة.",
      rating: 5,
    },
  ];
  return (
    <section id="testimonials" className="relative py-24 scroll-mt-24">
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto">
          <span className="text-primary text-sm font-bold">_ الثقة والنتائج</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">
            نتائج <span className="text-gradient-cyan">حقيقية</span> من عملاء حقيقيين
          </h2>
        </motion.div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.08 }}
              className="glass-strong rounded-2xl p-6 text-center hover:border-primary/40 transition"
            >
              <div className="font-display text-3xl sm:text-4xl text-gradient-cyan">{s.value}</div>
              <div className="mt-2 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative hover:border-primary/30 transition"
            >
              <Quote className="absolute top-5 left-5 h-8 w-8 text-primary/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="mt-5 pt-4 border-t border-border">
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim()
    .min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" })
    .max(80, { message: "الاسم طويل جداً" }),
  email: z.string().trim()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "صيغة البريد الإلكتروني غير صحيحة" })
    .max(255),
  service: z.string().min(1, { message: "يرجى اختيار نوع الخدمة" }),
  message: z.string().trim()
    .min(10, { message: "الرسالة قصيرة جداً (10 أحرف على الأقل)" })
    .max(1000, { message: "الرسالة طويلة جداً" }),
});

type FormErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

function Contact() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      service: String(fd.get("service") || ""),
      message: String(fd.get("message") || ""),
    };
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const errs: FormErrors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof FormErrors;
        if (k && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 6000);
    }, 600);
  };

  return (
    <section id="contact" className="relative py-24 scroll-mt-24">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-2">
            <span className="text-primary text-sm font-bold">_ تواصل</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-3 leading-tight">
              لنبدأ <span className="text-gradient-cyan">مشروعك</span> القادم
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              عندك فكرة، نظام تبغى تأتمته، أو حملة إعلانية تحتاج خبرة؟ راسلني وراح أرد عليك خلال 24 ساعة.
            </p>
            <a href="mailto:khalid.sh.dev@gmail.com" className="mt-8 glass rounded-2xl p-5 flex items-center gap-4 hover:border-primary/40 transition group">
              <div className="h-12 w-12 rounded-xl bg-[image:var(--gradient-cyan)] grid place-items-center text-background">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
                <div className="font-bold group-hover:text-primary transition" dir="ltr">khalid.sh.dev@gmail.com</div>
              </div>
            </a>
          </motion.div>

          <motion.form
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            onSubmit={handleSubmit} noValidate
            className="lg:col-span-3 glass-strong rounded-3xl p-6 sm:p-7 space-y-5"
          >
            {sent && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-start gap-3 text-emerald-300 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">تم استلام رسالتك بنجاح</div>
                  <div className="text-sm text-emerald-300/80 mt-0.5">سأتواصل معك خلال 24 ساعة على البريد الإلكتروني المُسجَّل.</div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="الاسم الكامل" name="name" placeholder="اكتب اسمك" error={errors.name} />
              <Field label="البريد الإلكتروني" name="email" type="email" placeholder="you@example.com" dir="ltr" error={errors.email} />
            </div>
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">نوع الخدمة</label>
              <select
                name="service"
                defaultValue=""
                className={`w-full bg-input border rounded-xl px-4 py-3 focus:outline-none transition ${errors.service ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
              >
                <option value="">اختر الخدمة المطلوبة</option>
                <option>إدارة حملات إعلانية</option>
                <option>بناء نظام أتمتة مخصص</option>
                <option>تحليل بيانات ولوحات أداء</option>
                <option>استشارة تقنية</option>
              </select>
              {errors.service && <FieldError msg={errors.service} />}
            </div>
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">الرسالة</label>
              <textarea
                name="message" rows={5} placeholder="احكِ لي عن مشروعك..."
                className={`w-full bg-input border rounded-xl px-4 py-3 focus:outline-none transition resize-none ${errors.message ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
              />
              {errors.message && <FieldError msg={errors.message} />}
            </div>
            <button
              type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-cyan)] text-background py-4 font-bold glow-cyan hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-60"
            >
              {submitting ? "جارٍ الإرسال..." : (<><Send className="h-4 w-4" /> إرسال الرسالة</>)}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{msg}</span>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, dir, error }: { label: string; name: string; type?: string; placeholder?: string; dir?: string; error?: string }) {
  return (
    <div>
      <label className="block text-sm mb-2 text-muted-foreground">{label}</label>
      <input
        name={name} type={type} placeholder={placeholder} dir={dir}
        className={`w-full bg-input border rounded-xl px-4 py-3 focus:outline-none transition ${error ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
      />
      {error && <FieldError msg={error} />}
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2 font-display">
          <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-cyan)] grid place-items-center text-background font-bold">خ</span>
          خالد الشريف
        </div>
        <div className="text-sm text-muted-foreground text-center">
          جميع الحقوق محفوظة للمهندس: خالد الشريف © 2024
        </div>
        <div className="flex items-center gap-3">
          <a href="mailto:khalid.sh.dev@gmail.com" className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary transition"><Mail className="h-4 w-4" /></a>
          <a href="#" aria-label="WhatsApp" className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary transition"><MessageCircle className="h-4 w-4" /></a>
          <a href="#" aria-label="Phone" className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary transition"><Phone className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <About />
        <Product />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
