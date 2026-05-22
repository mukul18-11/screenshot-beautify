"use client";

import { create } from "zustand";

import { getBackgroundPreset } from "@/lib/background-presets";
import { createBeautifyPresetSettings } from "@/lib/beautify-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import {
  DEFAULT_BEAUTIFY_SETTINGS,
  DEFAULT_BROWSER_FRAME_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_TEXT_OVERLAY_SETTINGS,
  DEFAULT_TILT_SETTINGS,
} from "@/lib/editor-defaults";
import {
  clampImageCrop,
  clampTextLayerOffset,
  clampUnitOffset,
} from "@/lib/editor-geometry";
import { sanitizeFileName } from "@/lib/export-utils";
import { createTextShadowPresetSettings } from "@/lib/text-effect-presets";
import { createTiltPresetSettings } from "@/lib/tilt-presets";
import type {
  BackgroundType,
  BeautifySettings,
  BrowserFrameSettings,
  BrowserFrameStyle,
  BrowserFrameTheme,
  EditorDesignSettings,
  ExportScale,
  ExportSettings,
  ImageCrop,
  ImageShadow,
  ScreenshotDesign,
  TextAlign,
  TextFontId,
  TextFontWeight,
  TextLayerId,
  TextOverlaySettings,
  TextPosition,
  TextShadowMode,
  TextShadowPresetId,
  TiltSettings,
  UploadedImage,
} from "@/types/editor";

export type { ScreenshotDesign, UploadedImage } from "@/types/editor";

export const MAX_SCREENSHOT_UPLOADS = 12;
const MAX_EDITOR_HISTORY_ENTRIES = 50;

type HistoryGlobalSettings = Pick<
  EditorDesignSettings,
  | "canvasPreset"
  | "canvasWidth"
  | "canvasHeight"
  | "backgroundType"
  | "backgroundValue"
  | "backgroundPresetId"
  | "imagePadding"
  | "textOverlayEnabled"
  | "headlineText"
  | "subtitleText"
  | "badgeText"
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
  | "badgeRotation"
  | "headlineRotation"
  | "subtitleRotation"
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
>;

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
  "badgeRotation",
  "headlineRotation",
  "subtitleRotation",
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
] as const satisfies readonly (keyof HistoryGlobalSettings)[];

type EditorStore = EditorDesignSettings & {
    historyPast: EditorHistorySnapshot[];
    historyFuture: EditorHistorySnapshot[];
    screenshots: ScreenshotDesign[];
    activeScreenshotId: string | null;
    uploadedImage: UploadedImage | null;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
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
    setSolidBackground: (color: string) => void;
    setImagePadding: (value: number) => void;
    setImageRadius: (value: number) => void;
    setImageScale: (value: number) => void;
    setImagePosition: (offsetX: number, offsetY: number) => void;
    setImageCrop: (crop: ImageCrop) => void;
    setImageTransform: (transform: {
      crop?: ImageCrop;
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }) => void;
    fitUploadedImage: (scale: number) => void;
    resetImagePosition: () => void;
    setImageShadow: (partialShadow: Partial<ImageShadow>) => void;
    setImageBorderEnabled: (enabled: boolean) => void;
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
    toggleTextOverlay: () => void;
    setHeadlineText: (value: string) => void;
    setSubtitleText: (value: string) => void;
    setBadgeText: (value: string) => void;
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
  };
}

