import { toSvg } from "html-to-image";

import {
  getExportFileName,
  getExportPixelSize,
  getSafeExportScale,
  supportsClipboardImageWrite,
} from "@/lib/export-utils";
import type { ExportScale } from "@/types/editor";

export const CLIPBOARD_IMAGE_UNSUPPORTED_MESSAGE =
  "Copying images is not supported in this browser. Please download the PNG instead.";
export const CLIPBOARD_IMAGE_WRITE_FAILED_MESSAGE =
  "Could not copy image. Try downloading instead.";
const IMAGE_LOAD_ERROR_MESSAGE = "An image could not be loaded for export.";
const PNG_EXPORT_ERROR_MESSAGE = "Unable to create PNG export.";
export const EXPORT_LAYOUT_ERROR_MESSAGE =
  "Export renderer did not match the selected canvas size.";
export const EXPORT_TOO_LARGE_MESSAGE =
  "This export is too large for this device. Lower the export scale or canvas size.";
export const EXPORT_RENDER_ERROR_MESSAGE =
  "Unable to prepare artwork for export.";
const EXPORT_LAYOUT_TOLERANCE_PX = 1;
const CSS_URL_PATTERN = /url\((['"]?)(.*?)\1\)/g;
const MAX_RASTERIZED_RESOURCE_DIMENSION = 4096;
const WEBKIT_RENDER_ATTEMPTS = 3;

type ExportPngOptions = {
  cacheBust?: boolean;
  fileName: string;
  height: number;
  node: HTMLElement;
  scale: ExportScale;
  width: number;
};

async function waitForFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return;
  }

  await document.fonts.ready;
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function waitForExportLayout(
  node: HTMLElement,
  expectedSize: { height: number; width: number },
) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await waitForNextPaint();

    const rect = node.getBoundingClientRect();
    const widthMatches =
      Math.abs(rect.width - expectedSize.width) <= EXPORT_LAYOUT_TOLERANCE_PX;
    const heightMatches =
      Math.abs(rect.height - expectedSize.height) <= EXPORT_LAYOUT_TOLERANCE_PX;

    if (widthMatches && heightMatches) {
      return;
    }
  }

  throw new Error(EXPORT_LAYOUT_ERROR_MESSAGE);
}

async function waitForImageElement(image: HTMLImageElement) {
  if (image.complete && image.naturalWidth > 0) {
    return;
  }

  if (image.complete) {
    throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
  }

  if (typeof image.decode === "function") {
    try {
      await image.decode();
      return;
    } catch {
      // Fall through to load/error listeners for browsers that reject decode early.
    }
  }

  if (image.complete && image.naturalWidth > 0) {
    return;
  }

  if (image.complete) {
    throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
  }

  await new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error(IMAGE_LOAD_ERROR_MESSAGE)),
      { once: true },
    );
  });
}

function isDataUrl(url: string) {
  return url.startsWith("data:");
}

function resolveResourceUrl(url: string) {
  if (url.startsWith("blob:") || isDataUrl(url)) {
    return url;
  }

  return new URL(url, window.location.href).href;
}

async function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error(IMAGE_LOAD_ERROR_MESSAGE));
    });
    reader.addEventListener("error", () => {
      reject(new Error(IMAGE_LOAD_ERROR_MESSAGE));
    });
    reader.readAsDataURL(blob);
  });
}

type InlineResourceContext = {
  element?: HTMLElement;
  imageElement?: HTMLImageElement;
};

