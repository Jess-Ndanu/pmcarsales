import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MAKES, MAKE_MODELS } from "@/lib/carMakes";

const PRICES = [
  { label: "Max Price", value: "" },
  { label: "Under KES 1M", value: "0-1000000" },
  { label: "KES 1M – 3M", value: "1000000-3000000" },
  { label: "KES 3M – 5M", value: "3000000-5000000" },
  { label: "KES 5M – 10M", value: "5000000-10000000" },
  { label: "KES 10M+", value: "10000000-999999999" },
];


const TABS = ["All", "New", "Used"] as const;

export function HeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const models = useMemo(() => (make ? MAKE_MODELS[make] ?? [] : []), [make]);

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
    if (tab !== "All") search.condition = tab.toLowerCase();
    navigate({ to: "/inventory", search });
  };

  const selectCls =
    "h-full w-full appearance-none bg-transparent px-5 pr-9 text-sm font-semibold text-foreground focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:text-foreground/40";

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative pb-2 text-sm font-bold uppercase tracking-wider transition-colors ${
              tab === t ? "text-white" : "text-white/60 hover:text-white/80"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Pill search bar */}
      <form
        onSubmit={onSubmit}
        className="flex items-stretch h-16 md:h-[72px] rounded-full bg-white shadow-2xl pr-2 pl-1"
      >
        <div className="relative flex-1 flex items-center border-r border-border/70">
          <select value={make} onChange={(e) => setMake(e.target.value)} className={selectCls}>
            {MAKES.map((m) => (
              <option key={m} value={m === "All Makes" ? "" : m}>{m}</option>
            ))}
          </select>
          <Chevron />
        </div>
        <div className="relative flex-1 flex items-center border-r border-border/70">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={selectCls}
            disabled={!make}
          >
            <option value="">
              {!make
                ? "Select Make first"
                : models.length === 0
                  ? "No models"
                  : "All Models"}
            </option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Chevron />
        </div>
        <div className="relative flex-1 flex items-center">
          <select value={price} onChange={(e) => setPrice(e.target.value)} className={selectCls}>
            {PRICES.map((p) => (
              <option key={p.label} value={p.value}>{p.label}</option>
            ))}
          </select>
          <Chevron />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="ml-2 my-2 inline-flex aspect-square h-[calc(100%-1rem)] items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-glow hover:scale-105"
        >
          <Search className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 h-4 w-4 text-foreground/50"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
