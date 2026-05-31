"use client";

import { create } from "zustand";

import { getBackgroundPreset } from "@/lib/background-presets";
import { createBeautifyPresetSettings } from "@/lib/beautify-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import {
  cloneCustomBackgroundConfig,
  createCustomGradient,
  getCustomBackgroundType,
  getEditablePresetCustomBackgroundConfig,
} from "@/lib/custom-backgrounds";
import {
  BEAUTIFY_SETTING_LIMITS,
  DEFAULT_BEAUTIFY_SETTINGS,
  DEFAULT_BROWSER_FRAME_SETTINGS,
  DEFAULT_DEVICE_MOCKUP_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_TEXT_OVERLAY_SETTINGS,
  DEFAULT_TILT_SETTINGS,
} from "@/lib/editor-defaults";
import {
  createCenteredCropForMockup,
  getDeviceMockup,
  getDeviceMockupVariant,
  isPhysicalDeviceMockup,
} from "@/lib/device-mockups";
import {
  clampValue,
  clampImageCrop,
  clampTextLayerOffset,
  clampTextLayerWidth,
  clampUnitOffset,
} from "@/lib/editor-geometry";
import { sanitizeFileName } from "@/lib/export-utils";
import {
  canApplyScreenshotLayout,
  createScreenshotLayoutPatches,
} from "@/lib/screenshot-layouts";
import { createTextShadowPresetSettings } from "@/lib/text-effect-presets";
import { createTiltPresetSettings } from "@/lib/tilt-presets";
import type {
  BackgroundType,
  BeautifySettings,
  BrowserFrameSettings,
  BrowserFrameStyle,
  BrowserFrameTheme,
  CustomBackgroundConfig,
  CustomTextLayer,
  CustomTextLayerId,
  DefaultTextLayerId,
  DeviceMockupId,
  DeviceMockupSettings,
  EditorDesignSettings,
  ExportScale,
  ExportSettings,
  ImageCrop,
  ImageBorderPreset,
  ImageShadow,
  ScreenshotLayoutPresetId,
  ScreenshotDesign,
  ShadowScenePlacement,
  ShadowScenePresetId,
  TextAlign,
  TextFontId,
  TextFontWeight,
  TextLayerId,
  TextLayerStyle,
  TextOverlaySettings,
  TextPosition,
  TextShadowMode,
  TextShadowPresetId,
  TiltSettings,
  UploadedImage,
} from "@/types/editor";

export type { ScreenshotDesign, UploadedImage } from "@/types/editor";

export const MAX_SCREENSHOT_UPLOADS = 5;
const MAX_EDITOR_HISTORY_ENTRIES = 50;
const HISTORY_ENABLED_TILT_PRESET_ID = "left-angle";
const DEFAULT_TEXT_LAYER_IDS = ["badge", "headline", "subtitle"] as const;

type HistoryGlobalSettings = Pick<
  EditorDesignSettings,
  | "canvasPreset"
  | "canvasWidth"
  | "canvasHeight"
  | "backgroundType"
  | "backgroundValue"
  | "backgroundPresetId"
  | "backgroundPatternId"
  | "backgroundPatternColor"
  | "backgroundPatternIntensity"
  | "backgroundNoise"
  | "backgroundBlur"
  | "customBackgroundConfig"
  | "imagePadding"
  | "textOverlayEnabled"
  | "headlineText"
  | "subtitleText"
  | "badgeText"
  | "customTextLayers"
  | "textLayerStyles"
  | "textPosition"
  | "textAlign"
  | "textColor"
  | "textFontId"
  | "textFontWeight"
  | "textItalic"
  | "textUnderline"
  | "textLetterSpacing"
  | "textLineHeight"
  | "textOpacity"
  | "textShadowEnabled"
  | "textShadowMode"
  | "textShadowPresetId"
  | "textShadowColor"
  | "textShadowBlur"
  | "textShadowOffsetX"
  | "textShadowOffsetY"
  | "textShadowOpacity"
  | "textShadowDepth"
  | "headlineSize"
  | "subtitleSize"
  | "badgeSize"
  | "badgeWidth"
  | "badgeRotation"
  | "headlineRotation"
  | "headlineWidth"
  | "subtitleRotation"
  | "subtitleWidth"
  | "badgeEnabled"
  | "badgeOffsetX"
  | "badgeOffsetY"
  | "headlineOffsetX"
  | "headlineOffsetY"
  | "subtitleOffsetX"
  | "subtitleOffsetY"
  | "backgroundParallaxEnabled"
  | "backgroundParallaxStrength"
  | "exportScale"
  | "exportFileName"
> & {
  screenshotLayoutPresetId: ScreenshotLayoutPresetId;
};

type EditorHistorySnapshot = {
  activeScreenshotId: string | null;
  globalSettings: HistoryGlobalSettings;
  screenshots: ScreenshotDesign[];
};

const HISTORY_GLOBAL_SETTING_KEYS = [
  "canvasPreset",
  "canvasWidth",
  "canvasHeight",
  "backgroundType",
  "backgroundValue",
  "backgroundPresetId",
  "backgroundPatternId",
  "backgroundPatternColor",
  "backgroundPatternIntensity",
  "backgroundNoise",
  "backgroundBlur",
  "imagePadding",
  "textOverlayEnabled",
  "headlineText",
  "subtitleText",
  "badgeText",
  "textPosition",
  "textAlign",
  "textColor",
  "textFontId",
  "textFontWeight",
  "textItalic",
  "textUnderline",
  "textLetterSpacing",
  "textLineHeight",
  "textOpacity",
  "textShadowEnabled",
  "textShadowMode",
  "textShadowPresetId",
  "textShadowColor",
  "textShadowBlur",
  "textShadowOffsetX",
  "textShadowOffsetY",
  "textShadowOpacity",
  "textShadowDepth",
  "headlineSize",
  "subtitleSize",
  "badgeSize",
  "badgeWidth",
  "badgeRotation",
  "headlineRotation",
  "headlineWidth",
  "subtitleRotation",
  "subtitleWidth",
  "badgeEnabled",
  "badgeOffsetX",
  "badgeOffsetY",
  "headlineOffsetX",
  "headlineOffsetY",
  "subtitleOffsetX",
  "subtitleOffsetY",
  "backgroundParallaxEnabled",
  "backgroundParallaxStrength",
  "exportScale",
  "exportFileName",
  "screenshotLayoutPresetId",
] as const satisfies readonly (keyof HistoryGlobalSettings)[];

type EditorStore = EditorDesignSettings & {
    historyPast: EditorHistorySnapshot[];
    historyFuture: EditorHistorySnapshot[];
    screenshots: ScreenshotDesign[];
    activeScreenshotId: string | null;
    activeTextLayerId: TextLayerId | null;
    screenshotLayoutPresetId: ScreenshotLayoutPresetId;
    uploadedImage: UploadedImage | null;
    customBackgroundImage: UploadedImage | null;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    beginHistoryBatch: () => void;
    commitHistoryBatch: () => void;
    applyScreenshotLayout: (presetId: ScreenshotLayoutPresetId) => void;
    selectScreenshot: (screenshotId: string) => void;
    placeScreenshot: (
      screenshotId: string,
      placement?: { offsetX: number; offsetY: number },
    ) => void;
    removeScreenshotFromCanvas: (screenshotId: string) => void;
    addUploadedImages: (uploadedImages: UploadedImage[]) => void;
    removeUploadedImage: (screenshotId: string) => void;
    setUploadedImage: (uploadedImage: UploadedImage | null) => void;
    clearUploadedImage: () => void;
    clearAllUploadedImages: () => void;
    replaceUploadedImage: (uploadedImage: UploadedImage) => void;
    applyBeautifyPreset: (presetId: string) => void;
    setCanvasPreset: (presetId: string) => void;
    setCanvasSize: (width: number, height: number) => void;
    setBackgroundPreset: (presetId: string) => void;
    setBackgroundPattern: (
      patternId: EditorDesignSettings["backgroundPatternId"],
    ) => void;
    setBackgroundPatternColor: (color: string) => void;
    setBackgroundPatternIntensity: (intensity: number) => void;
    setBackgroundNoise: (noise: number) => void;
    setBackgroundBlur: (blur: number) => void;
    setCustomBackgroundConfig: (config: CustomBackgroundConfig) => void;
    applyCustomBackgroundConfig: (config?: CustomBackgroundConfig) => void;
    setCustomBackgroundImage: (uploadedImage: UploadedImage) => void;
    clearCustomBackgroundImage: () => void;
    setSolidBackground: (color: string) => void;
    setImagePadding: (value: number) => void;
    setImageRadius: (value: number) => void;
    setImageScale: (value: number) => void;
    setImagePosition: (offsetX: number, offsetY: number) => void;
    setImageCrop: (crop: ImageCrop) => void;
    setImageTransform: (transform: {
      crop?: ImageCrop;
      markLayoutManual?: boolean;
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }) => void;
    fitUploadedImage: (scale: number) => void;
    resetImagePosition: () => void;
    setImageShadow: (partialShadow: Partial<ImageShadow>) => void;
    setImageBorderEnabled: (enabled: boolean) => void;
    setImageBorderPreset: (preset: ImageBorderPreset) => void;
    setImageBorderWidth: (width: number) => void;
    setImageBorderColor: (color: string) => void;
    toggleImageBorder: () => void;
    setImageZoom: (value: number) => void;
    setImageZoomOffset: (offsetX: number, offsetY: number) => void;
    resetImageZoom: () => void;
    resetBeautifySettings: () => void;
    toggleBrowserFrame: () => void;
    setBrowserFrameTheme: (theme: BrowserFrameTheme) => void;
    setBrowserFrameStyle: (style: BrowserFrameStyle) => void;
    setBrowserFrameUrl: (url: string) => void;
    toggleBrowserFrameUrl: () => void;
    setBrowserFrameUrlBold: (enabled: boolean) => void;
    toggleBrowserFrameUrlBold: () => void;
    setDeviceMockup: (
      mockupId: DeviceMockupId,
      variantId?: string | null,
    ) => void;
    setDeviceMockupVariant: (variantId: string) => void;
    clearDeviceMockup: () => void;
    setShadowSceneEnabled: (enabled: boolean) => void;
    setShadowScenePreset: (presetId: ShadowScenePresetId) => void;
    setShadowSceneOpacity: (opacity: number) => void;
    setShadowScenePlacement: (placement: ShadowScenePlacement) => void;
    toggleTextOverlay: () => void;
    setHeadlineText: (value: string) => void;
    setSubtitleText: (value: string) => void;
    setBadgeText: (value: string) => void;
    addCustomTextLayer: () => void;
    removeTextLayer: (layerId: TextLayerId) => void;
    setCustomTextLayerText: (layerId: CustomTextLayerId, value: string) => void;
    setActiveTextLayerId: (layerId: TextLayerId | null) => void;
    setTextPosition: (position: TextPosition) => void;
    setTextAlign: (align: TextAlign) => void;
    setTextColor: (color: string) => void;
    setTextFont: (fontId: TextFontId) => void;
    setTextFontWeight: (fontWeight: TextFontWeight) => void;
    setTextItalic: (enabled: boolean) => void;
    toggleTextItalic: () => void;
    setTextUnderline: (enabled: boolean) => void;
    toggleTextUnderline: () => void;
    setTextLetterSpacing: (spacing: number) => void;
    setTextLineHeight: (lineHeight: number) => void;
    setTextOpacity: (opacity: number) => void;
    setTextShadowEnabled: (enabled: boolean) => void;
    toggleTextShadow: () => void;
    setTextShadowMode: (mode: TextShadowMode) => void;
    applyTextShadowPreset: (presetId: TextShadowPresetId) => void;
    setTextShadowColor: (color: string) => void;
    setTextShadowBlur: (blur: number) => void;
    setTextShadowOffset: (offsetX: number, offsetY: number) => void;
    setTextShadowOpacity: (opacity: number) => void;
    setTextShadowDepth: (depth: number) => void;
    setHeadlineSize: (size: number) => void;
    setSubtitleSize: (size: number) => void;
    setBadgeSize: (size: number) => void;
    setTextLayerSize: (layerId: TextLayerId, size: number) => void;
    setBadgeRotation: (rotation: number) => void;
    setHeadlineRotation: (rotation: number) => void;
    setSubtitleRotation: (rotation: number) => void;
    setTextLayerRotation: (
      layerId: TextLayerId,
      rotation: number,
    ) => void;
    setTextLayerPosition: (
      layerId: TextLayerId,
      offsetX: number,
      offsetY: number,
    ) => void;
    setTextLayerBox: (
      layerId: TextLayerId,
      box: {
        offsetX: number;
        offsetY: number;
        width: number;
      },
    ) => void;
    setTextLayerWidth: (layerId: TextLayerId, width: number) => void;
    resetTextLayerPosition: (layerId?: TextLayerId) => void;
    toggleBadge: () => void;
    resetTextOverlaySettings: () => void;
    toggleTilt: () => void;
    setTiltEnabled: (value: boolean) => void;
    setTiltPreset: (presetId: string) => void;
    setPerspective: (value: number) => void;
    setRotateX: (value: number) => void;
    setRotateY: (value: number) => void;
    setRotateZ: (value: number) => void;
    setTranslateY: (value: number) => void;
    setTiltShadowMultiplier: (value: number) => void;
    toggleHoverTilt: () => void;
    setHoverTiltEnabled: (value: boolean) => void;
    setHoverTiltSensitivity: (value: number) => void;
    toggleBackgroundParallax: () => void;
    setBackgroundParallaxEnabled: (value: boolean) => void;
    setBackgroundParallaxStrength: (value: number) => void;
    resetTiltSettings: () => void;
    setExportScale: (scale: ExportScale) => void;
    setExportFileName: (name: string) => void;
    setIsExporting: (value: boolean) => void;
    markExported: () => void;
    resetExportSettings: () => void;
    resetActiveScreenshotDesign: () => void;
    resetEditorForNewUpload: () => void;
  };

