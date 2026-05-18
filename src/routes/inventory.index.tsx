import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { CarCard } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  maxMileage: z.string().optional(),
  bodyType: z.string().optional(),
  condition: z.string().optional(),
  page: z.string().optional(),
});

const PAGE_SIZE = 9;

export const Route = createFileRoute("/inventory/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Used Cars for Sale in Mombasa — PM Car Sales Inventory" },
      { name: "description", content: "Browse used cars for sale at PM Car Sales Mombasa. Filter by make, model, year, mileage, body type and price in KES." },
      { property: "og:title", content: "Used Cars for Sale in Mombasa — PM Car Sales" },
      { property: "og:description", content: "Browse our full inventory of quality used cars in Mombasa, Kenya." },
      { property: "og:url", content: "https://pmcarsales.lovable.app/inventory" },
      { name: "twitter:title", content: "Used Cars for Sale in Mombasa — PM Car Sales" },
      { name: "twitter:description", content: "Browse our full inventory of quality used cars in Mombasa, Kenya." },
    ],
    links: [{ rel: "canonical", href: "https://pmcarsales.lovable.app/inventory" }],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [cars, setCars] = useState<Tables<"cars">[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // local filter state (sync with URL)
  const [make, setMake] = useState(search.make ?? "");
  const [model, setModel] = useState(search.model ?? "");
  const [year, setYear] = useState(search.year ?? "");
  const [minPrice, setMinPrice] = useState(search.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(search.maxPrice ?? "");
  const [maxMileage, setMaxMileage] = useState(search.maxMileage ?? "");

  const page = Number(search.page ?? 1);

  useEffect(() => {
    setMake(search.make ?? "");
    setModel(search.model ?? "");
    setYear(search.year ?? "");
    setMinPrice(search.minPrice ?? "");
    setMaxPrice(search.maxPrice ?? "");
    setMaxMileage(search.maxMileage ?? "");
  }, [search]);

  // Models for the selected make
  const [models, setModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  useEffect(() => {
    if (!make) {
      setModels([]);
      return;
    }
    let cancelled = false;
    setLoadingModels(true);
    supabase
      .from("cars")
      .select("model")
      .ilike("make", make)
      .then(({ data }) => {
        if (cancelled) return;
        const unique = Array.from(new Set((data ?? []).map((r) => r.model).filter(Boolean))).sort();
        setModels(unique);
        setLoadingModels(false);
      });
    return () => {
      cancelled = true;
    };
  }, [make]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    let q = supabase.from("cars").select("*", { count: "exact" });
    if (search.q) {
      const term = `%${search.q}%`;
      q = q.or(`make.ilike.${term},model.ilike.${term}`);
    }
    if (search.make) q = q.ilike("make", search.make);
    if (search.model) q = q.ilike("model", `%${search.model}%`);
    if (search.year) q = q.eq("year", Number(search.year));
    if (search.minPrice) q = q.gte("price", Number(search.minPrice));
    if (search.maxPrice) q = q.lte("price", Number(search.maxPrice));
    if (search.maxMileage) q = q.lte("mileage", Number(search.maxMileage));
    const from = (page - 1) * PAGE_SIZE;
    q = q.order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1);
    q.then(({ data, count }) => {
      if (cancelled) return;
      setCars(data ?? []);
      setCount(count ?? 0);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [search, page]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const apply = () => {
    const next: Record<string, string> = {};
    if (make) next.make = make;
    if (model) next.model = model;
    if (year) next.year = year;
    if (minPrice) next.minPrice = minPrice;
    if (maxPrice) next.maxPrice = maxPrice;
    if (maxMileage) next.maxMileage = maxMileage;
    navigate({ search: next });
    setFiltersOpen(false);
  };

  const clear = () => navigate({ search: {} });

  const activeCount = useMemo(
    () => Object.values(search).filter(Boolean).length,
    [search],
  );

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Inventory</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold">All vehicles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? "Loading…" : `${count} ${count === 1 ? "vehicle" : "vehicles"} available`}
          </p>
          <InventorySearchBar initial={search.q ?? ""} onSubmit={(q) => navigate({ search: { ...search, q: q || undefined, page: undefined } })} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-6">

        <div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <h3 className="font-display text-xl font-semibold">No matches</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try widening your filters.</p>
              <button onClick={clear} className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 fade-up">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <Link
                        key={p}
                        to="/inventory"
                        search={{ ...search, page: String(p) }}
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium",
                          p === page
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary",
                        )}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

interface FilterProps {
  open: boolean;
  onClose: () => void;
  make: string; setMake: (v: string) => void;
  model: string; setModel: (v: string) => void;
  models: string[]; loadingModels: boolean;
  year: string; setYear: (v: string) => void;
  minPrice: string; setMinPrice: (v: string) => void;
  maxPrice: string; setMaxPrice: (v: string) => void;
  maxMileage: string; setMaxMileage: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
  activeCount: number;
}

function FilterSidebar(p: FilterProps) {
  const fieldCls = "h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <aside
      className={cn(
        "lg:sticky lg:top-24 lg:self-start lg:h-fit lg:rounded-xl lg:border lg:border-border lg:bg-card lg:p-5",
        p.open
          ? "fixed inset-0 z-50 bg-background overflow-y-auto p-5"
          : "hidden lg:block",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          {p.activeCount > 0 && (
            <button onClick={p.onClear} className="text-xs font-semibold text-primary hover:underline">
              Clear
            </button>
          )}
          <button onClick={p.onClose} className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5">Make</label>
          <select value={p.make} onChange={(e) => p.setMake(e.target.value)} className={fieldCls}>
            <option value="">Any</option>
            {["Audi","BMW","Daihatsu","Ford","Honda","Mazda","Mercedes-Benz","Mitsubishi","Nissan","Peugeot","Porsche","Range Rover","Subaru","Suzuki","Toyota","Volkswagen","Volvo"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Model</label>
          <select
            value={p.model}
            onChange={(e) => p.setModel(e.target.value)}
            className={fieldCls}
            disabled={!p.make || p.loadingModels}
          >
            <option value="">
              {!p.make
                ? "Select Make first"
                : p.loadingModels
                  ? "Loading…"
                  : p.models.length === 0
                    ? "No models"
                    : "Any"}
            </option>
            {p.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Price range</label>
          <div className="grid grid-cols-2 gap-2">
            <input value={p.minPrice} onChange={(e) => p.setMinPrice(e.target.value)} placeholder="Min" type="number" min={0} className={fieldCls} />
            <input value={p.maxPrice} onChange={(e) => p.setMaxPrice(e.target.value)} placeholder="Max" type="number" min={0} className={fieldCls} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Max mileage</label>
          <input value={p.maxMileage} onChange={(e) => p.setMaxMileage(e.target.value)} placeholder="Any" type="number" min={0} className={fieldCls} />
        </div>

        <button
          onClick={p.onApply}
          className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Apply filters
        </button>
      </div>
    </aside>
  );
}

function InventorySearchBar({ initial, onSubmit }: { initial: string; onSubmit: (q: string) => void }) {
  const [value, setValue] = useState(initial);
  useEffect(() => { setValue(initial); }, [initial]);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(value.trim()); }}
      className="mt-4 flex items-stretch h-12 max-w-2xl rounded-full bg-background border border-border shadow-sm overflow-hidden"
    >
      <div className="flex items-center pl-4 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by make or model — e.g. Toyota Premio"
        className="flex-1 bg-transparent px-3 text-sm focus:outline-none"
        maxLength={80}
      />
      <button type="submit" className="px-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
        Search
      </button>
    </form>
  );
}
