import type { SupabaseClient, User } from "@supabase/supabase-js";

function getStringMetadata(
  metadata: User["user_metadata"],
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = metadata?.[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function getUserDisplayName(user: User) {
  return (
    getStringMetadata(user.user_metadata, ["full_name", "name"]) ??
    user.email ??
    "Signed-in user"
  );
}

export function getUserAvatarUrl(user: User) {
  return getStringMetadata(user.user_metadata, ["avatar_url", "picture"]);
}

export async function syncUserProfile(supabase: SupabaseClient, user: User) {
  const email = user.email?.trim();

  if (!email) {
    return;
  }

  await supabase.from("profiles").upsert(
    {
      avatar_url: getUserAvatarUrl(user),
      email,
      full_name: getUserDisplayName(user),
      id: user.id,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  );
}
