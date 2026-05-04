import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function SoldGallery() {
  const [items, setItems] = useState<Tables<"sold_gallery">[]>([]);

  useEffect(() => {
    supabase
      .from("sold_gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setItems(data ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
      <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
        <div>
          <p className="text-sm font-semibold italic text-primary">Happy drivers</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Recently Sold
          </h2>
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <figure
            key={g.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={g.image_url}
              alt={g.caption ?? "Sold vehicle"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <CheckCircle2 className="h-3 w-3" /> Sold
            </div>
            {g.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 text-xs md:text-sm font-semibold text-white">
                {g.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