function createDefaultBrowserFrameSettings(): BrowserFrameSettings {
  return {
    ...DEFAULT_BROWSER_FRAME_SETTINGS,
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

function createDefaultEditorDesignSettings(): EditorDesignSettings {
  return {
    ...createDefaultBeautifySettings(),
    ...createDefaultBrowserFrameSettings(),
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
    imagePadding: state.imagePadding,
    imageRadius: state.imageRadius,
    imageScale: state.imageScale,
    imageOffsetX: state.imageOffsetX,
    imageOffsetY: state.imageOffsetY,
    imageCrop: state.imageCrop,
    imageShadow: state.imageShadow,
    imageBorderEnabled: state.imageBorderEnabled,
    imageZoom: state.imageZoom,
    imageZoomOffsetX: state.imageZoomOffsetX,
    imageZoomOffsetY: state.imageZoomOffsetY,
    browserFrameEnabled: state.browserFrameEnabled,
    browserFrameTheme: state.browserFrameTheme,
    browserFrameStyle: state.browserFrameStyle,
    browserFrameUrl: state.browserFrameUrl,
    browserFrameShowUrl: state.browserFrameShowUrl,
    textOverlayEnabled: state.textOverlayEnabled,
    headlineText: state.headlineText,
    subtitleText: state.subtitleText,
    badgeText: state.badgeText,
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
    badgeRotation: state.badgeRotation,
    headlineRotation: state.headlineRotation,
    subtitleRotation: state.subtitleRotation,
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
    imagePadding: state.imagePadding,
    textOverlayEnabled: state.textOverlayEnabled,
    headlineText: state.headlineText,
    subtitleText: state.subtitleText,
    badgeText: state.badgeText,
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
    badgeRotation: state.badgeRotation,
    headlineRotation: state.headlineRotation,
    subtitleRotation: state.subtitleRotation,
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

function createLayerLayout(index: number, total: number) {
  if (total <= 1) {
    return { imageOffsetX: 0, imageOffsetY: 0, imageScale: 92 };
  }

  const columns = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / columns);
  const column = index % columns;
  const row = Math.floor(index / columns);
  const xSpread = total <= 2 ? 0.72 : total <= 4 ? 0.9 : 1.04;
  const ySpread = total <= 2 ? 0.28 : total <= 4 ? 0.72 : 0.86;
  const imageScale =
    total <= 2 ? 58 : total <= 4 ? 45 : total <= 6 ? 36 : total <= 9 ? 30 : 25;

  return {
    imageOffsetX:
      columns <= 1 ? 0 : (column / (columns - 1) - 0.5) * xSpread,
    imageOffsetY: rows <= 1 ? 0 : (row / (rows - 1) - 0.5) * ySpread,
    imageScale,
  };
}

function arrangeScreenshotLayers(screenshots: ScreenshotDesign[]) {
  if (!screenshots.length) {
    return screenshots;
  }

  const placedScreenshots = screenshots.filter(
    (screenshot) => screenshot.isPlaced,
  );
  let placedIndex = 0;

  return screenshots.map((screenshot) => {
    if (!screenshot.isPlaced) {
      return screenshot;
    }

    const layout = createLayerLayout(placedIndex, placedScreenshots.length);
    placedIndex += 1;

    return {
      ...screenshot,
      settings: {
        ...cloneEditorDesignSettings(screenshot.settings),
        ...layout,
      },
    };
  });
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

function getTextLayerOffsetKeys(layerId: TextLayerId) {
  return {
    x: `${layerId}OffsetX`,
    y: `${layerId}OffsetY`,
  } as const;
}

function getTextLayerRotationKey(layerId: TextLayerId) {
  return `${layerId}Rotation` as const;
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
    imageBorderEnabled: settings.imageBorderEnabled,
    imageZoom: settings.imageZoom,
    imageZoomOffsetX: settings.imageZoomOffsetX,
    imageZoomOffsetY: settings.imageZoomOffsetY,
    browserFrameEnabled: settings.browserFrameEnabled,
    browserFrameTheme: settings.browserFrameTheme,
    browserFrameStyle: settings.browserFrameStyle,
    browserFrameUrl: settings.browserFrameUrl,
    browserFrameShowUrl: settings.browserFrameShowUrl,
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
  "imageBorderEnabled",
  "browserFrameEnabled",
  "browserFrameTheme",
  "browserFrameStyle",
  "browserFrameUrl",
  "browserFrameShowUrl",
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
      settings,
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
  const currentGeometry = getCurrentScreenshotGeometry(currentState);
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

function didHistoryGlobalSettingsChange(
  previousSettings: HistoryGlobalSettings,
  nextSettings: HistoryGlobalSettings,
) {
  return HISTORY_GLOBAL_SETTING_KEYS.some(
    (key) => previousSettings[key] !== nextSettings[key],
  );
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
    previousSettings.imageShadow.offsetY !== nextSettings.imageShadow.offsetY
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
  "imageBorderEnabled",
  "imageZoom",
  "imageZoomOffsetX",
  "imageZoomOffsetY",
  "browserFrameEnabled",
  "browserFrameTheme",
  "browserFrameStyle",
  "browserFrameUrl",
  "browserFrameShowUrl",
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
  "badgeRotation",
  "headlineRotation",
  "subtitleRotation",
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
    previousState.imageShadow.offsetY !== nextState.imageShadow.offsetY
  ) {
    return true;
  }

  return LAYER_SCALAR_SETTING_KEYS.some(
    (key) => previousState[key] !== nextState[key],
  );
}

let isApplyingHistoryStateChange = false;
let isSyncingActiveScreenshotSettings = false;

export const useEditorStore = create<EditorStore>((set, get) => ({
  historyPast: [],
  historyFuture: [],
  screenshots: [],
  activeScreenshotId: null,
  uploadedImage: null,
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
        ? createLayerLayout(placedCount, placedCount + 1)
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
        uploadedImage: null,
      });
      return;
    }

    set({
      screenshots: nextScreenshots,
      activeScreenshotId: activeScreenshot.id,
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

    const shouldPlaceFirstImage = state.screenshots.length === 0;
    const sourceSettings = getEditorDesignSettingsFromState(state);
    const nextScreenshots = imagesToAdd.map((uploadedImage, index) =>
      createScreenshotDesign(
        uploadedImage,
        createSettingsForUploadedImage(uploadedImage, sourceSettings),
        shouldPlaceFirstImage && index === 0,
      ),
    );
    const mergedScreenshots = [
      ...state.screenshots,
      ...nextScreenshots,
    ];
    const arrangedScreenshots = shouldPlaceFirstImage
      ? arrangeScreenshotLayers(mergedScreenshots)
      : mergedScreenshots;
    const activeScreenshot = shouldPlaceFirstImage
      ? arrangedScreenshots.find(
          (screenshot) => screenshot.id === nextScreenshots[0]?.id,
        )
      : getActiveScreenshot({
          ...state,
          screenshots: arrangedScreenshots,
        });

    if (!activeScreenshot) {
      set({
        screenshots: arrangedScreenshots,
      });
      return;
    }

    set({
      screenshots: arrangedScreenshots,
      activeScreenshotId: activeScreenshot.id,
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
      set({
        screenshots: remainingScreenshots,
        activeScreenshotId: null,
        uploadedImage: null,
        ...createDefaultEditorDesignSettings(),
      });
      return;
    }

    if (!activeScreenshot) {
      set({
        screenshots: remainingScreenshots,
        activeScreenshotId: null,
        uploadedImage: null,
      });
      return;
    }

    set({
      screenshots: remainingScreenshots,
      activeScreenshotId: activeScreenshot.id,
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
    const screenshots = get().screenshots;

    if (!screenshots.length) {
      return;
    }

    screenshots.forEach((screenshot) => {
      revokeObjectUrl(screenshot.uploadedImage);
    });

    set({
      screenshots: [],
      activeScreenshotId: null,
      uploadedImage: null,
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
    set(getBackgroundState(presetId));
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
    set({ imageScale: value });
  },
  setImagePosition: (offsetX, offsetY) => {
    set({
      imageOffsetX: clampUnitOffset(offsetX),
      imageOffsetY: clampUnitOffset(offsetY),
    });
  },
  setImageCrop: (crop) => {
    set({
      imageCrop: clampImageCrop(crop),
    });
  },
  setImageTransform: ({ crop, offsetX, offsetY, scale }) => {
    set((state) => ({
      imageScale:
        typeof scale === "number" ? Math.round(scale) : state.imageScale,
      imageOffsetX:
        typeof offsetX === "number"
          ? clampUnitOffset(offsetX)
          : state.imageOffsetX,
      imageOffsetY:
        typeof offsetY === "number"
          ? clampUnitOffset(offsetY)
          : state.imageOffsetY,
      imageCrop: crop ? clampImageCrop(crop) : state.imageCrop,
    }));
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
    set({ imageBorderEnabled: enabled });
  },
  toggleImageBorder: () => {
    set((state) => ({
      imageBorderEnabled: !state.imageBorderEnabled,
    }));
  },
  setImageZoom: (value) => {
    const clamped = Math.max(100, Math.min(400, Math.round(value)));
    if (clamped <= 100) {
      set({ imageZoom: 100, imageZoomOffsetX: 0, imageZoomOffsetY: 0 });
    } else {
      set((state) => {
        // Clamp offsets so the image stays within bounds at new zoom
        const maxOff = 1 - 1 / (clamped / 100);
        return {
          imageZoom: clamped,
          imageZoomOffsetX: Math.max(-maxOff, Math.min(maxOff, state.imageZoomOffsetX)),
          imageZoomOffsetY: Math.max(-maxOff, Math.min(maxOff, state.imageZoomOffsetY)),
        };
      });
    }
  },
  setImageZoomOffset: (offsetX, offsetY) => {
    set((state) => {
      const zoom = state.imageZoom / 100;
      if (zoom <= 1) return {};
      const maxOff = 1 - 1 / zoom;
      return {
        imageZoomOffsetX: Math.max(-maxOff, Math.min(maxOff, offsetX)),
        imageZoomOffsetY: Math.max(-maxOff, Math.min(maxOff, offsetY)),
      };
    });
  },
  resetImageZoom: () => {
    set({ imageZoom: 100, imageZoomOffsetX: 0, imageZoomOffsetY: 0 });
  },
  resetBeautifySettings: () => {
    set({
      ...createDefaultBeautifySettings(),
      lastBeautifyPresetId: null,
    });
  },
  toggleBrowserFrame: () => {
    set((state) => ({
      browserFrameEnabled: !state.browserFrameEnabled,
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
    set({ textAlign: align });
  },
  setTextColor: (color) => {
    set({ textColor: color });
  },
  setTextFont: (fontId) => {
    set({ textFontId: fontId });
  },
  setTextFontWeight: (fontWeight) => {
    set({ textFontWeight: fontWeight });
  },
  setTextItalic: (enabled) => {
    set({ textItalic: enabled });
  },
  toggleTextItalic: () => {
    set((state) => ({
      textItalic: !state.textItalic,
    }));
  },
  setTextUnderline: (enabled) => {
    set({ textUnderline: enabled });
  },
  toggleTextUnderline: () => {
    set((state) => ({
      textUnderline: !state.textUnderline,
    }));
  },
  setTextLetterSpacing: (spacing) => {
    set({ textLetterSpacing: spacing });
  },
  setTextLineHeight: (lineHeight) => {
    set({ textLineHeight: lineHeight });
  },
  setTextOpacity: (opacity) => {
    set({ textOpacity: opacity });
  },
  setTextShadowEnabled: (enabled) => {
    set({ textShadowEnabled: enabled });
  },
  toggleTextShadow: () => {
    set((state) => ({
      textShadowEnabled: !state.textShadowEnabled,
    }));
  },
  setTextShadowMode: (mode) => {
    set({
      textShadowEnabled: true,
      textShadowMode: mode,
      textShadowPresetId: "custom",
    });
  },
  applyTextShadowPreset: (presetId) => {
    set(createTextShadowPresetSettings(presetId));
  },
  setTextShadowColor: (color) => {
    set({
      textShadowColor: color,
      textShadowPresetId: "custom",
    });
  },
  setTextShadowBlur: (blur) => {
    set({
      textShadowBlur: blur,
      textShadowPresetId: "custom",
    });
  },
  setTextShadowOffset: (offsetX, offsetY) => {
    set({
      textShadowOffsetX: offsetX,
      textShadowOffsetY: offsetY,
      textShadowPresetId: "custom",
    });
  },
  setTextShadowOpacity: (opacity) => {
    set({
      textShadowOpacity: opacity,
      textShadowPresetId: "custom",
    });
  },
  setTextShadowDepth: (depth) => {
    set({
      textShadowDepth: depth,
      textShadowPresetId: "custom",
    });
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
    set({
      [getTextLayerRotationKey(layerId)]: rotation,
    });
  },
  setTextLayerPosition: (layerId, offsetX, offsetY) => {
    const offsetKeys = getTextLayerOffsetKeys(layerId);

    set({
      [offsetKeys.x]: clampTextLayerOffset(offsetX),
      [offsetKeys.y]: clampTextLayerOffset(offsetY),
    });
  },
  resetTextLayerPosition: (layerId) => {
    if (layerId) {
      const offsetKeys = getTextLayerOffsetKeys(layerId);

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
    set(createDefaultTextOverlaySettings());
  },
  toggleTilt: () => {
    set((state) => ({
      tiltEnabled: !state.tiltEnabled,
    }));
  },
  setTiltEnabled: (value) => {
    set({ tiltEnabled: value });
  },
  setTiltPreset: (presetId) => {
    set(createTiltPresetSettings(presetId));
  },
  setPerspective: (value) => {
    set({ perspective: value, tiltEnabled: true, tiltPresetId: "custom" });
  },
  setRotateX: (value) => {
    set({ rotateX: value, tiltEnabled: true, tiltPresetId: "custom" });
  },
  setRotateY: (value) => {
    set({ rotateY: value, tiltEnabled: true, tiltPresetId: "custom" });
  },
  setRotateZ: (value) => {
    set({ rotateZ: value, tiltEnabled: true, tiltPresetId: "custom" });
  },
  setTranslateY: (value) => {
    set({ translateY: value, tiltEnabled: true, tiltPresetId: "custom" });
  },
  setTiltShadowMultiplier: (value) => {
    set({
      tiltShadowMultiplier: value,
      tiltEnabled: true,
      tiltPresetId: "custom",
    });
  },
  toggleHoverTilt: () => {
    set((state) => ({
      hoverTiltEnabled: !state.hoverTiltEnabled,
      tiltEnabled: !state.hoverTiltEnabled ? true : state.tiltEnabled,
    }));
  },
  setHoverTiltEnabled: (value) => {
    set({
      hoverTiltEnabled: value,
      tiltEnabled: value ? true : get().tiltEnabled,
    });
  },
  setHoverTiltSensitivity: (value) => {
    set({
      hoverTiltSensitivity: value,
      hoverTiltEnabled: true,
      tiltEnabled: true,
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
    set(createDefaultTiltSettings());
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
  resetEditorForNewUpload: () => {
    set({
      ...createDefaultBeautifySettings(),
      ...createDefaultBrowserFrameSettings(),
      ...createDefaultTextOverlaySettings(),
      ...createDefaultTiltSettings(),
      lastBeautifyPresetId: null,
    });
  },
}));

useEditorStore.subscribe((state, previousState) => {
  if (isApplyingHistoryStateChange || isSyncingActiveScreenshotSettings) {
    return;
  }

  if (didScreenshotLibraryChange(previousState, state)) {
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