function revokeObjectUrl(uploadedImage: UploadedImage | null) {
  if (typeof URL === "undefined" || !uploadedImage?.objectUrl) {
    return;
  }

  URL.revokeObjectURL(uploadedImage.objectUrl);
}

function createDefaultBeautifySettings(): BeautifySettings {
  return {
    ...DEFAULT_BEAUTIFY_SETTINGS,
    imageCrop: {
      ...DEFAULT_BEAUTIFY_SETTINGS.imageCrop,
    },
    imageShadow: {
      ...DEFAULT_BEAUTIFY_SETTINGS.imageShadow,
    },
    imageBorder: {
      ...DEFAULT_BEAUTIFY_SETTINGS.imageBorder,
    },
    customBackgroundConfig: cloneCustomBackgroundConfig(
      DEFAULT_BEAUTIFY_SETTINGS.customBackgroundConfig,
    ),
  };
}

function createDefaultBrowserFrameSettings(): BrowserFrameSettings {
  return {
    ...DEFAULT_BROWSER_FRAME_SETTINGS,
  };
}

function createDefaultDeviceMockupSettings(): DeviceMockupSettings {
  return {
    ...DEFAULT_DEVICE_MOCKUP_SETTINGS,
  };
}

function createDefaultTextOverlaySettings(): TextOverlaySettings {
  return {
    ...DEFAULT_TEXT_OVERLAY_SETTINGS,
  };
}

function createDefaultTiltSettings(): TiltSettings {
  return {
    ...DEFAULT_TILT_SETTINGS,
  };
}

function createDefaultExportSettings(): ExportSettings {
  return {
    ...DEFAULT_EXPORT_SETTINGS,
  };
}

function cloneTextLayerStyles(
  textLayerStyles: Record<DefaultTextLayerId, TextLayerStyle>,
): Record<DefaultTextLayerId, TextLayerStyle> {
  return {
    badge: {
      ...textLayerStyles.badge,
    },
    headline: {
      ...textLayerStyles.headline,
    },
    subtitle: {
      ...textLayerStyles.subtitle,
    },
  };
}

function cloneCustomTextLayers(
  customTextLayers: CustomTextLayer[],
): CustomTextLayer[] {
  return customTextLayers.map((layer) => ({
    ...layer,
    style: {
      ...layer.style,
    },
  }));
}

function createDefaultEditorDesignSettings(): EditorDesignSettings {
  return {
    ...createDefaultBeautifySettings(),
    ...createDefaultBrowserFrameSettings(),
    ...createDefaultDeviceMockupSettings(),
    ...createDefaultTextOverlaySettings(),
    ...createDefaultTiltSettings(),
    ...createDefaultExportSettings(),
    lastBeautifyPresetId: null,
  };
}

function cloneEditorDesignSettings(
  settings: EditorDesignSettings,
): EditorDesignSettings {
  return {
    ...settings,
    imageCrop: {
      ...settings.imageCrop,
    },
    imageShadow: {
      ...settings.imageShadow,
    },
    imageBorder: {
      ...settings.imageBorder,
    },
    customBackgroundConfig: cloneCustomBackgroundConfig(
      settings.customBackgroundConfig,
    ),
    customTextLayers: cloneCustomTextLayers(settings.customTextLayers),
    textLayerStyles: cloneTextLayerStyles(settings.textLayerStyles),
  };
}

function cloneScreenshotDesigns(
  screenshots: ScreenshotDesign[],
): ScreenshotDesign[] {
  return screenshots.map((screenshot) => ({
    ...screenshot,
    settings: cloneEditorDesignSettings(screenshot.settings),
  }));
}

function hasVisibleTiltEffect(settings: TiltSettings) {
  return (
    settings.tiltEnabled &&
    (settings.rotateX !== DEFAULT_TILT_SETTINGS.rotateX ||
      settings.rotateY !== DEFAULT_TILT_SETTINGS.rotateY ||
      settings.rotateZ !== DEFAULT_TILT_SETTINGS.rotateZ ||
      settings.translateY !== DEFAULT_TILT_SETTINGS.translateY ||
      settings.tiltShadowMultiplier !==
        DEFAULT_TILT_SETTINGS.tiltShadowMultiplier)
  );
}

function createHistoryTiltSettings(settings: TiltSettings): TiltSettings {
  if (!hasVisibleTiltEffect(settings)) {
    return createDefaultTiltSettings();
  }

  return {
    ...createDefaultTiltSettings(),
    ...createTiltPresetSettings(HISTORY_ENABLED_TILT_PRESET_ID),
    tiltEnabled: true,
  };
}

function normalizeTiltSettingsForHistory(
  settings: EditorDesignSettings,
): EditorDesignSettings {
  return {
    ...settings,
    ...createHistoryTiltSettings(settings),
  };
}

function getEditorDesignSettingsFromState(
  state: EditorStore,
): EditorDesignSettings {
  return cloneEditorDesignSettings({
    canvasPreset: state.canvasPreset,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    backgroundType: state.backgroundType,
    backgroundValue: state.backgroundValue,
    backgroundPresetId: state.backgroundPresetId,
    backgroundPatternId: state.backgroundPatternId,
    backgroundPatternColor: state.backgroundPatternColor,
    backgroundPatternIntensity: state.backgroundPatternIntensity,
    backgroundNoise: state.backgroundNoise,
    backgroundBlur: state.backgroundBlur,
    customBackgroundConfig: cloneCustomBackgroundConfig(
      state.customBackgroundConfig,
    ),
    imagePadding: state.imagePadding,
    imageRadius: state.imageRadius,
    imageScale: state.imageScale,
    imageOffsetX: state.imageOffsetX,
    imageOffsetY: state.imageOffsetY,
    imageCrop: state.imageCrop,
    imageShadow: state.imageShadow,
    imageBorder: state.imageBorder,
    imageZoom: state.imageZoom,
    imageZoomOffsetX: state.imageZoomOffsetX,
    imageZoomOffsetY: state.imageZoomOffsetY,
    browserFrameEnabled: state.browserFrameEnabled,
    browserFrameTheme: state.browserFrameTheme,
    browserFrameStyle: state.browserFrameStyle,
    browserFrameUrl: state.browserFrameUrl,
    browserFrameShowUrl: state.browserFrameShowUrl,
    browserFrameUrlBold: state.browserFrameUrlBold,
    deviceMockupId: state.deviceMockupId,
    deviceMockupVariantId: state.deviceMockupVariantId,
    shadowSceneEnabled: state.shadowSceneEnabled,
    shadowScenePresetId: state.shadowScenePresetId,
    shadowSceneOpacity: state.shadowSceneOpacity,
    shadowScenePlacement: state.shadowScenePlacement,
    textOverlayEnabled: state.textOverlayEnabled,
    headlineText: state.headlineText,
    subtitleText: state.subtitleText,
    badgeText: state.badgeText,
    customTextLayers: cloneCustomTextLayers(state.customTextLayers),
    textLayerStyles: cloneTextLayerStyles(state.textLayerStyles),
    textPosition: state.textPosition,
    textAlign: state.textAlign,
    textColor: state.textColor,
    textFontId: state.textFontId,
    textFontWeight: state.textFontWeight,
    textItalic: state.textItalic,
    textUnderline: state.textUnderline,
    textLetterSpacing: state.textLetterSpacing,
    textLineHeight: state.textLineHeight,
    textOpacity: state.textOpacity,
    textShadowEnabled: state.textShadowEnabled,
    textShadowMode: state.textShadowMode,
    textShadowPresetId: state.textShadowPresetId,
    textShadowColor: state.textShadowColor,
    textShadowBlur: state.textShadowBlur,
    textShadowOffsetX: state.textShadowOffsetX,
    textShadowOffsetY: state.textShadowOffsetY,
    textShadowOpacity: state.textShadowOpacity,
    textShadowDepth: state.textShadowDepth,
    headlineSize: state.headlineSize,
    subtitleSize: state.subtitleSize,
    badgeSize: state.badgeSize,
    badgeWidth: state.badgeWidth,
    badgeRotation: state.badgeRotation,
    headlineRotation: state.headlineRotation,
    headlineWidth: state.headlineWidth,
    subtitleRotation: state.subtitleRotation,
    subtitleWidth: state.subtitleWidth,
    badgeEnabled: state.badgeEnabled,
    badgeOffsetX: state.badgeOffsetX,
    badgeOffsetY: state.badgeOffsetY,
    headlineOffsetX: state.headlineOffsetX,
    headlineOffsetY: state.headlineOffsetY,
    subtitleOffsetX: state.subtitleOffsetX,
    subtitleOffsetY: state.subtitleOffsetY,
    tiltEnabled: state.tiltEnabled,
    tiltPresetId: state.tiltPresetId,
    perspective: state.perspective,
    rotateX: state.rotateX,
    rotateY: state.rotateY,
    rotateZ: state.rotateZ,
    translateY: state.translateY,
    tiltShadowMultiplier: state.tiltShadowMultiplier,
    hoverTiltEnabled: state.hoverTiltEnabled,
    hoverTiltSensitivity: state.hoverTiltSensitivity,
    backgroundParallaxEnabled: state.backgroundParallaxEnabled,
    backgroundParallaxStrength: state.backgroundParallaxStrength,
    exportScale: state.exportScale,
    exportFileName: state.exportFileName,
    isExporting: state.isExporting,
    lastExportedAt: state.lastExportedAt,
    lastBeautifyPresetId: state.lastBeautifyPresetId,
  });
}

