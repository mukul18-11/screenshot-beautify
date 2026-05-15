"use client";

import { create } from "zustand";

export type UploadedImage = {
  id: string;
  file: File;
  objectUrl: string;
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  uploadedAt: number;
};

type EditorStore = {
  uploadedImage: UploadedImage | null;
  setUploadedImage: (uploadedImage: UploadedImage | null) => void;
  clearUploadedImage: () => void;
  replaceUploadedImage: (uploadedImage: UploadedImage) => void;
};

function revokeObjectUrl(uploadedImage: UploadedImage | null) {
  if (typeof URL === "undefined" || !uploadedImage?.objectUrl) {
    return;
  }

  URL.revokeObjectURL(uploadedImage.objectUrl);
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  uploadedImage: null,
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
}));
