"use client";

import { useCallback, type KeyboardEvent } from "react";
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
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="relative z-10 flex h-full min-h-0 w-full"
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
        animate={{ scale: isDragActive && !shouldReduceMotion ? 1.005 : 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn(
          "relative flex h-full min-h-[calc(100svh-4rem)] w-full cursor-default items-stretch justify-center overflow-hidden border border-dashed outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-slate-950/10",
          !uploadedImage
            ? "border-transparent bg-transparent p-4 sm:p-6 lg:p-8"
            : "border-transparent bg-transparent",
          isDragActive && "border-blue-500/60 bg-blue-50/50",
          isDragAccept && "border-emerald-500/60 bg-emerald-50/50",
          isDragReject && "border-rose-500/60 bg-rose-50/50",
        )}
      >
        <input
          {...getInputProps({
            "aria-label": "Browse for a screenshot image",
          })}
        />

        <div className="flex min-h-0 w-full flex-1 flex-col items-center">
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
                  "absolute left-0 right-0 top-4 z-10 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full px-4 py-2 text-center text-sm font-semibold shadow-lg backdrop-blur-xl",
                  dragState === "reject"
                    ? "bg-rose-50/90 text-rose-700"
                    : "bg-white/90 text-emerald-700",
                )}
              >
                {dragStateCopy}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false} mode="wait">
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
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex min-h-0 w-full flex-1"
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
                className="inline-flex max-w-md items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600"
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