function getHistoryGlobalSettingsFromState(
  state: EditorStore,
): HistoryGlobalSettings {
  return {
    canvasPreset: state.canvasPreset,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    backgroundType: state.backgroundType,
    backgroundValue: state.backgroundValue,
    backgroundPresetId: state.backgroundPresetId,
    backgroundPatternId: state.backgroundPatternId,
    backgroundPatternColor: state.backgroundPatternColor,
    backgroundPatternIntensity: state.backgroundPatternIntensity,
    backgroundNoise: state.backgroundNoise,
    backgroundBlur: state.backgroundBlur,
    customBackgroundConfig: cloneCustomBackgroundConfig(
      state.customBackgroundConfig,
    ),
    imagePadding: state.imagePadding,
    textOverlayEnabled: state.textOverlayEnabled,
    headlineText: state.headlineText,
    subtitleText: state.subtitleText,
    badgeText: state.badgeText,
    customTextLayers: cloneCustomTextLayers(state.customTextLayers),
    textLayerStyles: cloneTextLayerStyles(state.textLayerStyles),
    textPosition: state.textPosition,
    textAlign: state.textAlign,
    textColor: state.textColor,
    textFontId: state.textFontId,
    textFontWeight: state.textFontWeight,
    textItalic: state.textItalic,
    textUnderline: state.textUnderline,
    textLetterSpacing: state.textLetterSpacing,
    textLineHeight: state.textLineHeight,
    textOpacity: state.textOpacity,
    textShadowEnabled: state.textShadowEnabled,
    textShadowMode: state.textShadowMode,
    textShadowPresetId: state.textShadowPresetId,
    textShadowColor: state.textShadowColor,
    textShadowBlur: state.textShadowBlur,
    textShadowOffsetX: state.textShadowOffsetX,
    textShadowOffsetY: state.textShadowOffsetY,
    textShadowOpacity: state.textShadowOpacity,
    textShadowDepth: state.textShadowDepth,
    headlineSize: state.headlineSize,
    subtitleSize: state.subtitleSize,
    badgeSize: state.badgeSize,
    badgeWidth: state.badgeWidth,
    badgeRotation: state.badgeRotation,
    headlineRotation: state.headlineRotation,
    headlineWidth: state.headlineWidth,
    subtitleRotation: state.subtitleRotation,
    subtitleWidth: state.subtitleWidth,
    badgeEnabled: state.badgeEnabled,
    badgeOffsetX: state.badgeOffsetX,
    badgeOffsetY: state.badgeOffsetY,
    headlineOffsetX: state.headlineOffsetX,
    headlineOffsetY: state.headlineOffsetY,
    subtitleOffsetX: state.subtitleOffsetX,
    subtitleOffsetY: state.subtitleOffsetY,
    backgroundParallaxEnabled: state.backgroundParallaxEnabled,
    backgroundParallaxStrength: state.backgroundParallaxStrength,
    exportScale: state.exportScale,
    exportFileName: state.exportFileName,
    screenshotLayoutPresetId: state.screenshotLayoutPresetId,
  };
}

function createExportFileNameFromImage(uploadedImage: UploadedImage) {
  return sanitizeFileName(
    uploadedImage.name.replace(/\.(png|jpe?g|webp)$/i, ""),
  );
}

function createSettingsForUploadedImage(
  uploadedImage: UploadedImage,
  sourceSettings: EditorDesignSettings,
): EditorDesignSettings {
  return {
    ...cloneEditorDesignSettings(sourceSettings),
    ...createDefaultTiltSettings(),
    exportFileName: createExportFileNameFromImage(uploadedImage),
    isExporting: false,
    lastExportedAt: null,
  };
}

function createScreenshotDesign(
  uploadedImage: UploadedImage,
  settings: EditorDesignSettings,
  isPlaced = false,
): ScreenshotDesign {
  return {
    id: `design-${uploadedImage.id}`,
    isPlaced,
    uploadedImage,
    settings: cloneEditorDesignSettings(settings),
  };
}

function applyScreenshotLayoutToPlacedScreenshots(
  screenshots: ScreenshotDesign[],
  presetId: ScreenshotLayoutPresetId,
) {
  const placedScreenshots = screenshots.filter(
    (screenshot) => screenshot.isPlaced,
  );
  const layoutPatches = createScreenshotLayoutPatches(
    presetId,
    placedScreenshots.length,
  );

  if (!layoutPatches.length) {
    return screenshots;
  }

  let placedIndex = 0;

  return screenshots.map((screenshot) => {
    if (!screenshot.isPlaced) {
      return screenshot;
    }

    const layoutPatch = layoutPatches[placedIndex];
    placedIndex += 1;

    if (!layoutPatch) {
      return screenshot;
    }

    return {
      ...screenshot,
      settings: {
        ...cloneEditorDesignSettings(screenshot.settings),
        ...layoutPatch,
        imageShadow: {
          ...layoutPatch.imageShadow,
        },
      },
    };
  });
}

function createNextManualPlacement(
  placedCount: number,
): Pick<EditorDesignSettings, "imageOffsetX" | "imageOffsetY" | "imageScale"> {
  const angle = placedCount * 1.8;
  const radius = placedCount === 0 ? 0 : Math.min(0.28, 0.12 + placedCount * 0.04);

  return {
    imageOffsetX: clampUnitOffset(Math.cos(angle) * radius),
    imageOffsetY: clampUnitOffset(Math.sin(angle) * radius),
    imageScale: placedCount === 0 ? 92 : 58,
  };
}

function getActiveScreenshot(state: EditorStore) {
  return (
    state.screenshots.find(
      (screenshot) =>
        screenshot.id === state.activeScreenshotId && screenshot.isPlaced,
    ) ?? null
  );
}

function getNextActiveScreenshot(
  screenshots: ScreenshotDesign[],
  removedIndex: number,
) {
  return (
    screenshots
      .slice(removedIndex + 1)
      .find((screenshot) => screenshot.isPlaced) ??
    screenshots
      .slice(0, removedIndex)
      .reverse()
      .find((screenshot) => screenshot.isPlaced) ??
    null
  );
}

function clampFitScale(scale: number) {
  if (!Number.isFinite(scale)) {
    return 100;
  }

  return Math.max(1, Math.min(180, Math.floor(scale * 100) / 100));
}

function didImageCropChange(previousCrop: ImageCrop, nextCrop: ImageCrop) {
  return (
    previousCrop.top !== nextCrop.top ||
    previousCrop.right !== nextCrop.right ||
    previousCrop.bottom !== nextCrop.bottom ||
    previousCrop.left !== nextCrop.left
  );
}

function createManualLayoutPatch(
  state: EditorStore,
  shouldMarkManual: boolean,
) {
  if (!shouldMarkManual || state.screenshotLayoutPresetId === "manual") {
    return {};
  }

  return {
    screenshotLayoutPresetId: "manual" as const,
  };
}

function isDefaultTextLayerId(
  layerId: TextLayerId,
): layerId is DefaultTextLayerId {
  return DEFAULT_TEXT_LAYER_IDS.includes(layerId as DefaultTextLayerId);
}

function getTextLayerOffsetKeys(layerId: TextLayerId) {
  if (!isDefaultTextLayerId(layerId)) {
    return null;
  }

  return {
    x: `${layerId}OffsetX`,
    y: `${layerId}OffsetY`,
  } as const;
}

function getTextLayerRotationKey(layerId: TextLayerId) {
  if (!isDefaultTextLayerId(layerId)) {
    return null;
  }

  return `${layerId}Rotation` as const;
}

function getTextLayerWidthKey(layerId: TextLayerId) {
  if (!isDefaultTextLayerId(layerId)) {
    return null;
  }

  return `${layerId}Width` as const;
}

function getCustomTextLayer(
  state: EditorStore,
  layerId: TextLayerId,
): CustomTextLayer | null {
  if (isDefaultTextLayerId(layerId)) {
    return null;
  }

  return state.customTextLayers.find((layer) => layer.id === layerId) ?? null;
}

function createCustomTextLayer(state: EditorStore): CustomTextLayer {
  const layerNumber = state.customTextLayers.length + 1;

  return {
    id: `custom-${Date.now()}-${layerNumber}` as CustomTextLayerId,
    offsetX: 0,
    offsetY: Math.min(0.48, layerNumber * 0.1),
    rotation: 0,
    size: state.headlineSize,
    style: {
      ...state.textLayerStyles.headline,
    },
    text: "New text",
    width: state.headlineWidth,
  };
}

function getActiveTextLayerId(state: EditorStore) {
  return state.activeTextLayerId ?? "headline";
}

function getActiveTextLayerStyle(state: EditorStore) {
  const layerId = getActiveTextLayerId(state);

  if (isDefaultTextLayerId(layerId)) {
    return state.textLayerStyles[layerId];
  }

  return (
    getCustomTextLayer(state, layerId)?.style ?? state.textLayerStyles.headline
  );
}

function createTextLayerStyleStatePatch(
  state: EditorStore,
  patch: Partial<TextLayerStyle>,
) {
  const layerId = getActiveTextLayerId(state);

  if (!isDefaultTextLayerId(layerId)) {
    return {
      customTextLayers: state.customTextLayers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              style: {
                ...layer.style,
                ...patch,
              },
            }
          : layer,
      ),
    };
  }

  return {
    textLayerStyles: {
      ...state.textLayerStyles,
      [layerId]: {
        ...state.textLayerStyles[layerId],
        ...patch,
      },
    },
  };
}

function getBackgroundState(presetId: string): {
  backgroundType: BackgroundType;
  backgroundValue: string;
  backgroundPresetId: string;
} {
  const preset = getBackgroundPreset(presetId);

  return {
    backgroundType: preset.type,
    backgroundValue: preset.cssValue,
    backgroundPresetId: preset.id,
  };
}

function getCustomBackgroundState(config: CustomBackgroundConfig): {
  backgroundType: Extract<BackgroundType, "gradient" | "mesh">;
  backgroundValue: string;
  backgroundPresetId: string;
} {
  return {
    backgroundType: getCustomBackgroundType(config),
    backgroundValue: createCustomGradient(config),
    backgroundPresetId: "custom",
  };
}

function getLayerSettingsPatch(settings: EditorDesignSettings) {
  return {
    imageRadius: settings.imageRadius,
    imageScale: settings.imageScale,
    imageOffsetX: settings.imageOffsetX,
    imageOffsetY: settings.imageOffsetY,
    imageCrop: {
      ...settings.imageCrop,
    },
    imageShadow: {
      ...settings.imageShadow,
    },
    imageBorder: {
      ...settings.imageBorder,
    },
    imageZoom: settings.imageZoom,
    imageZoomOffsetX: settings.imageZoomOffsetX,
    imageZoomOffsetY: settings.imageZoomOffsetY,
    browserFrameEnabled: settings.browserFrameEnabled,
    browserFrameTheme: settings.browserFrameTheme,
    browserFrameStyle: settings.browserFrameStyle,
    browserFrameUrl: settings.browserFrameUrl,
    browserFrameShowUrl: settings.browserFrameShowUrl,
    browserFrameUrlBold: settings.browserFrameUrlBold,
    deviceMockupId: settings.deviceMockupId,
    deviceMockupVariantId: settings.deviceMockupVariantId,
    shadowSceneEnabled: settings.shadowSceneEnabled,
    shadowScenePresetId: settings.shadowScenePresetId,
    shadowSceneOpacity: settings.shadowSceneOpacity,
    shadowScenePlacement: settings.shadowScenePlacement,
    tiltEnabled: settings.tiltEnabled,
    tiltPresetId: settings.tiltPresetId,
    perspective: settings.perspective,
    rotateX: settings.rotateX,
    rotateY: settings.rotateY,
    rotateZ: settings.rotateZ,
    translateY: settings.translateY,
    tiltShadowMultiplier: settings.tiltShadowMultiplier,
    hoverTiltEnabled: settings.hoverTiltEnabled,
    hoverTiltSensitivity: settings.hoverTiltSensitivity,
    lastBeautifyPresetId: settings.lastBeautifyPresetId,
  } satisfies Partial<EditorDesignSettings>;
}

