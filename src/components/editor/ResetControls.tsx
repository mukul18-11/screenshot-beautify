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
    settings.backgroundPatternId !==
      DEFAULT_BEAUTIFY_SETTINGS.backgroundPatternId ||
    settings.backgroundPatternColor !==
      DEFAULT_BEAUTIFY_SETTINGS.backgroundPatternColor ||
    settings.backgroundPatternIntensity !==
      DEFAULT_BEAUTIFY_SETTINGS.backgroundPatternIntensity ||
    settings.imagePadding !== DEFAULT_BEAUTIFY_SETTINGS.imagePadding ||
    settings.imageRadius !== DEFAULT_BEAUTIFY_SETTINGS.imageRadius ||
    settings.imageScale !== DEFAULT_BEAUTIFY_SETTINGS.imageScale ||
    settings.imageOffsetX !== DEFAULT_BEAUTIFY_SETTINGS.imageOffsetX ||
    settings.imageOffsetY !== DEFAULT_BEAUTIFY_SETTINGS.imageOffsetY ||
    settings.imageCrop.top !== DEFAULT_BEAUTIFY_SETTINGS.imageCrop.top ||
    settings.imageCrop.right !== DEFAULT_BEAUTIFY_SETTINGS.imageCrop.right ||
    settings.imageCrop.bottom !== DEFAULT_BEAUTIFY_SETTINGS.imageCrop.bottom ||
    settings.imageCrop.left !== DEFAULT_BEAUTIFY_SETTINGS.imageCrop.left ||
    settings.imageBorder.enabled !==
      DEFAULT_BEAUTIFY_SETTINGS.imageBorder.enabled ||
    settings.imageBorder.preset !==
      DEFAULT_BEAUTIFY_SETTINGS.imageBorder.preset ||
    settings.imageBorder.width !== DEFAULT_BEAUTIFY_SETTINGS.imageBorder.width ||
    settings.imageBorder.color !== DEFAULT_BEAUTIFY_SETTINGS.imageBorder.color ||
    settings.imageShadow.enabled !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.enabled ||
    settings.imageShadow.blur !== DEFAULT_BEAUTIFY_SETTINGS.imageShadow.blur ||
    settings.imageShadow.opacity !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.opacity ||
    settings.imageShadow.offsetY !==
      DEFAULT_BEAUTIFY_SETTINGS.imageShadow.offsetY
  );
}

export default function ResetControls() {
  const shouldReduceMotion = useReducedMotion();
  const resetBeautifySettings = useEditorStore(
    (state) => state.resetBeautifySettings,
  );
  const hasChanges = useEditorStore(hasBeautifyChanges);

  return (
    <motion.section
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="py-5"
    >
      <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <Frame className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Reset style
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
              Return canvas, background, and screenshot styling to the default
              look.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Screenshot stays loaded
          </div>
          <motion.div
            whileHover={{ y: shouldReduceMotion || !hasChanges ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion || !hasChanges ? 1 : 0.98 }}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!hasChanges}
              onClick={resetBeautifySettings}
              className="w-full border border-white/70 bg-white/85 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset style
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
