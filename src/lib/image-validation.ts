import { formatFileSize } from "@/lib/format-file-size";

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_DROPZONE = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
};

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export type ImageValidationErrorCode =
  | "unsupported-type"
  | "file-too-large"
  | "empty-file";

export type ImageValidationResult =
  | { valid: true }
  | {
      valid: false;
      code: ImageValidationErrorCode;
      message: string;
    };

export function isAcceptedImageType(type: string): type is AcceptedImageType {
  return ACCEPTED_IMAGE_TYPES.includes(type as AcceptedImageType);
}

export function validateImageFile(file: File): ImageValidationResult {
  if (file.size <= 0) {
    return {
      valid: false,
      code: "empty-file",
      message: "That file looks empty. Choose a PNG, JPEG, or WebP image.",
    };
  }

  if (!isAcceptedImageType(file.type)) {
    return {
      valid: false,
      code: "unsupported-type",
      message: "Unsupported file type. Upload a PNG, JPEG, or WebP screenshot.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      code: "file-too-large",
      message: `That image is ${formatFileSize(file.size)}. Choose an image under 10 MB.`,
    };
  }

  return { valid: true };
}
