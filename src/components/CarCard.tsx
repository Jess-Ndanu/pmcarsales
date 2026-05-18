import { Link } from "@tanstack/react-router";
import { MapPin, Wallet, HandCoins, Landmark } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/format";

type Car = Tables<"cars">;

export function CarCard({ car }: { car: Car }) {
  const cover = car.images?.[0] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200";
  const waHref = `https://wa.me/254712604775?text=${encodeURIComponent(
    `Hi PM Car Sales, I am interested in the ${car.year} ${car.make} ${car.model}. Is it available for viewing?`
  )}`;

  return (
    <Link
      to="/inventory/$carId"
      params={{ carId: car.id }}
      className="car-card group flex h-full flex-col overflow-hidden rounded-lg bg-card border border-border shadow-card"
      style={{ borderRadius: "8px" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={cover}
          alt={`${car.year} ${car.make} ${car.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {car.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
        )}
        {car.sold && (
          <span className="absolute right-3 top-3 rounded-md bg-foreground px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-background">
            Sold
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight text-foreground">
          {car.make} {car.model}
        </h3>
        <p className="mt-2 font-display text-xl font-bold text-foreground leading-none">
          {formatPrice(Number(car.price))}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
            <Wallet className="h-3 w-3" /> Cash
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
            <HandCoins className="h-3 w-3" /> Hire Purchase
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
            <Landmark className="h-3 w-3" /> Bank Finance
          </span>
        </div>

        {car.condition && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold border border-primary/20">
              <MapPin className="h-3.5 w-3.5" /> {car.condition}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(waHref, "_blank", "noopener,noreferrer");
          }}
          className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1faa53] transition-colors"
        >
          Inquire on WhatsApp
        </button>
      </div>
    </Link>
  );
}
