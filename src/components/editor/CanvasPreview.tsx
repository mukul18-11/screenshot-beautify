"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";

import { motion, useReducedMotion } from "motion/react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";

const MAX_PREVIEW_WIDTH = 1320;
const PREVIEW_GUTTER_PX = 32;

type CanvasPreviewProps = {
  artworkMode?: "preview" | "export";
  isLoading?: boolean;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  showFitBadge?: boolean;
  uploadedImage?: UploadedImage | null;
};

export default function CanvasPreview({
  artworkMode = "preview",
  isLoading = false,
  onImageLoad,
  showFitBadge = true,
  uploadedImage,
}: CanvasPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const previewBoundsRef = useRef<HTMLDivElement | null>(null);
  const [previewSize, setPreviewSize] = useState({
    height: 0,
    scale: 0,
    width: 0,
  });
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const previewScale = previewSize.scale;
  const zoomPercent = Math.max(1, Math.round(previewScale * 100));

  useEffect(() => {
    const previewBounds = previewBoundsRef.current;

    if (!previewBounds) {
      return;
    }

    const updatePreviewSize = (entry?: ResizeObserverEntry) => {
      const rect = entry?.contentRect ?? previewBounds.getBoundingClientRect();
      const availableWidth = Math.max(0, rect.width - PREVIEW_GUTTER_PX);
      const availableHeight = Math.max(0, rect.height - PREVIEW_GUTTER_PX);
      const fitScale = Math.min(
        availableWidth / canvasWidth,
        availableHeight / canvasHeight,
        MAX_PREVIEW_WIDTH / canvasWidth,
      );
      const nextScale = Number.isFinite(fitScale) ? Math.max(0, fitScale) : 0;
      const nextSize = {
        height: canvasHeight * nextScale,
        scale: nextScale,
        width: canvasWidth * nextScale,
      };

      setPreviewSize((currentSize) =>
        Math.abs(currentSize.width - nextSize.width) < 0.5 &&
        Math.abs(currentSize.height - nextSize.height) < 0.5
          ? currentSize
          : nextSize,
      );
    };

    updatePreviewSize();

    const resizeObserver = new ResizeObserver((entries) => {
      updatePreviewSize(entries[0]);
    });
    resizeObserver.observe(previewBounds);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasHeight, canvasWidth]);

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
      className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-2 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-5"
    >
      {showFitBadge && previewScale > 0 && (
        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white/80 shadow-lg shadow-slate-950/20 backdrop-blur-md">
          Fit {zoomPercent}%
        </div>
      )}
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl shadow-slate-950/20 ring-1 ring-slate-950/[0.06]"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          height: previewSize.height > 0 ? `${previewSize.height}px` : undefined,
          opacity: previewSize.width > 0 ? 1 : 0,
          width: previewSize.width > 0 ? `${previewSize.width}px` : "100%",
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
            mode={artworkMode}
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
