"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Blend,
  Check,
  ImagePlus,
  SlidersHorizontal,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Label } from "@/components/ui/label";
import {
  BACKGROUND_PATTERNS,
  createBackgroundPatternStyle,
} from "@/lib/background-patterns";
import { BACKGROUND_PRESETS } from "@/lib/background-presets";
import {
  createCustomGradient,
  getCustomPatternOptions,
} from "@/lib/custom-backgrounds";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { createUploadedImage } from "@/lib/image-utils";
import {
  ACCEPTED_IMAGE_TYPES,
  validateImageFile,
} from "@/lib/image-validation";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

type InstantTooltipProps = {
  align?: "center" | "right";
  children: string;
};

function InstantTooltip({ align = "center", children }: InstantTooltipProps) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-[calc(100%+0.45rem)] z-40 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg shadow-slate-950/20 transition-opacity duration-100 group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-white dark:text-slate-950",
        align === "right"
          ? "right-0"
          : "left-1/2 -translate-x-1/2",
      )}
    >
      {children}
    </span>
  );
}

function getBackgroundUploadError(file: File) {
  const validation = validateImageFile(file);

  if (validation.valid) {
    return null;
  }

  if (validation.code === "unsupported-type") {
    return "Unsupported file type. Upload a PNG, JPEG, or WebP background image.";
  }

  if (validation.code === "empty-file") {
    return "That file looks empty. Choose a PNG, JPEG, or WebP background image.";
  }

  return validation.message;
}

