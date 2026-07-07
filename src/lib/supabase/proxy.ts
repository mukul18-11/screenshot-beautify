import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSafeNextPath } from "@/lib/auth/next-path";
import { getSupabaseBrowserConfig } from "@/lib/supabase/config";

function isProtectedPath(pathname: string) {
  return pathname === "/reset-password";
}

// Refreshed session cookies live on the in-flight response; a redirect
// response must carry them or the refreshed session is lost.
function copyCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  target.headers.set("Cache-Control", "private, no-store");
  return target;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const config = getSupabaseBrowserConfig();

  if (!config) {
    return response;
  }

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        response.headers.set("Cache-Control", "private, no-store");
      },
    },
  });

  // getUser() must run unconditionally: it refreshes expired tokens and
  // writes the rotated cookies via setAll above.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return copyCookies(NextResponse.redirect(url), response);
  }

  if (user && pathname === "/login") {
    const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));
    const url = new URL(nextPath, request.nextUrl.origin);
    return copyCookies(NextResponse.redirect(url), response);
  }

  return response;
}
