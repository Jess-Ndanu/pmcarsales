import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/format";

type Car = Tables<"cars">;

export function CarCard({ car }: { car: Car }) {
  const cover = car.images?.[0] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200";

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
        <p className="mt-2 font-display text-xl font-bold text-primary leading-none">
          {formatPrice(Number(car.price))}
        </p>
        {car.condition && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold border border-primary/20">
              <MapPin className="h-3.5 w-3.5" /> {car.condition}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
