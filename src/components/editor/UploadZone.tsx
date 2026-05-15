"use client";

import { useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import EmptyUploadState from "@/components/editor/EmptyUploadState";
import ImagePreview from "@/components/editor/ImagePreview";
import { cn } from "@/lib/utils";
import { useClipboardImage } from "@/hooks/useClipboardImage";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function UploadZone() {
  const {
    clearUploadedImage,
    errorMessage,
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
    isUploading,
    open,
    uploadFile,
    uploadedImage,
  } = useImageUpload();

  useClipboardImage({ uploadFile });

  const handleRemoveImage = useCallback(() => {
    clearUploadedImage();
    toast.success("Screenshot removed");
  }, [clearUploadedImage]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex w-full rounded-2xl border border-white/60 bg-white/45 p-4 shadow-soft backdrop-blur-2xl sm:p-5"
    >
      <motion.div
        {...getRootProps({
          "aria-label": "Screenshot upload area",
        })}
        whileHover={{
          borderColor: "rgba(15, 23, 42, 0.28)",
          backgroundColor: "rgba(255, 255, 255, 0.72)",
        }}
        transition={{ duration: 0.22 }}
        className={cn(
          "flex min-h-[520px] w-full cursor-default items-center justify-center rounded-2xl border-2 border-dashed border-slate-300/80 bg-white/45 p-6 outline-none transition-all duration-200 sm:p-10",
          isDragActive &&
            "scale-[1.005] border-cyan-400/80 bg-cyan-50/70 shadow-[0_0_0_8px_rgba(34,211,238,0.08)]",
          isDragAccept &&
            "border-emerald-400/90 bg-emerald-50/80 shadow-[0_0_0_10px_rgba(16,185,129,0.10)]",
          isDragReject &&
            "border-rose-400/90 bg-rose-50/80 shadow-[0_0_0_10px_rgba(244,63,94,0.10)]",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex w-full flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {uploadedImage ? (
              <ImagePreview
                key="uploaded"
                isUploading={isUploading}
                onRemove={handleRemoveImage}
                onReplace={open}
                uploadedImage={uploadedImage}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <EmptyUploadState isUploading={isUploading} onBrowse={open} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(errorMessage || isDragReject) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="inline-flex max-w-md items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {isDragReject
                    ? "Upload a PNG, JPEG, or WebP image under 10 MB."
                    : errorMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
