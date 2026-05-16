"use client";

import { Check, LayoutTemplate } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { TEXT_LAYOUT_PRESETS } from "@/lib/text-layout-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { TextAlign, TextPosition } from "@/types/editor";

function getPreviewPositionClass(textPosition: TextPosition) {
  if (textPosition === "bottom") {
    return "items-end justify-start";
  }

  if (textPosition === "left") {
    return "items-center justify-start";
  }

  if (textPosition === "right") {
    return "items-center justify-end";
  }

  if (textPosition === "center") {
    return "items-center justify-center";
  }

  return "items-start justify-start";
}

function getPreviewAlignClass(textAlign: TextAlign) {
  if (textAlign === "center") {
    return "mx-auto text-center";
  }

  if (textAlign === "right") {
    return "ml-auto text-right";
  }

  return "";
}

export default function TextLayoutPresetSelector() {
  const shouldReduceMotion = useReducedMotion();
  const textLayoutPreset = useEditorStore((state) => state.textLayoutPreset);
  const applyTextLayoutPreset = useEditorStore(
    (state) => state.applyTextLayoutPreset,
  );

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <LayoutTemplate className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Text layouts
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Start with a proven layout, then edit the copy.
        </p>
      </div>

      <div className="-mx-1 overflow-x-auto scroll-smooth pb-1">
        <div className="flex snap-x gap-2 px-1">
          {TEXT_LAYOUT_PRESETS.map((preset) => {
            const isSelected = textLayoutPreset === preset.id;

            return (
              <motion.button
                key={preset.id}
                type="button"
                whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                aria-label={`Apply ${preset.name} text layout`}
                aria-pressed={isSelected}
                onClick={() => applyTextLayoutPreset(preset.id)}
                className={cn(
                  "group min-w-[148px] snap-start rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                  isSelected
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
                )}
              >
                <div
                  className={cn(
                    "relative mb-2 flex h-20 overflow-hidden rounded-lg border p-2",
                    getPreviewPositionClass(preset.textPosition),
                    isSelected
                      ? "border-white/20 bg-white/10 dark:border-slate-950/10 dark:bg-slate-950/5"
                      : "border-slate-200 bg-slate-950 dark:border-white/10",
                  )}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_45%)]" />
                  <div
                    className={cn(
                      "relative space-y-1.5",
                      getPreviewAlignClass(preset.textAlign),
                    )}
                  >
                    {preset.badgeEnabled && (
                      <div className="h-2 w-10 rounded-full bg-white/60" />
                    )}
                    <div className="h-2 w-20 rounded-full bg-white/90" />
                    <div className="h-1.5 w-16 rounded-full bg-white/50" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold leading-5">
                    {preset.name}
                  </span>
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
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