function shouldRasterizeResourcesForExport() {
  return (
    isWebKitRenderer() ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}

function getRasterizedResourceDimension(
  renderedSize: number,
  naturalSize: number,
  scale: ExportScale,
) {
  const scaledSize = Math.ceil(Math.max(1, renderedSize || naturalSize) * scale);
  const maxSize = Math.max(
    1,
    Math.min(naturalSize || scaledSize, MAX_RASTERIZED_RESOURCE_DIMENSION),
  );

  return Math.max(1, Math.min(scaledSize, maxSize));
}

function canvasToPngDataUrl(canvas: HTMLCanvasElement) {
  const dataUrl = canvas.toDataURL("image/png");

  if (!dataUrl || dataUrl === "data:,") {
    throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
  }

  return dataUrl;
}

async function rasterizeImageElement(
  image: HTMLImageElement,
  scale: ExportScale,
) {
  await waitForImageElement(image);

  const rect = image.getBoundingClientRect();
  const targetWidth = getRasterizedResourceDimension(
    rect.width,
    image.naturalWidth,
    scale,
  );
  const targetHeight = getRasterizedResourceDimension(
    rect.height,
    image.naturalHeight,
    scale,
  );
  const canvas = document.createElement("canvas");

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
  }

  try {
    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    return canvasToPngDataUrl(canvas);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

async function rasterizeBackgroundImage(
  url: string,
  element: HTMLElement,
  scale: ExportScale,
) {
  const image = await loadExportImage(resolveResourceUrl(url));
  const rect = element.getBoundingClientRect();
  const targetWidth = getRasterizedResourceDimension(
    rect.width,
    image.naturalWidth,
    scale,
  );
  const targetHeight = getRasterizedResourceDimension(
    rect.height,
    image.naturalHeight,
    scale,
  );
  const canvas = document.createElement("canvas");

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
  }

  try {
    const coverScale = Math.max(
      targetWidth / image.naturalWidth,
      targetHeight / image.naturalHeight,
    );
    const sourceWidth = targetWidth / coverScale;
    const sourceHeight = targetHeight / coverScale;
    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    return canvasToPngDataUrl(canvas);
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

function createResourceInliner(scale: ExportScale) {
  const cache = new Map<string, Promise<string>>();

  function fetchResourceDataUrl(resourceUrl: string) {
    const cachedDataUrl = cache.get(resourceUrl);

    if (cachedDataUrl) {
      return cachedDataUrl;
    }

    const dataUrl = fetch(resourceUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
        }

        return response.blob();
      })
      .then(blobToDataUrl)
      .catch(() => {
        throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
      });

    cache.set(resourceUrl, dataUrl);

    return dataUrl;
  }

  return (url: string, context: InlineResourceContext = {}) => {
    const resourceUrl = resolveResourceUrl(url.trim());

    if (isDataUrl(resourceUrl)) {
      return Promise.resolve(resourceUrl);
    }

    if (shouldRasterizeResourcesForExport()) {
      if (context.imageElement) {
        return rasterizeImageElement(context.imageElement, scale).catch(() =>
          fetchResourceDataUrl(resourceUrl),
        );
      }

      if (context.element) {
        return rasterizeBackgroundImage(resourceUrl, context.element, scale).catch(
          () => fetchResourceDataUrl(resourceUrl),
        );
      }
    }

    return fetchResourceDataUrl(resourceUrl);
  };
}

function getCssUrls(cssText: string) {
  const urls = new Set<string>();

  for (const match of cssText.matchAll(CSS_URL_PATTERN)) {
    const url = match[2]?.trim();

    if (url && !isDataUrl(url)) {
      urls.add(url);
    }
  }

  return Array.from(urls);
}

async function inlineCssUrls(
  cssText: string,
  inlineResource: (
    url: string,
    context?: InlineResourceContext,
  ) => Promise<string>,
  element: HTMLElement,
) {
  const urls = getCssUrls(cssText);

  if (urls.length === 0) {
    return cssText;
  }

  const replacements = new Map<string, string>();

  await Promise.all(
    urls.map(async (url) => {
      replacements.set(url, await inlineResource(url, { element }));
    }),
  );

  return cssText.replace(CSS_URL_PATTERN, (raw, _quote, rawUrl) => {
    const dataUrl = replacements.get(rawUrl.trim());

    return dataUrl ? `url("${dataUrl}")` : raw;
  });
}

async function inlineExportResources(node: HTMLElement, scale: ExportScale) {
  const inlineResource = createResourceInliner(scale);
  const restoreCallbacks: Array<() => void> = [];
  const elements = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))];

  const restore = () => {
    restoreCallbacks.reverse().forEach((restoreCallback) => restoreCallback());
  };

  try {
    for (const element of elements) {
      const background = element.style.getPropertyValue("background");
      const propertyName =
        background && getCssUrls(background).length > 0
          ? "background"
          : "background-image";
      const originalValue = element.style.getPropertyValue(propertyName);

      if (!originalValue || getCssUrls(originalValue).length === 0) {
        continue;
      }

      const originalPriority = element.style.getPropertyPriority(propertyName);
      const inlinedValue = await inlineCssUrls(
        originalValue,
        inlineResource,
        element,
      );

      restoreCallbacks.push(() => {
        element.style.setProperty(propertyName, originalValue, originalPriority);
      });
      element.style.setProperty(propertyName, inlinedValue, originalPriority);
    }

    for (const image of Array.from(node.querySelectorAll("img"))) {
      if (!image.src || isDataUrl(image.src)) {
        continue;
      }

      const originalSrc = image.src;
      const originalSrcSet = image.srcset;
      const inlinedSrc = await inlineResource(originalSrc, {
        imageElement: image,
      });

      restoreCallbacks.push(() => {
        image.src = originalSrc;
        image.srcset = originalSrcSet;
      });
      image.srcset = "";
      image.src = inlinedSrc;
      await waitForImageElement(image);
    }
  } catch (error) {
    restore();
    throw error;
  }

  return restore;
}

