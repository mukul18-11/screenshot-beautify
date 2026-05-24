"use client";

import { Check, LayoutDashboard } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  MAX_SCREENSHOT_LAYOUT_COUNT,
  MIN_SCREENSHOT_LAYOUT_COUNT,
  SCREENSHOT_LAYOUT_PRESETS,
} from "@/lib/screenshot-layouts";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ScreenshotLayoutPresetId } from "@/types/editor";

type PreviewCard = {
  offsetX: number;
  offsetY: number;
  rotate: number;
  scale: number;
};

function getPreviewCards(presetId: ScreenshotLayoutPresetId): PreviewCard[] {
  if (presetId === "spotlight") {
    return [
      { offsetX: -18, offsetY: 2, rotate: -4, scale: 1.15 },
      { offsetX: 26, offsetY: -18, rotate: 5, scale: 0.68 },
      { offsetX: 32, offsetY: 18, rotate: -3, scale: 0.68 },
    ];
  }

  if (presetId === "staggered-rows") {
    return [
      { offsetX: -30, offsetY: -14, rotate: -5, scale: 0.72 },
      { offsetX: 0, offsetY: -18, rotate: 3, scale: 0.72 },
      { offsetX: 28, offsetY: -12, rotate: -2, scale: 0.72 },
      { offsetX: -18, offsetY: 18, rotate: 4, scale: 0.72 },
      { offsetX: 14, offsetY: 16, rotate: -4, scale: 0.72 },
      { offsetX: 42, offsetY: 20, rotate: 3, scale: 0.72 },
    ];
  }

  if (presetId === "bento") {
    return [
      { offsetX: -22, offsetY: -6, rotate: -4, scale: 1 },
      { offsetX: 26, offsetY: -18, rotate: 3, scale: 0.58 },
      { offsetX: 34, offsetY: 12, rotate: -2, scale: 0.58 },
      { offsetX: -2, offsetY: 22, rotate: 4, scale: 0.5 },
    ];
  }

  if (presetId === "compare") {
    return [
      { offsetX: -28, offsetY: -10, rotate: 0, scale: 0.72 },
      { offsetX: 28, offsetY: -10, rotate: 0, scale: 0.72 },
      { offsetX: -28, offsetY: 20, rotate: 0, scale: 0.72 },
      { offsetX: 28, offsetY: 20, rotate: 0, scale: 0.72 },
    ];
  }

  if (presetId === "grid") {
    return [
      { offsetX: -22, offsetY: -14, rotate: 0, scale: 0.72 },
      { offsetX: 22, offsetY: -14, rotate: 0, scale: 0.72 },
      { offsetX: -22, offsetY: 16, rotate: 0, scale: 0.72 },
      { offsetX: 22, offsetY: 16, rotate: 0, scale: 0.72 },
    ];
  }

  return [
    { offsetX: -22, offsetY: -8, rotate: -6, scale: 0.84 },
    { offsetX: 0, offsetY: 0, rotate: 3, scale: 0.88 },
    { offsetX: 22, offsetY: 8, rotate: -3, scale: 0.84 },
  ];
}

function LayoutPreview({ presetId }: { presetId: ScreenshotLayoutPresetId }) {
  const cards = getPreviewCards(presetId);

  return (
    <div
      className="relative h-20 overflow-hidden rounded-lg border border-white/70 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.26),transparent_30%),linear-gradient(135deg,#111827,#0f766e)] dark:border-white/10"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:18px_18px] opacity-30" />
      {cards.map((card, index) => (
        <div
          key={`${presetId}-${index}`}
          className="absolute left-1/2 top-1/2 h-8 w-14 rounded-md border border-white/70 bg-white shadow-lg shadow-slate-950/25"
          style={{
            transform: `translate(-50%, -50%) translate(${card.offsetX}px, ${card.offsetY}px) rotate(${card.rotate}deg) scale(${card.scale})`,
            zIndex: index + 1,
          }}
        >
          <div className="h-1.5 rounded-t-[inherit] bg-slate-100" />
          <div className="space-y-1 p-1.5">
            <div className="h-1 w-8 rounded-full bg-slate-300" />
            <div className="h-1 w-5 rounded-full bg-slate-200" />
            <div className="h-1 w-10 rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScreenshotLayoutControls() {
  const shouldReduceMotion = useReducedMotion();
  const screenshots = useEditorStore((state) => state.screenshots);
  const screenshotLayoutPresetId = useEditorStore(
    (state) => state.screenshotLayoutPresetId,
  );
  const applyScreenshotLayout = useEditorStore(
    (state) => state.applyScreenshotLayout,
  );
  const placedCount = screenshots.filter((screenshot) => screenshot.isPlaced).length;
  const canUseLayout =
    placedCount >= MIN_SCREENSHOT_LAYOUT_COUNT &&
    placedCount <= MAX_SCREENSHOT_LAYOUT_COUNT;
  const helperText =
    placedCount < MIN_SCREENSHOT_LAYOUT_COUNT
      ? `Place at least ${MIN_SCREENSHOT_LAYOUT_COUNT} screenshots to use layouts.`
      : placedCount > MAX_SCREENSHOT_LAYOUT_COUNT
        ? `Layouts support up to ${MAX_SCREENSHOT_LAYOUT_COUNT} placed screenshots.`
        : `${placedCount} placed screenshots ready.`;

  return (
    <section className="border-b border-slate-200/70 py-5 dark:border-white/10">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f172a,#14b8a6)] text-white shadow-sm">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Screenshot layout
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-slate-500 dark:text-slate-300">
          Arrange multiple screenshots into launch-ready compositions.
        </p>
      </div>

      <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
        {helperText}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SCREENSHOT_LAYOUT_PRESETS.map((preset) => {
          const isSelected = screenshotLayoutPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              disabled={!canUseLayout}
              whileHover={{ y: shouldReduceMotion || !canUseLayout ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion || !canUseLayout ? 1 : 0.98 }}
              aria-label={`Apply ${preset.name} screenshot layout`}
              aria-pressed={isSelected}
              onClick={() => applyScreenshotLayout(preset.id)}
              className={cn(
                "group rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-45 dark:focus-visible:ring-white/30",
                isSelected
                  ? "border-teal-500 bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-white shadow-lg shadow-teal-500/15"
                  : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
              )}
            >
              <LayoutPreview presetId={preset.id} />

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold leading-5">
                  {preset.name}
                </span>
                {isSelected && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "mt-1 min-h-8 text-[11px] leading-4",
                  isSelected
                    ? "text-white/75"
                    : "text-slate-500 dark:text-slate-400",
                )}
              >
                {preset.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
