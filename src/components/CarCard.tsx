import { Link } from "@tanstack/react-router";
import { Gauge, Fuel, Settings2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatMiles, formatPrice } from "@/lib/format";

type Car = Tables<"cars">;

export function CarCard({ car }: { car: Car }) {
  const cover = car.images?.[0] ?? "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200";

  return (
    <Link
      to="/inventory/$carId"
      params={{ carId: car.id }}
      className="car-card group block overflow-hidden rounded-xl bg-card border border-border shadow-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={cover}
          alt={`${car.year} ${car.make} ${car.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {car.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        )}
        {car.sold && (
          <span className="absolute right-3 top-3 rounded-md bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
            Sold
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {car.year} · {car.body_type ?? "Vehicle"}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold leading-tight">
              {car.make} {car.model}
            </h3>
          </div>
          <p className="font-display text-lg font-bold text-primary whitespace-nowrap">
            {formatPrice(Number(car.price))}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" /> {formatMiles(car.mileage)}
          </span>
          {car.fuel_type && (
            <span className="inline-flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5" /> {car.fuel_type}
            </span>
          )}
          {car.transmission && (
            <span className="inline-flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" /> {car.transmission}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
