"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { CANVAS_PRESETS } from "@/lib/canvas-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

function getAspectPreviewSize(width: number, height: number) {
  const maxWidth = 34;
  const maxHeight = 28;
  const ratio = width / height;

  if (ratio >= maxWidth / maxHeight) {
    return {
      width: maxWidth,
      height: maxWidth / ratio,
    };
  }

  return {
    width: maxHeight * ratio,
    height: maxHeight,
  };
}

export default function CanvasPresetSelector() {
  const shouldReduceMotion = useReducedMotion();
  const canvasPreset = useEditorStore((state) => state.canvasPreset);
  const setCanvasPreset = useEditorStore((state) => state.setCanvasPreset);

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
          Canvas size
        </h3>
        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Choose where you want to post this screenshot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {CANVAS_PRESETS.map((preset) => {
          const isSelected = canvasPreset === preset.id;
          const previewSize = getAspectPreviewSize(preset.width, preset.height);

          return (
            <motion.button
              key={preset.id}
              type="button"
              layout
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              aria-pressed={isSelected}
              onClick={() => setCanvasPreset(preset.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                isSelected
                  ? "border-blue-500 bg-[linear-gradient(135deg,#2563eb,#14b8a6)] text-white shadow-lg shadow-blue-500/20"
                  : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border transition",
                    isSelected
                      ? "border-white/20 bg-white/10 dark:border-slate-950/10 dark:bg-slate-950/5"
                      : "border-slate-200 bg-slate-50 group-hover:bg-white dark:border-white/10 dark:bg-white/10",
                  )}
                  aria-hidden="true"
                >
                  <motion.span
                    layout
                    className={cn(
                      "block rounded-[3px] border",
                      isSelected
                        ? "border-white/80 bg-white/35 dark:border-slate-950/70 dark:bg-slate-950/20"
                        : "border-slate-400 bg-slate-200 dark:border-white/50 dark:bg-white/20",
                    )}
                    style={{
                      height: previewSize.height,
                      width: previewSize.width,
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-5">
                      {preset.name}
                    </p>
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white"
                      >
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </motion.span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      isSelected
                        ? "text-white/70 dark:text-slate-600"
                        : "text-slate-400 dark:text-slate-500",
                    )}
                  >
                    {preset.width} x {preset.height}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
