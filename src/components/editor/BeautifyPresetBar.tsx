"use client";

import { Check, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  BEAUTIFY_PRESETS,
  createBeautifyPresetSettings,
} from "@/lib/beautify-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

function createPreviewShadow(blur: number, opacity: number, offsetY: number) {
  if (opacity <= 0 || blur <= 0) {
    return "none";
  }

  return `0 ${Math.max(4, offsetY / 3)}px ${Math.max(10, blur / 2)}px rgba(15, 23, 42, ${opacity})`;
}

export default function BeautifyPresetBar() {
  const shouldReduceMotion = useReducedMotion();
  const lastBeautifyPresetId = useEditorStore(
    (state) => state.lastBeautifyPresetId,
  );
  const applyBeautifyPreset = useEditorStore(
    (state) => state.applyBeautifyPreset,
  );

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Quick styles
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Start with a ready-made look, then fine-tune it.
        </p>
      </div>

      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex gap-2 px-1">
          {BEAUTIFY_PRESETS.map((preset) => {
            const settings = createBeautifyPresetSettings(preset.id);
            const isSelected = lastBeautifyPresetId === preset.id;
            const shadow = createPreviewShadow(
              settings.imageShadow.blur,
              settings.imageShadow.opacity,
              settings.imageShadow.offsetY,
            );

            return (
              <motion.button
                key={preset.id}
                type="button"
                whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                aria-label={`Apply ${preset.name} beautify style`}
                aria-pressed={isSelected}
                onClick={() => applyBeautifyPreset(preset.id)}
                className={cn(
                  "group min-w-[148px] rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                  isSelected
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
                )}
              >
                <div
                  className="relative mb-2 flex h-20 items-center justify-center overflow-hidden rounded-lg border border-white/70 dark:border-white/10"
                  style={{ background: settings.backgroundValue }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:18px_18px] opacity-35" />
                  <div
                    className={cn(
                      "relative h-11 w-20 bg-white/92 ring-1 ring-slate-950/5",
                      settings.imageBorderEnabled && "border border-white/80",
                    )}
                    style={{
                      borderRadius: `${Math.max(5, settings.imageRadius / 3)}px`,
                      boxShadow: shadow,
                      transform: `scale(${settings.imageScale / 100})`,
                    }}
                  >
                    <div className="h-2.5 rounded-t-[inherit] bg-slate-100" />
                    <div className="space-y-1.5 p-2">
                      <div className="h-1.5 w-12 rounded-full bg-slate-300" />
                      <div className="h-1.5 w-8 rounded-full bg-slate-200" />
                      <div className="h-1.5 w-14 rounded-full bg-slate-200" />
                    </div>
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
