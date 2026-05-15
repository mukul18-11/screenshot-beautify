"use client";

import type { LucideIcon } from "lucide-react";
import {
  Box,
  Frame,
  Palette,
  RotateCcw,
  Scaling,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import {
  BEAUTIFY_SETTING_LIMITS,
  DEFAULT_BEAUTIFY_SETTINGS,
} from "@/lib/editor-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ImageShadow } from "@/types/editor";

type ControlSectionProps = {
  children: React.ReactNode;
  icon: LucideIcon;
  title: string;
};

type SliderControlProps = {
  disabled?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  onReset: () => void;
  step: number;
  suffix: string;
  value: number;
};

function ControlSection({ children, icon: Icon, title }: ControlSectionProps) {
  return (
    <section className="border-b border-slate-200/70 py-5 last:border-b-0 dark:border-white/10">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function SliderControl({
  disabled = false,
  label,
  max,
  min,
  onChange,
  onReset,
  step,
  suffix,
  value,
}: SliderControlProps) {
  const inputId = `${label.toLowerCase().replace(/\s+/g, "-")}-control`;

  return (
    <div className={cn("space-y-2", disabled && "opacity-50")}>
      <div className="flex items-center justify-between gap-3">
        <label
          className="text-sm font-medium text-slate-600 dark:text-slate-300"
          htmlFor={inputId}
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="min-w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
            {value}
            {suffix}
          </span>
          <button
            type="button"
            aria-label={`Reset ${label}`}
            disabled={disabled}
            onClick={onReset}
            title={`Reset ${label}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/30"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-slate-950 disabled:cursor-not-allowed dark:accent-white"
      />
    </div>
  );
}

const SHADOW_PRESETS: Array<{
  id: string;
  label: string;
  value: ImageShadow;
}> = [
  {
    id: "none",
    label: "None",
    value: {
      enabled: false,
      blur: 0,
      opacity: 0,
      offsetY: 0,
    },
  },
  {
    id: "soft",
    label: "Soft",
    value: {
      enabled: true,
      blur: 48,
      opacity: 0.22,
      offsetY: 18,
    },
  },
  {
    id: "deep",
    label: "Deep",
    value: {
      enabled: true,
      blur: 84,
      opacity: 0.34,
      offsetY: 34,
    },
  },
  {
    id: "lifted",
    label: "Lifted",
    value: {
      enabled: true,
      blur: 64,
      opacity: 0.28,
      offsetY: 24,
    },
  },
];

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
  const backgroundPresetId = useEditorStore((state) => state.backgroundPresetId);
  const imagePadding = useEditorStore((state) => state.imagePadding);
  const imageRadius = useEditorStore((state) => state.imageRadius);
  const imageScale = useEditorStore((state) => state.imageScale);
  const imageShadow = useEditorStore((state) => state.imageShadow);
  const setBackgroundPreset = useEditorStore(
    (state) => state.setBackgroundPreset,
  );
  const setImagePadding = useEditorStore((state) => state.setImagePadding);
  const setImageRadius = useEditorStore((state) => state.setImageRadius);
  const setImageScale = useEditorStore((state) => state.setImageScale);
  const setImageShadow = useEditorStore((state) => state.setImageShadow);
  const resetBeautifySettings = useEditorStore(
    (state) => state.resetBeautifySettings,
  );
  const hasChanges = useEditorStore(hasBeautifyChanges);

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.26, ease: "easeOut" }}
      className="pt-1"
    >
      <ControlSection icon={Palette} title="Background">
        <div className="grid grid-cols-2 gap-2">
          {BACKGROUND_PRESETS.map((preset) => {
            const isSelected = backgroundPresetId === preset.id;

            return (
              <motion.button
                key={preset.id}
                type="button"
                whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                aria-label={`${preset.name} background`}
                aria-pressed={isSelected}
                onClick={() => setBackgroundPreset(preset.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                  isSelected
                    ? "border-slate-950 bg-white shadow-lg shadow-slate-950/10 dark:border-white dark:bg-white/15"
                    : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/10",
                )}
              >
                <span
                  className="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-white/80 shadow-sm dark:border-white/10"
                  style={{ background: preset.cssValue }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                  {preset.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </ControlSection>

      <ControlSection icon={Scaling} title="Screenshot">
        <div className="space-y-5">
          <SliderControl
            label="Padding"
            min={BEAUTIFY_SETTING_LIMITS.imagePadding.min}
            max={BEAUTIFY_SETTING_LIMITS.imagePadding.max}
            step={BEAUTIFY_SETTING_LIMITS.imagePadding.step}
            value={imagePadding}
            suffix="px"
            onChange={setImagePadding}
            onReset={() =>
              setImagePadding(DEFAULT_BEAUTIFY_SETTINGS.imagePadding)
            }
          />
          <SliderControl
            label="Radius"
            min={BEAUTIFY_SETTING_LIMITS.imageRadius.min}
            max={BEAUTIFY_SETTING_LIMITS.imageRadius.max}
            step={BEAUTIFY_SETTING_LIMITS.imageRadius.step}
            value={imageRadius}
            suffix="px"
            onChange={setImageRadius}
            onReset={() =>
              setImageRadius(DEFAULT_BEAUTIFY_SETTINGS.imageRadius)
            }
          />
          <SliderControl
            label="Scale"
            min={BEAUTIFY_SETTING_LIMITS.imageScale.min}
            max={BEAUTIFY_SETTING_LIMITS.imageScale.max}
            step={BEAUTIFY_SETTING_LIMITS.imageScale.step}
            value={imageScale}
            suffix="%"
            onChange={setImageScale}
            onReset={() =>
              setImageScale(DEFAULT_BEAUTIFY_SETTINGS.imageScale)
            }
          />
        </div>
      </ControlSection>

      <ControlSection icon={Box} title="Shadow">
        <div className="space-y-5">
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-white/70 p-1 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
            {SHADOW_PRESETS.map((preset) => {
              const isSelected =
                imageShadow.enabled === preset.value.enabled &&
                imageShadow.blur === preset.value.blur &&
                imageShadow.opacity === preset.value.opacity &&
                imageShadow.offsetY === preset.value.offsetY;

              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setImageShadow(preset.value)}
                  className={cn(
                    "h-9 rounded-md px-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                    isSelected
                      ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <SliderControl
            disabled={!imageShadow.enabled}
            label="Intensity"
            min={0}
            max={60}
            step={2}
            value={Math.round(imageShadow.opacity * 100)}
            suffix="%"
            onChange={(value) => setImageShadow({ opacity: value / 100 })}
            onReset={() =>
              setImageShadow({
                opacity: DEFAULT_BEAUTIFY_SETTINGS.imageShadow.opacity,
              })
            }
          />
        </div>
      </ControlSection>

      <div className="flex items-center justify-between gap-3 pt-5">
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
