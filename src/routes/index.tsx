import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mail, MessageSquare, Sparkles, Bot, BarChart3,
  Megaphone, Workflow, LineChart, Package, FileSpreadsheet,
  ShoppingCart, MapPin, Briefcase, Send, Github, Linkedin,
} from "lucide-react";
import { useState } from "react";
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

function Nav() {
  const links = [
    { href: "#about", label: "من أنا" },
    { href: "#product", label: "النظام" },
    { href: "#services", label: "الخدمات" },
    { href: "#contact", label: "تواصل" },
  ];
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <nav className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display text-lg">
            <span className="h-8 w-8 rounded-lg bg-[image:var(--gradient-cyan)] grid place-items-center text-background font-bold">خ</span>
            <span className="hidden sm:inline">خالد الشريف</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {links.map(l => (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">{l.label}</a>
            ))}
          </div>
          <a href="#contact" className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:opacity-90 transition">
            تواصل معي
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-24 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-right">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            متخصص أتمتة التسويق والنمو
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.15]">
            المهندس <span className="text-gradient-cyan">خالد الشريف</span>:
            <br />
            ندمج التقنية بالتسويق
            <br />
            لأتمتة <span className="text-gradient-cyan">نمو أعمالكم</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mr-0 lg:leading-relaxed">
            متخصص في بناء أنظمة الأتمتة وإدارة الحملات الإعلانية الذكية للسوق السعودي.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-cyan)] text-background px-6 py-3.5 font-bold glow-cyan hover:scale-[1.02] transition">
              تواصل معي
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" />
            </a>
            <a href="#product" className="inline-flex items-center gap-2 rounded-xl glass-strong px-6 py-3.5 font-bold hover:border-primary/40 transition">
              استعرض أعمالي
            </a>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div><div className="font-display text-2xl text-primary">+20</div><div className="text-muted-foreground">حملة إعلانية</div></div>
            <div className="border-r border-border pr-8"><div className="font-display text-2xl text-primary">SaaS</div><div className="text-muted-foreground">نظام مطوّر</div></div>
            <div className="border-r border-border pr-8"><div className="font-display text-2xl text-primary">24/7</div><div className="text-muted-foreground">أتمتة كاملة</div></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-[image:var(--gradient-cyan)] opacity-20 blur-3xl rounded-full" />
          <div className="relative glass-strong rounded-3xl p-3 glow-cyan">
            <img
              src={portrait}
              alt="المهندس خالد الشريف"
              className="rounded-2xl w-full h-auto object-cover"
              width={1408}
              height={760}
            />
            <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs"><div className="font-bold">متاح للعمل</div><div className="text-muted-foreground">عن بُعد · السعودية</div></div>
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
    <section id="about" className="relative py-24">
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
    <section id="product" className="relative py-24">
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
    <section id="services" className="relative py-24">
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

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-24">
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
            onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); }}
            className="lg:col-span-3 glass-strong rounded-3xl p-7 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="الاسم الكامل" name="name" placeholder="اكتب اسمك" />
              <Field label="البريد الإلكتروني" name="email" type="email" placeholder="you@example.com" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">نوع الخدمة</label>
              <select required className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition">
                <option value="">اختر الخدمة المطلوبة</option>
                <option>إدارة حملات إعلانية</option>
                <option>بناء نظام أتمتة مخصص</option>
                <option>تحليل بيانات ولوحات أداء</option>
                <option>استشارة تقنية</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-muted-foreground">الرسالة</label>
              <textarea required rows={5} placeholder="احكِ لي عن مشروعك..." className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition resize-none" />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-cyan)] text-background py-4 font-bold glow-cyan hover:scale-[1.01] transition">
              {sent ? <><Sparkles className="h-4 w-4" /> تم الإرسال بنجاح</> : <><Send className="h-4 w-4" /> إرسال الرسالة</>}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, dir }: { label: string; name: string; type?: string; placeholder?: string; dir?: string }) {
  return (
    <div>
      <label className="block text-sm mb-2 text-muted-foreground">{label}</label>
      <input
        required name={name} type={type} placeholder={placeholder} dir={dir}
        className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition"
      />
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
          <a href="#" aria-label="LinkedIn" className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary transition"><Linkedin className="h-4 w-4" /></a>
          <a href="#" aria-label="GitHub" className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary transition"><Github className="h-4 w-4" /></a>
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
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
