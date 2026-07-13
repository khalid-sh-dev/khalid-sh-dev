import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Mail, MessageCircle, Phone, Globe, Link as LinkIcon, Send as TelegramIcon, Music2, AtSign,
} from "lucide-react";
const Linkedin = AtSign, Twitter = AtSign, Instagram = AtSign, Facebook = AtSign, Youtube = AtSign, Github = AtSign;

type L = {
  id: string;
  label_ar: string;
  label_en: string | null;
  url: string;
  icon: string | null;
  category: string;
  display_order: number;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail, email: Mail,
  whatsapp: MessageCircle, phone: Phone,
  linkedin: Linkedin, twitter: Twitter, x: Twitter,
  instagram: Instagram, facebook: Facebook,
  youtube: Youtube, github: Github,
  telegram: TelegramIcon, snapchat: Music2, tiktok: Music2,
  website: Globe, link: LinkIcon,
};

export function useSiteLinks(category?: string) {
  const [links, setLinks] = useState<L[]>([]);
  useEffect(() => {
    (async () => {
      let q = (supabase as any).from("site_links").select("*").eq("is_published", true).order("display_order");
      if (category) q = q.eq("category", category);
      const { data } = await q;
      if (data) setLinks(data as unknown as L[]);
    })();
  }, [category]);
  return links;
}

export default function DynamicSocialLinks({ className = "" }: { className?: string }) {
  const links = useSiteLinks();
  if (links.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(l => {
        const Icon = ICONS[(l.icon || "link").toLowerCase()] || LinkIcon;
        return (
          <a
            key={l.id}
            href={l.url}
            target={l.url.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={l.label_ar}
            title={l.label_ar}
            className="h-10 w-10 grid place-items-center rounded-lg glass hover:text-primary hover:border-primary/40 transition"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
