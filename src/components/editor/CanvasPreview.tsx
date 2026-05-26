"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";

import { motion, useReducedMotion } from "motion/react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";

type CanvasPreviewProps = {
  isLoading?: boolean;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  uploadedImage?: UploadedImage | null;
};

export default function CanvasPreview({
  isLoading = false,
  onImageLoad,
  uploadedImage,
}: CanvasPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const previewBoundsRef = useRef<HTMLDivElement | null>(null);
  const [previewWidthPx, setPreviewWidthPx] = useState(0);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const aspectRatio = canvasWidth / canvasHeight;
  const previewScale = previewWidthPx > 0 ? previewWidthPx / canvasWidth : 0;

  useEffect(() => {
    const previewBounds = previewBoundsRef.current;

    if (!previewBounds) {
      return;
    }

    const updatePreviewWidth = (entry?: ResizeObserverEntry) => {
      const rect = entry?.contentRect ?? previewBounds.getBoundingClientRect();
      const nextWidth = Math.max(
        0,
        Math.min(rect.width, rect.height * aspectRatio, 1320),
      );

      setPreviewWidthPx((currentWidth) =>
        Math.abs(currentWidth - nextWidth) < 0.5 ? currentWidth : nextWidth,
      );
    };

    updatePreviewWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      updatePreviewWidth(entries[0]);
    });
    resizeObserver.observe(previewBounds);

    return () => {
      resizeObserver.disconnect();
    };
  }, [aspectRatio]);

  return (
    <motion.div
      ref={previewBoundsRef}
      initial={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : -8,
        scale: shouldReduceMotion ? 1 : 0.99,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-2 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-5"
    >
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl shadow-slate-950/20 ring-1 ring-slate-950/[0.06]"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          opacity: previewWidthPx > 0 ? 1 : 0,
          width: previewWidthPx > 0 ? `${previewWidthPx}px` : "100%",
        }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            height: `${canvasHeight}px`,
            opacity: previewScale > 0 ? 1 : 0,
            transform: `scale(${previewScale})`,
            transformOrigin: "top left",
            width: `${canvasWidth}px`,
          }}
        >
          <CanvasArtwork
            mode="preview"
            isLoading={isLoading}
            onImageLoad={onImageLoad}
            uploadedImage={uploadedImage}
            className="bg-white"
            style={{
              height: `${canvasHeight}px`,
              width: `${canvasWidth}px`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
