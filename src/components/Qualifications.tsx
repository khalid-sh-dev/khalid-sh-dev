import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Award, ExternalLink } from "lucide-react";

type Q = {
  id: string;
  title_ar: string;
  title_en: string | null;
  institution_ar: string | null;
  institution_en: string | null;
  year: string | null;
  type: string | null;
  url: string | null;
};

export default function Qualifications() {
  const [items, setItems] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("qualifications")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });
      if (data) setItems(data as unknown as Q[]);
      setLoading(false);
    })();
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section id="qualifications" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs mb-4">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            المؤهلات والشهادات
          </div>
          <h2 className="font-display text-3xl sm:text-4xl">الشهادات الأكاديمية والمهنية</h2>
          <p className="text-muted-foreground mt-2 text-sm">مسيرة من التعلم المستمر وشهادات معتمدة من كبرى الشركات.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(q => {
            const isDegree = q.type === "degree";
            return (
              <div key={q.id} className="glass-strong rounded-2xl p-5 hover:border-primary/40 transition group">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl grid place-items-center text-background shrink-0" style={{ background: "var(--gradient-cyan)" }}>
                    {isDegree ? <GraduationCap className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-snug">{q.title_ar}</div>
                    {q.title_en && <div className="text-[11px] text-muted-foreground mt-0.5">{q.title_en}</div>}
                    {(q.institution_ar || q.institution_en) && (
                      <div className="text-xs text-primary mt-2">{q.institution_ar || q.institution_en}</div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {q.year && <span className="text-[11px] text-muted-foreground">{q.year}</span>}
                      {q.url && (
                        <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary inline-flex items-center gap-1 hover:underline">
                          عرض <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