function getLayerSettingsPatchFromState(state: EditorStore) {
  return getLayerSettingsPatch(getEditorDesignSettingsFromState(state));
}

const LAYER_HISTORY_SCALAR_SETTING_KEYS = [
  "imageRadius",
  "browserFrameEnabled",
  "browserFrameTheme",
  "browserFrameStyle",
  "browserFrameUrl",
  "browserFrameShowUrl",
  "browserFrameUrlBold",
  "deviceMockupId",
  "deviceMockupVariantId",
  "shadowSceneEnabled",
  "shadowScenePresetId",
  "shadowSceneOpacity",
  "shadowScenePlacement",
  "tiltEnabled",
  "tiltPresetId",
  "perspective",
  "rotateX",
  "rotateY",
  "rotateZ",
  "translateY",
  "tiltShadowMultiplier",
  "hoverTiltEnabled",
  "hoverTiltSensitivity",
  "lastBeautifyPresetId",
] as const satisfies readonly (keyof ReturnType<typeof getLayerSettingsPatch>)[];

function getCurrentScreenshotGeometry(state: EditorStore) {
  const geometry = new Map<
    string,
    Pick<
      EditorDesignSettings,
      | "imageOffsetX"
      | "imageOffsetY"
      | "imageScale"
      | "imageZoom"
      | "imageZoomOffsetX"
      | "imageZoomOffsetY"
    >
  >();

  state.screenshots.forEach((screenshot) => {
    const isActiveScreenshot =
      screenshot.id === state.activeScreenshotId && screenshot.isPlaced;

    geometry.set(screenshot.id, {
      imageOffsetX: isActiveScreenshot
        ? state.imageOffsetX
        : screenshot.settings.imageOffsetX,
      imageOffsetY: isActiveScreenshot
        ? state.imageOffsetY
        : screenshot.settings.imageOffsetY,
      imageScale: isActiveScreenshot
        ? state.imageScale
        : screenshot.settings.imageScale,
      imageZoom: isActiveScreenshot
        ? state.imageZoom
        : screenshot.settings.imageZoom,
      imageZoomOffsetX: isActiveScreenshot
        ? state.imageZoomOffsetX
        : screenshot.settings.imageZoomOffsetX,
      imageZoomOffsetY: isActiveScreenshot
        ? state.imageZoomOffsetY
        : screenshot.settings.imageZoomOffsetY,
    });
  });

  return geometry;
}

function getHistoryScreenshotsFromState(
  state: EditorStore,
): ScreenshotDesign[] {
  const activeSettingsPatch = state.activeScreenshotId
    ? getLayerSettingsPatchFromState(state)
    : null;

  return state.screenshots.map((screenshot) => {
    let settings = cloneEditorDesignSettings(screenshot.settings);

    if (
      screenshot.isPlaced &&
      screenshot.id === state.activeScreenshotId &&
      activeSettingsPatch
    ) {
      settings = {
        ...settings,
        ...activeSettingsPatch,
        imageCrop: activeSettingsPatch.imageCrop
          ? { ...activeSettingsPatch.imageCrop }
          : settings.imageCrop,
        imageShadow: activeSettingsPatch.imageShadow
          ? { ...activeSettingsPatch.imageShadow }
          : settings.imageShadow,
      };
    }

    return {
      ...screenshot,
      settings: normalizeTiltSettingsForHistory(settings),
    };
  });
}

function createHistorySnapshot(state: EditorStore): EditorHistorySnapshot {
  return {
    activeScreenshotId: state.activeScreenshotId,
    globalSettings: getHistoryGlobalSettingsFromState(state),
    screenshots: getHistoryScreenshotsFromState(state),
  };
}

function createStateFromHistorySnapshot(
  snapshot: EditorHistorySnapshot,
  currentState: EditorStore,
): Partial<EditorStore> {
  const shouldPreserveCurrentGeometry =
    snapshot.globalSettings.screenshotLayoutPresetId === "manual" &&
    currentState.screenshotLayoutPresetId === "manual";
  const currentGeometry = shouldPreserveCurrentGeometry
    ? getCurrentScreenshotGeometry(currentState)
    : new Map();
  const screenshots = cloneScreenshotDesigns(snapshot.screenshots).map(
    (screenshot) => {
      const currentGeometryForScreenshot = currentGeometry.get(screenshot.id);

      if (!currentGeometryForScreenshot) {
        return screenshot;
      }

      return {
        ...screenshot,
        settings: {
          ...screenshot.settings,
          ...currentGeometryForScreenshot,
        },
      };
    },
  );
  const activeScreenshot =
    screenshots.find(
      (screenshot) =>
        screenshot.id === snapshot.activeScreenshotId && screenshot.isPlaced,
    ) ?? null;

  return {
    screenshots,
    activeScreenshotId: activeScreenshot?.id ?? null,
    uploadedImage: activeScreenshot?.uploadedImage ?? null,
    ...snapshot.globalSettings,
    ...(activeScreenshot
      ? getLayerSettingsPatch(activeScreenshot.settings)
      : {}),
    isExporting: currentState.isExporting,
    lastExportedAt: currentState.lastExportedAt,
  };
}

function didScreenshotLibraryChange(
  previousState: EditorStore,
  nextState: EditorStore,
) {
  if (previousState.screenshots.length !== nextState.screenshots.length) {
    return true;
  }

  return previousState.screenshots.some((screenshot, index) => {
    const nextScreenshot = nextState.screenshots[index];

    return (
      !nextScreenshot ||
      screenshot.id !== nextScreenshot.id ||
      screenshot.uploadedImage.id !== nextScreenshot.uploadedImage.id
    );
  });
}

function didCustomBackgroundConfigChange(
  previousConfig: CustomBackgroundConfig,
  nextConfig: CustomBackgroundConfig,
) {
  return (
    previousConfig.patternId !== nextConfig.patternId ||
    previousConfig.colorA !== nextConfig.colorA ||
    previousConfig.colorB !== nextConfig.colorB ||
    previousConfig.colorC !== nextConfig.colorC ||
    previousConfig.angle !== nextConfig.angle
  );
}

function didHistoryGlobalSettingsChange(
  previousSettings: HistoryGlobalSettings,
  nextSettings: HistoryGlobalSettings,
) {
  if (
    didCustomBackgroundConfigChange(
      previousSettings.customBackgroundConfig,
      nextSettings.customBackgroundConfig,
    ) ||
    didTextLayerStylesChange(
      previousSettings.textLayerStyles,
      nextSettings.textLayerStyles,
    ) ||
    didCustomTextLayersChange(
      previousSettings.customTextLayers,
      nextSettings.customTextLayers,
    )
  ) {
    return true;
  }

  return HISTORY_GLOBAL_SETTING_KEYS.some(
    (key) => previousSettings[key] !== nextSettings[key],
  );
}

function didTextLayerStylesChange(
  previousStyles: Record<DefaultTextLayerId, TextLayerStyle>,
  nextStyles: Record<DefaultTextLayerId, TextLayerStyle>,
) {
  return DEFAULT_TEXT_LAYER_IDS.some((layerId) => {
    const previousStyle = previousStyles[layerId];
    const nextStyle = nextStyles[layerId];

    return (
      previousStyle.textAlign !== nextStyle.textAlign ||
      previousStyle.textColor !== nextStyle.textColor ||
      previousStyle.textFontId !== nextStyle.textFontId ||
      previousStyle.textFontWeight !== nextStyle.textFontWeight ||
      previousStyle.textItalic !== nextStyle.textItalic ||
      previousStyle.textUnderline !== nextStyle.textUnderline ||
      previousStyle.textLetterSpacing !== nextStyle.textLetterSpacing ||
      previousStyle.textLineHeight !== nextStyle.textLineHeight ||
      previousStyle.textOpacity !== nextStyle.textOpacity ||
      previousStyle.textShadowEnabled !== nextStyle.textShadowEnabled ||
      previousStyle.textShadowMode !== nextStyle.textShadowMode ||
      previousStyle.textShadowPresetId !== nextStyle.textShadowPresetId ||
      previousStyle.textShadowColor !== nextStyle.textShadowColor ||
      previousStyle.textShadowBlur !== nextStyle.textShadowBlur ||
      previousStyle.textShadowOffsetX !== nextStyle.textShadowOffsetX ||
      previousStyle.textShadowOffsetY !== nextStyle.textShadowOffsetY ||
      previousStyle.textShadowOpacity !== nextStyle.textShadowOpacity ||
      previousStyle.textShadowDepth !== nextStyle.textShadowDepth
    );
  });
}

function didCustomTextLayersChange(
  previousLayers: CustomTextLayer[],
  nextLayers: CustomTextLayer[],
) {
  if (previousLayers.length !== nextLayers.length) {
    return true;
  }

  return previousLayers.some((layer, index) => {
    const nextLayer = nextLayers[index];

    return (
      !nextLayer ||
      layer.id !== nextLayer.id ||
      layer.text !== nextLayer.text ||
      layer.offsetX !== nextLayer.offsetX ||
      layer.offsetY !== nextLayer.offsetY ||
      layer.rotation !== nextLayer.rotation ||
      layer.size !== nextLayer.size ||
      layer.width !== nextLayer.width ||
      didTextLayerStylesChange(
        { badge: layer.style, headline: layer.style, subtitle: layer.style },
        {
          badge: nextLayer.style,
          headline: nextLayer.style,
          subtitle: nextLayer.style,
        },
      )
    );
  });
}

function didLayerHistorySettingsChange(
  previousSettings: EditorDesignSettings,
  nextSettings: EditorDesignSettings,
) {
  if (
    previousSettings.imageCrop.top !== nextSettings.imageCrop.top ||
    previousSettings.imageCrop.right !== nextSettings.imageCrop.right ||
    previousSettings.imageCrop.bottom !== nextSettings.imageCrop.bottom ||
    previousSettings.imageCrop.left !== nextSettings.imageCrop.left ||
    previousSettings.imageShadow.enabled !== nextSettings.imageShadow.enabled ||
    previousSettings.imageShadow.blur !== nextSettings.imageShadow.blur ||
    previousSettings.imageShadow.opacity !== nextSettings.imageShadow.opacity ||
    previousSettings.imageShadow.offsetY !== nextSettings.imageShadow.offsetY ||
    previousSettings.imageBorder.enabled !== nextSettings.imageBorder.enabled ||
    previousSettings.imageBorder.preset !== nextSettings.imageBorder.preset ||
    previousSettings.imageBorder.width !== nextSettings.imageBorder.width ||
    previousSettings.imageBorder.color !== nextSettings.imageBorder.color
  ) {
    return true;
  }

  return LAYER_HISTORY_SCALAR_SETTING_KEYS.some(
    (key) => previousSettings[key] !== nextSettings[key],
  );
}

