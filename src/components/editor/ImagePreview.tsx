"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ImageIcon, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import type { UploadedImage } from "@/store/editor-store";

type ImagePreviewProps = {
  isUploading?: boolean;
  onClear?: () => void;
  onReplace?: () => void;
  uploadedImage: UploadedImage;
};

export default function ImagePreview({
  isUploading = false,
  onClear,
  onReplace,
  uploadedImage,
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [uploadedImage.objectUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="w-full max-w-5xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(135deg,rgba(248,250,252,0.94),rgba(239,246,255,0.82)_45%,rgba(255,247,237,0.9))] p-3 shadow-2xl shadow-slate-950/18 backdrop-blur-xl sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-xl">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Screenshot loaded
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onReplace?.();
              }}
              disabled={isUploading}
              className="border border-white/70 bg-slate-950/90 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800"
            >
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
              Replace
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={(event) => {
                event.stopPropagation();
                onClear?.();
              }}
              disabled={isUploading}
              className="border-white/70 bg-white/85 text-slate-600 shadow-lg shadow-slate-950/10 hover:bg-white hover:text-slate-950"
              aria-label="Clear screenshot"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-[linear-gradient(45deg,rgba(226,232,240,0.45)_25%,transparent_25%),linear-gradient(-45deg,rgba(226,232,240,0.45)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(226,232,240,0.45)_75%),linear-gradient(-45deg,transparent_75%,rgba(226,232,240,0.45)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0] p-5 sm:min-h-[460px] sm:p-8">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-5 rounded-xl bg-slate-200/70 shadow-inner sm:inset-8"
              >
                <div className="h-full w-full animate-pulse rounded-xl bg-gradient-to-br from-white/80 via-slate-100/80 to-white/50" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.img
            key={uploadedImage.id}
            src={uploadedImage.objectUrl}
            alt={uploadedImage.name}
            onLoad={() => setIsLoading(false)}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: isLoading ? 0 : 1,
              scale: isLoading ? 0.96 : 1,
            }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative max-h-[58vh] max-w-full rounded-xl object-contain shadow-2xl shadow-slate-950/25 lg:max-h-[620px]"
          />
        </div>
      </div>
    </motion.div>
  );
}