async function waitForImageUrl(url: string) {
  const image = new Image();

  image.decoding = "async";
  image.src = url;

  await waitForImageElement(image);
}

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));

  await Promise.all(images.map((image) => waitForImageElement(image)));
}

function getBackgroundImageUrls(node: HTMLElement) {
  const elements = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))];
  const urls = new Set<string>();
  const imageUrlPattern = /url\((['"]?)(.*?)\1\)/g;

  elements.forEach((element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;

    for (const match of backgroundImage.matchAll(imageUrlPattern)) {
      const imageUrl = match[2]?.trim();

      if (imageUrl) {
        urls.add(imageUrl);
      }
    }
  });

  return Array.from(urls);
}

async function waitForBackgroundImages(node: HTMLElement) {
  const backgroundImageUrls = getBackgroundImageUrls(node);

  await Promise.all(backgroundImageUrls.map((url) => waitForImageUrl(url)));
}

async function assertPngDimensions(
  blob: Blob,
  expectedSize: { width: number; height: number },
) {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = new Image();

    image.src = objectUrl;
    await waitForImageElement(image);

    if (
      image.naturalWidth !== expectedSize.width ||
      image.naturalHeight !== expectedSize.height
    ) {
      throw new Error("Export dimensions did not match the selected scale.");
    }
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

function handleExportImageError() {
  throw new Error(IMAGE_LOAD_ERROR_MESSAGE);
}

function shouldIncludeExportNode(node: Node) {
  if (!(node instanceof Element)) {
    return true;
  }

  return !node.closest("[data-export-ignore='true']");
}

function isWebKitRenderer() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;
  const isSafariEngine =
    /AppleWebKit/i.test(userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|OPR/i.test(userAgent);
  // Every iOS/iPadOS browser is WebKit underneath, whatever its branding.
  const isIosDevice =
    /iP(?:hone|od|ad)/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1);

  return isSafariEngine || isIosDevice;
}

function waitForDelay(durationMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

type SvgDataUrlPayload = {
  svgText: string;
  type: string;
};

type SvgRenderCandidate = {
  cleanup?: () => void;
  url: string;
};

function decodeSvgDataUrl(svgDataUrl: string): SvgDataUrlPayload {
  const separatorIndex = svgDataUrl.indexOf(",");

  if (separatorIndex === -1 || !svgDataUrl.startsWith("data:image/svg+xml")) {
    throw new Error(PNG_EXPORT_ERROR_MESSAGE);
  }

  const metadata = svgDataUrl.slice(5, separatorIndex);
  const payload = svgDataUrl.slice(separatorIndex + 1);
  const isBase64 = /;base64/i.test(metadata);
  const type =
    metadata.replace(/;base64/gi, "") || "image/svg+xml;charset=utf-8";
  const svgText = isBase64
    ? new TextDecoder().decode(
        Uint8Array.from(window.atob(payload), (character) =>
          character.charCodeAt(0),
        ),
      )
    : decodeURIComponent(payload);

  return { svgText, type };
}

function bytesToBinaryString(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return binary;
}

function createBase64SvgDataUrl(svgText: string) {
  const bytes = new TextEncoder().encode(svgText);

  return `data:image/svg+xml;base64,${window.btoa(bytesToBinaryString(bytes))}`;
}

function createSvgObjectUrl(svgData: SvgDataUrlPayload): SvgRenderCandidate {
  const objectUrl = URL.createObjectURL(
    new Blob([svgData.svgText], { type: svgData.type }),
  );

  return {
    cleanup: () => URL.revokeObjectURL(objectUrl),
    url: objectUrl,
  };
}

function createSvgRenderCandidateFactories(svgDataUrl: string) {
  const factories: Array<() => SvgRenderCandidate> = [];

  try {
    const svgData = decodeSvgDataUrl(svgDataUrl);

    factories.push(() => createSvgObjectUrl(svgData));
    factories.push(() => ({
      url: createBase64SvgDataUrl(svgData.svgText),
    }));
  } catch {
    // Still try the original data URL; the renderer will surface one clean
    // export error if no candidate works.
  }

  factories.push(() => ({ url: svgDataUrl }));

  return factories;
}

async function renderSvgCandidateToPngBlob(
  candidateUrl: string,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  exportWidth: number,
  exportHeight: number,
) {
  const renderAttempts = isWebKitRenderer() ? WEBKIT_RENDER_ATTEMPTS : 1;
  let image = await loadExportImage(candidateUrl);
  let renderedNonBlank = false;

  for (let attempt = 0; attempt < renderAttempts; attempt += 1) {
    if (attempt > 0) {
      // WebKit rasterizes fonts/images inside SVG foreignObject lazily, so
      // the first draw can come out empty. Give it a beat and redraw from a
      // fresh decode instead of shipping a blank frame.
      await waitForNextPaint();
      await waitForDelay(120 * attempt);
      image = await loadExportImage(candidateUrl);
    }

    context.clearRect(0, 0, exportWidth, exportHeight);
    context.drawImage(image, 0, 0, exportWidth, exportHeight);

    if (!isCanvasBlank(canvas)) {
      renderedNonBlank = true;
      break;
    }
  }

  if (!renderedNonBlank) {
    throw new Error(PNG_EXPORT_ERROR_MESSAGE);
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    throw new Error(PNG_EXPORT_ERROR_MESSAGE);
  }

  return blob;
}

// WebKit's Image.decode() rejects for large SVG images even when they render
// fine, so decode failures are ignored on purpose; the load event is the
// source of truth. (html-to-image's own loader hangs forever on this.)
async function loadExportImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();

  image.decoding = "async";

  await new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error(IMAGE_LOAD_ERROR_MESSAGE)),
      { once: true },
    );
    image.src = url;
  });

  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  }

  return image;
}

