"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { buildTiltTransform } from "@/lib/tilt-utils";
import { TILT_PRESETS } from "@/lib/tilt-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

function TiltPresetPreview({
  isSelected,
  presetId,
}: {
  isSelected: boolean;
  presetId: string;
}) {
  const preset = TILT_PRESETS.find((tiltPreset) => tiltPreset.id === presetId);

  if (!preset) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative mb-2 flex h-[74px] items-center justify-center overflow-hidden rounded-lg border",
        isSelected
          ? "border-white/20 bg-white/10 dark:border-slate-950/10 dark:bg-slate-950/5"
          : "border-slate-200 bg-slate-950 dark:border-white/10",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />
      <div
        className="relative h-10 w-[76px] rounded-md bg-white shadow-lg shadow-slate-950/35 ring-1 ring-white/70"
        style={{
          transform: buildTiltTransform(preset),
          transformStyle: "preserve-3d",
        }}
      >
        <div className="h-2 rounded-t-md bg-slate-100" />
        <div className="space-y-1.5 p-2">
          <div className="h-1.5 w-11 rounded-full bg-slate-300" />
          <div className="h-1.5 w-14 rounded-full bg-slate-200" />
          <div className="h-1.5 w-8 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default function TiltPresetSelector() {
  const shouldReduceMotion = useReducedMotion();
  const tiltPresetId = useEditorStore((state) => state.tiltPresetId);
  const setTiltEnabled = useEditorStore((state) => state.setTiltEnabled);
  const setTiltPreset = useEditorStore((state) => state.setTiltPreset);

  function handlePresetClick(presetId: string) {
    setTiltEnabled(true);
    setTiltPreset(presetId);
  }

  return (
    <div className="-mx-1 overflow-x-auto scroll-smooth pb-1">
      <div className="flex snap-x gap-2 px-1">
        {TILT_PRESETS.map((preset) => {
          const isSelected = tiltPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              aria-label={`Apply ${preset.name} 3D tilt preset`}
              aria-pressed={isSelected}
              onClick={() => handlePresetClick(preset.id)}
              className={cn(
                "group min-h-[160px] w-[168px] shrink-0 snap-start rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                isSelected
                  ? "border-blue-500 bg-[linear-gradient(135deg,#2563eb,#14b8a6)] text-white shadow-lg shadow-blue-500/20"
                  : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
              )}
            >
              <TiltPresetPreview
                isSelected={isSelected}
                presetId={preset.id}
              />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold leading-5">
                    {preset.name}
                  </span>
                  <span
                    className={cn(
                      "mt-1 line-clamp-2 block text-xs leading-4",
                      isSelected
                        ? "text-white/70 dark:text-slate-600"
                        : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {preset.description}
                  </span>
                </div>
                {isSelected && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white"
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
  );
}
