"use client";

import { create } from "zustand";

import { getBackgroundPreset } from "@/lib/background-presets";
import { createBeautifyPresetSettings } from "@/lib/beautify-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import {
  DEFAULT_BEAUTIFY_SETTINGS,
  DEFAULT_BROWSER_FRAME_SETTINGS,
  DEFAULT_TEXT_OVERLAY_SETTINGS,
  DEFAULT_TILT_SETTINGS,
} from "@/lib/editor-defaults";
import { createTiltPresetSettings } from "@/lib/tilt-presets";
import { getTextLayoutPreset } from "@/lib/text-layout-presets";
import type {
  BackgroundType,
  BeautifySettings,
  BrowserFrameSettings,
  BrowserFrameStyle,
  BrowserFrameTheme,
  ImageShadow,
  Phase3Settings,
  Phase4Settings,
  TextAlign,
  TextOverlaySettings,
  TextPosition,
  TiltSettings,
  UploadedImage,
} from "@/types/editor";

export type { UploadedImage } from "@/types/editor";

type EditorStore = BeautifySettings &
  Phase3Settings &
  Phase4Settings & {
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

function createTextLayoutPresetSettings(
  presetId: string,
): TextOverlaySettings {
  const preset = getTextLayoutPreset(presetId);

  return {
    textOverlayEnabled: true,
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

export const useEditorStore = create<EditorStore>((set, get) => ({
  uploadedImage: null,
  lastBeautifyPresetId: null,
  ...createDefaultBeautifySettings(),
  ...createDefaultBrowserFrameSettings(),
  ...createDefaultTextOverlaySettings(),
  ...createDefaultTiltSettings(),
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
    set({ textPosition: position });
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
  toggleBadge: () => {
    set((state) => ({
      badgeEnabled: !state.badgeEnabled,
    }));
  },
  applyTextLayoutPreset: (presetId) => {
    set(createTextLayoutPresetSettings(presetId));
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
}));
