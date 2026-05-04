import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Apex Autos" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6, "Min 6 characters").max(100),
});

function AdminAuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, isAdmin, navigate]);

  if (location.pathname !== "/admin") {
    return <Outlet />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. The first signup is automatically admin.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back.");
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (user && !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">This account doesn't have admin access.</p>
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Sign out
          </button>
        </div>
      </SiteLayout>
    );
  }

  const fieldCls = "h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16 md:py-24">
        <Link to="/" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary">← Back to site</Link>
        <h1 className="mt-3 font-display text-3xl font-bold">{mode === "signin" ? "Admin sign in" : "Create admin account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Restricted access." : "First account becomes admin automatically."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3 rounded-xl border border-border bg-card p-6 shadow-card">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className={fieldCls} required maxLength={255} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className={fieldCls} required maxLength={100} />
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "No account? Create one" : "Have an account? Sign in"}
        </button>
      </div>
    </SiteLayout>
  );
}
