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
    <section className="border-b border-slate-100 py-4 dark:border-white/8">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-700 dark:text-white">
        Background
      </h3>

      {/* Compact color swatches grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {BACKGROUND_PRESETS.map((preset) => {
          const isSelected = backgroundPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              aria-label={`${preset.name} background`}
              aria-pressed={isSelected}
              onClick={() => setBackgroundPreset(preset.id)}
              className={cn(
                "group relative flex h-10 items-center justify-center overflow-hidden rounded-lg border transition",
                isSelected
                  ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
                  : "border-slate-200/60 hover:border-slate-300 dark:border-white/10",
              )}
              style={{ background: preset.cssValue }}
              title={preset.name}
            >
              {preset.type === "image-blur" && (
                <ImageIcon className="h-3.5 w-3.5 text-white/70" aria-hidden="true" />
              )}
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <Check className="h-3.5 w-3.5 text-white drop-shadow" aria-hidden="true" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Inline custom color picker */}
      <div className="mt-3 flex items-center gap-2.5">
        <input
          id="custom-background-color"
          type="color"
          value={colorInputValue}
          onChange={(event) => setSolidBackground(event.target.value)}
          className="h-8 w-10 shrink-0 cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5"
        />
        <div className="min-w-0">
          <span className="text-[12px] font-medium text-slate-500">Custom</span>
          <span className="ml-2 font-mono text-[11px] uppercase text-slate-400">
            {isCustomSelected ? backgroundValue : colorInputValue}
          </span>
        </div>
      </div>
    </section>
  );
}
