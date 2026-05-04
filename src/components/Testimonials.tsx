import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Testimonials() {
  const [items, setItems] = useState<Tables<"testimonials">[]>([]);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setItems(data ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm font-semibold italic text-primary">What customers say</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Trusted by Drivers
          </h2>
        </div>

        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="relative rounded-xl bg-background border border-border p-6 md:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <Quote className="absolute top-5 right-5 h-7 w-7 text-primary/15" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "fill-primary text-primary" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="text-foreground/85 leading-relaxed text-sm md:text-base">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3 pt-5 border-t border-border">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {t.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm">{t.author_name}</p>
                  {t.author_role && (
                    <p className="text-xs text-muted-foreground">{t.author_role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
