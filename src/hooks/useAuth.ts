import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async (u: User | null) => {
      if (!u) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!mounted) return;
      if (error) console.error("admin role check failed:", error);
      setIsAdmin(!!data);
      setLoading(false);
    };

    // Listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      if (!mounted) return;
      setLoading(true);
      setSession(sess);
      setUser(sess?.user ?? null);
      // Defer Supabase call to avoid deadlock inside auth callback
      setTimeout(() => checkAdmin(sess?.user ?? null), 0);
    });

    // THEN restore existing
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      await checkAdmin(data.session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, session, isAdmin, loading };
}
