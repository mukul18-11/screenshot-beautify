"use client";

import {
  FileImage,
  RefreshCw,
  ShieldCheck,
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

      <div className="flex items-center gap-3 rounded-xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] p-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <FileImage className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold text-[var(--editor-ink)] dark:text-white">
            {uploadedImage.name}
          </h3>
          <p className="text-[11px] text-[var(--editor-muted)] dark:text-slate-500">
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
          className="h-7 gap-1.5 px-2 text-xs text-[var(--editor-muted)] hover:text-[var(--editor-ink)]"
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
          className="h-7 gap-1.5 px-2 text-xs text-[var(--editor-soft)] hover:text-rose-600"
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

function EmptySettingsContent() {
  return (
    <motion.div
      key="empty-settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="flex min-h-[260px] items-center justify-center px-5 py-4 lg:h-[calc(100%-3rem)] lg:min-h-0"
    >
      <div className="w-full rounded-2xl border border-[var(--editor-border)] bg-[var(--editor-panel-muted)] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--editor-ink)] shadow-sm">
            <FileImage className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--editor-ink)]">
              No screenshot yet
            </h3>
            <p className="mt-1 text-xs leading-5 text-[var(--editor-muted)]">
              Drop one on the canvas, click the upload target, or paste from
              clipboard.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-xs font-medium text-[var(--editor-muted)]">
          <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
            <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
            PNG, JPG, or WebP up to 10 MB
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
            <ShieldCheck
              className="h-3.5 w-3.5 text-emerald-600"
              aria-hidden="true"
            />
            Files stay in your browser
          </div>
        </div>
      </div>
    </motion.div>
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
        "mx-4 mb-4 overflow-hidden rounded-2xl border border-[var(--editor-border)] bg-[var(--editor-panel)] shadow-xl shadow-slate-950/[0.06]",
        "lg:m-0 lg:h-[calc(100svh-3.5rem)] lg:self-stretch lg:rounded-none lg:border-y-0 lg:border-r-0 lg:shadow-none",
      )}
    >
      {/* Minimal header */}
      <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-[var(--editor-border)] bg-white/95 px-5 backdrop-blur-sm">
        <h2 className="text-[13px] font-semibold text-[var(--editor-ink)]">
          Settings
        </h2>
        <span className="rounded-full bg-[var(--editor-accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-normal text-[var(--editor-accent)]">
          Design
        </span>
      </div>

      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="canvas-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="h-[calc(100%-3rem)] overflow-y-auto overscroll-contain px-5 py-4"
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
          <EmptySettingsContent />
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