function isCanvasBlank(canvas: HTMLCanvasElement) {
  const probeSize = 16;
  const probeCanvas = document.createElement("canvas");

  probeCanvas.width = probeSize;
  probeCanvas.height = probeSize;

  const probeContext = probeCanvas.getContext("2d");

  if (!probeContext) {
    return false;
  }

  probeContext.drawImage(canvas, 0, 0, probeSize, probeSize);

  const pixels = probeContext.getImageData(0, 0, probeSize, probeSize).data;

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] !== 0) {
      return false;
    }
  }

  return true;
}

async function renderSvgToPngBlob(
  svgDataUrl: string,
  exportWidth: number,
  exportHeight: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");

  canvas.width = exportWidth;
  canvas.height = exportHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(PNG_EXPORT_ERROR_MESSAGE);
  }

  try {
    for (const createCandidate of createSvgRenderCandidateFactories(svgDataUrl)) {
      let candidate: SvgRenderCandidate | null = null;

      try {
        candidate = createCandidate();
        context.clearRect(0, 0, exportWidth, exportHeight);

        return await renderSvgCandidateToPngBlob(
          candidate.url,
          canvas,
          context,
          exportWidth,
          exportHeight,
        );
      } catch {
        canvas.width = exportWidth;
        canvas.height = exportHeight;
        // Try the next SVG loading strategy before surfacing a renderer error.
      } finally {
        candidate?.cleanup?.();
      }
    }

    throw new Error(PNG_EXPORT_ERROR_MESSAGE);
  } finally {
    // Release the backing store eagerly; iOS keeps large canvases alive
    // until garbage collection otherwise.
    canvas.width = 0;
    canvas.height = 0;
  }
}

