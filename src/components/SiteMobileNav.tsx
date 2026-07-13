import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Briefcase, GraduationCap, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { href: "/", hash: "top", icon: Home, label: "الرئيسية" },
  { href: "/", hash: "portfolio", icon: Briefcase, label: "أعمالي" },
  { href: "/", hash: "qualifications", icon: GraduationCap, label: "شهاداتي" },
  { href: "/", hash: "contact", icon: MessageSquare, label: "تواصل" },
];

export default function SiteMobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => subscription.unsubscribe();
  }, []);

  if (path.startsWith("/admin")) return null;

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border/60 pb-[env(safe-area-inset-bottom)]" aria-label="التنقل السفلي">
      <ul className="grid grid-cols-5 items-center">
        {items.map(it => {
          const Icon = it.icon;
          return (
            <li key={it.hash}>
              <button
                onClick={() => scrollTo(it.hash)}
                className="w-full flex flex-col items-center gap-0.5 py-2.5 text-[10px] text-muted-foreground hover:text-primary transition"
              >
                <Icon className="h-5 w-5" />
                {it.label}
              </button>
            </li>
          );
        })}
        <li>
          <Link to="/admin" className="w-full flex flex-col items-center gap-0.5 py-2.5 text-[10px] text-muted-foreground hover:text-primary transition">
            <User className="h-5 w-5" />
            {authed ? "حسابي" : "دخول"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
