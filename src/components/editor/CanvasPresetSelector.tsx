"use client";

import {
  useId,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Label } from "@/components/ui/label";
import { CANVAS_PRESETS } from "@/lib/canvas-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

const MIN_CUSTOM_CANVAS_SIZE = 320;
const MAX_CUSTOM_CANVAS_SIZE = 2400;
const MAX_CUSTOM_CANVAS_AREA = 2250000;
const WHOLE_NUMBER_PATTERN = /^\d+$/;

function getAspectPreviewSize(width: number, height: number) {
  const maxWidth = 20;
  const maxHeight = 14;
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

function parseCustomDimension(value: string, label: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return { error: `${label} is required.` };
  }

  if (!WHOLE_NUMBER_PATTERN.test(normalizedValue)) {
    return { error: `${label} must be a whole number.` };
  }

  const size = Number(normalizedValue);

  if (!Number.isSafeInteger(size)) {
    return { error: `${label} is too large.` };
  }

  if (size < MIN_CUSTOM_CANVAS_SIZE) {
    return {
      error: `${label} must be at least ${MIN_CUSTOM_CANVAS_SIZE} px.`,
    };
  }

  if (size > MAX_CUSTOM_CANVAS_SIZE) {
    return {
      error: `${label} must be ${MAX_CUSTOM_CANVAS_SIZE} px or less.`,
    };
  }

  return { size };
}

