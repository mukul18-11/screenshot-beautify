"use client";

import { useMemo, useState } from "react";
import { Check, Image as ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  BACKGROUND_PATTERNS,
  createBackgroundPatternStyle,
} from "@/lib/background-patterns";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

const DEFAULT_CUSTOM_COLOR_A = "#f8fafc";
const DEFAULT_CUSTOM_COLOR_B = "#030712";
const DEFAULT_CUSTOM_COLOR_C = "#334155";

type CustomPatternId =
  | "arc-ribbons"
  | "contours"
  | "grid-glow"
  | "linear"
  | "liquid-chrome"
  | "radial"
  | "spotlight"
  | "velvet-storm";

type CustomBackgroundConfig = {
  patternId: CustomPatternId;
  colorA: string;
  colorB: string;
  colorC: string;
  angle: number;
};

const DEFAULT_CUSTOM_CONFIG: CustomBackgroundConfig = {
  patternId: "radial",
  colorA: DEFAULT_CUSTOM_COLOR_A,
  colorB: DEFAULT_CUSTOM_COLOR_B,
  colorC: DEFAULT_CUSTOM_COLOR_C,
  angle: 135,
};

const EDITABLE_PRESET_CONFIGS: Record<string, CustomBackgroundConfig> = {
  "blue-arc-ribbons": {
    patternId: "arc-ribbons",
    colorA: "#22d3ee",
    colorB: "#2563eb",
    colorC: "#020617",
    angle: 135,
  },
  "neon-grid-glow": {
    patternId: "grid-glow",
    colorA: "#38bdf8",
    colorB: "#22d3ee",
    colorC: "#020617",
    angle: 135,
  },
  "midnight-spotlight": {
    patternId: "spotlight",
    colorA: "#f8fafc",
    colorB: "#3b82f6",
    colorC: "#030712",
    angle: 135,
  },
  "liquid-chrome": {
    patternId: "liquid-chrome",
    colorA: "#f8fafc",
    colorB: "#60a5fa",
    colorC: "#111827",
    angle: 135,
  },
  "velvet-storm": {
    patternId: "velvet-storm",
    colorA: "#ec4899",
    colorB: "#4f46e5",
    colorC: "#07030f",
    angle: 135,
  },
  "ocean-blue": {
    patternId: "radial",
    colorA: "#1d4ed8",
    colorB: "#22d3ee",
    colorC: "#020617",
    angle: 135,
  },
  "product-hunt-orange": {
    patternId: "radial",
    colorA: "#fb923c",
    colorB: "#f59e0b",
    colorC: "#fff7ed",
    angle: 135,
  },
  "classic-ocean-blue": {
    patternId: "linear",
    colorA: "#082f49",
    colorB: "#bae6fd",
    colorC: "#0284c7",
    angle: 135,
  },
  "classic-mint-glass": {
    patternId: "linear",
    colorA: "#ecfeff",
    colorB: "#f0fdfa",
    colorC: "#99f6e4",
    angle: 135,
  },
  "classic-soft-peach": {
    patternId: "linear",
    colorA: "#fff7ed",
    colorB: "#fbcfe8",
    colorC: "#fed7aa",
    angle: 135,
  },
  "classic-cyber-lime": {
    patternId: "radial",
    colorA: "#bef264",
    colorB: "#22d3ee",
    colorC: "#052e16",
    angle: 135,
  },
  "classic-deep-space": {
    patternId: "radial",
    colorA: "#6366f1",
    colorB: "#ec4899",
    colorC: "#020617",
    angle: 135,
  },
  "classic-product-hunt-orange": {
    patternId: "linear",
    colorA: "#ff6154",
    colorB: "#fff1d6",
    colorC: "#ff8a3d",
    angle: 135,
  },
};

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

