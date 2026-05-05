import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { formatMiles, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/inventory/$carId")({
  component: CarDetailPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    if (import.meta.env.DEV) {
      console.error("Inventory detail error:", error);
    }
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 md:px-8 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground">An error occurred loading this vehicle. Please try again.</p>
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

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Gallery */}
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
          </div>

          {/* Title + price + specs + CTA — next to gallery */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{car.year} · {car.body_type ?? "Vehicle"}</p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">{car.make} {car.model}</h1>
              <p className="mt-2 font-display text-2xl md:text-3xl font-bold text-primary">{formatPrice(Number(car.price))}</p>
            </div>

            <div className="rounded-2xl bg-muted/60 border border-border p-5 md:p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {specs.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] items-start gap-2">
                    <dt className="text-sm font-bold text-foreground">{label}:</dt>
                    <dd className="text-sm text-foreground/80">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <WhatsAppCTA carName={`${car.year} ${car.make} ${car.model}`} />
          </aside>
        </div>

        {/* Features, Safety & Description — full width below */}
        <div className="mt-12 max-w-4xl">
          {car.description && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">Description</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{car.description}</p>
            </div>
          )}

          {(car as any).features && (car as any).features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">Features</h2>
              <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
                <div className="flex flex-wrap gap-3">
                  {((car as any).features as string[]).map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(car as any).safety_features && (car as any).safety_features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">Safety Features</h2>
              <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
                <div className="flex flex-wrap gap-3">
                  {((car as any).safety_features as string[]).map((f) => (
                    <span key={f} className="inline-flex items-center rounded-md bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </SiteLayout>
  );
}

function WhatsAppCTA({ carName }: { carName: string }) {
  const href = `https://wa.me/254721861621?text=${encodeURIComponent(`Hi, I'm interested in the ${carName}. Is it still available?`)}`;
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold">Interested in this car?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chat with us directly on WhatsApp for the fastest response.
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] text-base font-semibold text-white hover:bg-[#1faa53] transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Chat via WhatsApp
      </a>
    </div>
  );
}
