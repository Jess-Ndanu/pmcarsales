import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Gauge, Fuel, Settings2, Palette, Car as CarIcon, Cog, BadgeCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatMiles, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/inventory/$carId")({
  component: CarDetailPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 md:px-8 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </SiteLayout>
    );
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 md:px-8 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Vehicle not found</h1>
        <Link to="/inventory" className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Back to inventory
        </Link>
      </div>
    </SiteLayout>
  ),
});

function CarDetailPage() {
  const { carId } = Route.useParams();
  const [car, setCar] = useState<Tables<"cars"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("cars")
      .select("*")
      .eq("id", carId)
      .maybeSingle()
      .then(({ data }) => {
        setCar(data);
        setLoading(false);
      });
  }, [carId]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
          <div className="aspect-[16/9] rounded-xl bg-muted animate-pulse" />
        </div>
      </SiteLayout>
    );
  }

  if (!car) {
    throw notFound();
  }

  const images = car.images?.length
    ? car.images
    : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600"];

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  const specs: { label: string; value: string }[] = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Condition", value: car.condition ?? "—" },
    { label: "Year", value: String(car.year) },
    { label: "Mileage", value: formatMiles(car.mileage) },
    { label: "Fuel", value: car.fuel_type ?? "—" },
    { label: "Transmission", value: car.transmission ?? "—" },
    { label: "Body", value: car.body_type ?? "—" },
    { label: "Color", value: car.color ?? "—" },
    { label: "Engine Size", value: car.engine_size ?? "—" },
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 pb-16">
        <Link to="/inventory" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Gallery + content */}
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[16/10]">
              <img
                src={images[idx]}
                alt={`${car.year} ${car.make} ${car.model}`}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center rounded-full bg-background/90 hover:bg-background shadow">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 inline-flex items-center justify-center rounded-full bg-background/90 hover:bg-background shadow">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium">
                    {idx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setIdx(i)}
                    className={`overflow-hidden rounded-md aspect-[4/3] border-2 transition ${i === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{car.year} · {car.body_type ?? "Vehicle"}</p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">{car.make} {car.model}</h1>
              <p className="mt-2 font-display text-2xl md:text-3xl font-bold text-primary">{formatPrice(Number(car.price))}</p>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-display text-lg font-semibold">Specifications</h2>
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-border">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-5 -mt-px -ml-px">
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </dt>
                    <dd className="mt-1.5 text-base font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {car.description && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold mb-3">Description</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}
          </div>

          {/* Inquiry form */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <InquiryForm carId={car.id} carName={`${car.year} ${car.make} ${car.model}`} />
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message required").max(2000),
});

function InquiryForm({ carId, carName }: { carId: string; carName: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Hi, I'm interested in the ${carName}. Is it still available?`);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inquirySchema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      car_id: carId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send. Please try again.");
      return;
    }
    toast.success("Inquiry sent! We'll get back to you shortly.");
    setName(""); setEmail(""); setPhone("");
    setMessage(`Hi, I'm interested in the ${carName}. Is it still available?`);
  };

  const fieldCls = "h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-3">
      <h3 className="font-display text-lg font-semibold">Inquire about this car</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={fieldCls} required maxLength={120} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={fieldCls} required maxLength={255} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone (optional)" className={fieldCls} maxLength={40} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Message" className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" required maxLength={2000} />
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