export default function BackgroundControls() {
  const shouldReduceMotion = useReducedMotion();
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [backgroundUploadError, setBackgroundUploadError] = useState<string | null>(
    null,
  );
  const [isBackgroundUploading, setIsBackgroundUploading] = useState(false);
  const backgroundImageInputRef = useRef<HTMLInputElement | null>(null);
  const effectsPopoverRef = useRef<HTMLDivElement | null>(null);

  // Preload all premium image backgrounds to ensure instant loading when clicked
  useEffect(() => {
    BACKGROUND_PRESETS.forEach((preset) => {
      if (preset.cssValue.includes("url(")) {
        const match = preset.cssValue.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (match && match[1]) {
          const img = new Image();
          img.src = match[1];
        }
      }
    });
  }, []);
  const backgroundPresetId = useEditorStore((state) => state.backgroundPresetId);
  const customConfig = useEditorStore((state) => state.customBackgroundConfig);
  const backgroundPatternId = useEditorStore(
    (state) => state.backgroundPatternId,
  );
  const backgroundPatternColor = useEditorStore(
    (state) => state.backgroundPatternColor,
  );
  const backgroundPatternIntensity = useEditorStore(
    (state) => state.backgroundPatternIntensity,
  );
  const backgroundValue = useEditorStore((state) => state.backgroundValue);
  const backgroundType = useEditorStore((state) => state.backgroundType);
  const backgroundNoise = useEditorStore((state) => state.backgroundNoise);
  const backgroundBlur = useEditorStore((state) => state.backgroundBlur);
  const customBackgroundImage = useEditorStore(
    (state) => state.customBackgroundImage,
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
  const setBackgroundNoise = useEditorStore(
    (state) => state.setBackgroundNoise,
  );
  const setBackgroundBlur = useEditorStore((state) => state.setBackgroundBlur);
  const setCustomBackgroundImage = useEditorStore(
    (state) => state.setCustomBackgroundImage,
  );
  const setCustomBackgroundConfig = useEditorStore(
    (state) => state.setCustomBackgroundConfig,
  );
  const applyCustomBackgroundConfig = useEditorStore(
    (state) => state.applyCustomBackgroundConfig,
  );
  const isCustomImageSelected = backgroundType === "image";
  const isCustomSelected =
    backgroundPresetId === "custom" && !isCustomImageSelected;
  const customGradient = useMemo(
    () => createCustomGradient(customConfig),
    [customConfig],
  );
  const activeBackgroundPreviewStyle =
    isCustomImageSelected && customBackgroundImage
      ? {
          backgroundImage: `url(${customBackgroundImage.objectUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }
      : { background: backgroundValue || customGradient };
  const gradientPresets = BACKGROUND_PRESETS.filter(
    (preset) => preset.type !== "image-blur",
  );
  const imageBlurPreset = BACKGROUND_PRESETS.find(
    (preset) => preset.type === "image-blur",
  );
  const hasBackgroundEffects = backgroundNoise > 0 || backgroundBlur > 0;

  useEffect(() => {
    if (!isEffectsOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const popover = effectsPopoverRef.current;

      if (!popover || !(event.target instanceof Node)) {
        return;
      }

      if (!popover.contains(event.target)) {
        setIsEffectsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsEffectsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEffectsOpen]);

  async function uploadCustomBackgroundImage(file: File | undefined) {
    if (!file) {
      return;
    }

    const validationMessage = getBackgroundUploadError(file);

    if (validationMessage) {
      setBackgroundUploadError(validationMessage);
      return;
    }

    setBackgroundUploadError(null);
    setIsBackgroundUploading(true);

    try {
      const uploadedBackground = await createUploadedImage(file);

      setCustomBackgroundImage(uploadedBackground);
      setIsCustomOpen(false);
      setIsEffectsOpen(false);
    } catch (error) {
      setBackgroundUploadError(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong while reading that background image.",
      );
    } finally {
      setIsBackgroundUploading(false);
    }
  }

  return (
    <section className="border-b border-slate-100 py-4 dark:border-white/10">
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
                setBackgroundUploadError(null);
                setBackgroundPreset(preset.id);
                setIsCustomOpen(false);
                setIsEffectsOpen(false);
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
                onClick={() => {
                  setBackgroundPattern(pattern.id);
                  setIsEffectsOpen(false);
                }}
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

      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
        <motion.button
          type="button"
          whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.025, 1],
                  boxShadow: [
                    "0 0 0 rgba(236, 72, 153, 0)",
                    "0 0 24px rgba(236, 72, 153, 0.34)",
                    "0 0 0 rgba(236, 72, 153, 0)",
                  ],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  scale: {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  boxShadow: {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
          aria-expanded={isCustomOpen}
          aria-pressed={isCustomSelected}
          onClick={() => {
            setBackgroundUploadError(null);
            setIsEffectsOpen(false);
            setIsCustomOpen((isOpen) => !isOpen);
            applyCustomBackgroundConfig(customConfig);
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

        <input
          ref={backgroundImageInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void uploadCustomBackgroundImage(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
        <div className="group relative h-10 w-12">
          <motion.button
            type="button"
            whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
            aria-label="Upload background image"
            aria-pressed={isCustomImageSelected}
            disabled={isBackgroundUploading}
            onClick={() => {
              setBackgroundUploadError(null);
              setIsCustomOpen(false);
              setIsEffectsOpen(false);
              backgroundImageInputRef.current?.click();
            }}
            className={cn(
              "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-60",
              isCustomImageSelected
                ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
                : "border-slate-200/70 bg-slate-950/5 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04]",
            )}
            style={
              customBackgroundImage
                ? {
                    backgroundImage: `url(${customBackgroundImage.objectUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }
                : undefined
            }
          >
            <span
              className={cn(
                "absolute inset-0",
                customBackgroundImage ? "bg-black/25" : "bg-transparent",
              )}
              aria-hidden="true"
            />
            <ImagePlus
              className={cn(
                "relative h-3.5 w-3.5",
                customBackgroundImage
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-300",
              )}
              aria-hidden="true"
            />
          </motion.button>
          <InstantTooltip>Upload background image</InstantTooltip>
        </div>

        {imageBlurPreset && (
          <div className="group relative h-10 w-12">
            <motion.button
              type="button"
              whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
              aria-label="Blur from screenshot background"
              aria-pressed={backgroundPresetId === imageBlurPreset.id}
              onClick={() => {
                setBackgroundUploadError(null);
                setBackgroundPreset(imageBlurPreset.id);
                setIsCustomOpen(false);
                setIsEffectsOpen(false);
              }}
              className={cn(
                "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border transition",
                backgroundPresetId === imageBlurPreset.id
                  ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
                  : "border-slate-200/70 hover:border-slate-300 dark:border-white/10",
              )}
              style={{ background: imageBlurPreset.cssValue }}
            >
              <Blend
                className="relative h-3.5 w-3.5 text-white/80"
                aria-hidden="true"
              />
            </motion.button>
            <InstantTooltip align="right">Blur from screenshot</InstantTooltip>
          </div>
        )}
      </div>

      {backgroundUploadError && (
        <p
          className="mt-2 text-[11px] font-medium text-rose-600 dark:text-rose-300"
          role="alert"
        >
          {backgroundUploadError}
        </p>
      )}

      {isCustomOpen && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-2 space-y-2.5 rounded-xl border border-slate-200/70 bg-white/70 p-2.5 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div className="flex rounded-lg bg-slate-100/80 p-0.5 dark:bg-white/[0.06]">
            {getCustomPatternOptions(customConfig.patternId).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setCustomBackgroundConfig({
                    ...customConfig,
                    patternId: option.id,
                  })
                }
                className={cn(
                  "flex-1 py-1 rounded-md text-[11px] font-semibold transition-all duration-150",
                  customConfig.patternId === option.id
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white",
                )}
                aria-pressed={customConfig.patternId === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Color A</span>
              <div className="relative h-6 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.08]">
                <input
                  id="custom-background-color-a"
                  type="color"
                  value={customConfig.colorA}
                  onChange={(event) => {
                    setCustomBackgroundConfig({
                      ...customConfig,
                      colorA: event.target.value,
                    });
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer border-0 opacity-0"
                />
                <div
                  className="h-full w-full rounded-[4px]"
                  style={{ backgroundColor: customConfig.colorA }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Color B</span>
              <div className="relative h-6 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.08]">
                <input
                  id="custom-background-color-b"
                  type="color"
                  value={customConfig.colorB}
                  onChange={(event) => {
                    setCustomBackgroundConfig({
                      ...customConfig,
                      colorB: event.target.value,
                    });
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer border-0 opacity-0"
                />
                <div
                  className="h-full w-full rounded-[4px]"
                  style={{ backgroundColor: customConfig.colorB }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">Base</span>
              <div className="relative h-6 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[0.08]">
                <input
                  id="custom-background-color-c"
                  type="color"
                  value={customConfig.colorC}
                  onChange={(event) => {
                    setCustomBackgroundConfig({
                      ...customConfig,
                      colorC: event.target.value,
                    });
                  }}
                  className="absolute inset-0 h-full w-full cursor-pointer border-0 opacity-0"
                />
                <div
                  className="h-full w-full rounded-[4px]"
                  style={{ backgroundColor: customConfig.colorC }}
                />
              </div>
            </div>
          </div>

          {customConfig.patternId === "linear" && (
            <EditorSliderRow
              label="Angle"
              labelClassName="text-slate-500 dark:text-slate-400 text-[11px] font-medium"
              min={0}
              max={360}
              step={1}
              value={customConfig.angle}
              suffix="deg"
              onChange={(angle) => {
                setCustomBackgroundConfig({
                  ...customConfig,
                  angle,
                });
              }}
            />
          )}
        </motion.div>
      )}

      <div className="relative mt-3" ref={effectsPopoverRef}>
        <motion.button
          type="button"
          whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
          aria-expanded={isEffectsOpen}
          aria-pressed={hasBackgroundEffects}
          onClick={() => {
            setIsCustomOpen(false);
            setIsEffectsOpen((isOpen) => !isOpen);
          }}
          className={cn(
            "relative flex h-10 w-full items-center justify-between overflow-hidden rounded-xl border px-3 text-[12px] font-semibold text-white transition",
            isEffectsOpen || hasBackgroundEffects
              ? "border-slate-800 ring-1 ring-slate-800/30 dark:border-white dark:ring-white/30"
              : "border-slate-200/70 hover:border-slate-300 dark:border-white/10",
          )}
          style={activeBackgroundPreviewStyle}
        >
          <span className="absolute inset-0 bg-black/30" aria-hidden="true" />
          <span className="relative inline-flex min-w-0 items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">Noise & Blur</span>
          </span>
          <span className="relative text-[11px] font-bold tabular-nums text-white/80">
            {backgroundNoise}/{backgroundBlur}
          </span>
        </motion.button>

        {isEffectsOpen && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-xl shadow-slate-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-black/40"
          >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
              <EditorSliderRow
                label="Noise"
                labelClassName="text-slate-600 dark:text-slate-300"
                variant="compactStepper"
                min={BEAUTIFY_SETTING_LIMITS.backgroundNoise.min}
                max={BEAUTIFY_SETTING_LIMITS.backgroundNoise.max}
                step={BEAUTIFY_SETTING_LIMITS.backgroundNoise.step}
                value={backgroundNoise}
                suffix="%"
                onChange={setBackgroundNoise}
              />
              <EditorSliderRow
                label="Blur"
                labelClassName="text-slate-600 dark:text-slate-300"
                variant="compactStepper"
                min={BEAUTIFY_SETTING_LIMITS.backgroundBlur.min}
                max={BEAUTIFY_SETTING_LIMITS.backgroundBlur.max}
                step={BEAUTIFY_SETTING_LIMITS.backgroundBlur.step}
                value={backgroundBlur}
                suffix="%"
                onChange={setBackgroundBlur}
              />
            </div>
          </motion.div>
        )}
      </div>

    </section>
  );
}
