"use client";

import {
  FileImage,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import BackgroundControls from "@/components/editor/BackgroundControls";
import BeautifyPresetBar from "@/components/editor/BeautifyPresetBar";
import BrowserFrameControls from "@/components/editor/BrowserFrameControls";
import CanvasPresetSelector from "@/components/editor/CanvasPresetSelector";
import ImageStyleControls from "@/components/editor/ImageStyleControls";
import ResetControls from "@/components/editor/ResetControls";
import TextLayoutPresetSelector from "@/components/editor/TextLayoutPresetSelector";
import TextOverlayControls from "@/components/editor/TextOverlayControls";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/format-file-size";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { UploadedImage } from "@/store/editor-store";

type EditorSettingsPanelProps = {
  uploadedImage: UploadedImage | null;
};

type ImageInfoSectionProps = {
  uploadedImage: UploadedImage;
};

function getReadableFileType(type: string) {
  if (type === "image/jpeg") {
    return "JPEG";
  }

  return type.replace("image/", "").toUpperCase();
}

function ImageInfoSection({ uploadedImage }: ImageInfoSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const {
    clearError,
    clearUploadedImage,
    errorMessage,
    getInputProps,
    isUploading,
    open,
  } = useImageUpload();

  function handleRemoveImage() {
    clearError();
    clearUploadedImage();
    toast.success("Screenshot removed");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-200/70 py-5 dark:border-white/10"
    >
      <input
        {...getInputProps({
          "aria-label": "Replace screenshot image from settings panel",
        })}
      />

      <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <FileImage className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-normal text-emerald-600 dark:text-emerald-200">
              Screenshot loaded
            </p>
            <h3 className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">
              {uploadedImage.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-300">
              {uploadedImage.width} x {uploadedImage.height} px /{" "}
              {formatFileSize(uploadedImage.size)} /{" "}
              {getReadableFileType(uploadedImage.type)}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <motion.div
            whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isUploading}
              onClick={open}
              className="w-full border border-white/70 bg-white/85 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Replace
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
          >
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isUploading}
              onClick={handleRemoveImage}
              className="w-full border border-rose-200/80 bg-rose-50/70 text-rose-600 shadow-sm hover:bg-rose-50 hover:text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200 dark:hover:bg-rose-400/15"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Remove
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              role="alert"
              className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

function PanelHeader() {
  return (
    <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-slate-200/70 bg-white/80 px-5 py-5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:rounded-t-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Canvas controls
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EditorSettingsPanel({
  uploadedImage,
}: EditorSettingsPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, delay: 0.08, ease: "easeOut" }}
      className={cn(
        "rounded-3xl border border-white/60 bg-white/50 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/10",
        "lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:scroll-smooth",
      )}
    >
      <PanelHeader />

      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="canvas-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <ImageInfoSection uploadedImage={uploadedImage} />
            <BeautifyPresetBar />
            <CanvasPresetSelector />
            <BackgroundControls />
            <ImageStyleControls />
            <BrowserFrameControls />
            <TextLayoutPresetSelector />
            <TextOverlayControls />
            <ResetControls />
          </motion.div>
        ) : (
          <motion.div
            key="empty-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex min-h-[420px] items-center justify-center text-center"
          >
            <div className="max-w-[260px]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/10">
                <SlidersHorizontal
                  className="h-6 w-6 text-slate-400 dark:text-slate-300"
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                Upload a screenshot to customize it.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
