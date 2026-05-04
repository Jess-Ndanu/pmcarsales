import { useEffect, useState } from "react";
import { Upload, Trash2, X, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function SoldGalleryManager() {
  const [items, setItems] = useState<Tables<"sold_gallery">[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Tables<"sold_gallery"> | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("sold_gallery").select("*").order("sort_order").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("sold-gallery").upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (upErr) { toast.error(`Upload failed: ${upErr.message}`); continue; }
      const { data } = supabase.storage.from("sold-gallery").getPublicUrl(path);
      const { error: insErr } = await supabase.from("sold_gallery").insert({ image_url: data.publicUrl, caption: "" });
      if (insErr) toast.error(insErr.message);
    }
    setUploading(false);
    e.target.value = "";
    toast.success("Uploaded");
    refresh();
  };

  const remove = async (g: Tables<"sold_gallery">) => {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("sold_gallery").delete().eq("id", g.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  const saveCaption = async (caption: string) => {
    if (!editing) return;
    const { error } = await supabase.from("sold_gallery").update({ caption }).eq("id", editing.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); setEditing(null); refresh(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-2xl font-bold">Sold Units Gallery</h2>
        <label className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer">
          <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Add photos"}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p className="p-10 text-center text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center text-muted-foreground">
          No photos yet. Upload your first sold unit photo.
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {items.map((g) => (
            <div key={g.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
              <img src={g.image_url} alt={g.caption ?? ""} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                <button onClick={() => setEditing(g)} className="inline-flex items-center gap-1 rounded bg-white text-foreground px-3 py-1.5 text-xs font-semibold">
                  <Pencil className="h-3 w-3" /> Caption
                </button>
                <button onClick={() => remove(g)} className="inline-flex items-center gap-1 rounded bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-semibold">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
              {g.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-xs font-semibold text-white pointer-events-none">
                  {g.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CaptionDialog
          initial={editing.caption ?? ""}
          onClose={() => setEditing(null)}
          onSave={saveCaption}
        />
      )}
    </div>
  );
}

function CaptionDialog({ initial, onClose, onSave }: { initial: string; onClose: () => void; onSave: (caption: string) => void }) {
  const [val, setVal] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-card border border-border shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Edit caption</h2>
          <button onClick={onClose} className="h-9 w-9 inline-flex items-center justify-center rounded hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="e.g. 2019 Toyota Prado — Sold to Mr. Otieno"
            maxLength={160}
            autoFocus
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-6 py-4 bg-surface">
          <button onClick={onClose} className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium">Cancel</button>
          <button onClick={() => onSave(val)} className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save</button>
        </div>
      </div>
    </div>
  );
}
