"use client";

import { Check, Image as ImageIcon, RotateCcw, ZoomIn } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import {
  createImageBorderBackingLayers,
  createImageBorderCss,
  IMAGE_BORDER_PRESETS,
} from "@/lib/image-border-styles";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { ImageBorderPreset } from "@/types/editor";

type ImageStyleControlsMode = "all" | "style" | "effects";

type ImageStyleControlsProps = {
  mode?: ImageStyleControlsMode;
};

const BORDER_COLOR_SWATCHES = [
  "#ffffff",
  "#0f172a",
  "#14b8a6",
  "#38bdf8",
  "#8b5cf6",
  "#f97316",
] as const;

export default function ImageStyleControls({
  mode = "all",
}: ImageStyleControlsProps) {
  const shouldReduceMotion = useReducedMotion();
  const imagePadding = useEditorStore((state) => state.imagePadding);
  const imageRadius = useEditorStore((state) => state.imageRadius);
  const imageScale = useEditorStore((state) => state.imageScale);
  const imageShadow = useEditorStore((state) => state.imageShadow);
  const imageBorder = useEditorStore((state) => state.imageBorder);
  const imageZoom = useEditorStore((state) => state.imageZoom);
  const imageZoomOffsetX = useEditorStore(
    (state) => state.imageZoomOffsetX,
  );
  const imageZoomOffsetY = useEditorStore(
    (state) => state.imageZoomOffsetY,
  );
  const rotateZ = useEditorStore((state) => state.rotateZ);
  const setImagePadding = useEditorStore((state) => state.setImagePadding);
  const setImageRadius = useEditorStore((state) => state.setImageRadius);
  const setImageScale = useEditorStore((state) => state.setImageScale);
  const setImageShadow = useEditorStore((state) => state.setImageShadow);
  const setImageBorderPreset = useEditorStore(
    (state) => state.setImageBorderPreset,
  );
  const setImageBorderWidth = useEditorStore(
    (state) => state.setImageBorderWidth,
  );
  const setImageBorderColor = useEditorStore(
    (state) => state.setImageBorderColor,
  );
  const setImageZoom = useEditorStore((state) => state.setImageZoom);
  const setImageZoomOffset = useEditorStore(
    (state) => state.setImageZoomOffset,
  );
  const setRotateZ = useEditorStore((state) => state.setRotateZ);
  const resetImageZoom = useEditorStore((state) => state.resetImageZoom);
  const shadowOpacityPercent = Math.round(imageShadow.opacity * 100);
  const isZoomed = imageZoom > 100;
  const hasBorderStyle = imageBorder.preset !== "none";
  const showStyleControls = mode === "all" || mode === "style";
  const showEffectControls = mode === "all" || mode === "effects";
  const sectionTitle =
    mode === "effects" ? "Shadow & focus" : "Screenshot style";
  const SectionIcon = mode === "effects" ? ZoomIn : ImageIcon;

  return (
    <motion.section
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-100 py-4 dark:border-white/10"
    >
      <div className="mb-3 flex items-center gap-2">
        <SectionIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
          {sectionTitle}
        </h3>
      </div>

      <div className="space-y-4">
        {showStyleControls && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
            <EditorSliderRow
              label="Padding"
              labelClassName="text-slate-600 dark:text-slate-300"
              variant="compactStepper"
              min={BEAUTIFY_SETTING_LIMITS.imagePadding.min}
              max={BEAUTIFY_SETTING_LIMITS.imagePadding.max}
              step={BEAUTIFY_SETTING_LIMITS.imagePadding.step}
              value={imagePadding}
              suffix="px"
              onChange={setImagePadding}
            />
            <EditorSliderRow
              label="Radius"
              labelClassName="text-slate-600 dark:text-slate-300"
              variant="compactStepper"
              min={BEAUTIFY_SETTING_LIMITS.imageRadius.min}
              max={BEAUTIFY_SETTING_LIMITS.imageRadius.max}
              step={BEAUTIFY_SETTING_LIMITS.imageRadius.step}
              value={imageRadius}
              suffix="px"
              onChange={setImageRadius}
            />
            <EditorSliderRow
              label="Scale"
              labelClassName="text-slate-600 dark:text-slate-300"
              variant="compactStepper"
              min={BEAUTIFY_SETTING_LIMITS.imageScale.min}
              max={BEAUTIFY_SETTING_LIMITS.imageScale.max}
              step={BEAUTIFY_SETTING_LIMITS.imageScale.step}
              value={imageScale}
              suffix="%"
              onChange={setImageScale}
            />
            <EditorSliderRow
              label="Rotate"
              labelClassName="text-slate-600 dark:text-slate-300"
              variant="compactStepper"
              min={BEAUTIFY_SETTING_LIMITS.rotateZ.min}
              max={BEAUTIFY_SETTING_LIMITS.rotateZ.max}
              step={BEAUTIFY_SETTING_LIMITS.rotateZ.step}
              value={rotateZ}
              suffix="deg"
              onChange={setRotateZ}
            />
          </div>
        )}

        {showStyleControls && showEffectControls && (
          <Separator className="!my-3 bg-slate-100" />
        )}

        {showEffectControls && (
          <>
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor="shadow-toggle"
                className="text-[13px] font-medium text-slate-600"
              >
                Shadow
              </Label>
              <Switch
                id="shadow-toggle"
                checked={imageShadow.enabled}
                onCheckedChange={(enabled) => setImageShadow({ enabled })}
                aria-label="Toggle screenshot shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <EditorSliderRow
                disabled={!imageShadow.enabled}
                label="Opacity"
                labelClassName="text-slate-600 dark:text-slate-300"
                variant="compactStepper"
                min={Math.round(
                  BEAUTIFY_SETTING_LIMITS.imageShadowOpacity.min * 100,
                )}
                max={Math.round(
                  BEAUTIFY_SETTING_LIMITS.imageShadowOpacity.max * 100,
                )}
                step={Math.round(
                  BEAUTIFY_SETTING_LIMITS.imageShadowOpacity.step * 100,
                )}
                value={shadowOpacityPercent}
                suffix="%"
                onChange={(opacity) =>
                  setImageShadow({ opacity: opacity / 100 })
                }
              />
              <EditorSliderRow
                disabled={!imageShadow.enabled}
                label="Offset Y"
                labelClassName="text-slate-600 dark:text-slate-300"
                variant="compactStepper"
                min={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.min}
                max={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.max}
                step={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.step}
                value={imageShadow.offsetY}
                suffix="px"
                onChange={(offsetY) => setImageShadow({ offsetY })}
              />
            </div>

            <Separator className="!my-3 bg-slate-100" />

            <div className="space-y-2.5 rounded-xl border border-slate-200/75 bg-slate-50/60 p-2.5 dark:border-white/10 dark:bg-white/[0.04]">
              <div>
                <Label className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                  Border style
                </Label>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                  {IMAGE_BORDER_PRESETS.map((preset) => {
                    const isSelected = imageBorder.preset === preset.id;
                    const previewStyle = createImageBorderCss(
                      {
                        ...imageBorder,
                        width: 1.5,
                        enabled: preset.id !== "none",
                        preset: preset.id as ImageBorderPreset,
                      },
                      "0 10px 20px rgba(15, 23, 42, 0.16)",
                    );
                    const previewBackingLayers = createImageBorderBackingLayers(
                      {
                        ...imageBorder,
                        width: 1.5,
                        enabled: preset.id !== "none",
                        preset: preset.id as ImageBorderPreset,
                      },
                      7,
                      true,
                    );

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setImageBorderPreset(preset.id)}
                        className={cn(
                          "group min-w-0 rounded-lg border p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/25",
                          isSelected
                            ? "border-slate-950 bg-white shadow-sm dark:border-white dark:bg-white/10"
                            : "border-slate-200/80 bg-white/65 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10",
                        )}
                      >
                        <div className="mb-1.5 flex h-8 items-center justify-center rounded-md bg-[linear-gradient(135deg,#ecfeff,#f8fafc_46%,#eef2ff)] dark:bg-[linear-gradient(135deg,#020617,#111827)] overflow-hidden">
                          <span className="relative block h-5 w-10">
                            {previewBackingLayers.map((layerStyle, index) => (
                              <span
                                key={`${preset.id}-backing-${index}`}
                                className="absolute inset-0 rounded-md"
                                style={layerStyle}
                              />
                            ))}
                            <span
                              className="absolute inset-0 rounded-md bg-white/95 dark:bg-slate-950/95"
                              style={{
                                ...previewStyle,
                                borderRadius: "6px",
                              }}
                            />
                          </span>
                        </div>
                        <span className="flex items-center justify-between gap-1 text-[10px] font-semibold leading-3 text-slate-700 dark:text-slate-100">
                          {preset.name}
                          {isSelected && (
                            <Check
                              className="h-2.5 w-2.5 shrink-0 text-teal-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {hasBorderStyle && (
                <>
                  <EditorSliderRow
                    label="Width"
                    labelClassName="text-slate-600 dark:text-slate-300"
                    min={BEAUTIFY_SETTING_LIMITS.imageBorderWidth.min}
                    max={BEAUTIFY_SETTING_LIMITS.imageBorderWidth.max}
                    step={BEAUTIFY_SETTING_LIMITS.imageBorderWidth.step}
                    value={imageBorder.width}
                    suffix="px"
                    onChange={setImageBorderWidth}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label
                        htmlFor="border-color"
                        className="text-[12px] font-medium text-slate-500 dark:text-slate-400"
                      >
                        Color
                      </Label>
                      <input
                        id="border-color"
                        type="color"
                        value={imageBorder.color}
                        onChange={(event) =>
                          setImageBorderColor(event.target.value)
                        }
                        className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200/80 bg-white p-0.5 dark:border-white/10 dark:bg-white/[0.08]"
                        aria-label="Border color"
                      />
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {BORDER_COLOR_SWATCHES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setImageBorderColor(color)}
                          className={cn(
                            "h-7 rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/25",
                            imageBorder.color.toLowerCase() === color
                              ? "border-slate-950 ring-1 ring-slate-950/20 dark:border-white dark:ring-white/20"
                              : "border-white/80 hover:scale-105 dark:border-white/10",
                          )}
                          style={{ backgroundColor: color }}
                          aria-label={`Set border color to ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Separator className="!my-3 bg-slate-100" />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ZoomIn
                  className="h-3.5 w-3.5 text-slate-400"
                  aria-hidden="true"
                />
                <span className="text-[13px] font-semibold text-slate-700 dark:text-white">
                  Zoom &amp; focus
                </span>
              </div>
              {isZoomed && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={resetImageZoom}
                  className="h-6 gap-1 px-1.5 text-[11px] text-slate-400 hover:text-slate-700"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Reset
                </Button>
              )}
            </div>

            <EditorSliderRow
              label="Zoom"
              labelClassName="text-slate-600 dark:text-slate-300"
              min={BEAUTIFY_SETTING_LIMITS.imageZoom.min}
              max={BEAUTIFY_SETTING_LIMITS.imageZoom.max}
              step={BEAUTIFY_SETTING_LIMITS.imageZoom.step}
              value={imageZoom}
              suffix="%"
              onChange={setImageZoom}
            />

            {isZoomed && (
              <div className="space-y-3 pl-1">
                <EditorSliderRow
                  label="Pan X"
                  labelClassName="text-slate-600 dark:text-slate-300"
                  min={-100}
                  max={100}
                  step={1}
                  value={Math.round(imageZoomOffsetX * 100)}
                  suffix=""
                  onChange={(v) =>
                    setImageZoomOffset(v / 100, imageZoomOffsetY)
                  }
                />
                <EditorSliderRow
                  label="Pan Y"
                  labelClassName="text-slate-600 dark:text-slate-300"
                  min={-100}
                  max={100}
                  step={1}
                  value={Math.round(imageZoomOffsetY * 100)}
                  suffix=""
                  onChange={(v) =>
                    setImageZoomOffset(imageZoomOffsetX, v / 100)
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}
