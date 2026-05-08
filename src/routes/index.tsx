import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, Sparkles, Bot, BarChart3,
  Megaphone, Workflow, LineChart, Package, FileSpreadsheet,
  ShoppingCart, MapPin, Briefcase, Send, MessageCircle, Phone,
  Star, Quote, CheckCircle2, AlertCircle, ChevronDown, TrendingUp, RotateCcw,
  Code2, Database, Layers, ArrowUpRight, Rocket, ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import portrait from "@/assets/khalid-portrait.png";
import dashboard from "@/assets/dashboard-mockup.jpg";
import AIChatWidget from "@/components/AIChatWidget";

const PAGE_TITLE = "المهندس خالد الشريف — أتمتة التسويق والنمو";
const PAGE_DESC = "متخصص في بناء أنظمة الأتمتة وإدارة الحملات الإعلانية الذكية للسوق السعودي. ندمج التقنية بالتسويق لأتمتة نمو أعمالكم.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { name: "google-site-verification", content: "FBIryYkocqm8iD_zPXL6PGrTpHlDLs5uSUNixCcGmUY" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://khalid-sh-dev.lovable.app/" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:site_name", content: "المهندس خالد الشريف" },
      { property: "og:image", content: "https://khalid-sh-dev.lovable.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "المهندس خالد الشريف — أتمتة التسويق والنمو" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:image", content: "https://khalid-sh-dev.lovable.app/og-image.jpg" },
      { name: "theme-color", content: "#0b1426" },
    ],
    links: [
      { rel: "canonical", href: "https://khalid-sh-dev.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": "https://khalid-sh-dev.lovable.app/#person",
              name: "المهندس خالد الشريف",
              alternateName: "Khalid Al-Sharif",
              jobTitle: "متخصص أتمتة التسويق والنمو",
              email: "mailto:khalid.sh.dev@gmail.com",
              description: PAGE_DESC,
              url: "https://khalid-sh-dev.lovable.app/",
              image: "https://khalid-sh-dev.lovable.app/og-image.jpg",
              knowsAbout: [
                "Marketing Automation",
                "SaaS",
                "Snapchat Ads",
                "TikTok Ads",
                "Data Analytics",
                "Growth Engineering",
              ],
              areaServed: { "@type": "Country", name: "Saudi Arabia" },
              sameAs: [
                "https://khalid-sh-dev.lovable.app/",
              ],
            },
            {
              "@type": "Organization",
              "@id": "https://khalid-sh-dev.lovable.app/#organization",
              name: "المهندس خالد الشريف",
              url: "https://khalid-sh-dev.lovable.app/",
              logo: "https://khalid-sh-dev.lovable.app/icons/icon-512.png",
              email: "mailto:khalid.sh.dev@gmail.com",
              founder: { "@id": "https://khalid-sh-dev.lovable.app/#person" },
              areaServed: { "@type": "Country", name: "Saudi Arabia" },
              description: PAGE_DESC,
            },
            {
              "@type": "WebSite",
              "@id": "https://khalid-sh-dev.lovable.app/#website",
              url: "https://khalid-sh-dev.lovable.app/",
              name: PAGE_TITLE,
              description: PAGE_DESC,
              inLanguage: "ar-SA",
              publisher: { "@id": "https://khalid-sh-dev.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const SUBMIT_COUNT_KEY = "contact_submissions_count";
function getSubmissionCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(SUBMIT_COUNT_KEY) || "0", 10) || 0;
}
function incrementSubmissionCount(): number {
  const next = getSubmissionCount() + 1;
  localStorage.setItem(SUBMIT_COUNT_KEY, String(next));
  return next;
}

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
    { id: "skills", label: "المهارات" },
    { id: "services", label: "الخدمات" },
    { id: "portfolio", label: "أعمالي" },
    { id: "testimonials", label: "العملاء" },
    { id: "faq", label: "أسئلة" },
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
      desc: "حملات احترافية على Snapchat و TikTok مصممة للسوق السعودي بنتائج قابلة للقياس وتقارير شفافة.",
      features: [
        "بحث جمهور واستهداف دقيق للسوق السعودي",
        "تصميم Creatives جاذبة (صور / فيديو)",
        "تحسين ROAS وخفض تكلفة التحويل",
        "تقارير أسبوعية + Dashboard حي",
      ],
      tags: ["Snapchat Ads", "TikTok Ads", "Meta Ads", "تحسين ROAS"],
      gradient: "from-rose-500/20 to-amber-500/20",
    },
    {
      icon: Workflow,
      title: "بناء أنظمة الأتمتة المخصصة",
      desc: "تصميم وتطوير حلول أوتوماتيكية ذكية تربط أنظمتك وتختصر ساعات من العمل اليدوي يومياً.",
      features: [
        "ربط CRM مع البريد والواتساب وSheets",
        "أتمتة الفواتير والتقارير المتكررة",
        "Workflows متقدمة على Make / n8n / Zapier",
        "تكامل مع APIs مخصصة",
      ],
      tags: ["Make", "n8n", "Zapier", "REST APIs"],
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      icon: LineChart,
      title: "تحليل البيانات ولوحات الأداء",
      desc: "بناء Dashboards تفاعلية تحوّل بيانات أعمالك المبعثرة إلى قرارات استراتيجية سريعة.",
      features: [
        "ربط مصادر متعددة (DB, Sheets, Ads)",
        "KPIs مخصصة لكل قسم",
        "تنبيهات تلقائية عند الانحراف",
        "تقارير قابلة للتصدير PDF/Excel",
      ],
      tags: ["Looker Studio", "Power BI", "Metabase"],
      gradient: "from-emerald-500/20 to-cyan-500/20",
    },
    {
      icon: Code2,
      title: "تطوير أنظمة SaaS مخصصة",
      desc: "تصميم وبناء منصات سحابية متكاملة لإدارة عمليات شركتك من الصفر إلى الإطلاق.",
      features: [
        "Frontend حديث (React + Tailwind)",
        "Backend موثوق وقاعدة بيانات قابلة للتوسع",
        "نظام صلاحيات وأدوار متعدد",
        "نشر على البنية السحابية",
      ],
      tags: ["React", "Node.js", "PostgreSQL", "Cloud"],
      gradient: "from-violet-500/20 to-fuchsia-500/20",
    },
    {
      icon: ShieldCheck,
      title: "استشارات تقنية وتدقيق",
      desc: "مراجعة بنيتك التقنية الحالية واقتراح تحسينات لزيادة الكفاءة وخفض التكاليف.",
      features: [
        "تدقيق العمليات والاختناقات",
        "خارطة طريق رقمية واضحة",
        "اختيار الأدوات الأنسب لميزانيتك",
        "تدريب الفريق على الأنظمة الجديدة",
      ],
      tags: ["Audit", "Strategy", "Training"],
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Rocket,
      title: "إطلاق ونمو المنتجات الرقمية",
      desc: "خطة إطلاق متكاملة من الـ MVP حتى أول 1000 عميل بأدوات Growth Hacking مدروسة.",
      features: [
        "صفحات هبوط محسّنة للتحويل",
        "Funnels إعلانية مع Retargeting",
        "أتمتة Onboarding للمستخدمين",
        "تتبع التحويلات والأحداث",
      ],
      tags: ["Landing Pages", "GA4", "Funnels"],
      gradient: "from-sky-500/20 to-indigo-500/20",
    },
  ];
  return (
    <section id="services" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
          <span className="text-primary text-sm font-bold">_ خدماتنا</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">حلول مصممة <span className="text-gradient-cyan">لتنمو أعمالك</span></h2>
          <p className="mt-4 text-muted-foreground">باقة كاملة من الخدمات التقنية والتسويقية تحت سقف واحد — من الفكرة حتى التنفيذ والقياس.</p>
        </motion.div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.06 }}
              className="relative glass-strong rounded-3xl p-7 group hover:-translate-y-2 transition duration-500 overflow-hidden"
            >
              <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${s.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition duration-700`} />
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-xl">{s.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <ul className="mt-4 space-y-2">
                  {s.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-foreground/85">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground border border-border">{t}</span>
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

function Skills() {
  const groups = [
    {
      icon: Workflow,
      title: "أتمتة وتكاملات",
      items: ["Make (Integromat)", "n8n", "Zapier", "Webhooks", "REST APIs", "GraphQL"],
    },
    {
      icon: Megaphone,
      title: "إعلانات رقمية",
      items: ["Snapchat Ads", "TikTok Ads", "Meta Ads", "Google Ads", "GA4 / GTM", "Pixel Setup"],
    },
    {
      icon: Code2,
      title: "تطوير المنتجات",
      items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Node.js", "TanStack", "Vite"],
    },
    {
      icon: Database,
      title: "قواعد البيانات والسحابة",
      items: ["PostgreSQL", "Supabase", "Firebase", "Cloudflare", "Vercel", "Edge Functions"],
    },
    {
      icon: BarChart3,
      title: "تحليل بيانات",
      items: ["Looker Studio", "Power BI", "Metabase", "SQL", "Sheets المتقدم", "Dashboards"],
    },
    {
      icon: Bot,
      title: "ذكاء اصطناعي",
      items: ["OpenAI / Gemini", "Prompt Engineering", "RAG", "AI Agents", "Embeddings", "Automation AI"],
    },
  ];
  return (
    <section id="skills" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-3xl mx-auto">
          <span className="text-primary text-sm font-bold">_ المهارات والخبرات</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">
            مكدّس <span className="text-gradient-cyan">تقني متكامل</span> لأي تحدي رقمي
          </h2>
          <p className="mt-4 text-muted-foreground">أعمل على أحدث الأدوات والتقنيات لأقدّم حلولاً موثوقة وقابلة للتوسع.</p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <motion.div
              key={g.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[image:var(--gradient-cyan)] grid place-items-center text-background group-hover:scale-110 transition">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg">{g.title}</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {g.items.map(it => (
                  <span key={it} className="text-xs px-3 py-1.5 rounded-lg bg-secondary/40 border border-border text-foreground/85 hover:border-primary/40 hover:text-primary transition cursor-default">
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const projects = [
    {
      title: "نظام SaaS لإدارة المتاجر",
      category: "منصة سحابية",
      desc: "منصة متكاملة تدير المبيعات والمخزون والتقارير في مكان واحد، مع أتمتة كاملة للعمليات اليومية.",
      tech: ["React", "Node.js", "PostgreSQL", "Cloudflare"],
      metrics: [{ k: "70%", v: "توفير وقت" }, { k: "+200", v: "متجر مستفيد" }],
      icon: Layers,
      accent: "from-cyan-500/30 to-blue-500/30",
    },
    {
      title: "أتمتة فريق المبيعات",
      category: "Workflow Automation",
      desc: "ربط CRM مع WhatsApp Business والبريد لإرسال متابعات تلقائية وتسجيل العملاء بدون تدخل يدوي.",
      tech: ["n8n", "HubSpot", "WhatsApp API"],
      metrics: [{ k: "12h/يوم", v: "وقت موفّر" }, { k: "+45%", v: "معدل المتابعة" }],
      icon: Workflow,
      accent: "from-emerald-500/30 to-cyan-500/30",
    },
    {
      title: "حملة إطلاق براند تجميل",
      category: "Snapchat & TikTok Ads",
      desc: "حملة متكاملة لإطلاق منتج جديد في السوق السعودي بميزانية محسوبة ونتائج فاقت المستهدف.",
      tech: ["Snapchat Ads", "TikTok", "GA4"],
      metrics: [{ k: "4.6x", v: "ROAS" }, { k: "-38%", v: "تكلفة التحويل" }],
      icon: Megaphone,
      accent: "from-rose-500/30 to-amber-500/30",
    },
    {
      title: "Dashboard تنفيذي شامل",
      category: "Data Analytics",
      desc: "لوحة قياس تنفيذية تجمع بيانات المبيعات والإعلانات والمخزون من 6 مصادر مختلفة في عرض واحد.",
      tech: ["Looker Studio", "BigQuery", "Sheets"],
      metrics: [{ k: "6→1", v: "مصادر موحّدة" }, { k: "حي", v: "تحديث لحظي" }],
      icon: BarChart3,
      accent: "from-violet-500/30 to-fuchsia-500/30",
    },
    {
      title: "نظام حجوزات ذكي",
      category: "Custom Web App",
      desc: "تطبيق حجوزات مع تأكيد تلقائي عبر SMS والبريد، ولوحة تحكم لإدارة المواعيد والعملاء.",
      tech: ["Next.js", "Supabase", "Twilio"],
      metrics: [{ k: "24/7", v: "حجز ذاتي" }, { k: "0", v: "أخطاء بشرية" }],
      icon: Rocket,
      accent: "from-sky-500/30 to-indigo-500/30",
    },
    {
      title: "وكيل AI لخدمة العملاء",
      category: "AI Agent",
      desc: "وكيل ذكاء اصطناعي يجاوب على استفسارات العملاء على الموقع والواتساب باللهجة السعودية.",
      tech: ["Gemini", "RAG", "Vector DB"],
      metrics: [{ k: "82%", v: "معدل الحل" }, { k: "<3s", v: "زمن الرد" }],
      icon: Bot,
      accent: "from-amber-500/30 to-orange-500/30",
    },
  ];
  return (
    <section id="portfolio" className="relative py-24 scroll-mt-24">
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div className="max-w-2xl">
            <span className="text-primary text-sm font-bold">_ معرض الأعمال</span>
            <h2 className="font-display text-3xl sm:text-5xl mt-3">
              مشاريع <span className="text-gradient-cyan">حقيقية</span>، نتائج ملموسة
            </h2>
            <p className="mt-4 text-muted-foreground">عينة من المشاريع التي نفّذتها في مجالات الأتمتة والتطوير والإعلانات الرقمية.</p>
          </div>
          <button onClick={() => smoothScrollTo("contact")} className="hidden sm:inline-flex items-center gap-2 glass-strong rounded-xl px-5 py-3 font-bold hover:border-primary/40 transition self-start sm:self-auto">
            ابدأ مشروعك
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={fadeUp} transition={{ delay: i * 0.06 }}
              className="group relative glass-strong rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-500"
            >
              {/* Visual header */}
              <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${p.accent}`}>
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 grid place-items-center">
                  <p.icon className="h-16 w-16 text-foreground/80 group-hover:scale-110 group-hover:rotate-6 transition duration-500" strokeWidth={1.2} />
                </div>
                <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-[11px] font-bold">
                  {p.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="font-display text-lg leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {p.metrics.map(m => (
                    <div key={m.v} className="glass rounded-xl p-2.5 text-center">
                      <div className="font-display text-base text-gradient-cyan">{m.k}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{t}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-muted-foreground">
          * بعض الأعمال خاصة وتم إخفاء أسماء العملاء حفاظاً على السرية.
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

function FAQ() {
  const items = [
    {
      q: "كم تستغرق عملية بناء نظام أتمتة مخصص؟",
      a: "تختلف المدة حسب التعقيد، لكن أغلب المشاريع تكتمل خلال 2 إلى 6 أسابيع، بعد جلسة تحليل أولية لتحديد العمليات والتكاملات المطلوبة.",
    },
    {
      q: "هل تدعمون السوق السعودي تحديداً في الحملات الإعلانية؟",
      a: "نعم، تخصصي الأساسي هو حملات Snapchat و TikTok للسوق السعودي، مع فهم عميق لسلوك المستخدم وأفضل أوقات النشر والمحتوى المناسب ثقافياً.",
    },
    {
      q: "ما الأدوات التي تستخدمها في الأتمتة؟",
      a: "أعتمد على Make و Zapier و n8n للأتمتة المرنة، مع كتابة سكريبتات مخصصة عند الحاجة، وربط APIs مباشرة لضمان الأداء والاستقرار.",
    },
    {
      q: "هل أحصل على تقارير دورية عن أداء الحملات؟",
      a: "بالتأكيد، يصلك تقرير أسبوعي مفصّل وآخر شهري مع توصيات تحسين، بالإضافة إلى لوحة Looker Studio حية يمكنك متابعتها في أي وقت.",
    },
    {
      q: "هل تقدمون دعماً بعد تسليم المشروع؟",
      a: "نعم، كل مشروع يتضمن فترة دعم مجانية لمدة 30 يوماً، مع إمكانية الاشتراك في باقات الصيانة والتطوير المستمر.",
    },
    {
      q: "كيف تتم عملية الدفع وما هي الأسعار؟",
      a: "السعر يعتمد على نطاق المشروع، ويتم الاتفاق على دفعة مقدمة وأخرى عند التسليم. تواصل معي للحصول على عرض سعر مخصص لمشروعك.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center">
          <span className="text-primary text-sm font-bold">_ الأسئلة الشائعة</span>
          <h2 className="font-display text-3xl sm:text-5xl mt-3">
            استفسارات <span className="text-gradient-cyan">متكررة</span>
          </h2>
          <p className="mt-4 text-muted-foreground">إجابات مباشرة على أكثر ما يسأله العملاء قبل البدء.</p>
        </motion.div>

        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={it.q}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeUp} transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl overflow-hidden transition ${isOpen ? "border-primary/40" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-card/30 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg flex-1">{it.q}</span>
                  <ChevronDown className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base border-t border-border/50 pt-4">
                        {it.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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

type ContactData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactData, string>>;

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***";
  const head = user.slice(0, 2);
  const tail = user.length > 3 ? user.slice(-1) : "";
  return `${head}${"•".repeat(Math.max(2, user.length - 3))}${tail}@${domain}`;
}

function ConfirmationView({ data, count, onReset }: { data: ContactData; count: number; onReset: () => void }) {
  const ticket = `KS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong rounded-3xl p-7 sm:p-9 text-center"
    >
      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 grid place-items-center glow-cyan">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </div>
      <h3 className="mt-6 font-display text-2xl sm:text-3xl">شكراً {data.name.split(" ")[0]}، استلمنا طلبك ✨</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed max-w-md mx-auto">
        سأراجع طلبك وأرد عليك خلال 24 ساعة. تم تسجيل الطلب بنجاح في نظامنا.
      </p>

      <div className="mt-7 grid sm:grid-cols-3 gap-3 text-right">
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">رقم المرجع</div>
          <div className="font-bold mt-1 font-mono text-primary" dir="ltr">{ticket}</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">نوع الخدمة</div>
          <div className="font-bold mt-1 text-sm">{data.service}</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">البريد للتواصل</div>
          <div className="font-bold mt-1 text-sm" dir="ltr">{maskEmail(data.email)}</div>
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground glass rounded-full px-4 py-2">
        <TrendingUp className="h-3.5 w-3.5 text-primary" />
        إجمالي الطلبات المُستلمة عبر الموقع: <span className="font-bold text-primary">{count}</span>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a href="mailto:khalid.sh.dev@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-cyan)] text-background px-5 py-3 font-bold glow-cyan hover:scale-[1.02] transition">
          <Mail className="h-4 w-4" /> فتح البريد مباشرة
        </a>
        <button onClick={onReset} className="inline-flex items-center gap-2 rounded-xl glass-strong px-5 py-3 font-bold hover:border-primary/40 transition">
          <RotateCcw className="h-4 w-4" /> إرسال طلب جديد
        </button>
      </div>
    </motion.div>
  );
}

function Contact() {
  const [confirmed, setConfirmed] = useState<ContactData | null>(null);
  const [count, setCount] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { setCount(getSubmissionCount()); }, []);

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
      const newCount = incrementSubmissionCount();
      // Google Analytics conversion event
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "contact",
          event_label: result.data.service,
          value: 1,
        });
        window.gtag("event", "contact_form_submit", {
          service: result.data.service,
        });
      }
      setSubmitting(false);
      setCount(newCount);
      setConfirmed(result.data);
      (e.target as HTMLFormElement).reset();
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
            <div className="mt-5 glass rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">طلبات مُستلمة عبر الموقع</div>
                <div className="font-display text-xl text-gradient-cyan">{count}</div>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {confirmed ? (
                <ConfirmationView key="confirm" data={confirmed} count={count} onReset={() => setConfirmed(null)} />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit} noValidate
                  className="glass-strong rounded-3xl p-6 sm:p-7 space-y-5"
                >
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
              )}
            </AnimatePresence>
          </div>
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

function AnimatedBackground() {
  return (
    <div className="bg-aurora" aria-hidden="true">
      <span className="blob" />
      <span className="grid" />
      <span className="noise" />
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Product />
        <Services />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
