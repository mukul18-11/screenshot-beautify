import { NextResponse } from "next/server";

import { getSafeNextPath } from "@/lib/auth/next-path";
import { syncUserProfile } from "@/lib/auth/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function createNoStoreRedirect(requestUrl: string, path: string) {
  const response = NextResponse.redirect(new URL(path, requestUrl));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return createNoStoreRedirect(request.url, `${next}?auth=not_configured`);
  }

  // Errors surface on the login page — `next` is guarded now, so redirecting
  // there would just bounce back to /login and lose the error signal.
  const errorPath = `/login?auth=error&next=${encodeURIComponent(next)}`;

  const supabase = await createClient();

  if (!supabase || !code) {
    return createNoStoreRedirect(request.url, errorPath);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return createNoStoreRedirect(request.url, errorPath);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      await syncUserProfile(supabase, user);
    } catch {
      // The profiles table may not exist until migrations are applied.
    }
  }

  return createNoStoreRedirect(request.url, next);
}
