import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Car, ShieldCheck, Zap, Wallet, Landmark, HandCoins, Repeat, Ship } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import heroCar from "@/assets/hero-car.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { HeroSearch } from "@/components/HeroSearch";
import { CarCard } from "@/components/CarCard";

import { Testimonials } from "@/components/Testimonials";
import { SoldGallery } from "@/components/SoldGallery";
import { Faq, FAQS } from "@/components/Faq";
import { DEALER_NAME, DEALER_WHATSAPP } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${DEALER_NAME} — Find Your Perfect Car in Mombasa` },
      { name: "description", content: "Browse hand-picked quality vehicles. Search by make, model, and price. Drive your dream." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [featured, setFeatured] = useState<Tables<"cars">[]>([]);
  const [tradeIns, setTradeIns] = useState<Tables<"cars">[]>([]);

  useEffect(() => {
    supabase
      .from("cars")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setFeatured(data ?? []));

    supabase
      .from("cars")
      .select("*")
      .ilike("condition", "%trade%")
      .eq("sold", false)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setTradeIns(data ?? []));
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

        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
        <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
              Featured Listings
            </h2>
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

      {/* Trade-In Cars */}
      {tradeIns.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
            <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Customer trade-ins</p>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
                  Trade-In Cars
                </h2>
                <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
                  Quality vehicles taken in from our customers — inspected and ready for a new owner.
                </p>
              </div>
              <Link
                to="/inventory"
                search={{ condition: "trade-in" }}
                className="hidden sm:inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tradeIns.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Why Choose Us
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { icon: Car, title: "Wide range of brands", body: "We offer a diverse selection of vehicles from top brands, ensuring you have plenty of options to find the perfect car for your needs and budget." },
              { icon: ShieldCheck, title: "Trusted by our clients", body: "We have built a reputation for honesty and reliability, making us a trusted choice for clients seeking quality vehicles and excellent service." },
              { icon: Zap, title: "Fast & easy financing", body: "We make the car-buying process smooth with fast and simple financing options designed to fit your budget and get you on the road quickly." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-xs">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flexible Purchase Terms */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 py-[60px] md:py-24">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">How you pay</p>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Flexible purchase terms
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Pick the path that fits you best. We'll walk you through every step — no jargon, no surprises.
          </p>
        </div>

        <Tabs defaultValue="cash" className="w-full">
          <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-3xl flex-wrap justify-center gap-1 bg-muted/60 p-1.5">
            {[
              { v: "cash", icon: Wallet, label: "Cash" },
              { v: "hire", icon: HandCoins, label: "Hire Purchase" },
              { v: "bank", icon: Landmark, label: "Bank / SACCO" },
              { v: "trade", icon: Repeat, label: "Trade-In" },
              { v: "import", icon: Ship, label: "Imports" },
            ].map(({ v, icon: Icon, label }) => (
              <TabsTrigger key={v} value={v} className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {[
            { v: "cash", title: "Cash purchases", body: "Pay in full and drive away the same day. We handle logbook transfer end-to-end so the car is legally yours before you leave the yard." },
            { v: "hire", title: "Hire purchase", body: "Put a deposit down, pay the balance in monthly installments directly to us. Flexible terms tailored to your income — no bank approval required." },
            { v: "bank", title: "Bank & SACCO financing", body: "We work with all major Kenyan banks and SACCOs. Bring your pre-approval or we'll connect you with our partner lenders for competitive rates." },
            { v: "trade", title: "Trade-in your old car", body: "Drive in your current vehicle, drive out in a new one. We'll value your car on the spot and apply it as part of your new car's price." },
            { v: "import", title: "Custom imports", body: "Can't find what you want on the lot? Tell us the make, model, and year — we'll source it directly from Japan or the UK and handle clearing, duty, and registration." },
          ].map(({ v, title, body }) => (
            <TabsContent key={v} value={v} className="mt-0">
              <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 md:p-12 text-center shadow-sm">
                <h3 className="font-display text-2xl md:text-3xl font-bold">{title}</h3>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">{body}</p>
                <a
                  href={`https://wa.me/${DEALER_WHATSAPP}?text=${encodeURIComponent(`Hi PM Car Sales, I'd like to know more about ${title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-primary hover:gap-2.5 transition-all"
                >
                  Talk to us <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Sold Gallery */}
      <SoldGallery />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <Faq />

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

