import { getBackgroundPreset } from "@/lib/background-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import type {
  BeautifySettings,
  BrowserFrameSettings,
  ExportSettings,
  ImageShadow,
  TemplateSettings,
  TextOverlaySettings,
  TiltSettings,
} from "@/types/editor";

const DEFAULT_CANVAS_PRESET_ID = "wide-hero";
const DEFAULT_BACKGROUND_PRESET_ID = "midnight-purple";

const defaultCanvasPreset = getCanvasPreset(DEFAULT_CANVAS_PRESET_ID);
const defaultBackgroundPreset = getBackgroundPreset(DEFAULT_BACKGROUND_PRESET_ID);

export const DEFAULT_IMAGE_SHADOW: ImageShadow = {
  enabled: true,
  blur: 40,
  opacity: 0.25,
  offsetY: 24,
};

export const DEFAULT_BEAUTIFY_SETTINGS: BeautifySettings = {
  canvasPreset: defaultCanvasPreset.id,
  canvasWidth: defaultCanvasPreset.width,
  canvasHeight: defaultCanvasPreset.height,
  backgroundType: defaultBackgroundPreset.type,
  backgroundValue: defaultBackgroundPreset.cssValue,
  backgroundPresetId: defaultBackgroundPreset.id,
  imagePadding: 96,
  imageRadius: 24,
  imageScale: 92,
  imageShadow: DEFAULT_IMAGE_SHADOW,
  imageBorderEnabled: true,
};

export const DEFAULT_BROWSER_FRAME_SETTINGS: BrowserFrameSettings = {
  browserFrameEnabled: false,
  browserFrameTheme: "light",
  browserFrameStyle: "macos",
  browserFrameUrl: "yourproduct.com",
  browserFrameShowUrl: true,
};

export const DEFAULT_TEXT_OVERLAY_SETTINGS: TextOverlaySettings = {
  textOverlayEnabled: false,
  headlineText: "Launch-ready in seconds",
  subtitleText: "Turn a plain screenshot into a polished product visual.",
  badgeText: "New launch",
  textLayoutPreset: "launch-top",
  textPosition: "top",
  textAlign: "center",
  textColor: "#ffffff",
  headlineSize: 44,
  subtitleSize: 20,
  badgeEnabled: true,
};

export const DEFAULT_TILT_SETTINGS: TiltSettings = {
  tiltEnabled: false,
  tiltPresetId: "flat",
  perspective: 1200,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  translateY: 0,
  tiltShadowMultiplier: 1,
  hoverTiltEnabled: false,
  hoverTiltSensitivity: 8,
  backgroundParallaxEnabled: false,
  backgroundParallaxStrength: 8,
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  exportScale: 2,
  exportFileName: "screenshot-beautifier",
  isExporting: false,
  lastExportedAt: null,
};

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  activeTemplateId: null,
  lastAppliedTemplateId: null,
};

export const BEAUTIFY_SETTING_LIMITS = {
  imagePadding: {
    min: 24,
    max: 220,
    step: 4,
  },
  imageRadius: {
    min: 0,
    max: 48,
    step: 1,
  },
  imageScale: {
    min: 70,
    max: 110,
    step: 1,
  },
  imageShadowBlur: {
    min: 0,
    max: 80,
    step: 1,
  },
  imageShadowOpacity: {
    min: 0,
    max: 0.6,
    step: 0.01,
  },
  imageShadowOffsetY: {
    min: 0,
    max: 60,
    step: 1,
  },
  headlineSize: {
    min: 24,
    max: 72,
    step: 1,
  },
  subtitleSize: {
    min: 14,
    max: 32,
    step: 1,
  },
  perspective: {
    min: 600,
    max: 2000,
    step: 50,
  },
  rotateX: {
    min: -30,
    max: 30,
    step: 1,
  },
  rotateY: {
    min: -35,
    max: 35,
    step: 1,
  },
  rotateZ: {
    min: -8,
    max: 8,
    step: 0.5,
  },
  translateY: {
    min: -40,
    max: 20,
    step: 1,
  },
  tiltShadowMultiplier: {
    min: 0.5,
    max: 2,
    step: 0.1,
  },
  hoverTiltSensitivity: {
    min: 2,
    max: 18,
    step: 1,
  },
  backgroundParallaxStrength: {
    min: 0,
    max: 24,
    step: 1,
  },
} as const;

export function createImageShadowCss(imageShadow: ImageShadow) {
  if (!imageShadow.enabled || imageShadow.opacity <= 0 || imageShadow.blur <= 0) {
    return "none";
  }

  return `0 ${imageShadow.offsetY}px ${imageShadow.blur}px rgba(15, 23, 42, ${imageShadow.opacity})`;
}
