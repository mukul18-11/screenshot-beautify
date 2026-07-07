const FALLBACK_PATH = "/editor";

export function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return FALLBACK_PATH;
  }

  try {
    const url = new URL(value, "https://snapingly.local");

    if (url.origin !== "https://snapingly.local") {
      return FALLBACK_PATH;
    }

    // Never bounce back to the login page itself (redirect loop).
    if (url.pathname === "/login") {
      return FALLBACK_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return FALLBACK_PATH;
  }
}
