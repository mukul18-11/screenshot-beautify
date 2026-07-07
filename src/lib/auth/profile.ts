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

  // The handle_new_user trigger inserts the profile row on signup, so this
  // only needs to refresh the user-editable columns (the column-level grant
  // on profiles excludes everything else, including id).
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: getUserAvatarUrl(user),
      email,
      full_name: getUserDisplayName(user),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.warn("syncUserProfile failed:", error.message);
  }
}
