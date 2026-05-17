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
  await waitForNextPaint();

  const blob = await toBlob(node, {
    cacheBust,
    canvasHeight: height,
    canvasWidth: width,
    height,
    onImageErrorHandler: handleExportImageError,
    pixelRatio: scale,
    skipAutoScale: true,
    skipFonts: true,
    width,
    style: {
      height: `${height}px`,
      width: `${width}px`,
    },
  });

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
