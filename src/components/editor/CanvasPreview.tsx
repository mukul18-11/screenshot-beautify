"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { createImageShadowCss } from "@/lib/editor-defaults";
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
  const backgroundValue = useEditorStore((state) => state.backgroundValue);
  const imagePadding = useEditorStore((state) => state.imagePadding);
  const imageRadius = useEditorStore((state) => state.imageRadius);
  const imageScale = useEditorStore((state) => state.imageScale);
  const imageShadow = useEditorStore((state) => state.imageShadow);
  const imageBorderEnabled = useEditorStore(
    (state) => state.imageBorderEnabled,
  );
  const aspectRatio = canvasWidth / canvasHeight;
  const previewWidth = `min(100%, 1040px, calc(70vh * ${aspectRatio}))`;
  const paddingPercent =
    (imagePadding / Math.min(canvasWidth, canvasHeight)) * 100;
  const screenshotScale = imageScale / 100;
  const screenshotShadow = createImageShadowCss(imageShadow);

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
      <motion.div
        layout
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-2xl shadow-slate-950/20 ring-1 ring-slate-950/[0.03] dark:border-white/10 dark:bg-slate-950 dark:ring-white/10"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          width: previewWidth,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundValue}
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ background: backgroundValue }}
          />
        </AnimatePresence>

        <div
          className="absolute inset-0 opacity-25 mix-blend-soft-light"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <motion.div
          layout
          className="relative flex h-full w-full items-center justify-center"
          style={{ padding: `${paddingPercent}%` }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={uploadedImage.id}
              src={uploadedImage.objectUrl}
              alt={uploadedImage.name}
              onLoad={onImageLoad}
              initial={{
                opacity: 0,
                scale: shouldReduceMotion
                  ? screenshotScale
                  : screenshotScale * 0.96,
              }}
              animate={{
                opacity: isLoading ? 0 : 1,
                scale:
                  isLoading && !shouldReduceMotion
                    ? screenshotScale * 0.98
                    : screenshotScale,
              }}
              exit={{
                opacity: 0,
                scale: shouldReduceMotion
                  ? screenshotScale
                  : screenshotScale * 0.98,
              }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="max-h-full max-w-full object-contain"
              style={{
                border: imageBorderEnabled
                  ? "1px solid rgba(255, 255, 255, 0.72)"
                  : "none",
                borderRadius: `${imageRadius}px`,
                boxShadow: screenshotShadow,
              }}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
