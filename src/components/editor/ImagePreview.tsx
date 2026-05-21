"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import CanvasPreview from "@/components/editor/CanvasPreview";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/store/editor-store";

type ImagePreviewProps = {
  isUploading?: boolean;
  onRemove?: () => void;
  onReplace?: () => void;
  toolbar?: ReactNode;
  uploadedImage: UploadedImage;
};

export default function ImagePreview({
  isUploading = false,
  onRemove,
  onReplace,
  toolbar,
  uploadedImage,
}: ImagePreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loadedImageId, setLoadedImageId] = useState<string | null>(null);
  const isLoading = loadedImageId !== uploadedImage.id;
  const handleImageLoad = () => {
    setLoadedImageId(uploadedImage.id);
  };

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.98,
        y: shouldReduceMotion ? 0 : -10,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full min-h-0 w-full flex-col"
    >
      <div className="shrink-0 px-2 pb-2 sm:px-3 lg:px-5">
        {toolbar ?? (
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-white/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Ready
            </div>

            <div className="flex items-center gap-1.5">
              <motion.div
                whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -1 }}
                whileTap={{
                  scale: shouldReduceMotion || isUploading ? 1 : 0.97,
                }}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={isUploading}
                  onClick={(event) => {
                    event.stopPropagation();
                    onReplace?.();
                  }}
                  className="h-8 gap-1.5 rounded-lg bg-white/70 px-2.5 text-xs text-[var(--editor-muted)] shadow-sm hover:bg-white hover:text-[var(--editor-ink)]"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  Replace
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -1 }}
                whileTap={{
                  scale: shouldReduceMotion || isUploading ? 1 : 0.97,
                }}
              >
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  aria-label="Remove screenshot image"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove?.();
                  }}
                  disabled={isUploading}
                  className="h-8 gap-1.5 rounded-lg bg-white/70 px-2.5 text-xs text-[var(--editor-soft)] shadow-sm hover:bg-white hover:text-rose-600"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                  Remove
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas directly - no wrapper card */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <CanvasPreview
          isLoading={isLoading}
          onImageLoad={handleImageLoad}
          uploadedImage={uploadedImage}
        />

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[rgba(238,243,248,0.82)] backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2
                  className="h-5 w-5 animate-spin text-slate-400"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-slate-400">Loading…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