export default function CanvasPresetSelector() {
  const shouldReduceMotion = useReducedMotion();
  const errorId = useId();
  const canvasPreset = useEditorStore((state) => state.canvasPreset);
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const setCanvasPreset = useEditorStore((state) => state.setCanvasPreset);
  const setCanvasSize = useEditorStore((state) => state.setCanvasSize);
  const [customDraft, setCustomDraft] = useState<{
    width: string;
    height: string;
  } | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const activeDraft = customDraft ?? {
    width: String(canvasWidth),
    height: String(canvasHeight),
  };
  const selectedPreset = CANVAS_PRESETS.find(
    (preset) => preset.width === canvasWidth && preset.height === canvasHeight,
  );
  const isCustomSelected = !selectedPreset;

  function resetCustomDraft() {
    setCustomDraft(null);
    setCustomError(null);
  }

  function updateCustomDraft(field: "width" | "height", value: string) {
    setCustomDraft((draft) => ({
      ...(draft ?? activeDraft),
      [field]: value,
    }));

    if (customError) {
      setCustomError(null);
    }
  }

  function applyCustomSize() {
    const parsedWidth = parseCustomDimension(activeDraft.width, "Width");

    if (parsedWidth.error) {
      setCustomError(parsedWidth.error);
      return;
    }

    const parsedHeight = parseCustomDimension(activeDraft.height, "Height");

    if (parsedHeight.error) {
      setCustomError(parsedHeight.error);
      return;
    }

    const nextWidth = parsedWidth.size;
    const nextHeight = parsedHeight.size;

    if (!nextWidth || !nextHeight) {
      return;
    }

    if (nextWidth * nextHeight > MAX_CUSTOM_CANVAS_AREA) {
      setCustomError("Custom canvas area must be 2.25 MP or less.");
      return;
    }

    const matchingPreset = CANVAS_PRESETS.find(
      (preset) => preset.width === nextWidth && preset.height === nextHeight,
    );

    setCustomError(null);

    if (nextWidth === canvasWidth && nextHeight === canvasHeight) {
      setCustomDraft(null);
      return;
    }

    if (matchingPreset) {
      setCanvasPreset(matchingPreset.id);
      setCustomDraft(null);
      return;
    }

    setCanvasSize(nextWidth, nextHeight);
    setCustomDraft(null);
  }

  function handleCustomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyCustomSize();
  }

  function handleCustomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCustomSize();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      resetCustomDraft();
    }
  }

  return (
    <section className="border-b border-slate-200/70 py-4 dark:border-white/10">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
          Canvas size
        </h3>
        <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-300">
          Choose where you want to post this screenshot.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {CANVAS_PRESETS.map((preset) => {
          const isSelected =
            selectedPreset?.id === preset.id || canvasPreset === preset.id;
          const previewSize = getAspectPreviewSize(preset.width, preset.height);

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              aria-pressed={isSelected}
              aria-label={`${preset.name} canvas preset`}
              onClick={() => {
                setCanvasPreset(preset.id);
                setCustomDraft(null);
                setCustomError(null);
              }}
              className={cn(
                "group relative flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg border px-1 py-1 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                isSelected
                  ? "border-blue-500 bg-blue-500 text-white shadow-sm shadow-blue-500/25"
                  : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
              )}
            >
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-slate-950"
                >
                  <Check className="h-2 w-2" aria-hidden="true" />
                </motion.span>
              )}

              <span
                className={cn(
                  "flex h-5 w-7 items-center justify-center rounded border transition",
                  isSelected
                    ? "border-white/25 bg-white/10"
                    : "border-slate-200 bg-slate-50 group-hover:bg-white dark:border-white/10 dark:bg-white/10",
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "block rounded-[2px] border",
                    isSelected
                      ? "border-white/80 bg-white/35"
                      : "border-slate-400 bg-slate-200 dark:border-white/50 dark:bg-white/20",
                  )}
                  style={{
                    height: previewSize.height,
                    width: previewSize.width,
                  }}
                />
              </span>

              <span className="text-[11px] font-semibold leading-none">
                {preset.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-2 text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
        Output · {canvasWidth} × {canvasHeight}
      </p>

      <form onSubmit={handleCustomSubmit} className="mt-2">
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition",
            isCustomSelected
              ? "border-blue-500 ring-1 ring-blue-500/20"
              : "border-slate-200/80 dark:border-white/10",
          )}
        >
          <span className="shrink-0 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            Custom
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-1">
            <div className="relative min-w-0 flex-1">
              <Label htmlFor="custom-canvas-width" className="sr-only">
                Width
              </Label>
              <span
                className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              >
                W
              </span>
              <input
                id="custom-canvas-width"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={activeDraft.width}
                onChange={(event) =>
                  updateCustomDraft("width", event.target.value)
                }
                onKeyDown={handleCustomKeyDown}
                aria-invalid={Boolean(customError)}
                aria-describedby={customError ? errorId : undefined}
                className="h-8 w-full rounded-md border border-slate-200/80 bg-slate-50/80 py-0 pl-5 pr-1.5 text-xs font-semibold tabular-nums text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:focus:border-white/25 dark:focus:ring-white/10"
              />
            </div>

            <span
              className="shrink-0 text-xs text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            >
              ×
            </span>

            <div className="relative min-w-0 flex-1">
              <Label htmlFor="custom-canvas-height" className="sr-only">
                Height
              </Label>
              <span
                className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              >
                H
              </span>
              <input
                id="custom-canvas-height"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={activeDraft.height}
                onChange={(event) =>
                  updateCustomDraft("height", event.target.value)
                }
                onKeyDown={handleCustomKeyDown}
                aria-invalid={Boolean(customError)}
                aria-describedby={customError ? errorId : undefined}
                className="h-8 w-full rounded-md border border-slate-200/80 bg-slate-50/80 py-0 pl-5 pr-1.5 text-xs font-semibold tabular-nums text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:focus:border-white/25 dark:focus:ring-white/10"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200/80 bg-slate-950 text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:border-white/10 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:focus-visible:ring-white/30"
            aria-label="Apply custom canvas size"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </motion.button>
        </div>

        {customError && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 rounded-md bg-rose-50 px-2 py-1 text-xs font-medium leading-4 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200"
          >
            {customError}
          </p>
        )}
      </form>
    </section>
  );
}
