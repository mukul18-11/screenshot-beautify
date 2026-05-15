"use client";

import { AlertCircle, CheckCircle2, ImageIcon, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import EmptyUploadState from "@/components/editor/EmptyUploadState";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/format-file-size";
import { cn } from "@/lib/utils";
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
    uploadedImage,
  } = useImageUpload();

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
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid w-full max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"
              >
                <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/25">
                  <img
                    src={uploadedImage.objectUrl}
                    alt={uploadedImage.name}
                    className="max-h-[460px] max-w-full rounded-xl object-contain shadow-2xl shadow-black/35"
                  />
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-slate-900/10 backdrop-blur-xl">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Screenshot ready
                  </p>
                  <h2 className="mt-2 break-words text-xl font-semibold text-slate-950">
                    {uploadedImage.name}
                  </h2>
                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p>
                      {uploadedImage.width} x {uploadedImage.height} px
                    </p>
                    <p>{formatFileSize(uploadedImage.size)}</p>
                    <p>{uploadedImage.type}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={open}
                      disabled={isUploading}
                      className="bg-slate-950 text-white hover:bg-slate-800"
                    >
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                      Replace screenshot
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearUploadedImage}
                      disabled={isUploading}
                      className="border-slate-200 bg-white/80"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Clear
                    </Button>
                  </div>
                </div>
              </motion.div>
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
