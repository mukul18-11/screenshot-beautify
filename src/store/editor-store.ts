"use client";

import { create } from "zustand";

import { getBackgroundPreset } from "@/lib/background-presets";
import { createBeautifyPresetSettings } from "@/lib/beautify-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import {
  DEFAULT_BEAUTIFY_SETTINGS,
  DEFAULT_BROWSER_FRAME_SETTINGS,
  DEFAULT_EXPORT_SETTINGS,
  DEFAULT_TEMPLATE_SETTINGS,
  DEFAULT_TEXT_OVERLAY_SETTINGS,
  DEFAULT_TILT_SETTINGS,
} from "@/lib/editor-defaults";
import {
  createDesignTemplateSettings,
  getDesignTemplate,
} from "@/lib/design-templates";
import { sanitizeFileName } from "@/lib/export-utils";
import { createTiltPresetSettings } from "@/lib/tilt-presets";
import { getTextLayoutPreset } from "@/lib/text-layout-presets";
import type {
  BackgroundType,
  BeautifySettings,
  BrowserFrameSettings,
  BrowserFrameStyle,
  BrowserFrameTheme,
  ExportScale,
  ExportSettings,
  ImageShadow,
  Phase3Settings,
  Phase4Settings,
  Phase5Settings,
  Phase6Settings,
  TemplateSettings,
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
  Phase5Settings &
  Phase6Settings & {
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
    resetImagePosition: () => void;
    setImageShadow: (partialShadow: Partial<ImageShadow>) => void;
    setImageBorderEnabled: (enabled: boolean) => void;
    toggleImageBorder: () => void;
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
    applyTextLayoutPreset: (presetId: string) => void;
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
    applyDesignTemplate: (templateId: string) => void;
    setActiveTemplateId: (templateId: string | null) => void;
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

function createDefaultTemplateSettings(): TemplateSettings {
  return {
    ...DEFAULT_TEMPLATE_SETTINGS,
  };
}

function createTextLayoutPresetSettings(
  presetId: string,
  textOverlayEnabled: boolean,
): TextOverlaySettings {
  const preset = getTextLayoutPreset(presetId);

  return {
    textOverlayEnabled,
    headlineText: preset.headlineText,
    subtitleText: preset.subtitleText,
    badgeText: preset.badgeText,
    textLayoutPreset: preset.id,
    textPosition: preset.textPosition,
    textAlign: preset.textAlign,
    textColor: preset.textColor,
    headlineSize: preset.headlineSize,
    subtitleSize: preset.subtitleSize,
    badgeEnabled: preset.badgeEnabled,
    badgeOffsetX: preset.badgeOffsetX,
    badgeOffsetY: preset.badgeOffsetY,
    headlineOffsetX: preset.headlineOffsetX,
    headlineOffsetY: preset.headlineOffsetY,
    subtitleOffsetX: preset.subtitleOffsetX,
    subtitleOffsetY: preset.subtitleOffsetY,
  };
}

function clampOffset(value: number) {
  return Math.max(-1, Math.min(1, value));
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
  ...createDefaultTemplateSettings(),
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
      activeTemplateId: null,
      imageOffsetX: clampOffset(offsetX),
      imageOffsetY: clampOffset(offsetY),
    });
  },
  resetImagePosition: () => {
    set({
      imageOffsetX: 0,
      imageOffsetY: 0,
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
      textLayoutPreset: "custom",
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
      activeTemplateId: null,
      textLayoutPreset: "custom",
      [offsetKeys.x]: clampOffset(offsetX),
      [offsetKeys.y]: clampOffset(offsetY),
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
  applyTextLayoutPreset: (presetId) => {
    set(createTextLayoutPresetSettings(presetId, get().textOverlayEnabled));
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
      ...createDefaultTemplateSettings(),
      lastBeautifyPresetId: null,
    });
  },
  applyDesignTemplate: (templateId) => {
    const template = getDesignTemplate(templateId);

    set({
      ...createDesignTemplateSettings(template.id),
      activeTemplateId: template.id,
      lastAppliedTemplateId: template.id,
      lastBeautifyPresetId: null,
    });
  },
  setActiveTemplateId: (templateId) => {
    set({ activeTemplateId: templateId });
  },
}));
