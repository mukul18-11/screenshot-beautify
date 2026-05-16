"use client";

import { motion, useReducedMotion } from "motion/react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";

type CanvasPreviewProps = {
  isLoading?: boolean;
  onImageLoad?: () => void;
  uploadedImage: UploadedImage;
};

export default function CanvasPreview({
  isLoading = false,
  onImageLoad,
  uploadedImage,
}: CanvasPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const aspectRatio = canvasWidth / canvasHeight;
  const previewWidth = `min(100%, 1040px, calc(70vh * ${aspectRatio}))`;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 12,
        scale: shouldReduceMotion ? 1 : 0.985,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : -8,
        scale: shouldReduceMotion ? 1 : 0.99,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex w-full items-center justify-center px-2 py-3 sm:px-4 sm:py-5"
    >
      <CanvasArtwork
        mode="preview"
        isLoading={isLoading}
        onImageLoad={onImageLoad}
        uploadedImage={uploadedImage}
        className="rounded-[1.75rem] border border-white/80 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-950/[0.03] dark:border-white/10 dark:bg-slate-950 dark:ring-white/10"
        style={{ width: previewWidth }}
      />
    </motion.div>
  );
}
