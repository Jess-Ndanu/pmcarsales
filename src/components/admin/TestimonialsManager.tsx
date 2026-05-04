import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Star } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

const schema = z.object({
  author_name: z.string().trim().min(1).max(80),
  author_role: z.string().trim().max(120).optional().or(z.literal("")),
  quote: z.string().trim().min(5).max(800),
  rating: z.number().int().min(1).max(5),
});

export function TestimonialsManager() {
  const [items, setItems] = useState<Tables<"testimonials">[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tables<"testimonials"> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const remove = async (t: Tables<"testimonials">) => {
    if (!confirm(`Delete testimonial from ${t.author_name}?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Testimonials</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New testimonial
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {loading ? (
          <p className="p-10 text-center text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">No testimonials yet.</p>
        ) : items.map((t) => (
          <div key={t.id} className="p-5 flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold">{t.author_name}</p>
                {t.author_role && <span className="text-xs text-muted-foreground">· {t.author_role}</span>}
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <p className="text-sm text-foreground/80">"{t.quote}"</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(t); setShowForm(true); }} className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-muted">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(t)} className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <TestimonialForm
          item={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); refresh(); }}
        />
      )}
    </div>
  );
}

function TestimonialForm({ item, onClose, onSaved }: { item: Tables<"testimonials"> | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    author_name: item?.author_name ?? "",
    author_role: item?.author_role ?? "",
    quote: item?.quote ?? "",
    rating: item?.rating ?? 5,
    featured: item?.featured ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0]?.message ?? "Check the form"); return; }
    setSaving(true);
    const payload: TablesInsert<"testimonials"> = {
      author_name: parsed.data.author_name,
      author_role: parsed.data.author_role || null,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
      featured: form.featured,
    };
    const { error } = item
      ? await supabase.from("testimonials").update(payload).eq("id", item.id)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(item ? "Updated" : "Created");
    onSaved();
  };

  const fieldCls = "h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelCls = "block text-xs font-semibold mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 overflow-y-auto">
      <form onSubmit={save} className="w-full max-w-xl my-8 rounded-xl bg-card border border-border shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-semibold">{item ? "Edit testimonial" : "New testimonial"}</h2>
          <button type="button" onClick={onClose} className="h-9 w-9 inline-flex items-center justify-center rounded hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Author name</label><input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className={fieldCls} required maxLength={80} /></div>
            <div><label className={labelCls}>Role / location</label><input value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} className={fieldCls} maxLength={120} placeholder="e.g. Mombasa" /></div>
          </div>
          <div>
            <label className={labelCls}>Quote</label>
            <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" required maxLength={800} />
          </div>
          <div>
            <label className={labelCls}>Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={fieldCls}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-border" />
            Show on homepage
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4 bg-surface">
          <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving…" : item ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
