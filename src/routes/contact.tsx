import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { DEALER_ADDRESS, DEALER_EMAIL, DEALER_NAME, DEALER_PHONE } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact PM Car Sales — Mombasa Car Dealer | 0712 604 775` },
      { name: "description", content: `Contact PM Car Sales in Mombasa. Call 0712 604 775, WhatsApp us, or email pmcarsalesmombasa@gmail.com. We respond fast.` },
      { property: "og:title", content: "Contact PM Car Sales — Mombasa Car Dealer" },
      { property: "og:description", content: "Call 0712 604 775, WhatsApp us, or send a message. PM Car Sales, Mombasa." },
      { property: "og:url", content: "https://pmcarsales.lovable.app/contact" },
      { name: "twitter:title", content: "Contact PM Car Sales — Mombasa Car Dealer" },
      { name: "twitter:description", content: "Call 0712 604 775, WhatsApp us, or send a message." },
    ],
    links: [{ rel: "canonical", href: "https://pmcarsales.lovable.app/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error("Please fill in name, email, and message.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send. Try again.");
      return;
    }
    toast.success("Message sent! We'll be in touch.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const fieldCls = "h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold">Let's talk cars.</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Questions about a vehicle, financing, or trade-in? Drop us a note and we'll respond within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16 grid gap-12 lg:grid-cols-[1fr_440px]">
        <div className="order-2 lg:order-1 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Phone, label: "Call", value: DEALER_PHONE, href: `tel:${DEALER_PHONE.replace(/\s/g, "")}` },
              { icon: Mail, label: "Email", value: DEALER_EMAIL, href: `mailto:${DEALER_EMAIL}` },
              { icon: MapPin, label: "Visit", value: DEALER_ADDRESS, href: `mailto:${DEALER_EMAIL}` },
            ].map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="order-1 lg:order-2 rounded-xl border border-border bg-card p-6 shadow-card space-y-3 lg:sticky lg:top-24 lg:self-start">
          <h2 className="font-display text-xl font-semibold">Send us a message</h2>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={fieldCls} required maxLength={120} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" className={fieldCls} required maxLength={255} />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="Phone (optional)" className={fieldCls} maxLength={40} />
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} placeholder="How can we help?" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" required maxLength={2000} />
          <button type="submit" disabled={submitting} className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </SiteLayout>
  );
}
