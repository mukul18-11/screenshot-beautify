"use client";

import { create } from "zustand";

import { getBackgroundPreset } from "@/lib/background-presets";
import { createBeautifyPresetSettings } from "@/lib/beautify-presets";
import { getCanvasPreset } from "@/lib/canvas-presets";
import { DEFAULT_BEAUTIFY_SETTINGS } from "@/lib/editor-defaults";
import type {
  BackgroundType,
  BeautifySettings,
  ImageShadow,
  UploadedImage,
} from "@/types/editor";

export type { UploadedImage } from "@/types/editor";

type EditorStore = BeautifySettings & {
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
}));
