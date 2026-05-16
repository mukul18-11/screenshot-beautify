"use client";

import { useCallback, useEffect, type KeyboardEvent } from "react";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import EmptyUploadState from "@/components/editor/EmptyUploadState";
import ImagePreview from "@/components/editor/ImagePreview";
import { cn } from "@/lib/utils";
import { useClipboardImage } from "@/hooks/useClipboardImage";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function UploadZone() {
  const shouldReduceMotion = useReducedMotion();
  const {
    clearUploadedImage,
    clearError,
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
    clearError();
    clearUploadedImage();
    toast.success("Screenshot removed");
  }, [clearError, clearUploadedImage]);

  useEffect(() => {
    return () => {
      clearUploadedImage();
    };
  }, [clearUploadedImage]);

  const handleRootKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (isUploading) {
        return;
      }

      event.preventDefault();
      open();
    },
    [isUploading, open],
  );

  const dragState = isDragReject ? "reject" : isDragAccept ? "accept" : "idle";
  const dragStateCopy =
    dragState === "reject"
      ? "Only PNG, JPG, or WebP supported"
      : "Drop to upload";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="group flex w-full rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-3 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-5"
    >
      <motion.div
        {...getRootProps({
          "aria-describedby": errorMessage || isDragReject
            ? "upload-helper-text upload-error"
            : "upload-helper-text",
          "aria-disabled": isUploading,
          "aria-invalid": Boolean(errorMessage || isDragReject),
          "aria-label": "Screenshot upload area",
          onKeyDown: handleRootKeyDown,
          role: "group",
          tabIndex: 0,
        })}
        animate={{ scale: isDragActive && !shouldReduceMotion ? 1.01 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn(
          "relative flex min-h-[480px] w-full cursor-default items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-slate-300/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(240,253,250,0.58)_42%,rgba(238,242,255,0.68))] p-4 outline-none transition-colors duration-200 hover:border-indigo-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/25 focus-visible:ring-offset-2 sm:min-h-[540px] sm:p-10",
          isDragActive &&
            "border-cyan-400/80 bg-cyan-50/75 shadow-[0_0_0_8px_rgba(34,211,238,0.08),0_26px_80px_-42px_rgba(8,47,73,0.55)]",
          isDragAccept &&
            "border-emerald-400/90 bg-emerald-50/80 shadow-[0_0_0_10px_rgba(16,185,129,0.12),0_28px_90px_-44px_rgba(6,95,70,0.6)]",
          isDragReject &&
            "border-rose-400/90 bg-rose-50/80 shadow-[0_0_0_10px_rgba(244,63,94,0.10)]",
        )}
      >
        <input
          {...getInputProps({
            "aria-label": "Browse for a screenshot image",
          })}
        />

        <div className="flex w-full flex-col items-center gap-6">
          <p id="upload-helper-text" className="sr-only">
            Upload, drop, or paste a PNG, JPG, or WebP screenshot up to 10 MB.
          </p>

          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "absolute left-0 right-0 top-5 z-10 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border px-4 py-2 text-center text-sm font-semibold shadow-lg backdrop-blur-xl",
                  dragState === "reject"
                    ? "border-rose-200 bg-rose-50/90 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/15 dark:text-rose-200"
                    : "border-emerald-200 bg-white/90 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/15 dark:text-emerald-100",
                )}
              >
                {dragStateCopy}
              </motion.div>
            )}
          </AnimatePresence>

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
                <EmptyUploadState
                  dragState={dragState}
                  isUploading={isUploading}
                  onBrowse={open}
                />
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
                id="upload-error"
                role="alert"
                aria-live="assertive"
                className="inline-flex max-w-md items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-sm dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
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
