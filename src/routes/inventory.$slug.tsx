import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Wallet, HandCoins, Landmark } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatMiles, formatPrice, DEALER_PHONE } from "@/lib/format";
import { carSlug, isUuid } from "@/lib/slug";

export const Route = createFileRoute("/inventory/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;

    // Legacy: support old UUID-based URLs
    if (isUuid(slug)) {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return { car: data, canonicalSlug: carSlug(data) };
    }

    // Parse year prefix: "2020-toyota-prado"
    const m = slug.match(/^(\d{4})-(.+)$/);
    if (!m) throw notFound();
    const year = Number(m[1]);

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("year", year)
      .limit(50);
    if (error) throw error;

    const match = (data ?? []).find((c) => carSlug(c) === slug);
    if (!match) throw notFound();
    return { car: match, canonicalSlug: slug };
  },
  head: ({ loaderData }) => {
    const car = loaderData?.car;
    if (!car) return {};
    const title = `${car.year} ${car.make} ${car.model} for Sale in Mombasa — PM Car Sales`;
    const description = `${car.year} ${car.make} ${car.model} available at PM Car Sales Mombasa. ${formatMiles(car.mileage)}, priced at ${formatPrice(Number(car.price))}. Call ${DEALER_PHONE} or WhatsApp to inquire.`;
    const image = car.images?.[0] ?? "https://pmcarsales.lovable.app/favicon.ico";
    const url = `https://pmcarsales.lovable.app/inventory/${loaderData.canonicalSlug}`;
    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${car.year} ${car.make} ${car.model}`,
      description: car.description ?? `${car.year} ${car.make} ${car.model} for sale at PM Car Sales Mombasa.`,
      image: car.images?.length ? car.images : [image],
      brand: { "@type": "Brand", name: car.make },
      sku: car.id,
      mpn: car.id,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "KES",
        price: Number(car.price),
        availability: car.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        itemCondition: "https://schema.org/UsedCondition",
        seller: {
          "@type": "AutoDealer",
          name: "PM Car Sales",
          telephone: "+254712604775",
          email: "pmcarsalesmombasa@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ivory Building, Moi Avenue",
            addressLocality: "Mombasa",
            addressCountry: "KE",
          },
        },
      },
    };
    const vehicleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Vehicle",
      name: `${car.year} ${car.make} ${car.model}`,
      brand: { "@type": "Brand", name: car.make },
      model: car.model,
      vehicleModelDate: String(car.year),
      mileageFromOdometer: { "@type": "QuantitativeValue", value: car.mileage, unitCode: "KMT" },
      bodyType: car.body_type ?? undefined,
      fuelType: car.fuel_type ?? undefined,
      vehicleTransmission: car.transmission ?? undefined,
      color: car.color ?? undefined,
      image: car.images ?? [],
      url,
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productJsonLd) },
        { type: "application/ld+json", children: JSON.stringify(vehicleJsonLd) },
      ],
    };
  },
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
  const { car } = Route.useLoaderData();
  const [idx, setIdx] = useState(0);

  if (!car) {
    throw notFound();
  }

  const images: string[] = car.images?.length
    ? (car.images as string[])
    : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600"];

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  const specs: { label: string; value: string }[] = [
    { label: "Year", value: String(car.year) },
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    { label: "Engine", value: car.engine_size ?? "—" },
    { label: "Transmission", value: car.transmission ?? "—" },
    { label: "Mileage", value: formatMiles(car.mileage) },
    { label: "Fuel", value: car.fuel_type ?? "—" },
    { label: "Body Type", value: car.body_type ?? "—" },
    { label: "Color", value: car.color ?? "—" },
    { label: "Condition", value: car.condition ?? "—" },
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
                alt={`${car.year} ${car.make} ${car.model} for sale in Mombasa Kenya — PM Car Sales`}
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
                    <img src={src} alt={`${car.year} ${car.make} ${car.model} — photo ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title + price + specs + CTA — next to gallery */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{car.year} · {car.body_type ?? "Vehicle"}</p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">{car.year} {car.make} {car.model}</h1>
              <p className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">{formatPrice(Number(car.price))}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatMiles(car.mileage)} · {car.fuel_type ?? "—"} · {car.transmission ?? "—"}</p>
            </div>

            {/* Payment options */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <Wallet className="h-3.5 w-3.5" /> Cash
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <HandCoins className="h-3.5 w-3.5" /> Hire Purchase
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                <Landmark className="h-3.5 w-3.5" /> Bank Finance
              </span>
            </div>

            {/* Bulleted specifications */}
            <div className="rounded-2xl bg-muted/60 border border-border p-5 md:p-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-3">Specifications</h2>
              <ul className="space-y-2">
                {specs.map(({ label, value }) => (
                  <li key={label} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span className="font-semibold text-foreground">{label}:</span>
                    <span className="text-foreground/80">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <WhatsAppCTA car={car} />
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

          {car.features && car.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">Premium Features</h2>
              <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(car.features as string[]).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {car.safety_features && car.safety_features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-bold mb-4">Safety Features</h2>
              <div className="rounded-2xl bg-primary/5 border border-primary/15 p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(car.safety_features as string[]).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </div>
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

function WhatsAppCTA({ car }: { car: { year: number; make: string; model: string } }) {
  const href = `https://wa.me/254712604775?text=${encodeURIComponent(`Hi PM Car Sales, I am interested in the ${car.year} ${car.make} ${car.model}. Is it available for viewing?`)}`;
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
