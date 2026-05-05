import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function InquiriesManager() {
  const [items, setItems] = useState<Tables<"inquiries">[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    refresh();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">No inquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{items.length} {items.length === 1 ? "inquiry" : "inquiries"} total</p>
      <div className="grid gap-3">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{it.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <a href={`mailto:${it.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {it.email}
                  </a>
                  {it.phone && (
                    <a href={`tel:${it.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                      <Phone className="h-3.5 w-3.5" /> {it.phone}
                    </a>
                  )}
                  <span>{new Date(it.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => remove(it.id)}
                title="Delete"
                className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-foreground/85">{it.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
