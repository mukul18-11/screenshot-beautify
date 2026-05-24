"use client";

import type { ReactNode } from "react";
import { CheckCircle2, RefreshCw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import CanvasPreview from "@/components/editor/CanvasPreview";
import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/store/editor-store";

type ImagePreviewProps = {
  isUploading?: boolean;
  onRemove?: () => void;
  onReplace?: () => void;
  toolbar?: ReactNode;
  uploadedImage?: UploadedImage | null;
};

export default function ImagePreview({
  isUploading = false,
  onRemove,
  onReplace,
  toolbar,
  uploadedImage,
}: ImagePreviewProps) {
  const shouldReduceMotion = useReducedMotion();

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
                  className="h-8 gap-1.5 rounded-lg bg-white/70 px-2.5 text-xs text-[var(--editor-muted)] shadow-sm hover:bg-white hover:text-[var(--editor-ink)] dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-400 dark:hover:text-white"
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
                  className="h-8 gap-1.5 rounded-lg bg-white/70 px-2.5 text-xs text-[var(--editor-soft)] shadow-sm hover:bg-white hover:text-rose-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-400 dark:hover:text-rose-400"
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
          isLoading={false}
          uploadedImage={uploadedImage}
        />
      </div>
    </motion.div>
  );
}
