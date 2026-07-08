import type { ExportScale } from "@/types/editor";

const EXPORT_SCALE_STEPS: ExportScale[] = [1, 2, 4, 6];
// iOS/iPadOS WebKit refuses to rasterize canvases above ~16.7M pixels
// (4096 x 4096): drawing silently produces nothing and toBlob() returns null.
const IOS_MAX_CANVAS_AREA = 16_777_216;
const DEFAULT_MAX_CANVAS_AREA = 268_435_456;

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

function isIosLikeDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  // Modern iPadOS reports itself as Macintosh, so a Mac UA with touch support
  // is treated as an iPad.
  return (
    /iP(?:hone|od|ad)/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  );
}

export function getMaxExportCanvasArea(): number {
  return isIosLikeDevice() ? IOS_MAX_CANVAS_AREA : DEFAULT_MAX_CANVAS_AREA;
}

export function getMaxSafeExportScale(
  canvasWidth: number,
  canvasHeight: number,
): ExportScale | null {
  const maxArea = getMaxExportCanvasArea();
  const fittingScales = EXPORT_SCALE_STEPS.filter(
    (scale) => canvasWidth * scale * canvasHeight * scale <= maxArea,
  );

  return fittingScales.length > 0
    ? fittingScales[fittingScales.length - 1]
    : null;
}

export function getSafeExportScale(
  canvasWidth: number,
  canvasHeight: number,
  requestedScale: ExportScale,
): ExportScale | null {
  const maxSafeScale = getMaxSafeExportScale(canvasWidth, canvasHeight);

  if (maxSafeScale === null) {
    return null;
  }

  return requestedScale <= maxSafeScale ? requestedScale : maxSafeScale;
}

export function supportsClipboardImageWrite(): boolean {
  return (
    typeof ClipboardItem !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.write === "function"
  );
}
