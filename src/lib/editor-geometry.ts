import type { ImageCrop } from "@/types/editor";

export const MIN_CROP_RATIO = 0.18;

export function clampValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function clampUnitOffset(value: number) {
  return clampValue(value, -1, 1);
}

export function clampTextLayerOffset(value: number) {
  return clampValue(value, -2, 2);
}

export function clampCropInset(value: number) {
  return clampValue(value, 0, 1 - MIN_CROP_RATIO);
}

export function clampImageCrop(crop: ImageCrop): ImageCrop {
  const left = clampCropInset(crop.left);
  const right = Math.min(clampCropInset(crop.right), 1 - MIN_CROP_RATIO - left);
  const top = clampCropInset(crop.top);
  const bottom = Math.min(clampCropInset(crop.bottom), 1 - MIN_CROP_RATIO - top);

  return { top, right, bottom, left };
}

export function getCropRatios(crop: ImageCrop) {
  return {
    width: Math.max(MIN_CROP_RATIO, 1 - crop.left - crop.right),
    height: Math.max(MIN_CROP_RATIO, 1 - crop.top - crop.bottom),
  };
}
