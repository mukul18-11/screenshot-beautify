import { getBackgroundPreset } from "@/lib/background-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import type { BeautifySettings, ImageShadow } from "@/types/editor";

const DEFAULT_CANVAS_PRESET_ID = "wide-hero";
const DEFAULT_BACKGROUND_PRESET_ID = "midnight-purple";

const defaultCanvasPreset = getCanvasPreset(DEFAULT_CANVAS_PRESET_ID);
const defaultBackgroundPreset = getBackgroundPreset(DEFAULT_BACKGROUND_PRESET_ID);

export const DEFAULT_IMAGE_SHADOW: ImageShadow = {
  enabled: true,
  blur: 64,
  opacity: 0.28,
  offsetY: 24,
};

export const DEFAULT_BEAUTIFY_SETTINGS: BeautifySettings = {
  canvasPreset: defaultCanvasPreset.id,
  canvasWidth: defaultCanvasPreset.width,
  canvasHeight: defaultCanvasPreset.height,
  backgroundType: defaultBackgroundPreset.type,
  backgroundValue: defaultBackgroundPreset.cssValue,
  backgroundPresetId: defaultBackgroundPreset.id,
  imagePadding: 72,
  imageRadius: 18,
  imageScale: 92,
  imageShadow: DEFAULT_IMAGE_SHADOW,
  imageBorderEnabled: false,
};

export const BEAUTIFY_SETTING_LIMITS = {
  imagePadding: {
    min: 24,
    max: 160,
    step: 4,
  },
  imageRadius: {
    min: 0,
    max: 40,
    step: 1,
  },
  imageScale: {
    min: 60,
    max: 115,
    step: 1,
  },
  imageShadowBlur: {
    min: 0,
    max: 120,
    step: 2,
  },
  imageShadowOpacity: {
    min: 0,
    max: 0.6,
    step: 0.02,
  },
  imageShadowOffsetY: {
    min: 0,
    max: 64,
    step: 1,
  },
} as const;

export function createImageShadowCss(imageShadow: ImageShadow) {
  if (!imageShadow.enabled || imageShadow.opacity <= 0 || imageShadow.blur <= 0) {
    return "none";
  }

  return `0 ${imageShadow.offsetY}px ${imageShadow.blur}px rgba(15, 23, 42, ${imageShadow.opacity})`;
}
