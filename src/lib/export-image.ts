import { toBlob } from "html-to-image";

import {
  getExportFileName,
  getExportPixelSize,
  supportsClipboardImageWrite,
} from "@/lib/export-utils";
import type { ExportScale } from "@/types/editor";

export const CLIPBOARD_IMAGE_UNSUPPORTED_MESSAGE =
  "Copying images is not supported in this browser. Please download the PNG instead.";
export const CLIPBOARD_IMAGE_WRITE_FAILED_MESSAGE =
  "Could not copy image. Try downloading instead.";
const IMAGE_LOAD_ERROR_MESSAGE = "An image could not be loaded for export.";
export const EXPORT_LAYOUT_ERROR_MESSAGE =
  "Export renderer did not match the selected canvas size.";
const EXPORT_LAYOUT_TOLERANCE_PX = 1;
const CSS_URL_PATTERN = /url\((['"]?)(.*?)\1\)/g;

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

function createResourceInliner() {
  const cache = new Map<string, Promise<string>>();

  return (url: string) => {
    const resourceUrl = resolveResourceUrl(url.trim());

    if (isDataUrl(resourceUrl)) {
      return Promise.resolve(resourceUrl);
    }

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
  inlineResource: (url: string) => Promise<string>,
) {
  const urls = getCssUrls(cssText);

  if (urls.length === 0) {
    return cssText;
  }

  const replacements = new Map<string, string>();

  await Promise.all(
    urls.map(async (url) => {
      replacements.set(url, await inlineResource(url));
    }),
  );

  return cssText.replace(CSS_URL_PATTERN, (raw, _quote, rawUrl) => {
    const dataUrl = replacements.get(rawUrl.trim());

    return dataUrl ? `url("${dataUrl}")` : raw;
  });
}

async function inlineExportResources(node: HTMLElement) {
  const inlineResource = createResourceInliner();
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
      const inlinedValue = await inlineCssUrls(originalValue, inlineResource);

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
      const inlinedSrc = await inlineResource(originalSrc);

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

export async function createExportPngBlob({
  cacheBust = false,
  height,
  node,
  scale,
  width,
}: Omit<ExportPngOptions, "fileName">): Promise<Blob> {
  const exportSize = getExportPixelSize(width, height, scale);

  if (width <= 0 || height <= 0 || exportSize.width <= 0 || exportSize.height <= 0) {
    throw new Error("Export dimensions must be greater than zero.");
  }

  await waitForFonts();
  await waitForImages(node);
  await waitForBackgroundImages(node);
  await waitForExportLayout(node, { height, width });

  const restoreInlinedResources = await inlineExportResources(node);
  let blob: Blob | null;

  try {
    blob = await toBlob(node, {
      cacheBust,
      canvasHeight: height,
      canvasWidth: width,
      filter: shouldIncludeExportNode,
      height,
      onImageErrorHandler: handleExportImageError,
      pixelRatio: scale,
      skipAutoScale: true,
      width,
      style: {
        height: `${height}px`,
        width: `${width}px`,
      },
    });
  } finally {
    restoreInlinedResources();
  }

  if (!blob) {
    throw new Error("Unable to create PNG export.");
  }

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

  const blob = await createExportPngBlob(options);
  const clipboardItem = new ClipboardItem({ "image/png": blob });

  try {
    await navigator.clipboard.write([clipboardItem]);
  } catch {
    throw new Error(CLIPBOARD_IMAGE_WRITE_FAILED_MESSAGE);
  }
}
