"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import CanvasPreview from "@/components/editor/CanvasPreview";
import ReplaceImageButton from "@/components/editor/ReplaceImageButton";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/store/editor-store";

type ImagePreviewProps = {
  isUploading?: boolean;
  onRemove?: () => void;
  onReplace?: () => void;
  uploadedImage: UploadedImage;
};

export default function ImagePreview({
  isUploading = false,
  onRemove,
  onReplace,
  uploadedImage,
}: ImagePreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loadedImageId, setLoadedImageId] = useState<string | null>(null);
  const isLoading = loadedImageId !== uploadedImage.id;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.97,
        y: shouldReduceMotion ? 0 : 14,
      }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.98,
        y: shouldReduceMotion ? 0 : -10,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86)_44%,rgba(255,247,237,0.92))] p-3 shadow-2xl shadow-slate-950/18 backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.86),rgba(30,41,59,0.72)_48%,rgba(17,24,39,0.86))] sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Screenshot loaded
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <ReplaceImageButton
              disabled={isUploading}
              onReplace={() => onReplace?.()}
            />
            <motion.div
              whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
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
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Remove image
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100/65 p-3 shadow-inner shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950/35 sm:min-h-[460px] sm:p-6">
          <CanvasPreview
            isLoading={isLoading}
            onImageLoad={() => setLoadedImageId(uploadedImage.id)}
            uploadedImage={uploadedImage}
          />

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-3 overflow-hidden rounded-2xl bg-slate-200/70 shadow-inner dark:bg-white/10 sm:inset-6"
              >
                <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-white/80 via-slate-100/80 to-white/50 dark:from-white/15 dark:via-white/10 dark:to-white/5" />
                {!shouldReduceMotion && (
                  <motion.div
                    animate={{ x: ["-120%", "120%"] }}
                    transition={{
                      duration: 1.3,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent dark:via-white/15"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2
                    className="h-6 w-6 animate-spin text-slate-500 dark:text-slate-300"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
