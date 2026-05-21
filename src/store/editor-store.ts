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

type EditorStore = EditorDesignSettings & {
    screenshots: ScreenshotDesign[];
    activeScreenshotId: string | null;
    uploadedImage: UploadedImage | null;
    selectScreenshot: (screenshotId: string) => void;
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
): ScreenshotDesign {
  return {
    id: `design-${uploadedImage.id}`,
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

  return screenshots.map((screenshot, index) => {
    const layout = createLayerLayout(index, screenshots.length);

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
      (screenshot) => screenshot.id === state.activeScreenshotId,
    ) ?? null
  );
}

function getNextActiveScreenshot(
  screenshots: ScreenshotDesign[],
  removedIndex: number,
) {
  return screenshots[removedIndex + 1] ?? screenshots[removedIndex - 1] ?? null;
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

export const useEditorStore = create<EditorStore>((set, get) => ({
  screenshots: [],
  activeScreenshotId: null,
  uploadedImage: null,
  ...createDefaultEditorDesignSettings(),
  selectScreenshot: (screenshotId) => {
    const screenshot = get().screenshots.find(
      (item) => item.id === screenshotId,
    );

    if (!screenshot || get().activeScreenshotId === screenshot.id) {
      return;
    }

    set({
      activeScreenshotId: screenshot.id,
      uploadedImage: screenshot.uploadedImage,
      ...getLayerSettingsPatch(screenshot.settings),
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

    const sourceSettings = getEditorDesignSettingsFromState(state);
    const nextScreenshots = imagesToAdd.map((uploadedImage) =>
      createScreenshotDesign(
        uploadedImage,
        createSettingsForUploadedImage(uploadedImage, sourceSettings),
      ),
    );
    const arrangedScreenshots = arrangeScreenshotLayers([
      ...state.screenshots,
      ...nextScreenshots,
    ]);
    const activeScreenshot = arrangedScreenshots[arrangedScreenshots.length - 1]!;

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

    if (!activeScreenshot) {
      set({
        screenshots: remainingScreenshots,
        activeScreenshotId: null,
        uploadedImage: null,
        ...createDefaultEditorDesignSettings(),
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

let isSyncingActiveScreenshotSettings = false;

useEditorStore.subscribe((state, previousState) => {
  if (
    isSyncingActiveScreenshotSettings ||
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
