"use client";

import { Check, Image as ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

const DEFAULT_CUSTOM_COLOR = "#111827";

function getColorInputValue(backgroundValue: string, backgroundPresetId: string) {
  if (
    backgroundPresetId === "custom" &&
    /^#[0-9a-fA-F]{6}$/.test(backgroundValue)
  ) {
    return backgroundValue;
  }

  return DEFAULT_CUSTOM_COLOR;
}

export default function BackgroundControls() {
  const shouldReduceMotion = useReducedMotion();
  const backgroundPresetId = useEditorStore((state) => state.backgroundPresetId);
  const backgroundValue = useEditorStore((state) => state.backgroundValue);
  const setBackgroundPreset = useEditorStore(
    (state) => state.setBackgroundPreset,
  );
  const setSolidBackground = useEditorStore(
    (state) => state.setSolidBackground,
  );
  const colorInputValue = getColorInputValue(
    backgroundValue,
    backgroundPresetId,
  );
  const isCustomSelected = backgroundPresetId === "custom";

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
          Background
        </h3>
        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Pick a background that makes your screenshot pop.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {BACKGROUND_PRESETS.map((preset) => {
          const isSelected = backgroundPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              aria-label={`${preset.name} background`}
              aria-pressed={isSelected}
              onClick={() => setBackgroundPreset(preset.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:border-white dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-lg border shadow-sm",
                    isSelected
                      ? "border-white/25 dark:border-slate-950/15"
                      : "border-white/80 dark:border-white/10",
                  )}
                  style={{ background: preset.cssValue }}
                  aria-hidden="true"
                >
                  {preset.type === "image-blur" && (
                    <span className="absolute inset-1 flex items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm">
                      <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1 text-sm font-semibold leading-5">
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

      <div
        className={cn(
          "mt-3 rounded-xl border p-3 transition",
          isCustomSelected
            ? "border-slate-950 bg-white shadow-lg shadow-slate-950/10 dark:border-white dark:bg-white/15"
            : "border-slate-200 bg-white/60 shadow-sm dark:border-white/10 dark:bg-white/[0.06]",
        )}
      >
        <label
          htmlFor="custom-background-color"
          className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-100"
        >
          Custom color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="custom-background-color"
            type="color"
            value={colorInputValue}
            onChange={(event) => setSolidBackground(event.target.value)}
            className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:border-white/10 dark:bg-white/10 dark:focus-visible:ring-white/30"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Choose a solid canvas color.
            </p>
            <p className="mt-0.5 font-mono text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">
              {isCustomSelected ? backgroundValue : colorInputValue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
