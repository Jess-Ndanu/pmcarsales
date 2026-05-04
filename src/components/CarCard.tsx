import { Link } from "@tanstack/react-router";
import { Calendar, Gauge, Settings2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { formatMiles, formatPrice } from "@/lib/format";

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
        <p className="font-display text-xl font-bold text-primary leading-none">
          {formatPrice(Number(car.price))}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="mt-auto pt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-foreground/70 border-t border-border/60 mt-4">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" style={{ color: "#C0C0C0" }} /> {car.year}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" style={{ color: "#C0C0C0" }} /> {formatMiles(car.mileage)}
          </span>
          {car.transmission && (
            <span className="inline-flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" style={{ color: "#C0C0C0" }} /> {car.transmission}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
