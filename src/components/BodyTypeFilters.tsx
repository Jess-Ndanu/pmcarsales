import { Link } from "@tanstack/react-router";
import { Car, CarFront, CarTaxiFront, Caravan, Truck } from "lucide-react";

const TYPES = [
  { label: "Sedan", icon: CarFront },
  { label: "Coupe", icon: Car },
  { label: "SUV", icon: Caravan },
  { label: "Hatchback", icon: CarTaxiFront },
  { label: "Truck", icon: Truck },
] as const;

export function BodyTypeFilters() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-6 md:gap-x-14">
      {TYPES.map(({ label, icon: Icon }) => (
        <Link
          key={label}
          to="/inventory"
          search={{ bodyType: label }}
          className="group flex flex-col items-center gap-2.5 text-white"
        >
          <span className="flex h-16 w-16 md:h-[72px] md:w-[72px] items-center justify-center rounded-full border-2 border-white/70 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:scale-110">
            <Icon className="h-7 w-7 md:h-8 md:w-8 transition-colors group-hover:text-primary" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold tracking-wide group-hover:text-primary transition-colors">
            {label}
          </span>
        </Link>
      ))}
    </div>
  );
}