function didHistoryScreenshotsChange(
  previousScreenshots: ScreenshotDesign[],
  nextScreenshots: ScreenshotDesign[],
) {
  if (previousScreenshots.length !== nextScreenshots.length) {
    return true;
  }

  return previousScreenshots.some((screenshot, index) => {
    const nextScreenshot = nextScreenshots[index];

    return (
      !nextScreenshot ||
      screenshot.id !== nextScreenshot.id ||
      screenshot.isPlaced !== nextScreenshot.isPlaced ||
      didLayerHistorySettingsChange(
        screenshot.settings,
        nextScreenshot.settings,
      )
    );
  });
}

function didHistorySnapshotChange(
  previousSnapshot: EditorHistorySnapshot,
  nextSnapshot: EditorHistorySnapshot,
) {
  return (
    didHistoryGlobalSettingsChange(
      previousSnapshot.globalSettings,
      nextSnapshot.globalSettings,
    ) ||
    didHistoryScreenshotsChange(
      previousSnapshot.screenshots,
      nextSnapshot.screenshots,
    )
  );
}

const LAYER_SCALAR_SETTING_KEYS = [
  "imageRadius",
  "imageScale",
  "imageOffsetX",
  "imageOffsetY",
  "imageZoom",
  "imageZoomOffsetX",
  "imageZoomOffsetY",
  "browserFrameEnabled",
  "browserFrameTheme",
  "browserFrameStyle",
  "browserFrameUrl",
  "browserFrameShowUrl",
  "browserFrameUrlBold",
  "deviceMockupId",
  "deviceMockupVariantId",
  "shadowSceneEnabled",
  "shadowScenePresetId",
  "shadowSceneOpacity",
  "shadowScenePlacement",
  "textOverlayEnabled",
  "headlineText",
  "subtitleText",
  "badgeText",
  "textPosition",
  "textAlign",
  "textColor",
  "textFontId",
  "textFontWeight",
  "textItalic",
  "textUnderline",
  "textLetterSpacing",
  "textLineHeight",
  "textOpacity",
  "textShadowEnabled",
  "textShadowMode",
  "textShadowPresetId",
  "textShadowColor",
  "textShadowBlur",
  "textShadowOffsetX",
  "textShadowOffsetY",
  "textShadowOpacity",
  "textShadowDepth",
  "headlineSize",
  "subtitleSize",
  "badgeSize",
  "badgeWidth",
  "badgeRotation",
  "headlineRotation",
  "headlineWidth",
  "subtitleRotation",
  "subtitleWidth",
  "badgeEnabled",
  "badgeOffsetX",
  "badgeOffsetY",
  "headlineOffsetX",
  "headlineOffsetY",
  "subtitleOffsetX",
  "subtitleOffsetY",
  "tiltEnabled",
  "tiltPresetId",
  "perspective",
  "rotateX",
  "rotateY",
  "rotateZ",
  "translateY",
  "tiltShadowMultiplier",
  "hoverTiltEnabled",
  "hoverTiltSensitivity",
  "lastBeautifyPresetId",
] as const satisfies readonly (keyof EditorDesignSettings)[];

function didLayerSettingsChange(
  previousState: EditorStore,
  nextState: EditorStore,
) {
  if (
    previousState.imageCrop.top !== nextState.imageCrop.top ||
    previousState.imageCrop.right !== nextState.imageCrop.right ||
    previousState.imageCrop.bottom !== nextState.imageCrop.bottom ||
    previousState.imageCrop.left !== nextState.imageCrop.left ||
    previousState.imageShadow.enabled !== nextState.imageShadow.enabled ||
    previousState.imageShadow.blur !== nextState.imageShadow.blur ||
    previousState.imageShadow.opacity !== nextState.imageShadow.opacity ||
    previousState.imageShadow.offsetY !== nextState.imageShadow.offsetY ||
    previousState.imageBorder.enabled !== nextState.imageBorder.enabled ||
    previousState.imageBorder.preset !== nextState.imageBorder.preset ||
    previousState.imageBorder.width !== nextState.imageBorder.width ||
    previousState.imageBorder.color !== nextState.imageBorder.color
  ) {
    return true;
  }

  return LAYER_SCALAR_SETTING_KEYS.some(
    (key) => previousState[key] !== nextState[key],
  );
}

let isApplyingHistoryStateChange = false;
let isSyncingActiveScreenshotSettings = false;
let historyBatchDepth = 0;
let historyBatchStartSnapshot: EditorHistorySnapshot | null = null;

