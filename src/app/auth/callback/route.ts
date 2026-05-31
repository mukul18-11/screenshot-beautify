import { NextResponse } from "next/server";

import { syncUserProfile } from "@/lib/auth/profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/editor";
  }

  return value;
}

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

  const supabase = await createClient();

  if (!supabase || !code) {
    return createNoStoreRedirect(request.url, `${next}?auth=error`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return createNoStoreRedirect(request.url, `${next}?auth=error`);
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
