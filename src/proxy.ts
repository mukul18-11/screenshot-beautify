import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // API routes authenticate themselves per-request (see require-user.ts)
    // and don't need the redirect/cookie-refresh logic below — routing them
    // through it just adds a second, network-fragile Supabase auth round
    // trip in front of every request (most visible on mobile connections).
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
