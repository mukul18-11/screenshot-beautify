"use client";

import { useMemo, useState } from "react";
import { Check, Image as ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

const DEFAULT_CUSTOM_COLOR_A = "#7c3aed";
const DEFAULT_CUSTOM_COLOR_B = "#ec4899";

type CustomGradientMode = "linear" | "radial";

function hexToRgb(color: string) {
  const normalizedColor = color.trim().replace(/^#/, "");
  const colorValue = Number.parseInt(normalizedColor, 16);

  return {
    r: (colorValue >> 16) & 255,
    g: (colorValue >> 8) & 255,
    b: colorValue & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHexColors(colorA: string, colorB: string, colorBWeight: number) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  const colorAWeight = 1 - colorBWeight;

  return rgbToHex({
    r: rgbA.r * colorAWeight + rgbB.r * colorBWeight,
    g: rgbA.g * colorAWeight + rgbB.g * colorBWeight,
    b: rgbA.b * colorAWeight + rgbB.b * colorBWeight,
  });
}

function createCustomGradient(
  mode: CustomGradientMode,
  colorA: string,
  colorB: string,
  angle: number,
) {
  if (mode === "linear") {
    return `linear-gradient(${angle}deg, ${colorA} 0%, ${colorB} 100%)`;
  }

  return [
    `radial-gradient(at 20% 30%, ${colorA} 0%, transparent 60%)`,
    `radial-gradient(at 80% 10%, ${colorB} 0%, transparent 50%)`,
    `radial-gradient(at 50% 80%, ${mixHexColors(
      colorA,
      colorB,
      0.5,
    )} 0%, transparent 60%)`,
    `linear-gradient(135deg, ${mixHexColors(
      colorA,
      colorB,
      0.18,
    )} 0%, ${mixHexColors(colorA, colorB, 0.82)} 100%)`,
  ].join(", ");
}

export default function BackgroundControls() {
  const shouldReduceMotion = useReducedMotion();
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customMode, setCustomMode] = useState<CustomGradientMode>("radial");
  const [customColorA, setCustomColorA] = useState(DEFAULT_CUSTOM_COLOR_A);
  const [customColorB, setCustomColorB] = useState(DEFAULT_CUSTOM_COLOR_B);
  const [customAngle, setCustomAngle] = useState(135);
  const backgroundPresetId = useEditorStore((state) => state.backgroundPresetId);
  const setBackgroundPreset = useEditorStore(
    (state) => state.setBackgroundPreset,
  );
  const setGradientBackground = useEditorStore(
    (state) => state.setGradientBackground,
  );
  const isCustomSelected = backgroundPresetId === "custom";
  const customGradient = useMemo(
    () =>
      createCustomGradient(
        customMode,
        customColorA,
        customColorB,
        customAngle,
      ),
    [customAngle, customColorA, customColorB, customMode],
  );
  const gradientPresets = BACKGROUND_PRESETS.filter(
    (preset) => preset.type !== "image-blur",
  );
  const imageBlurPreset = BACKGROUND_PRESETS.find(
    (preset) => preset.type === "image-blur",
  );

  function applyCustomGradient() {
    setGradientBackground(
      customGradient,
      customMode === "radial" ? "mesh" : "gradient",
    );
  }

  function updateCustomGradient(
    nextMode: CustomGradientMode,
    nextColorA: string,
    nextColorB: string,
    nextAngle: number,
  ) {
    if (!isCustomSelected) {
      return;
    }

    setGradientBackground(
      createCustomGradient(nextMode, nextColorA, nextColorB, nextAngle),
      nextMode === "radial" ? "mesh" : "gradient",
    );
  }

  return (
    <section className="border-b border-slate-100 py-4 dark:border-white/8">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-700 dark:text-white">
        Background
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {gradientPresets.map((preset) => {
          const isSelected = backgroundPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
              aria-label={`${preset.name} background`}
              aria-pressed={isSelected}
              onClick={() => {
                setBackgroundPreset(preset.id);
                setIsCustomOpen(false);
              }}
              className={cn(
                "group relative flex h-10 items-center justify-center overflow-hidden rounded-xl border transition",
                isSelected
                  ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
                  : "border-slate-200/60 hover:border-slate-300 dark:border-white/10",
              )}
              style={{ background: preset.cssValue }}
              title={preset.name}
            >
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <Check
                    className="h-3.5 w-3.5 text-white drop-shadow"
                    aria-hidden="true"
                  />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <motion.button
          type="button"
          whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
          aria-expanded={isCustomOpen}
          aria-pressed={isCustomSelected}
          onClick={() => {
            setIsCustomOpen((isOpen) => !isOpen);
            applyCustomGradient();
          }}
          className={cn(
            "relative flex h-10 items-center justify-center overflow-hidden rounded-xl border text-[12px] font-semibold transition",
            isCustomSelected
              ? "border-slate-800 text-white ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
              : "border-slate-200/70 text-white hover:border-slate-300 dark:border-white/10",
          )}
          style={{ background: customGradient }}
        >
          <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <span className="relative">Custom</span>
        </motion.button>

        {imageBlurPreset && (
          <motion.button
            type="button"
            whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
            aria-label={`${imageBlurPreset.name} background`}
            aria-pressed={backgroundPresetId === imageBlurPreset.id}
            onClick={() => {
              setBackgroundPreset(imageBlurPreset.id);
              setIsCustomOpen(false);
            }}
            className={cn(
              "relative flex h-10 w-12 items-center justify-center overflow-hidden rounded-xl border transition",
              backgroundPresetId === imageBlurPreset.id
                ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
                : "border-slate-200/70 hover:border-slate-300 dark:border-white/10",
            )}
            style={{ background: imageBlurPreset.cssValue }}
            title={imageBlurPreset.name}
          >
            <ImageIcon
              className="relative h-3.5 w-3.5 text-white/80"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </div>

      {isCustomOpen && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-3 space-y-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div
            className="h-12 rounded-lg border border-white/60 shadow-inner dark:border-white/10"
            style={{ background: customGradient }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="custom-background-color-a"
                className="text-[12px] font-medium text-slate-500 dark:text-slate-400"
              >
                Color A
              </Label>
              <input
                id="custom-background-color-a"
                type="color"
                value={customColorA}
                onChange={(event) => {
                  const nextColor = event.target.value;

                  setCustomColorA(nextColor);
                  updateCustomGradient(
                    customMode,
                    nextColor,
                    customColorB,
                    customAngle,
                  );
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="custom-background-color-b"
                className="text-[12px] font-medium text-slate-500 dark:text-slate-400"
              >
                Color B
              </Label>
              <input
                id="custom-background-color-b"
                type="color"
                value={customColorB}
                onChange={(event) => {
                  const nextColor = event.target.value;

                  setCustomColorB(nextColor);
                  updateCustomGradient(
                    customMode,
                    customColorA,
                    nextColor,
                    customAngle,
                  );
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-white/[0.08]">
            {(["radial", "linear"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setCustomMode(mode);
                  updateCustomGradient(
                    mode,
                    customColorA,
                    customColorB,
                    customAngle,
                  );
                }}
                className={cn(
                  "h-8 rounded-md text-[12px] font-semibold capitalize transition",
                  customMode === mode
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white",
                )}
                aria-pressed={customMode === mode}
              >
                {mode}
              </button>
            ))}
          </div>

          {customMode === "linear" && (
            <EditorSliderRow
              label="Angle"
              labelClassName="text-slate-600 dark:text-slate-300"
              min={0}
              max={360}
              step={1}
              value={customAngle}
              suffix="deg"
              onChange={(angle) => {
                setCustomAngle(angle);
                updateCustomGradient(
                  customMode,
                  customColorA,
                  customColorB,
                  angle,
                );
              }}
            />
          )}

          <Button
            type="button"
            size="sm"
            className="h-9 w-full rounded-lg bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            onClick={applyCustomGradient}
          >
            Apply
          </Button>
        </motion.div>
      )}
    </section>
  );
}
