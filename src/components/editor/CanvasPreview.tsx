"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";

import { motion, useReducedMotion } from "motion/react";

import CanvasArtwork from "@/components/editor/CanvasArtwork";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";

type CanvasPreviewProps = {
  isLoading?: boolean;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  uploadedImage: UploadedImage;
};

export default function CanvasPreview({
  isLoading = false,
  onImageLoad,
  uploadedImage,
}: CanvasPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const previewFrameRef = useRef<HTMLDivElement | null>(null);
  const [previewWidthPx, setPreviewWidthPx] = useState(0);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const aspectRatio = canvasWidth / canvasHeight;
  const previewWidth = `min(100%, 1040px, calc(70vh * ${aspectRatio}))`;
  const previewScale = previewWidthPx > 0 ? previewWidthPx / canvasWidth : 0;

  useEffect(() => {
    const previewFrame = previewFrameRef.current;

    if (!previewFrame) {
      return;
    }

    const updatePreviewWidth = () => {
      setPreviewWidthPx(previewFrame.getBoundingClientRect().width);
    };

    updatePreviewWidth();

    const resizeObserver = new ResizeObserver(updatePreviewWidth);
    resizeObserver.observe(previewFrame);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
      className="flex w-full items-center justify-center px-1 py-2 sm:px-3 sm:py-4"
    >
      <div
        ref={previewFrameRef}
        className="relative shadow-2xl shadow-slate-950/15 ring-1 ring-black/[0.04]"
        style={{
          aspectRatio: `${canvasWidth} / ${canvasHeight}`,
          width: previewWidth,
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
