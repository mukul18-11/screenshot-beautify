"use client";

import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import BackgroundControls from "@/components/editor/BackgroundControls";
import BeautifyPresetBar from "@/components/editor/BeautifyPresetBar";
import CanvasControls from "@/components/editor/CanvasControls";
import CanvasPresetSelector from "@/components/editor/CanvasPresetSelector";
import ImageMetaCard from "@/components/editor/ImageMetaCard";
import ImageStyleControls from "@/components/editor/ImageStyleControls";
import type { UploadedImage } from "@/store/editor-store";

type EditorSettingsPanelProps = {
  uploadedImage: UploadedImage | null;
};

export default function EditorSettingsPanel({
  uploadedImage,
}: EditorSettingsPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, delay: 0.08, ease: "easeOut" }}
      className="rounded-3xl border border-white/60 bg-white/50 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:self-start lg:overflow-y-auto"
    >
      <div className="flex items-center gap-3 border-b border-slate-200/70 pb-5 dark:border-white/10">
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

      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="canvas-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <BeautifyPresetBar />
            <CanvasPresetSelector />
            <BackgroundControls />
            <ImageStyleControls />
            <CanvasControls />
            <ImageMetaCard uploadedImage={uploadedImage} />
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
                Upload or paste a screenshot to start editing.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
