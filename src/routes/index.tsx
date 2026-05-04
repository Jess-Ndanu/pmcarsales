import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import heroCar from "@/assets/hero-car.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { HeroSearch } from "@/components/HeroSearch";
import { CarCard } from "@/components/CarCard";
import { BodyTypeFilters } from "@/components/BodyTypeFilters";
import { DEALER_NAME } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${DEALER_NAME} — Find Your Perfect Car in Mombasa` },
      { name: "description", content: "Browse hand-picked quality vehicles. Search by make, model, and price. Drive your dream." },
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
      <section className="relative -mt-16 min-h-[760px] flex items-center overflow-hidden">
        <img
          src={heroCar}
          alt="Luxury car at dusk"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10 pt-24 pb-16 text-center">
          <div className="fade-up">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold leading-[1.05] tracking-tight text-white">
              Find Your <span className="text-primary">Perfect</span> Car
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base md:text-lg text-white/85 leading-relaxed">
              Hand-picked quality vehicles in Mombasa. Drive your dream — at the right price.
            </p>
          </div>

          <div className="mt-10 md:mt-12 mx-auto max-w-4xl fade-up-delay">
            <HeroSearch />
          </div>

          <div className="mt-10 md:mt-14 fade-up-delay">
            <BodyTypeFilters />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1px] text-primary">Featured</p>
            <h2 className="section-title mt-3 font-display text-3xl md:text-4xl">Featured Cars</h2>
          </div>
          <Link
            to="/inventory"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-muted animate-pulse" style={{ borderRadius: "8px" }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Why */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24 grid gap-10 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "150-Point Inspection", body: "Every car is mechanically and cosmetically vetted before it lists." },
            { icon: Wrench, title: "Service Warranty", body: "12-month limited powertrain warranty included on every vehicle." },
            { icon: Sparkles, title: "Transparent Pricing", body: "No hidden fees. Out-the-door price quoted upfront, every time." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background px-6 py-12 md:p-16">
          <div className="relative z-10 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-white">
                Don't see the one?<br />Let us source it for you.
              </h2>
              <p className="mt-3 text-white/70 max-w-md leading-relaxed">
                Tell us what you're looking for and our buying team will hunt it down — at the right price.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                Get in touch
              </Link>
              <Link
                to="/inventory"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-all duration-300"
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

