import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut, Pencil, Plus, Search, Trash2, Star, StarOff, Upload, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { formatPrice } from "@/lib/format";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { SoldGalleryManager } from "@/components/admin/SoldGalleryManager";
import { InquiriesManager } from "@/components/admin/InquiriesManager";

type Tab = "cars" | "gallery" | "testimonials" | "inquiries";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Apex Autos Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Tables<"cars">[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tables<"cars"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<Tab>("cars");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate({ to: "/admin" });
    }
  }, [user, isAdmin, authLoading, navigate]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchTerm(searchInput.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const refresh = async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    let q = supabase.from("cars").select("*", { count: "exact" });
    if (searchTerm) {
      const term = `%${searchTerm}%`;
      q = q.or(`make.ilike.${term},model.ilike.${term}`);
    }
    const { data, count } = await q
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    setCars(data ?? []);
    setTotalCars(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, page, searchTerm]);

  const remove = async (car: Tables<"cars">) => {
    if (!confirm(`Delete ${car.year} ${car.make} ${car.model}?`)) return;
    const { error } = await supabase.from("cars").delete().eq("id", car.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    refresh();
  };

  const toggleFeatured = async (car: Tables<"cars">) => {
    const { error } = await supabase.from("cars").update({ featured: !car.featured }).eq("id", car.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  if (authLoading || !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center text-muted-foreground">Checking access…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email}</p>
          </div>
          <div className="flex gap-2">
            {tab === "cars" && (
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> New car
              </button>
            )}
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium hover:border-primary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-1 border-b border-border">
          {([
            { id: "cars", label: "Cars" },
            { id: "gallery", label: "Sold Gallery" },
            { id: "testimonials", label: "Testimonials" },
            { id: "inquiries", label: "Inquiries" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "cars" && (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by make or model…"
                    className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {loading ? "Loading…" : `${totalCars} ${totalCars === 1 ? "car" : "cars"} total`}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Make</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loading ? (
                        <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>
                      ) : cars.length === 0 ? (
                        <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">{searchTerm ? "No cars match your search." : "No cars yet. Add your first listing."}</td></tr>
                      ) : cars.map((car) => (
                        <tr key={car.id}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                                {car.images?.[0] && <img src={car.images[0]} alt="" className="h-full w-full object-cover" />}
                              </div>
                              <div>
                                <p className="font-semibold">{car.model}</p>
                                <p className="text-xs text-muted-foreground">{car.year} · {car.color}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">{car.make}</td>
                          <td className="px-5 py-4 font-semibold">{formatPrice(Number(car.price))}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1">
                              {car.featured && <span className="inline-flex rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">Featured</span>}
                              {car.sold && <span className="inline-flex rounded bg-foreground text-background px-2 py-0.5 text-xs font-semibold">Sold</span>}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => toggleFeatured(car)} title="Toggle featured" className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-muted">
                                {car.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                              </button>
                              <button onClick={() => { setEditing(car); setShowForm(true); }} title="Edit" className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-muted">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => remove(car)} title="Delete" className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalCars > PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Page {page} of {Math.max(1, Math.ceil(totalCars / PAGE_SIZE))}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= Math.ceil(totalCars / PAGE_SIZE) || loading}
                      className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "gallery" && <SoldGalleryManager />}
          {tab === "testimonials" && <TestimonialsManager />}
          {tab === "inquiries" && <InquiriesManager />}
        </div>
      </div>

      {showForm && (
        <CarFormDialog
          car={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); refresh(); }}
        />
      )}
    </SiteLayout>
  );
}

const carSchema = z.object({
  make: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(60),
  year: z.number().int().min(1900).max(2100),
  mileage: z.number().int().min(0).max(2_000_000),
  price: z.number().min(0).max(1_000_000_000),
  body_type: z.string().trim().max(40).optional().or(z.literal("")),
  fuel_type: z.string().trim().max(40).optional().or(z.literal("")),
  transmission: z.string().trim().max(40).optional().or(z.literal("")),
  color: z.string().trim().max(40).optional().or(z.literal("")),
  condition: z.string().trim().max(80).optional().or(z.literal("")),
  engine_size: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
});

const FEATURE_OPTIONS = [
  "360-degree camera","Blind spot alert","Bluetooth","Cooled seats","Heated seats",
  "Keyless start","Leather seats","LED headlights","Memory seat","Navigation System",
  "Reversing camera","Side airbags","Sound system","Traction Control","USB port",
];

const SAFETY_FEATURE_OPTIONS = [
  "Active head restraints","Adaptive headlights","Backup camera","Blind-spot warning",
  "Brake assist","Forward-collision warning","Lane keeping assist","Parking assist systems",
  "Pedestrian detection","Sideview camera",
];

function CarFormDialog({ car, onClose, onSaved }: { car: Tables<"cars"> | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    make: car?.make ?? "",
    model: car?.model ?? "",
    year: car?.year ?? new Date().getFullYear(),
    mileage: car?.mileage ?? 0,
    price: Number(car?.price ?? 0),
    body_type: car?.body_type ?? "",
    fuel_type: car?.fuel_type ?? "",
    transmission: car?.transmission ?? "",
    color: car?.color ?? "",
    condition: car?.condition ?? "",
    engine_size: car?.engine_size ?? "",
    description: car?.description ?? "",
    featured: car?.featured ?? false,
    sold: car?.sold ?? false,
  });
  const [images, setImages] = useState<string[]>(car?.images ?? []);
  const [features, setFeatures] = useState<string[]>((car as any)?.features ?? []);
  const [safetyFeatures, setSafetyFeatures] = useState<string[]>((car as any)?.safety_features ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };
  const toggleSafety = (f: string) => {
    setSafetyFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("car-images").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
      });
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("car-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const dragIndex = useRef<number | null>(null);
  const onDragStart = (i: number) => { dragIndex.current = i; };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (i: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === i) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
  };
  const moveImage = (i: number, dir: -1 | 1) => {
    setImages((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = carSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Check the form");
      return;
    }
    setSaving(true);
    const payload: TablesInsert<"cars"> = {
      make: parsed.data.make,
      model: parsed.data.model,
      year: parsed.data.year,
      mileage: parsed.data.mileage,
      price: parsed.data.price,
      body_type: parsed.data.body_type || null,
      fuel_type: parsed.data.fuel_type || null,
      transmission: parsed.data.transmission || null,
      color: parsed.data.color || null,
      condition: parsed.data.condition || null,
      engine_size: parsed.data.engine_size || null,
      description: parsed.data.description || null,
      images,
      features,
      safety_features: safetyFeatures,
      featured: form.featured,
      sold: form.sold,
    } as any;
    let error;
    if (car) {
      ({ error } = await supabase.from("cars").update(payload).eq("id", car.id));
    } else {
      ({ error } = await supabase.from("cars").insert(payload));
    }
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(car ? "Updated" : "Created");
    onSaved();
  };

  const fieldCls = "h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelCls = "block text-xs font-semibold mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 overflow-y-auto">
      <form onSubmit={save} className="w-full max-w-3xl my-8 rounded-xl bg-card border border-border shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-semibold">{car ? "Edit car" : "New car"}</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 inline-flex items-center justify-center rounded hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Make</label><input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} className={fieldCls} required maxLength={60} /></div>
            <div><label className={labelCls}>Model</label><input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={fieldCls} required maxLength={60} /></div>
            <div><label className={labelCls}>Year</label><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className={fieldCls} required min={1900} max={2100} /></div>
            <div><label className={labelCls}>Price (KSh)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={fieldCls} required min={0} step={1000} /></div>
            <div><label className={labelCls}>Mileage (km)</label><input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} className={fieldCls} min={0} placeholder="e.g. 45000" /></div>
            <div><label className={labelCls}>Body type</label><input value={form.body_type} onChange={(e) => setForm({ ...form, body_type: e.target.value })} className={fieldCls} maxLength={40} placeholder="Sedan, SUV…" /></div>
            <div>
              <label className={labelCls}>Fuel</label>
              <select value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value })} className={fieldCls}>
                <option value="">Select…</option>
                {["Petrol","Diesel","Hybrid","Electric"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Transmission</label>
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={fieldCls}>
                <option value="">Select…</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={fieldCls}>
                <option value="">Select…</option>
                {["Black","Blue","Brown","Gold","Green","Grey","Orange","Red","Silver","White","Yellow"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div><label className={labelCls}>Engine size (cc)</label><input type="number" value={form.engine_size} onChange={(e) => setForm({ ...form, engine_size: e.target.value })} className={fieldCls} min={0} placeholder="e.g. 2000" /></div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Condition</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={fieldCls}>
                <option value="">Select…</option>
                <option value="Imported and available in Mombasa">Imported and available in Mombasa</option>
                <option value="Traded in">Traded in</option>
                <option value="On the way">On the way</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" maxLength={4000} />
          </div>

          <div>
            <label className={labelCls}>Images <span className="text-muted-foreground font-normal">(drag to reorder — first image is the cover)</span></label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {images.map((url, i) => (
                <div
                  key={url}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(i)}
                  className="relative group aspect-[4/3] overflow-hidden rounded border border-border bg-muted cursor-move"
                >
                  <img src={url} alt="" className="h-full w-full object-cover pointer-events-none" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Cover</span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-foreground/60 opacity-0 group-hover:opacity-100 transition">
                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="px-2 py-1 text-white text-xs disabled:opacity-30">◀</button>
                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="px-2 py-1 text-white text-xs disabled:opacity-30">▶</button>
                  </div>
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 h-7 w-7 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="aspect-[4/3] flex flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-border cursor-pointer hover:border-primary text-xs text-muted-foreground">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Add"}
                <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
          <div>
            <label className={labelCls}>Features</label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((f) => {
                const active = features.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"}`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className={labelCls}>Safety Features</label>
            <div className="flex flex-wrap gap-2">
              {SAFETY_FEATURE_OPTIONS.map((f) => {
                const active = safetyFeatures.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleSafety(f)}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"}`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>


          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-border" />
              Featured on homepage
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sold} onChange={(e) => setForm({ ...form, sold: e.target.checked })} className="h-4 w-4 rounded border-border" />
              Mark as sold
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4 bg-surface">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving…" : car ? "Update listing" : "Update listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
