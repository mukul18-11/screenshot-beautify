import type { ExportScale } from "@/types/editor";

const DEFAULT_EXPORT_FILE_NAME = "snapingly-export";
const UNSAFE_FILE_NAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001F\u007F]/g;
const PNG_EXTENSION_PATTERN = /\.png$/i;

export function sanitizeFileName(input: string): string {
  const sanitized = input
    .replace(UNSAFE_FILE_NAME_CHARACTERS, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "")
    .replace(/[. ]+$/, "");

  return sanitized || DEFAULT_EXPORT_FILE_NAME;
}

export function getExportFileName(input: string): string {
  const sanitized = sanitizeFileName(input);

  if (PNG_EXTENSION_PATTERN.test(sanitized)) {
    return sanitized.replace(PNG_EXTENSION_PATTERN, ".png");
  }

  return `${sanitized}.png`;
}

export function getExportPixelSize(
  canvasWidth: number,
  canvasHeight: number,
  scale: ExportScale,
): { width: number; height: number } {
  return {
    width: canvasWidth * scale,
    height: canvasHeight * scale,
  };
}

export function supportsClipboardImageWrite(): boolean {
  return (
    typeof ClipboardItem !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.write === "function"
  );
}
