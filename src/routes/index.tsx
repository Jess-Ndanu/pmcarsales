import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import heroCar from "@/assets/hero-car.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { HeroSearch } from "@/components/HeroSearch";
import { CarCard } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apex Autos — Premium Pre-Owned Vehicles" },
      { name: "description", content: "Browse hand-picked premium pre-owned cars. Search by make, model, year, and price." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [featured, setFeatured] = useState<Tables<"cars">[]>([]);

  useEffect(() => {
    supabase
      .from("cars")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setFeatured(data ?? []));
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative -mt-16 min-h-[680px] flex items-end overflow-hidden">
        <img
          src={heroCar}
          alt="Luxury car at dusk"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 pt-32 pb-12 md:pb-16">
          <div className="max-w-3xl text-background fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 backdrop-blur px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
              <Sparkles className="h-3.5 w-3.5" /> Curated inventory · Updated weekly
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              Find a car worth<br /> the drive home.
            </h1>
            <p className="mt-4 max-w-xl text-base md:text-lg text-white/80">
              Premium pre-owned vehicles, transparent pricing, and a no-pressure buying experience — all under one roof.
            </p>
          </div>

          <div className="relative z-10 mt-8 md:mt-10 max-w-5xl">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Featured</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">This week's highlights</h2>
          </div>
          <Link
            to="/inventory"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Why */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 grid gap-10 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "150-point inspection", body: "Every car is mechanically and cosmetically vetted before it lists." },
            { icon: Wrench, title: "Service warranty", body: "12-month limited powertrain warranty included on every vehicle." },
            { icon: Sparkles, title: "Transparent pricing", body: "No hidden fees. Out-the-door price quoted upfront, every time." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background px-6 py-12 md:p-16">
          <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Don't see the one?<br />Let us source it for you.
              </h2>
              <p className="mt-3 text-background/70 max-w-md">
                Tell us what you're looking for and our buying team will hunt it down — at the right price.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get in touch
              </Link>
              <Link
                to="/inventory"
                className="inline-flex h-12 items-center justify-center rounded-md border border-background/30 px-6 text-sm font-semibold text-background hover:bg-background/10 transition-colors"
              >
                Browse inventory
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        </div>
      </section>
    </SiteLayout>
  );
}
