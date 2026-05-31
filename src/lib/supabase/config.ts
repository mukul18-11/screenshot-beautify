type SupabaseBrowserConfig = {
  publishableKey: string;
  url: string;
};

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url?.trim() || !publishableKey?.trim()) {
    return null;
  }

  return {
    publishableKey: publishableKey.trim(),
    url: url.trim(),
  };
}

export function isSupabaseConfigured() {
  return getSupabaseBrowserConfig() !== null;
}
