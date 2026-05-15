import type { UploadedImage } from "@/store/editor-store";

export type ImageDimensions = {
  width: number;
  height: number;
};

function createImageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function readImageDimensions(objectUrl: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    if (typeof Image === "undefined") {
      reject(new Error("Image previews are only available in the browser."));
      return;
    }

    const image = new Image();

    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
    };

    image.onload = () => {
      cleanup();

      if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        reject(
          new Error("We couldn't read that image. Try another screenshot."),
        );
        return;
      }

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      cleanup();
      reject(new Error("We couldn't read that image. Try another screenshot."));
    };

    image.src = objectUrl;
  });
}

export async function createUploadedImage(file: File): Promise<UploadedImage> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const { width, height } = await readImageDimensions(objectUrl);

    return {
      id: createImageId(),
      file,
      objectUrl,
      name: file.name.trim() || "Pasted screenshot",
      size: file.size,
      type: file.type,
      width,
      height,
      uploadedAt: Date.now(),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}
