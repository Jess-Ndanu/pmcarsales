import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const adminBootstrapped = createServerFn({ method: "GET" }).handler(async () => {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) {
    // Fail closed: assume bootstrapped to prevent open signup if check fails
    return { bootstrapped: true };
  }
  return { bootstrapped: (count ?? 0) > 0 };
});
