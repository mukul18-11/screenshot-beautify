"use client";

import { Frame, RotateCcw, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { DEFAULT_BEAUTIFY_SETTINGS } from "@/lib/editor-defaults";
import { useEditorStore } from "@/store/editor-store";

function hasBeautifyChanges(settings: ReturnType<typeof useEditorStore.getState>) {
  return (
    settings.canvasPreset !== DEFAULT_BEAUTIFY_SETTINGS.canvasPreset ||
    settings.canvasWidth !== DEFAULT_BEAUTIFY_SETTINGS.canvasWidth ||
    settings.canvasHeight !== DEFAULT_BEAUTIFY_SETTINGS.canvasHeight ||
    settings.backgroundType !== DEFAULT_BEAUTIFY_SETTINGS.backgroundType ||
    settings.backgroundValue !== DEFAULT_BEAUTIFY_SETTINGS.backgroundValue ||
    settings.backgroundPresetId !==
      DEFAULT_BEAUTIFY_SETTINGS.backgroundPresetId ||
    settings.imagePadding !== DEFAULT_BEAUTIFY_SETTINGS.imagePadding ||
    settings.imageRadius !== DEFAULT_BEAUTIFY_SETTINGS.imageRadius ||
    settings.imageScale !== DEFAULT_BEAUTIFY_SETTINGS.imageScale ||
    settings.imageBorderEnabled !==
      DEFAULT_BEAUTIFY_SETTINGS.imageBorderEnabled ||
    settings.imageShadow.enabled !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.enabled ||
    settings.imageShadow.blur !== DEFAULT_BEAUTIFY_SETTINGS.imageShadow.blur ||
    settings.imageShadow.opacity !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.opacity ||
    settings.imageShadow.offsetY !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.offsetY
  );
}

export default function CanvasControls() {
  const shouldReduceMotion = useReducedMotion();
  const resetBeautifySettings = useEditorStore(
    (state) => state.resetBeautifySettings,
  );
  const hasChanges = useEditorStore(hasBeautifyChanges);

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="pt-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
          <Frame className="h-4 w-4" aria-hidden="true" />
          Live canvas
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={!hasChanges}
          onClick={resetBeautifySettings}
          className="border border-white/70 bg-white/85 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset all
        </Button>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Local preview only
      </div>
    </motion.div>
  );
}
