import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/api/require-user";
import { getUserAvatarUrl, getUserDisplayName } from "@/lib/auth/profile";
import { LOCAL_FREE_EXPORT_AUTHORIZATION } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

function createNoStoreJson(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const { configured, user } = await getAuthenticatedUser();

  if (configured && !user) {
    return createNoStoreJson(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  return createNoStoreJson({
    authenticated: Boolean(user),
    entitlement: LOCAL_FREE_EXPORT_AUTHORIZATION.entitlement,
    plan: "free",
    quota: LOCAL_FREE_EXPORT_AUTHORIZATION.quota,
    requiresWatermark: LOCAL_FREE_EXPORT_AUTHORIZATION.requiresWatermark,
    user: user
      ? {
          avatarUrl: getUserAvatarUrl(user),
          email: user.email,
          id: user.id,
          name: getUserDisplayName(user),
        }
      : null,
    watermarkText: LOCAL_FREE_EXPORT_AUTHORIZATION.watermarkText,
  });
}
