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
import { clampImageCrop, clampUnitOffset } from "@/lib/editor-geometry";
import { sanitizeFileName } from "@/lib/export-utils";
import { createTiltPresetSettings } from "@/lib/tilt-presets";
import type {
  BackgroundType,
  BeautifySettings,
  BrowserFrameSettings,
  BrowserFrameStyle,
  BrowserFrameTheme,
  ExportScale,
  ExportSettings,
  ImageCrop,
  ImageShadow,
  Phase3Settings,
  Phase4Settings,
  Phase5Settings,
  TextAlign,
  TextLayerId,
  TextOverlaySettings,
  TextPosition,
  TiltSettings,
  UploadedImage,
} from "@/types/editor";

export type { UploadedImage } from "@/types/editor";

type EditorStore = BeautifySettings &
  Phase3Settings &
  Phase4Settings &
  Phase5Settings & {
    uploadedImage: UploadedImage | null;
    lastBeautifyPresetId: string | null;
    setUploadedImage: (uploadedImage: UploadedImage | null) => void;
    clearUploadedImage: () => void;
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
    setHeadlineSize: (size: number) => void;
    setSubtitleSize: (size: number) => void;
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

export const useEditorStore = create<EditorStore>((set, get) => ({
  uploadedImage: null,
  lastBeautifyPresetId: null,
  ...createDefaultBeautifySettings(),
  ...createDefaultBrowserFrameSettings(),
  ...createDefaultTextOverlaySettings(),
  ...createDefaultTiltSettings(),
  ...createDefaultExportSettings(),
  setUploadedImage: (uploadedImage) => {
    const previousImage = get().uploadedImage;

    if (previousImage?.objectUrl !== uploadedImage?.objectUrl) {
      revokeObjectUrl(previousImage);
    }

    set({ uploadedImage });
  },
  clearUploadedImage: () => {
    if (!get().uploadedImage) {
      return;
    }

    get().setUploadedImage(null);
  },
  replaceUploadedImage: (uploadedImage) => {
    get().setUploadedImage(uploadedImage);
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
  setHeadlineSize: (size) => {
    set({ headlineSize: size });
  },
  setSubtitleSize: (size) => {
    set({ subtitleSize: size });
  },
  setTextLayerPosition: (layerId, offsetX, offsetY) => {
    const offsetKeys = getTextLayerOffsetKeys(layerId);

    set({
      [offsetKeys.x]: clampUnitOffset(offsetX),
      [offsetKeys.y]: clampUnitOffset(offsetY),
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
