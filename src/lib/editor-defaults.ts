import { getBackgroundPreset } from "@/lib/background-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import type {
  BeautifySettings,
  BrowserFrameSettings,
  ExportSettings,
  ImageCrop,
  ImageBorder,
  ImageShadow,
  TextLayerStyle,
  TextOverlaySettings,
  TiltSettings,
} from "@/types/editor";

const DEFAULT_CANVAS_PRESET_ID = "wide-hero";
const DEFAULT_BACKGROUND_PRESET_ID = "apple-layered-organic";

const defaultCanvasPreset = getCanvasPreset(DEFAULT_CANVAS_PRESET_ID);
const defaultBackgroundPreset = getBackgroundPreset(DEFAULT_BACKGROUND_PRESET_ID);

export const DEFAULT_IMAGE_SHADOW: ImageShadow = {
  enabled: true,
  blur: 40,
  opacity: 0.25,
  offsetY: 24,
};

export const DEFAULT_IMAGE_BORDER: ImageBorder = {
  enabled: false,
  preset: "none",
  width: 1,
  color: "#ffffff",
};

export const DEFAULT_IMAGE_CROP: ImageCrop = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const DEFAULT_BEAUTIFY_SETTINGS: BeautifySettings = {
  canvasPreset: defaultCanvasPreset.id,
  canvasWidth: defaultCanvasPreset.width,
  canvasHeight: defaultCanvasPreset.height,
  backgroundType: defaultBackgroundPreset.type,
  backgroundValue: defaultBackgroundPreset.cssValue,
  backgroundPresetId: defaultBackgroundPreset.id,
  backgroundPatternId: "none",
  backgroundPatternColor: "#ffffff",
  backgroundPatternIntensity: 25,
  imagePadding: 96,
  imageRadius: 24,
  imageScale: 92,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageCrop: DEFAULT_IMAGE_CROP,
  imageShadow: DEFAULT_IMAGE_SHADOW,
  imageBorder: DEFAULT_IMAGE_BORDER,
  imageZoom: 100,
  imageZoomOffsetX: 0,
  imageZoomOffsetY: 0,
};

export const DEFAULT_BROWSER_FRAME_SETTINGS: BrowserFrameSettings = {
  browserFrameEnabled: false,
  browserFrameTheme: "light",
  browserFrameStyle: "macos",
  browserFrameUrl: "yourproduct.com",
  browserFrameShowUrl: false,
  shadowSceneEnabled: false,
  shadowScenePresetId: "none",
  shadowSceneOpacity: 0.42,
  shadowScenePlacement: "overlay",
};

const DEFAULT_TEXT_LAYER_STYLE: TextLayerStyle = {
  textAlign: "center",
  textColor: "#ffffff",
  textFontId: "inter",
  textFontWeight: "auto",
  textItalic: false,
  textUnderline: false,
  textLetterSpacing: 0,
  textLineHeight: 0,
  textOpacity: 1,
  textShadowEnabled: true,
  textShadowMode: "drop",
  textShadowPresetId: "soft-depth",
  textShadowColor: "#0f172a",
  textShadowBlur: 48,
  textShadowOffsetX: 0,
  textShadowOffsetY: 18,
  textShadowOpacity: 0.28,
  textShadowDepth: 1,
};

export const DEFAULT_TEXT_OVERLAY_SETTINGS: TextOverlaySettings = {
  textOverlayEnabled: false,
  headlineText: "Launch-ready in seconds",
  subtitleText: "Turn a plain screenshot into a polished product visual.",
  badgeText: "New launch",
  customTextLayers: [],
  textLayerStyles: {
    badge: {
      ...DEFAULT_TEXT_LAYER_STYLE,
    },
    headline: {
      ...DEFAULT_TEXT_LAYER_STYLE,
    },
    subtitle: {
      ...DEFAULT_TEXT_LAYER_STYLE,
    },
  },
  textPosition: "top",
  textAlign: "center",
  textColor: "#ffffff",
  textFontId: "inter",
  textFontWeight: "auto",
  textItalic: false,
  textUnderline: false,
  textLetterSpacing: 0,
  textLineHeight: 0,
  textOpacity: 1,
  textShadowEnabled: true,
  textShadowMode: "drop",
  textShadowPresetId: "soft-depth",
  textShadowColor: "#0f172a",
  textShadowBlur: 48,
  textShadowOffsetX: 0,
  textShadowOffsetY: 18,
  textShadowOpacity: 0.28,
  textShadowDepth: 1,
  headlineSize: 44,
  subtitleSize: 20,
  badgeSize: 11,
  badgeWidth: 0.18,
  badgeRotation: 0,
  headlineRotation: 0,
  headlineWidth: 0.56,
  subtitleRotation: 0,
  subtitleWidth: 0.56,
  badgeEnabled: true,
  badgeOffsetX: 0,
  badgeOffsetY: 0,
  headlineOffsetX: 0,
  headlineOffsetY: 0,
  subtitleOffsetX: 0,
  subtitleOffsetY: 0,
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
    min: 10,
    max: 180,
    step: 1,
  },
  imageZoom: {
    min: 100,
    max: 400,
    step: 1,
  },
  backgroundPatternIntensity: {
    min: 0,
    max: 80,
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
  imageBorderWidth: {
    min: 1,
    max: 12,
    step: 1,
  },
  shadowSceneOpacity: {
    min: 0.08,
    max: 1,
    step: 0.01,
  },
  headlineSize: {
    min: 24,
    max: 160,
    step: 1,
  },
  subtitleSize: {
    min: 14,
    max: 96,
    step: 1,
  },
  badgeSize: {
    min: 9,
    max: 64,
    step: 1,
  },
  textRotation: {
    min: -180,
    max: 180,
    step: 1,
  },
  textLetterSpacing: {
    min: -2,
    max: 12,
    step: 0.1,
  },
  textLineHeight: {
    min: 0.8,
    max: 2,
    step: 0.05,
  },
  textOpacity: {
    min: 0.1,
    max: 1,
    step: 0.01,
  },
  textShadowBlur: {
    min: 0,
    max: 72,
    step: 1,
  },
  textShadowOffset: {
    min: -48,
    max: 48,
    step: 1,
  },
  textShadowOpacity: {
    min: 0,
    max: 1,
    step: 0.01,
  },
  textShadowDepth: {
    min: 0,
    max: 28,
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
    min: -180,
    max: 180,
    step: 1,
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
