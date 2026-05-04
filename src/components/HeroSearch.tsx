import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

const MAKES = ["Any make", "Audi", "BMW", "Ford", "Mercedes-Benz", "Porsche", "Range Rover", "Tesla", "Volkswagen"];
const YEARS = ["Any year", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const PRICES = [
  { label: "Any price", value: "" },
  { label: "Under $30k", value: "0-30000" },
  { label: "$30k – $60k", value: "30000-60000" },
  { label: "$60k – $100k", value: "60000-100000" },
  { label: "$100k – $150k", value: "100000-150000" },
  { label: "$150k+", value: "150000-9999999" },
];

export function HeroSearch() {
  const navigate = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const search: Record<string, string> = {};
    if (make) search.make = make;
    if (model) search.model = model;
    if (year) search.year = year;
    if (price) {
      const [min, max] = price.split("-");
      search.minPrice = min;
      search.maxPrice = max;
    }
    navigate({ to: "/inventory", search });
  };

  const fieldCls =
    "h-14 w-full rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-background/95 backdrop-blur p-5 md:p-6 shadow-2xl border border-border/50"
    >
      <div className="grid gap-3 md:grid-cols-5 md:gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
            Make
          </label>
          <select value={make} onChange={(e) => setMake(e.target.value)} className={fieldCls}>
            {MAKES.map((m) => (
              <option key={m} value={m === "Any make" ? "" : m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
            Model
          </label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Any"
            className={fieldCls}
            maxLength={60}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
            Year
          </label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={fieldCls}>
            {YEARS.map((y) => (
              <option key={y} value={y === "Any year" ? "" : y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
            Price
          </label>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className={fieldCls}>
            {PRICES.map((p) => (
              <option key={p.label} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out shadow-glow hover:shadow-lg"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

