const FORBIDDEN_IMAGE_PAYLOAD_KEYS = new Set([
  "base64",
  "blob",
  "blobs",
  "dataurl",
  "file",
  "files",
  "imagebase64",
  "imageblob",
  "imagefile",
  "objecturl",
  "objecturls",
  "pngblob",
  "renderedpng",
  "screenshot",
  "screenshots",
]);

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function hasForbiddenImagePayload(value: unknown, depth = 0): boolean {
  if (depth > 8 || !value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenImagePayload(item, depth + 1));
  }

  return Object.entries(value).some(([key, nestedValue]) => {
    if (FORBIDDEN_IMAGE_PAYLOAD_KEYS.has(normalizeKey(key))) {
      return true;
    }

    return hasForbiddenImagePayload(nestedValue, depth + 1);
  });
}
