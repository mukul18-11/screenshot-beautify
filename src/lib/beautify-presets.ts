import { getBackgroundPreset } from "@/lib/background-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import type { BeautifySettings, ImageShadow } from "@/types/editor";

export type BeautifyPreset = {
  id: string;
  name: string;
  canvasPresetId: string;
  backgroundPresetId: string;
  imagePadding: number;
  imageRadius: number;
  imageScale: number;
  imageShadow: ImageShadow;
  imageBorderEnabled: boolean;
};

export const BEAUTIFY_PRESETS = [
  {
    id: "clean-saas",
    name: "Clean SaaS",
    canvasPresetId: "square-post",
    backgroundPresetId: "classic-clean-gray",
    imagePadding: 96,
    imageRadius: 24,
    imageScale: 92,
    imageShadow: {
      enabled: true,
      blur: 34,
      opacity: 0.18,
      offsetY: 18,
    },
    imageBorderEnabled: true,
  },
  {
    id: "founder-dark",
    name: "Founder Dark",
    canvasPresetId: "square-post",
    backgroundPresetId: "classic-deep-space",
    imagePadding: 132,
    imageRadius: 28,
    imageScale: 90,
    imageShadow: {
      enabled: true,
      blur: 72,
      opacity: 0.44,
      offsetY: 34,
    },
    imageBorderEnabled: true,
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    canvasPresetId: "product-hunt",
    backgroundPresetId: "product-hunt-orange",
    imagePadding: 96,
    imageRadius: 22,
    imageScale: 92,
    imageShadow: {
      enabled: true,
      blur: 46,
      opacity: 0.26,
      offsetY: 24,
    },
    imageBorderEnabled: true,
  },
  {
    id: "launch-hero",
    name: "Launch Hero",
    canvasPresetId: "wide-hero",
    backgroundPresetId: "classic-midnight-purple",
    imagePadding: 128,
    imageRadius: 26,
    imageScale: 92,
    imageShadow: {
      enabled: true,
      blur: 72,
      opacity: 0.4,
      offsetY: 34,
    },
    imageBorderEnabled: true,
  },
  {
    id: "linkedin-clean",
    name: "LinkedIn Clean",
    canvasPresetId: "linkedin-post",
    backgroundPresetId: "classic-soft-peach",
    imagePadding: 96,
    imageRadius: 20,
    imageScale: 92,
    imageShadow: {
      enabled: true,
      blur: 36,
      opacity: 0.2,
      offsetY: 18,
    },
    imageBorderEnabled: true,
  },
  {
    id: "mobile-story",
    name: "Mobile Story",
    canvasPresetId: "story-reel",
    backgroundPresetId: "classic-deep-space",
    imagePadding: 136,
    imageRadius: 28,
    imageScale: 90,
    imageShadow: {
      enabled: true,
      blur: 76,
      opacity: 0.42,
      offsetY: 36,
    },
    imageBorderEnabled: true,
  },
] as const satisfies readonly BeautifyPreset[];

export type BeautifyPresetId = (typeof BEAUTIFY_PRESETS)[number]["id"];

export function getBeautifyPreset(presetId: string) {
  return (
    BEAUTIFY_PRESETS.find((preset) => preset.id === presetId) ??
    BEAUTIFY_PRESETS[0]
  );
}

export function createBeautifyPresetSettings(
  presetId: string,
): BeautifySettings {
  const preset = getBeautifyPreset(presetId);
  const canvasPreset = getCanvasPreset(preset.canvasPresetId);
  const backgroundPreset = getBackgroundPreset(preset.backgroundPresetId);

  return {
    canvasPreset: canvasPreset.id,
    canvasWidth: canvasPreset.width,
    canvasHeight: canvasPreset.height,
    backgroundType: backgroundPreset.type,
    backgroundValue: backgroundPreset.cssValue,
    backgroundPresetId: backgroundPreset.id,
    backgroundPatternId: "none",
    backgroundPatternColor: "#ffffff",
    backgroundPatternIntensity: 25,
    imagePadding: preset.imagePadding,
    imageRadius: preset.imageRadius,
    imageScale: preset.imageScale,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageCrop: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    imageShadow: {
      ...preset.imageShadow,
    },
    imageBorderEnabled: preset.imageBorderEnabled,
    imageZoom: 100,
    imageZoomOffsetX: 0,
    imageZoomOffsetY: 0,
  };
}
