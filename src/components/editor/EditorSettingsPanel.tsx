"use client";

import {
  FileImage,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import BackgroundControls from "@/components/editor/BackgroundControls";
import BeautifyPresetBar from "@/components/editor/BeautifyPresetBar";
import BrowserFrameControls from "@/components/editor/BrowserFrameControls";
import CanvasPresetSelector from "@/components/editor/CanvasPresetSelector";
import ExportControls from "@/components/editor/ExportControls";
import ImageStyleControls from "@/components/editor/ImageStyleControls";
import ResetControls from "@/components/editor/ResetControls";
import TextOverlayControls from "@/components/editor/TextOverlayControls";
import TiltControls from "@/components/editor/TiltControls";
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
      className="border-b border-slate-100 pb-4 dark:border-white/8"
    >
      <input
        {...getInputProps({
          "aria-label": "Replace screenshot image from settings panel",
        })}
      />

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <FileImage className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold text-slate-800 dark:text-white">
            {uploadedImage.name}
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {uploadedImage.width}×{uploadedImage.height} ·{" "}
            {formatFileSize(uploadedImage.size)} ·{" "}
            {getReadableFileType(uploadedImage.type)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isUploading}
          onClick={open}
          className="h-7 gap-1.5 px-2 text-xs text-slate-500 hover:text-slate-800"
        >
          <RefreshCw className="h-3 w-3" aria-hidden="true" />
          Replace
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={isUploading}
          onClick={handleRemoveImage}
          className="h-7 gap-1.5 px-2 text-xs text-slate-400 hover:text-rose-600"
        >
          <Trash2 className="h-3 w-3" aria-hidden="true" />
          Remove
        </Button>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="alert"
            className="mt-2 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 dark:bg-rose-400/10 dark:text-rose-200"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
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
        "overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-950/[0.06]",
        "lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:scroll-smooth",
      )}
    >
      {/* Minimal header */}
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-sm">
        <h2 className="text-[13px] font-semibold text-slate-800">Settings</h2>
      </div>

      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="canvas-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="px-5 py-4"
          >
            <ImageInfoSection uploadedImage={uploadedImage} />
            <BeautifyPresetBar />
            <CanvasPresetSelector />
            <BackgroundControls />
            <ImageStyleControls />
            <BrowserFrameControls />
            <TextOverlayControls />
            <TiltControls />
            <ExportControls uploadedImage={uploadedImage} />
            <ResetControls />
          </motion.div>
        ) : (
          <motion.div
            key="empty-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="flex min-h-[360px] items-center justify-center px-5 text-center"
          >
            <div className="max-w-[220px]">
              <p className="text-sm text-slate-400">
                Upload a screenshot to start customizing.
              </p>
              <div className="mt-5 text-left">
                <ExportControls uploadedImage={uploadedImage} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