export const useEditorStore = create<EditorStore>((set, get) => ({
  historyPast: [],
  historyFuture: [],
  screenshots: [],
  activeScreenshotId: null,
  activeTextLayerId: null,
  screenshotLayoutPresetId: "manual",
  uploadedImage: null,
  customBackgroundImage: null,
  ...createDefaultEditorDesignSettings(),
  undo: () => {
    const state = get();
    const previousSnapshot = state.historyPast[state.historyPast.length - 1];

    if (!previousSnapshot || state.isExporting) {
      return;
    }

    const currentSnapshot = createHistorySnapshot(state);

    isApplyingHistoryStateChange = true;
    try {
      set({
        ...createStateFromHistorySnapshot(previousSnapshot, state),
        historyPast: state.historyPast.slice(0, -1),
        historyFuture: [
          currentSnapshot,
          ...state.historyFuture,
        ].slice(0, MAX_EDITOR_HISTORY_ENTRIES),
      });
    } finally {
      isApplyingHistoryStateChange = false;
    }
  },
  redo: () => {
    const state = get();
    const nextSnapshot = state.historyFuture[0];

    if (!nextSnapshot || state.isExporting) {
      return;
    }

    const currentSnapshot = createHistorySnapshot(state);

    isApplyingHistoryStateChange = true;
    try {
      set({
        ...createStateFromHistorySnapshot(nextSnapshot, state),
        historyPast: [
          ...state.historyPast,
          currentSnapshot,
        ].slice(-MAX_EDITOR_HISTORY_ENTRIES),
        historyFuture: state.historyFuture.slice(1),
      });
    } finally {
      isApplyingHistoryStateChange = false;
    }
  },
  clearHistory: () => {
    const state = get();

    if (!state.historyPast.length && !state.historyFuture.length) {
      return;
    }

    isApplyingHistoryStateChange = true;
    try {
      set({
        historyPast: [],
        historyFuture: [],
      });
    } finally {
      isApplyingHistoryStateChange = false;
    }
  },
  beginHistoryBatch: () => {
    if (historyBatchDepth === 0) {
      historyBatchStartSnapshot = createHistorySnapshot(get());
    }

    historyBatchDepth += 1;
  },
  commitHistoryBatch: () => {
    if (historyBatchDepth <= 0) {
      return;
    }

    historyBatchDepth -= 1;

    if (historyBatchDepth > 0) {
      return;
    }

    const previousSnapshot = historyBatchStartSnapshot;
    historyBatchStartSnapshot = null;

    if (!previousSnapshot) {
      return;
    }

    const state = get();
    const nextSnapshot = createHistorySnapshot(state);

    if (!didHistorySnapshotChange(previousSnapshot, nextSnapshot)) {
      return;
    }

    isApplyingHistoryStateChange = true;
    try {
      set({
        historyPast: [
          ...state.historyPast,
          previousSnapshot,
        ].slice(-MAX_EDITOR_HISTORY_ENTRIES),
        historyFuture: [],
      });
    } finally {
      isApplyingHistoryStateChange = false;
    }
  },
  applyScreenshotLayout: (presetId) => {
    const state = get();
    const placedScreenshots = state.screenshots.filter(
      (screenshot) => screenshot.isPlaced,
    );

    if (presetId === "manual") {
      set({ screenshotLayoutPresetId: "manual" });
      return;
    }

    if (!canApplyScreenshotLayout(placedScreenshots.length)) {
      return;
    }

    const nextScreenshots = applyScreenshotLayoutToPlacedScreenshots(
      state.screenshots,
      presetId,
    );
    const activeScreenshot =
      placedScreenshots.find(
        (screenshot) => screenshot.id === state.activeScreenshotId,
      ) ??
      placedScreenshots[placedScreenshots.length - 1] ??
      null;

    set({
      screenshots: nextScreenshots,
      screenshotLayoutPresetId: presetId,
      ...(activeScreenshot
        ? {
            activeScreenshotId: activeScreenshot.id,
            uploadedImage: activeScreenshot.uploadedImage,
            ...getLayerSettingsPatch(
              nextScreenshots.find(
                (screenshot) => screenshot.id === activeScreenshot.id,
              )?.settings ?? activeScreenshot.settings,
            ),
          }
        : {}),
    });
  },
  selectScreenshot: (screenshotId) => {
    const screenshot = get().screenshots.find(
      (item) => item.id === screenshotId,
    );

    if (
      !screenshot ||
      !screenshot.isPlaced ||
      get().activeScreenshotId === screenshot.id
    ) {
      return;
    }

    set({
      activeScreenshotId: screenshot.id,
      uploadedImage: screenshot.uploadedImage,
      ...getLayerSettingsPatch(screenshot.settings),
    });
  },
  placeScreenshot: (screenshotId, placement) => {
    const state = get();
    const screenshot = state.screenshots.find(
      (item) => item.id === screenshotId,
    );

    if (!screenshot) {
      return;
    }

    const placedCount = state.screenshots.filter(
      (item) => item.isPlaced,
    ).length;
    const layout =
      !screenshot.isPlaced && !placement
        ? createNextManualPlacement(placedCount)
        : null;
    const settings = cloneEditorDesignSettings(
      screenshot.id === state.activeScreenshotId && screenshot.isPlaced
        ? getEditorDesignSettingsFromState(state)
        : screenshot.settings,
    );
    const nextSettings: EditorDesignSettings = {
      ...settings,
      ...(layout ?? {}),
      ...(placement
        ? {
            imageOffsetX: clampUnitOffset(placement.offsetX),
            imageOffsetY: clampUnitOffset(placement.offsetY),
          }
        : {}),
    };

    if (!screenshot.isPlaced && placement && placedCount > 0) {
      nextSettings.imageScale = Math.min(nextSettings.imageScale, 58);
    }

    set({
      screenshots: state.screenshots.map((item) =>
        item.id === screenshot.id
          ? {
              ...item,
              isPlaced: true,
              settings: nextSettings,
            }
          : item,
      ),
      activeScreenshotId: screenshot.id,
      screenshotLayoutPresetId: "manual",
      uploadedImage: screenshot.uploadedImage,
      ...getLayerSettingsPatch(nextSettings),
    });
  },
  removeScreenshotFromCanvas: (screenshotId) => {
    const state = get();
    const removedIndex = state.screenshots.findIndex(
      (screenshot) => screenshot.id === screenshotId,
    );

    if (removedIndex === -1) {
      return;
    }

    const screenshot = state.screenshots[removedIndex]!;
    const currentSettings =
      screenshot.id === state.activeScreenshotId && screenshot.isPlaced
        ? getEditorDesignSettingsFromState(state)
        : screenshot.settings;
    const nextScreenshots = state.screenshots.map((item) =>
      item.id === screenshotId
        ? {
            ...item,
            isPlaced: false,
            settings: cloneEditorDesignSettings(currentSettings),
          }
        : item,
    );
    const activeScreenshot =
      state.activeScreenshotId === screenshotId
        ? getNextActiveScreenshot(nextScreenshots, removedIndex)
        : getActiveScreenshot({
            ...state,
            screenshots: nextScreenshots,
          });

    if (!activeScreenshot) {
      set({
        screenshots: nextScreenshots,
        activeScreenshotId: null,
        screenshotLayoutPresetId: "manual",
        uploadedImage: null,
      });
      return;
    }

    set({
      screenshots: nextScreenshots,
      activeScreenshotId: activeScreenshot.id,
      screenshotLayoutPresetId: "manual",
      uploadedImage: activeScreenshot.uploadedImage,
      ...getLayerSettingsPatch(activeScreenshot.settings),
    });
  },
  addUploadedImages: (uploadedImages) => {
    if (!uploadedImages.length) {
      return;
    }

    const state = get();
    const availableSlots = Math.max(
      0,
      MAX_SCREENSHOT_UPLOADS - state.screenshots.length,
    );
    const imagesToAdd = uploadedImages.slice(0, availableSlots);
    const imagesToDiscard = uploadedImages.slice(availableSlots);

    imagesToDiscard.forEach(revokeObjectUrl);

    if (!imagesToAdd.length) {
      return;
    }

    const shouldPlaceUploadedImages = state.screenshots.length === 0;
    const sourceSettings = getEditorDesignSettingsFromState(state);
    const nextScreenshots = imagesToAdd.map((uploadedImage, index) => {
      const uploadedImageSettings = createSettingsForUploadedImage(
        uploadedImage,
        sourceSettings,
      );

      return createScreenshotDesign(
        uploadedImage,
        shouldPlaceUploadedImages
          ? {
              ...uploadedImageSettings,
              ...createNextManualPlacement(index),
            }
          : uploadedImageSettings,
        shouldPlaceUploadedImages,
      );
    });
    const mergedScreenshots = [
      ...state.screenshots,
      ...nextScreenshots,
    ];
    const layoutPresetId: ScreenshotLayoutPresetId = "manual";
    const arrangedScreenshots = mergedScreenshots;
    const activeScreenshot = shouldPlaceUploadedImages
      ? arrangedScreenshots.find(
          (screenshot) =>
            screenshot.id === nextScreenshots[nextScreenshots.length - 1]?.id,
        )
      : getActiveScreenshot({
          ...state,
          screenshots: arrangedScreenshots,
        });

    if (!activeScreenshot) {
      set({
        screenshots: arrangedScreenshots,
        screenshotLayoutPresetId: layoutPresetId,
      });
      return;
    }

    set({
      screenshots: arrangedScreenshots,
      activeScreenshotId: activeScreenshot.id,
      screenshotLayoutPresetId: layoutPresetId,
      uploadedImage: activeScreenshot.uploadedImage,
      ...getLayerSettingsPatch(activeScreenshot.settings),
    });
  },
  removeUploadedImage: (screenshotId) => {
    const state = get();
    const removedIndex = state.screenshots.findIndex(
      (screenshot) => screenshot.id === screenshotId,
    );

    if (removedIndex === -1) {
      return;
    }

    const removedScreenshot = state.screenshots[removedIndex]!;
    const remainingScreenshots = state.screenshots.filter(
      (screenshot) => screenshot.id !== screenshotId,
    );
    const activeScreenshot =
      state.activeScreenshotId === screenshotId
        ? getNextActiveScreenshot(state.screenshots, removedIndex)
        : getActiveScreenshot(state);

    revokeObjectUrl(removedScreenshot.uploadedImage);

    if (!remainingScreenshots.length) {
      revokeObjectUrl(state.customBackgroundImage);

      set({
        screenshots: remainingScreenshots,
        activeScreenshotId: null,
        screenshotLayoutPresetId: "manual",
        uploadedImage: null,
        customBackgroundImage: null,
        ...createDefaultEditorDesignSettings(),
      });
      return;
    }

    if (!activeScreenshot) {
      set({
        screenshots: remainingScreenshots,
        activeScreenshotId: null,
        screenshotLayoutPresetId: "manual",
        uploadedImage: null,
      });
      return;
    }

    set({
      screenshots: remainingScreenshots,
      activeScreenshotId: activeScreenshot.id,
      screenshotLayoutPresetId: "manual",
      uploadedImage: activeScreenshot.uploadedImage,
      ...getLayerSettingsPatch(activeScreenshot.settings),
    });
  },
  setUploadedImage: (uploadedImage) => {
    if (!uploadedImage) {
      get().clearAllUploadedImages();
      return;
    }

    if (get().activeScreenshotId) {
      get().replaceUploadedImage(uploadedImage);
      return;
    }

    get().addUploadedImages([uploadedImage]);
  },
  clearUploadedImage: () => {
    const activeScreenshotId = get().activeScreenshotId;

    if (!activeScreenshotId) {
      return;
    }

    get().removeUploadedImage(activeScreenshotId);
  },
  clearAllUploadedImages: () => {
    const state = get();
    const screenshots = state.screenshots;

    if (!screenshots.length && !state.customBackgroundImage) {
      return;
    }

    screenshots.forEach((screenshot) => {
      revokeObjectUrl(screenshot.uploadedImage);
    });
    revokeObjectUrl(state.customBackgroundImage);

    set({
      screenshots: [],
      activeScreenshotId: null,
      uploadedImage: null,
      customBackgroundImage: null,
      screenshotLayoutPresetId: "manual",
      ...createDefaultEditorDesignSettings(),
    });
  },
  replaceUploadedImage: (uploadedImage) => {
    const state = get();
    const activeScreenshot = getActiveScreenshot(state);

    if (!activeScreenshot) {
      get().addUploadedImages([uploadedImage]);
      return;
    }

    if (activeScreenshot.uploadedImage.objectUrl !== uploadedImage.objectUrl) {
      revokeObjectUrl(activeScreenshot.uploadedImage);
    }

    set({
      screenshots: state.screenshots.map((screenshot) =>
        screenshot.id === activeScreenshot.id
          ? {
              ...screenshot,
              uploadedImage,
            }
          : screenshot,
      ),
      uploadedImage,
    });
  },
  applyBeautifyPreset: (presetId) => {
    set({
      ...createBeautifyPresetSettings(presetId),
      lastBeautifyPresetId: presetId,
      screenshotLayoutPresetId: "manual",
    });
  },
  setCanvasPreset: (presetId) => {
    const preset = getCanvasPreset(presetId);

    set({
      canvasPreset: preset.id,
      canvasWidth: preset.width,
      canvasHeight: preset.height,
    });
  },
  setCanvasSize: (width, height) => {
    set({
      canvasPreset: "custom",
      canvasWidth: width,
      canvasHeight: height,
    });
  },
  setBackgroundPreset: (presetId) => {
    const customBackgroundConfig =
      getEditablePresetCustomBackgroundConfig(presetId);

    set({
      ...getBackgroundState(presetId),
      ...(customBackgroundConfig ? { customBackgroundConfig } : {}),
    });
  },
  setBackgroundPattern: (patternId) => {
    set({ backgroundPatternId: patternId });
  },
  setBackgroundPatternColor: (color) => {
    set({ backgroundPatternColor: color });
  },
  setBackgroundPatternIntensity: (intensity) => {
    set({
      backgroundPatternIntensity: clampValue(
        Math.round(intensity),
        BEAUTIFY_SETTING_LIMITS.backgroundPatternIntensity.min,
        BEAUTIFY_SETTING_LIMITS.backgroundPatternIntensity.max,
      ),
    });
  },
  setBackgroundNoise: (noise) => {
    set({
      backgroundNoise: clampValue(
        Math.round(noise),
        BEAUTIFY_SETTING_LIMITS.backgroundNoise.min,
        BEAUTIFY_SETTING_LIMITS.backgroundNoise.max,
      ),
    });
  },
  setBackgroundBlur: (blur) => {
    set({
      backgroundBlur: clampValue(
        Math.round(blur),
        BEAUTIFY_SETTING_LIMITS.backgroundBlur.min,
        BEAUTIFY_SETTING_LIMITS.backgroundBlur.max,
      ),
    });
  },
  setCustomBackgroundConfig: (config) => {
    const customBackgroundConfig = cloneCustomBackgroundConfig(config);

    set((state) => {
      const shouldApplyCustomBackground =
        state.backgroundPresetId === "custom" &&
        state.backgroundType !== "image";

      return {
        customBackgroundConfig,
        ...(shouldApplyCustomBackground
          ? getCustomBackgroundState(customBackgroundConfig)
          : {}),
      };
    });
  },
  applyCustomBackgroundConfig: (config) => {
    const customBackgroundConfig = cloneCustomBackgroundConfig(
      config ?? get().customBackgroundConfig,
    );

    set({
      customBackgroundConfig,
      ...getCustomBackgroundState(customBackgroundConfig),
    });
  },
  setCustomBackgroundImage: (uploadedImage) => {
    set((state) => {
      if (state.customBackgroundImage?.objectUrl !== uploadedImage.objectUrl) {
        revokeObjectUrl(state.customBackgroundImage);
      }

      return {
        customBackgroundImage: uploadedImage,
        backgroundType: "image",
        backgroundValue: "",
        backgroundPresetId: "custom",
      };
    });
  },
  clearCustomBackgroundImage: () => {
    set((state) => {
      revokeObjectUrl(state.customBackgroundImage);

      return {
        customBackgroundImage: null,
      };
    });
  },
  setSolidBackground: (color) => {
    set({
      backgroundType: "solid",
      backgroundValue: color,
      backgroundPresetId: "custom",
    });
  },
  setImagePadding: (value) => {
    set({ imagePadding: value });
  },
  setImageRadius: (value) => {
    set({ imageRadius: value });
  },
  setImageScale: (value) => {
    set((state) => ({
      imageScale: value,
      ...createManualLayoutPatch(state, value !== state.imageScale),
    }));
  },
  setImagePosition: (offsetX, offsetY) => {
    set((state) => {
      const nextOffsetX = clampUnitOffset(offsetX);
      const nextOffsetY = clampUnitOffset(offsetY);

      return {
        imageOffsetX: nextOffsetX,
        imageOffsetY: nextOffsetY,
        ...createManualLayoutPatch(
          state,
          nextOffsetX !== state.imageOffsetX ||
            nextOffsetY !== state.imageOffsetY,
        ),
      };
    });
  },
  setImageCrop: (crop) => {
    set((state) => {
      const nextCrop = clampImageCrop(crop);

      return {
        imageCrop: nextCrop,
        ...createManualLayoutPatch(
          state,
          didImageCropChange(state.imageCrop, nextCrop),
        ),
      };
    });
  },
  setImageTransform: ({ crop, markLayoutManual = true, offsetX, offsetY, scale }) => {
    set((state) => {
      const nextScale =
        typeof scale === "number" ? Math.round(scale) : state.imageScale;
      const nextOffsetX =
        typeof offsetX === "number"
          ? clampUnitOffset(offsetX)
          : state.imageOffsetX;
      const nextOffsetY =
        typeof offsetY === "number"
          ? clampUnitOffset(offsetY)
          : state.imageOffsetY;
      const nextCrop = crop ? clampImageCrop(crop) : state.imageCrop;
      const didTransformChange =
        nextScale !== state.imageScale ||
        nextOffsetX !== state.imageOffsetX ||
        nextOffsetY !== state.imageOffsetY ||
        didImageCropChange(state.imageCrop, nextCrop);

      return {
        imageScale: nextScale,
        imageOffsetX: nextOffsetX,
        imageOffsetY: nextOffsetY,
        imageCrop: nextCrop,
        ...createManualLayoutPatch(
          state,
          markLayoutManual && didTransformChange,
        ),
      };
    });
  },
  fitUploadedImage: (scale) => {
    set({
      imageScale: clampFitScale(scale),
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageCrop: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      imageZoom: 100,
      imageZoomOffsetX: 0,
      imageZoomOffsetY: 0,
      screenshotLayoutPresetId: "manual",
    });
  },
  resetImagePosition: () => {
    set({
      imageOffsetX: 0,
      imageOffsetY: 0,
      imageCrop: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      imageZoom: 100,
      imageZoomOffsetX: 0,
      imageZoomOffsetY: 0,
      screenshotLayoutPresetId: "manual",
    });
  },
  setImageShadow: (partialShadow) => {
    set((state) => ({
      imageShadow: {
        ...state.imageShadow,
        ...partialShadow,
      },
    }));
  },
  setImageBorderEnabled: (enabled) => {
    set((state) => ({
      imageBorder: {
        ...state.imageBorder,
        enabled,
        preset: enabled && state.imageBorder.preset === "none"
          ? "solid"
          : state.imageBorder.preset,
      },
    }));
  },
  setImageBorderPreset: (preset) => {
    set((state) => ({
      imageBorder: {
        ...state.imageBorder,
        enabled: preset !== "none",
        preset,
      },
    }));
  },
  setImageBorderWidth: (width) => {
    set((state) => ({
      imageBorder: {
        ...state.imageBorder,
        width: clampValue(
          Math.round(width),
          BEAUTIFY_SETTING_LIMITS.imageBorderWidth.min,
          BEAUTIFY_SETTING_LIMITS.imageBorderWidth.max,
        ),
      },
    }));
  },
  setImageBorderColor: (color) => {
    set((state) => ({
      imageBorder: {
        ...state.imageBorder,
        color,
      },
    }));
  },
  toggleImageBorder: () => {
    set((state) => ({
      imageBorder: {
        ...state.imageBorder,
        enabled: state.imageBorder.preset === "none",
        preset: state.imageBorder.preset === "none" ? "solid" : "none",
      },
    }));
  },
  setImageZoom: (value) => {
    const clamped = Math.max(100, Math.min(400, Math.round(value)));
    if (clamped <= 100) {
      set((state) => ({
        imageZoom: 100,
        imageZoomOffsetX: 0,
        imageZoomOffsetY: 0,
        ...createManualLayoutPatch(
          state,
          state.imageZoom !== 100 ||
            state.imageZoomOffsetX !== 0 ||
            state.imageZoomOffsetY !== 0,
        ),
      }));
    } else {
      set((state) => {
        // Clamp offsets so the image stays within bounds at new zoom
        const maxOff = 1 - 1 / (clamped / 100);
        const nextZoomOffsetX = Math.max(
          -maxOff,
          Math.min(maxOff, state.imageZoomOffsetX),
        );
        const nextZoomOffsetY = Math.max(
          -maxOff,
          Math.min(maxOff, state.imageZoomOffsetY),
        );

        return {
          imageZoom: clamped,
          imageZoomOffsetX: nextZoomOffsetX,
          imageZoomOffsetY: nextZoomOffsetY,
          ...createManualLayoutPatch(
            state,
            clamped !== state.imageZoom ||
              nextZoomOffsetX !== state.imageZoomOffsetX ||
              nextZoomOffsetY !== state.imageZoomOffsetY,
          ),
        };
      });
    }
  },
  setImageZoomOffset: (offsetX, offsetY) => {
    set((state) => {
      const zoom = state.imageZoom / 100;
      if (zoom <= 1) return {};
      const maxOff = 1 - 1 / zoom;
      const nextZoomOffsetX = Math.max(-maxOff, Math.min(maxOff, offsetX));
      const nextZoomOffsetY = Math.max(-maxOff, Math.min(maxOff, offsetY));

      return {
        imageZoomOffsetX: nextZoomOffsetX,
        imageZoomOffsetY: nextZoomOffsetY,
        ...createManualLayoutPatch(
          state,
          nextZoomOffsetX !== state.imageZoomOffsetX ||
            nextZoomOffsetY !== state.imageZoomOffsetY,
        ),
      };
    });
  },
  resetImageZoom: () => {
    set((state) => ({
      imageZoom: 100,
      imageZoomOffsetX: 0,
      imageZoomOffsetY: 0,
      ...createManualLayoutPatch(
        state,
        state.imageZoom !== 100 ||
          state.imageZoomOffsetX !== 0 ||
          state.imageZoomOffsetY !== 0,
      ),
    }));
  },
  resetBeautifySettings: () => {
    set((state) => {
      revokeObjectUrl(state.customBackgroundImage);

      return {
        ...createDefaultBeautifySettings(),
        customBackgroundImage: null,
        lastBeautifyPresetId: null,
        screenshotLayoutPresetId: "manual",
      };
    });
  },
  toggleBrowserFrame: () => {
    set((state) => ({
      browserFrameEnabled: !state.browserFrameEnabled,
      deviceMockupId: "none",
      deviceMockupVariantId: null,
    }));
  },
  setBrowserFrameTheme: (theme) => {
    set({ browserFrameTheme: theme });
  },
  setBrowserFrameStyle: (style) => {
    set({ browserFrameStyle: style });
  },
  setBrowserFrameUrl: (url) => {
    set({ browserFrameUrl: url });
  },
  toggleBrowserFrameUrl: () => {
    set((state) => ({
      browserFrameShowUrl: !state.browserFrameShowUrl,
    }));
  },
  setBrowserFrameUrlBold: (enabled) => {
    set({ browserFrameUrlBold: enabled });
  },
  toggleBrowserFrameUrlBold: () => {
    set((state) => ({
      browserFrameUrlBold: !state.browserFrameUrlBold,
    }));
  },
  setDeviceMockup: (mockupId, variantId) => {
    if (mockupId === "none") {
      get().clearDeviceMockup();
      return;
    }

    if (mockupId === "browser") {
      set({
        browserFrameEnabled: true,
        deviceMockupId: "none",
        deviceMockupVariantId: null,
      });
      return;
    }

    const state = get();
    const activeScreenshot = getActiveScreenshot(state);

    if (!activeScreenshot || !isPhysicalDeviceMockup(mockupId)) {
      return;
    }

    const mockup = getDeviceMockup(mockupId);
    const isChangingModel = state.deviceMockupId !== mockup.id;
    const variant = getDeviceMockupVariant(
      mockup.id,
      variantId ?? (isChangingModel ? null : state.deviceMockupVariantId),
    );

    set({
      browserFrameEnabled: false,
      deviceMockupId: mockup.id,
      deviceMockupVariantId: variant.id,
      ...(isChangingModel
        ? {
            imageCrop: clampImageCrop(
              createCenteredCropForMockup(activeScreenshot.uploadedImage, mockup),
            ),
            imageScale: mockup.defaultScale,
            imageZoom: 100,
            imageZoomOffsetX: 0,
            imageZoomOffsetY: 0,
            screenshotLayoutPresetId: "manual" as const,
          }
        : {}),
    });
  },
  setDeviceMockupVariant: (variantId) => {
    const state = get();

    if (!isPhysicalDeviceMockup(state.deviceMockupId)) {
      return;
    }

    set({
      deviceMockupVariantId: getDeviceMockupVariant(
        state.deviceMockupId,
        variantId,
      ).id,
    });
  },
  clearDeviceMockup: () => {
    set({
      browserFrameEnabled: false,
      deviceMockupId: "none",
      deviceMockupVariantId: null,
    });
  },
  setShadowSceneEnabled: (enabled) => {
    set({ shadowSceneEnabled: enabled });
  },
  setShadowScenePreset: (presetId) => {
    set({
      shadowScenePresetId: presetId,
      shadowSceneEnabled: presetId !== "none",
    });
  },
  setShadowSceneOpacity: (opacity) => {
    set((state) => ({
      shadowSceneOpacity: clampValue(
        opacity,
        BEAUTIFY_SETTING_LIMITS.shadowSceneOpacity.min,
        BEAUTIFY_SETTING_LIMITS.shadowSceneOpacity.max,
      ),
      shadowSceneEnabled: state.shadowScenePresetId !== "none",
    }));
  },
  setShadowScenePlacement: (placement) => {
    set((state) => ({
      shadowScenePlacement: placement,
      shadowSceneEnabled: state.shadowScenePresetId !== "none",
    }));
  },
  toggleTextOverlay: () => {
    set((state) => ({
      textOverlayEnabled: !state.textOverlayEnabled,
    }));
  },
  setHeadlineText: (value) => {
    set({ headlineText: value });
  },
  setSubtitleText: (value) => {
    set({ subtitleText: value });
  },
  setBadgeText: (value) => {
    set({ badgeText: value });
  },
  addCustomTextLayer: () => {
    set((state) => {
      const customTextLayer = createCustomTextLayer(state);

      return {
        activeTextLayerId: customTextLayer.id,
        customTextLayers: [...state.customTextLayers, customTextLayer],
        textOverlayEnabled: true,
      };
    });
  },
  removeTextLayer: (layerId) => {
    if (layerId === "badge") {
      set({ activeTextLayerId: null, badgeText: "" });
      return;
    }

    if (layerId === "headline") {
      set({ activeTextLayerId: null, headlineText: "" });
      return;
    }

    if (layerId === "subtitle") {
      set({ activeTextLayerId: null, subtitleText: "" });
      return;
    }

    set((state) => ({
      activeTextLayerId:
        state.activeTextLayerId === layerId ? null : state.activeTextLayerId,
      customTextLayers: state.customTextLayers.filter(
        (layer) => layer.id !== layerId,
      ),
    }));
  },
  setCustomTextLayerText: (layerId, value) => {
    set((state) => ({
      customTextLayers: state.customTextLayers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              text: value,
            }
          : layer,
      ),
    }));
  },
  setActiveTextLayerId: (layerId) => {
    set({ activeTextLayerId: layerId });
  },
  setTextPosition: (position) => {
    set({
      badgeOffsetX: 0,
      badgeOffsetY: 0,
      headlineOffsetX: 0,
      headlineOffsetY: 0,
      subtitleOffsetX: 0,
      subtitleOffsetY: 0,
      textPosition: position,
    });
  },
  setTextAlign: (align) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textAlign: align }),
    );
  },
  setTextColor: (color) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textColor: color }),
    );
  },
  setTextFont: (fontId) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textFontId: fontId }),
    );
  },
  setTextFontWeight: (fontWeight) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textFontWeight: fontWeight }),
    );
  },
  setTextItalic: (enabled) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textItalic: enabled }),
    );
  },
  toggleTextItalic: () => {
    set((state) => ({
      ...createTextLayerStyleStatePatch(state, {
        textItalic: !getActiveTextLayerStyle(state).textItalic,
      }),
    }));
  },
  setTextUnderline: (enabled) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textUnderline: enabled }),
    );
  },
  toggleTextUnderline: () => {
    set((state) => ({
      ...createTextLayerStyleStatePatch(state, {
        textUnderline: !getActiveTextLayerStyle(state).textUnderline,
      }),
    }));
  },
  setTextLetterSpacing: (spacing) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textLetterSpacing: spacing }),
    );
  },
  setTextLineHeight: (lineHeight) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textLineHeight: lineHeight }),
    );
  },
  setTextOpacity: (opacity) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textOpacity: opacity }),
    );
  },
  setTextShadowEnabled: (enabled) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, { textShadowEnabled: enabled }),
    );
  },
  toggleTextShadow: () => {
    set((state) => ({
      ...createTextLayerStyleStatePatch(state, {
        textShadowEnabled: !getActiveTextLayerStyle(state).textShadowEnabled,
      }),
    }));
  },
  setTextShadowMode: (mode) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowEnabled: true,
        textShadowMode: mode,
        textShadowPresetId: "custom",
      }),
    );
  },
  applyTextShadowPreset: (presetId) => {
    set((state) =>
      createTextLayerStyleStatePatch(
        state,
        createTextShadowPresetSettings(presetId),
      ),
    );
  },
  setTextShadowColor: (color) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowColor: color,
        textShadowPresetId: "custom",
      }),
    );
  },
  setTextShadowBlur: (blur) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowBlur: blur,
        textShadowPresetId: "custom",
      }),
    );
  },
  setTextShadowOffset: (offsetX, offsetY) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowOffsetX: offsetX,
        textShadowOffsetY: offsetY,
        textShadowPresetId: "custom",
      }),
    );
  },
  setTextShadowOpacity: (opacity) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowOpacity: opacity,
        textShadowPresetId: "custom",
      }),
    );
  },
  setTextShadowDepth: (depth) => {
    set((state) =>
      createTextLayerStyleStatePatch(state, {
        textShadowDepth: depth,
        textShadowPresetId: "custom",
      }),
    );
  },
  setHeadlineSize: (size) => {
    set({ headlineSize: size });
  },
  setSubtitleSize: (size) => {
    set({ subtitleSize: size });
  },
  setBadgeSize: (size) => {
    set({ badgeSize: size });
  },
  setTextLayerSize: (layerId, size) => {
    if (!isDefaultTextLayerId(layerId)) {
      set((state) => ({
        customTextLayers: state.customTextLayers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                size,
              }
            : layer,
        ),
      }));
      return;
    }

    if (layerId === "headline") {
      set({ headlineSize: size });
      return;
    }

    if (layerId === "subtitle") {
      set({ subtitleSize: size });
      return;
    }

    set({ badgeSize: size });
  },
  setBadgeRotation: (rotation) => {
    set({ badgeRotation: rotation });
  },
  setHeadlineRotation: (rotation) => {
    set({ headlineRotation: rotation });
  },
  setSubtitleRotation: (rotation) => {
    set({ subtitleRotation: rotation });
  },
  setTextLayerRotation: (layerId, rotation) => {
    if (!isDefaultTextLayerId(layerId)) {
      set((state) => ({
        customTextLayers: state.customTextLayers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                rotation,
              }
            : layer,
        ),
      }));
      return;
    }

    const rotationKey = getTextLayerRotationKey(layerId);

    if (!rotationKey) {
      return;
    }

    set({
      [rotationKey]: rotation,
    });
  },
  setTextLayerPosition: (layerId, offsetX, offsetY) => {
    if (!isDefaultTextLayerId(layerId)) {
      set((state) => ({
        customTextLayers: state.customTextLayers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                offsetX: clampTextLayerOffset(offsetX),
                offsetY: clampTextLayerOffset(offsetY),
              }
            : layer,
        ),
      }));
      return;
    }

    const offsetKeys = getTextLayerOffsetKeys(layerId);

    if (!offsetKeys) {
      return;
    }

    set({
      [offsetKeys.x]: clampTextLayerOffset(offsetX),
      [offsetKeys.y]: clampTextLayerOffset(offsetY),
    });
  },
  setTextLayerBox: (layerId, box) => {
    const nextWidth = clampTextLayerWidth(box.width);
    const nextOffsetX = clampTextLayerOffset(box.offsetX);
    const nextOffsetY = clampTextLayerOffset(box.offsetY);

    if (!isDefaultTextLayerId(layerId)) {
      set((state) => ({
        customTextLayers: state.customTextLayers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                offsetX: nextOffsetX,
                offsetY: nextOffsetY,
                width: nextWidth,
              }
            : layer,
        ),
      }));
      return;
    }

    const offsetKeys = getTextLayerOffsetKeys(layerId);
    const widthKey = getTextLayerWidthKey(layerId);

    if (!offsetKeys || !widthKey) {
      return;
    }

    set({
      [offsetKeys.x]: nextOffsetX,
      [offsetKeys.y]: nextOffsetY,
      [widthKey]: nextWidth,
    });
  },
  setTextLayerWidth: (layerId, width) => {
    const nextWidth = clampTextLayerWidth(width);

    if (!isDefaultTextLayerId(layerId)) {
      set((state) => ({
        customTextLayers: state.customTextLayers.map((layer) =>
          layer.id === layerId
            ? {
                ...layer,
                width: nextWidth,
              }
            : layer,
        ),
      }));
      return;
    }

    const widthKey = getTextLayerWidthKey(layerId);

    if (!widthKey) {
      return;
    }

    set({
      [widthKey]: nextWidth,
    });
  },
  resetTextLayerPosition: (layerId) => {
    if (layerId) {
      if (!isDefaultTextLayerId(layerId)) {
        set((state) => ({
          customTextLayers: state.customTextLayers.map((layer) =>
            layer.id === layerId
              ? {
                  ...layer,
                  offsetX: 0,
                  offsetY: 0,
                }
              : layer,
          ),
        }));
        return;
      }

      const offsetKeys = getTextLayerOffsetKeys(layerId);

      if (!offsetKeys) {
        return;
      }

      set({
        [offsetKeys.x]: 0,
        [offsetKeys.y]: 0,
      });
      return;
    }

    set({
      badgeOffsetX: 0,
      badgeOffsetY: 0,
      headlineOffsetX: 0,
      headlineOffsetY: 0,
      subtitleOffsetX: 0,
      subtitleOffsetY: 0,
    });
  },
  toggleBadge: () => {
    set((state) => ({
      badgeEnabled: !state.badgeEnabled,
    }));
  },
  resetTextOverlaySettings: () => {
    set({
      ...createDefaultTextOverlaySettings(),
      activeTextLayerId: null,
    });
  },
  toggleTilt: () => {
    set((state) => ({
      tiltEnabled: !state.tiltEnabled,
      screenshotLayoutPresetId: "manual",
    }));
  },
  setTiltEnabled: (value) => {
    set({ tiltEnabled: value, screenshotLayoutPresetId: "manual" });
  },
  setTiltPreset: (presetId) => {
    set({
      ...createTiltPresetSettings(presetId),
      screenshotLayoutPresetId: "manual",
    });
  },
  setPerspective: (value) => {
    set({
      perspective: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  setRotateX: (value) => {
    set({
      rotateX: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  setRotateY: (value) => {
    set({
      rotateY: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  setRotateZ: (value) => {
    set({
      rotateZ: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  setTranslateY: (value) => {
    set({
      translateY: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  setTiltShadowMultiplier: (value) => {
    set({
      tiltShadowMultiplier: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
      screenshotLayoutPresetId: "manual",
    });
  },
  toggleHoverTilt: () => {
    set((state) => ({
      hoverTiltEnabled: !state.hoverTiltEnabled,
      tiltEnabled: !state.hoverTiltEnabled ? true : state.tiltEnabled,
      screenshotLayoutPresetId: "manual",
    }));
  },
  setHoverTiltEnabled: (value) => {
    set({
      hoverTiltEnabled: value,
      tiltEnabled: value ? true : get().tiltEnabled,
      screenshotLayoutPresetId: "manual",
    });
  },
  setHoverTiltSensitivity: (value) => {
    set({
      hoverTiltSensitivity: value,
      hoverTiltEnabled: true,
      tiltEnabled: true,
      screenshotLayoutPresetId: "manual",
    });
  },
  toggleBackgroundParallax: () => {
    set((state) => ({
      backgroundParallaxEnabled: !state.backgroundParallaxEnabled,
    }));
  },
  setBackgroundParallaxEnabled: (value) => {
    set({ backgroundParallaxEnabled: value });
  },
  setBackgroundParallaxStrength: (value) => {
    set({
      backgroundParallaxStrength: value,
      backgroundParallaxEnabled: true,
    });
  },
  resetTiltSettings: () => {
    set({
      ...createDefaultTiltSettings(),
      screenshotLayoutPresetId: "manual",
    });
  },
  setExportScale: (scale) => {
    set({ exportScale: scale });
  },
  setExportFileName: (name) => {
    set({ exportFileName: sanitizeFileName(name) });
  },
  setIsExporting: (value) => {
    set({ isExporting: value });
  },
  markExported: () => {
    set({ lastExportedAt: Date.now(), isExporting: false });
  },
  resetExportSettings: () => {
    set(createDefaultExportSettings());
  },
  resetActiveScreenshotDesign: () => {
    const state = get();
    const activeScreenshot = getActiveScreenshot(state);

    if (!activeScreenshot) {
      return;
    }

    revokeObjectUrl(state.customBackgroundImage);

    set({
      ...createDefaultBeautifySettings(),
      ...createDefaultBrowserFrameSettings(),
      ...createDefaultDeviceMockupSettings(),
      ...createDefaultTextOverlaySettings(),
      ...createDefaultTiltSettings(),
      ...createDefaultExportSettings(),
      activeTextLayerId: null,
      customBackgroundImage: null,
      exportFileName: createExportFileNameFromImage(
        activeScreenshot.uploadedImage,
      ),
      lastBeautifyPresetId: null,
      screenshotLayoutPresetId: "manual",
    });
  },
  resetEditorForNewUpload: () => {
    set((state) => {
      revokeObjectUrl(state.customBackgroundImage);

      return {
        ...createDefaultBeautifySettings(),
        ...createDefaultBrowserFrameSettings(),
        ...createDefaultDeviceMockupSettings(),
        ...createDefaultTextOverlaySettings(),
        ...createDefaultTiltSettings(),
        activeTextLayerId: null,
        customBackgroundImage: null,
        lastBeautifyPresetId: null,
        screenshotLayoutPresetId: "manual",
      };
    });
  },
}));

useEditorStore.subscribe((state, previousState) => {
  if (isApplyingHistoryStateChange || isSyncingActiveScreenshotSettings) {
    return;
  }

  if (didScreenshotLibraryChange(previousState, state)) {
    historyBatchDepth = 0;
    historyBatchStartSnapshot = null;
    isApplyingHistoryStateChange = true;
    try {
      useEditorStore.setState({
        historyPast: [],
        historyFuture: [],
      });
    } finally {
      isApplyingHistoryStateChange = false;
    }
    return;
  }

  if (historyBatchDepth === 0) {
    const previousHistorySnapshot = createHistorySnapshot(previousState);
    const nextHistorySnapshot = createHistorySnapshot(state);

    if (didHistorySnapshotChange(previousHistorySnapshot, nextHistorySnapshot)) {
      isApplyingHistoryStateChange = true;
      try {
        useEditorStore.setState({
          historyPast: [
            ...state.historyPast,
            previousHistorySnapshot,
          ].slice(-MAX_EDITOR_HISTORY_ENTRIES),
          historyFuture: [],
        });
      } finally {
        isApplyingHistoryStateChange = false;
      }
    }
  }

  if (
    !state.activeScreenshotId ||
    state.activeScreenshotId !== previousState.activeScreenshotId ||
    !didLayerSettingsChange(previousState, state)
  ) {
    return;
  }

  const activeScreenshotId = state.activeScreenshotId;
  const settings = getLayerSettingsPatchFromState(state);

  isSyncingActiveScreenshotSettings = true;
  useEditorStore.setState({
    screenshots: state.screenshots.map((screenshot) =>
      screenshot.id === activeScreenshotId
        ? {
            ...screenshot,
            settings: {
              ...screenshot.settings,
              ...settings,
              imageCrop: settings.imageCrop
                ? { ...settings.imageCrop }
                : screenshot.settings.imageCrop,
              imageShadow: settings.imageShadow
                ? { ...settings.imageShadow }
                : screenshot.settings.imageShadow,
            },
          }
        : screenshot,
    ),
  });
  isSyncingActiveScreenshotSettings = false;
});
