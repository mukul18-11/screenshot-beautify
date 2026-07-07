import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();

  if (!supabase) {
    // Supabase is not configured (local dev): auth is disabled entirely.
    return { configured: false as const, supabase: null, user: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { configured: true as const, supabase, user };
}
