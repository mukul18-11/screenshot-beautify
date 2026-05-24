"use client";

import { Check } from "lucide-react";

import { TILT_PRESETS } from "@/lib/tilt-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

export default function TiltPresetSelector() {
  const tiltPresetId = useEditorStore((state) => state.tiltPresetId);
  const setTiltEnabled = useEditorStore((state) => state.setTiltEnabled);
  const setTiltPreset = useEditorStore((state) => state.setTiltPreset);

  function handlePresetClick(presetId: string) {
    setTiltEnabled(true);
    setTiltPreset(presetId);
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {TILT_PRESETS.map((preset) => {
        const isSelected = tiltPresetId === preset.id;

        return (
          <button
            key={preset.id}
            type="button"
            aria-label={`Apply ${preset.name} 3D tilt preset`}
            aria-pressed={isSelected}
            onClick={() => handlePresetClick(preset.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
              isSelected
                ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/25"
                : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10",
            )}
          >
            {isSelected && (
              <Check className="h-3 w-3" aria-hidden="true" />
            )}
            {preset.name}
          </button>
        );
      })}
    </div>
  );
}