function createCustomGradient({
  patternId,
  colorA,
  colorB,
  colorC,
  angle,
}: CustomBackgroundConfig) {
  if (patternId === "linear") {
    return `linear-gradient(${angle}deg, ${colorA} 0%, ${colorC} 50%, ${colorB} 100%)`;
  }

  if (patternId === "arc-ribbons") {
    return [
      `radial-gradient(120% 82% at 56% 116%, transparent 0 38%, ${colorA} 38% 47%, transparent 47% 54%, ${colorB} 54% 63%, transparent 63% 70%, ${mixHexColors(
        colorA,
        colorB,
        0.45,
      )} 70% 77%, transparent 77%)`,
      `radial-gradient(at 78% 28%, ${mixHexColors(
        colorA,
        "#ffffff",
        0.24,
      )} 0%, transparent 34%)`,
      `radial-gradient(at 16% 22%, ${mixHexColors(
        colorB,
        "#ffffff",
        0.16,
      )} 0%, transparent 32%)`,
      `radial-gradient(rgba(255, 255, 255, 0.16) 0.7px, transparent 0.7px) 0 0 / 12px 12px`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.68,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "contours") {
    return [
      `radial-gradient(ellipse at 24% 84%, transparent 0 18%, ${colorA} 18% 19.5%, transparent 19.5% 31%, ${colorB} 31% 32.5%, transparent 32.5% 44%, ${mixHexColors(
        colorA,
        colorB,
        0.5,
      )} 44% 45.5%, transparent 45.5%)`,
      `radial-gradient(ellipse at 84% 12%, transparent 0 16%, ${colorB} 16% 17.5%, transparent 17.5% 30%, ${colorA} 30% 31.5%, transparent 31.5%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.62,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "grid-glow") {
    return [
      `linear-gradient(${mixHexColors(
        colorA,
        "#000000",
        0.2,
      )} 1px, transparent 1px) 0 0 / 34px 34px`,
      `linear-gradient(90deg, ${mixHexColors(
        colorA,
        "#000000",
        0.24,
      )} 1px, transparent 1px) 0 0 / 34px 34px`,
      `radial-gradient(at 50% 92%, ${colorB} 0%, transparent 46%)`,
      `radial-gradient(at 78% 18%, ${colorA} 0%, transparent 34%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.5,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "liquid-chrome") {
    return [
      `radial-gradient(90% 44% at 12% 22%, ${colorA} 0%, transparent 44%)`,
      `radial-gradient(82% 42% at 82% 22%, ${colorB} 0%, transparent 48%)`,
      `linear-gradient(142deg, ${mixHexColors(
        colorA,
        colorC,
        0.12,
      )} 0 8%, transparent 18% 28%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.26,
      )} 38%, transparent 50%, ${mixHexColors(
        colorA,
        colorB,
        0.18,
      )} 62%, transparent 76%)`,
      `radial-gradient(120% 76% at 50% 116%, ${mixHexColors(
        colorC,
        "#000000",
        0.72,
      )} 0%, ${colorC} 54%, ${mixHexColors(colorC, "#000000", 0.78)} 100%)`,
    ].join(", ");
  }

  if (patternId === "velvet-storm") {
    return [
      `conic-gradient(from 220deg at 48% 54%, ${colorA}, ${colorB}, transparent 34%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.1,
      )}, ${mixHexColors(colorA, colorC, 0.32)})`,
      `radial-gradient(64% 54% at 50% 50%, ${mixHexColors(
        colorA,
        "#ffffff",
        0.2,
      )} 0%, transparent 54%)`,
      `radial-gradient(78% 52% at 82% 12%, ${colorB} 0%, transparent 46%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.76,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "spotlight") {
    return [
      `radial-gradient(70% 54% at 50% 0%, ${colorA} 0%, transparent 56%)`,
      `radial-gradient(64% 46% at 52% 86%, ${colorB} 0%, transparent 62%)`,
      `radial-gradient(rgba(255, 255, 255, 0.12) 0.7px, transparent 0.7px) 0 0 / 14px 14px`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.08,
      )} 54%, ${mixHexColors(colorC, "#000000", 0.72)} 100%)`,
    ].join(", ");
  }



  return [
    `radial-gradient(at 18% 24%, ${colorA} 0%, transparent 42%)`,
    `radial-gradient(at 78% 16%, ${colorB} 0%, transparent 58%)`,
    `radial-gradient(at 50% 80%, ${mixHexColors(
      colorC,
      colorB,
      0.34,
    )} 0%, transparent 52%)`,
    `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
      colorC,
      "#000000",
      0.45,
    )} 100%)`,
  ].join(", ");
}

function getCustomPatternOptions(patternId: CustomPatternId) {
  const options: { id: CustomPatternId; label: string }[] = [
    { id: "radial", label: "Radial" },
    { id: "linear", label: "Linear" },
  ];

  if (patternId !== "linear" && patternId !== "radial") {
    return [{ id: patternId, label: "Pattern" }, ...options];
  }

  return options;
}

export default function BackgroundControls() {
  const shouldReduceMotion = useReducedMotion();
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customConfig, setCustomConfig] = useState<CustomBackgroundConfig>(
    DEFAULT_CUSTOM_CONFIG,
  );
  const backgroundPresetId = useEditorStore((state) => state.backgroundPresetId);
  const backgroundPatternId = useEditorStore(
    (state) => state.backgroundPatternId,
  );
  const backgroundPatternColor = useEditorStore(
    (state) => state.backgroundPatternColor,
  );
  const backgroundPatternIntensity = useEditorStore(
    (state) => state.backgroundPatternIntensity,
  );
  const setBackgroundPreset = useEditorStore(
    (state) => state.setBackgroundPreset,
  );
  const setBackgroundPattern = useEditorStore(
    (state) => state.setBackgroundPattern,
  );
  const setBackgroundPatternColor = useEditorStore(
    (state) => state.setBackgroundPatternColor,
  );
  const setBackgroundPatternIntensity = useEditorStore(
    (state) => state.setBackgroundPatternIntensity,
  );
  const setGradientBackground = useEditorStore(
    (state) => state.setGradientBackground,
  );
  const isCustomSelected = backgroundPresetId === "custom";
  const customGradient = useMemo(
    () => createCustomGradient(customConfig),
    [customConfig],
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
      customConfig.patternId === "linear" ? "gradient" : "mesh",
    );
  }

  function selectEditablePreset(presetId: string) {
    const nextConfig = EDITABLE_PRESET_CONFIGS[presetId];

    if (nextConfig) {
      setCustomConfig(nextConfig);
    }

    return nextConfig;
  }

  function setLiveCustomConfig(nextConfig: CustomBackgroundConfig) {
    setCustomConfig(nextConfig);

    if (isCustomSelected) {
      setGradientBackground(
        createCustomGradient(nextConfig),
        nextConfig.patternId === "linear" ? "gradient" : "mesh",
      );
    }
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
                selectEditablePreset(preset.id);
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

      <div className="mt-4">
        <Label className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
          Pattern
        </Label>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {BACKGROUND_PATTERNS.map((pattern) => {
            const isSelected = backgroundPatternId === pattern.id;
            const previewStyle = createBackgroundPatternStyle({
              color: backgroundPatternColor,
              intensity: backgroundPatternIntensity,
              patternId: pattern.id,
            });

            return (
              <button
                key={pattern.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${pattern.name} background pattern`}
                title={pattern.name}
                onClick={() => setBackgroundPattern(pattern.id)}
                className={cn(
                  "group flex h-[52px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1.5 text-[11px] font-semibold transition",
                  isSelected
                    ? "border-slate-800 text-slate-950 ring-1 ring-slate-800/25 dark:border-white dark:text-white dark:ring-white/25"
                    : "border-slate-200/70 text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-white/10 dark:text-slate-400 dark:hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "relative h-4 w-full overflow-hidden rounded-md border border-slate-950/10 shadow-inner dark:border-white/10",
                    pattern.previewClassName,
                  )}
                  aria-hidden="true"
                >
                  {pattern.id !== "none" && (
                    <span
                      className="absolute inset-0 mix-blend-soft-light"
                      style={previewStyle}
                    />
                  )}
                </span>
                <span className="max-w-full truncate">{pattern.name}</span>
              </button>
            );
          })}
        </div>

        {backgroundPatternId !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mt-3 grid gap-3 rounded-xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="grid grid-cols-[auto_1fr] items-end gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="background-pattern-color"
                  className="text-[12px] font-medium text-slate-500 dark:text-slate-400"
                >
                  Color
                </Label>
                <input
                  id="background-pattern-color"
                  type="color"
                  value={backgroundPatternColor}
                  onChange={(event) =>
                    setBackgroundPatternColor(event.target.value)
                  }
                  className="h-9 w-14 cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
                />
              </div>

              <EditorSliderRow
                label="Intensity"
                labelClassName="text-slate-600 dark:text-slate-300"
                min={BEAUTIFY_SETTING_LIMITS.backgroundPatternIntensity.min}
                max={BEAUTIFY_SETTING_LIMITS.backgroundPatternIntensity.max}
                step={BEAUTIFY_SETTING_LIMITS.backgroundPatternIntensity.step}
                value={backgroundPatternIntensity}
                suffix="%"
                onChange={setBackgroundPatternIntensity}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <motion.button
          type="button"
          whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
          aria-expanded={isCustomOpen}
          aria-pressed={isCustomSelected}
          onClick={() => {
            const presetConfig = selectEditablePreset(backgroundPresetId);
            const nextConfig = presetConfig ?? customConfig;

            setIsCustomOpen((isOpen) => !isOpen);
            setGradientBackground(
              createCustomGradient(nextConfig),
              nextConfig.patternId === "linear" ? "gradient" : "mesh",
            );
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

          <div className="grid grid-cols-3 gap-2">
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
                value={customConfig.colorA}
                onChange={(event) => {
                  const nextColor = event.target.value;

                  setLiveCustomConfig({
                    ...customConfig,
                    colorA: nextColor,
                  });
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
                value={customConfig.colorB}
                onChange={(event) => {
                  const nextColor = event.target.value;

                  setLiveCustomConfig({
                    ...customConfig,
                    colorB: nextColor,
                  });
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="custom-background-color-c"
                className="text-[12px] font-medium text-slate-500 dark:text-slate-400"
              >
                Base
              </Label>
              <input
                id="custom-background-color-c"
                type="color"
                value={customConfig.colorC}
                onChange={(event) => {
                  const nextColor = event.target.value;

                  setLiveCustomConfig({
                    ...customConfig,
                    colorC: nextColor,
                  });
                }}
                className="h-9 w-full cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 rounded-lg bg-slate-100 p-1 dark:bg-white/[0.08]">
            {getCustomPatternOptions(customConfig.patternId).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setLiveCustomConfig({
                      ...customConfig,
                      patternId: option.id,
                    })
                  }
                  className={cn(
                    "h-8 rounded-md text-[12px] font-semibold transition",
                    customConfig.patternId === option.id
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white",
                  )}
                  aria-pressed={customConfig.patternId === option.id}
                >
                  {option.label}
                </button>
              ))}
          </div>

          {customConfig.patternId === "linear" && (
            <EditorSliderRow
              label="Angle"
              labelClassName="text-slate-600 dark:text-slate-300"
              min={0}
              max={360}
              step={1}
              value={customConfig.angle}
              suffix="deg"
              onChange={(angle) => {
                setLiveCustomConfig({
                  ...customConfig,
                  angle,
                });
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