export function getEffectiveExportScale(
  width: number,
  height: number,
  scale: ExportScale,
): ExportScale {
  const safeScale = getSafeExportScale(width, height, scale);

  if (safeScale === null) {
    throw new Error(EXPORT_TOO_LARGE_MESSAGE);
  }

  return safeScale;
}

export async function createExportPngBlob({
  cacheBust = false,
  height,
  node,
  scale,
  width,
}: Omit<ExportPngOptions, "fileName">): Promise<Blob> {
  const effectiveScale = getEffectiveExportScale(width, height, scale);
  const exportSize = getExportPixelSize(width, height, effectiveScale);

  if (width <= 0 || height <= 0 || exportSize.width <= 0 || exportSize.height <= 0) {
    throw new Error("Export dimensions must be greater than zero.");
  }

  await waitForFonts();
  await waitForImages(node);
  await waitForExportLayout(node, { height, width });

  const restoreInlinedResources = await inlineExportResources(
    node,
    effectiveScale,
  );
  let svgDataUrl: string;

  try {
    await waitForBackgroundImages(node);

    try {
      svgDataUrl = await toSvg(node, {
        cacheBust,
        filter: shouldIncludeExportNode,
        height,
        onImageErrorHandler: handleExportImageError,
        width,
        style: {
          height: `${height}px`,
          width: `${width}px`,
        },
      });
    } catch (error) {
      // html-to-image's toSvg() can throw raw, uncataloged errors (e.g. a
      // URIError from encodeURIComponent on malformed text, or a TypeError
      // from its own unguarded font-loading failure handler) that would
      // otherwise surface as an unhelpful generic "Export failed" message.
      console.error("[export] toSvg failed", error);
      throw new Error(EXPORT_RENDER_ERROR_MESSAGE);
    }
  } finally {
    restoreInlinedResources();
  }

  const blob = await renderSvgToPngBlob(
    svgDataUrl,
    exportSize.width,
    exportSize.height,
  );

  if (blob.type && blob.type !== "image/png") {
    throw new Error("Export did not produce a PNG image.");
  }

  await assertPngDimensions(blob, exportSize);

  return blob;
}

export async function exportPng(options: ExportPngOptions): Promise<void> {
  const blob = await createExportPngBlob(options);

  downloadBlob(blob, getExportFileName(options.fileName));
}

export async function copyPngToClipboard(
  options: Omit<ExportPngOptions, "fileName">,
): Promise<void> {
  if (!supportsClipboardImageWrite()) {
    throw new Error(CLIPBOARD_IMAGE_UNSUPPORTED_MESSAGE);
  }

  const blobPromise = createExportPngBlob(options);

  try {
    // Safari only allows clipboard writes tied to a user gesture, so hand it
    // the pending blob instead of awaiting the (slow) render first.
    const clipboardItem = new ClipboardItem({ "image/png": blobPromise });

    await navigator.clipboard.write([clipboardItem]);
    return;
  } catch {
    // Fall through: either the render failed (rethrown below with its real
    // message) or this browser cannot accept promised clipboard payloads.
  }

  const blob = await blobPromise;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
  } catch {
    throw new Error(CLIPBOARD_IMAGE_WRITE_FAILED_MESSAGE);
  }
}
