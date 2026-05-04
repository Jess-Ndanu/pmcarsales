import { createFileRoute } from "@tanstack/react-router";
import { Award, Heart, Shield, Users } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { DEALER_ADDRESS, DEALER_NAME } from "@/lib/format";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${DEALER_NAME}` },
      { name: "description", content: `Learn about ${DEALER_NAME}, our story, mission, and what makes our buying experience different.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">About us</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            Cars chosen with care, sold without pressure.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            For over 15 years we've curated pre-owned vehicles for drivers who value craftsmanship, transparency, and a relationship — not a transaction.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Our mission</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            To make buying a quality used car feel as good as the drive itself. Every vehicle on our lot is hand-selected, fully inspected, and priced honestly. We don't haggle, upsell, or rush — we help you find the right car and stand behind it.
          </p>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            Whether you're after a daily driver, a weekend toy, or a forever family hauler — we're here to help.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Award, k: "15+", v: "Years in business" },
            { icon: Users, k: "4,200+", v: "Happy owners" },
            { icon: Shield, k: "150-pt", v: "Inspection process" },
            { icon: Heart, k: "4.9★", v: "Average review" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={v} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display text-3xl font-bold">{k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-t border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Visit our showroom</h2>
          <p className="mt-3 text-muted-foreground">{DEALER_ADDRESS}</p>
        </div>
      </section>
    </SiteLayout>
  );
}
