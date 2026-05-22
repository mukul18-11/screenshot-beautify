"use client";

import { Image as ImageIcon, RotateCcw, ZoomIn } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { useEditorStore } from "@/store/editor-store";

export default function ImageStyleControls() {
  const shouldReduceMotion = useReducedMotion();
  const imagePadding = useEditorStore((state) => state.imagePadding);
  const imageRadius = useEditorStore((state) => state.imageRadius);
  const imageScale = useEditorStore((state) => state.imageScale);
  const imageShadow = useEditorStore((state) => state.imageShadow);
  const imageBorderEnabled = useEditorStore(
    (state) => state.imageBorderEnabled,
  );
  const imageZoom = useEditorStore((state) => state.imageZoom);
  const imageZoomOffsetX = useEditorStore(
    (state) => state.imageZoomOffsetX,
  );
  const imageZoomOffsetY = useEditorStore(
    (state) => state.imageZoomOffsetY,
  );
  const setImagePadding = useEditorStore((state) => state.setImagePadding);
  const setImageRadius = useEditorStore((state) => state.setImageRadius);
  const setImageScale = useEditorStore((state) => state.setImageScale);
  const setImageShadow = useEditorStore((state) => state.setImageShadow);
  const setImageBorderEnabled = useEditorStore(
    (state) => state.setImageBorderEnabled,
  );
  const setImageZoom = useEditorStore((state) => state.setImageZoom);
  const setImageZoomOffset = useEditorStore(
    (state) => state.setImageZoomOffset,
  );
  const resetImageZoom = useEditorStore((state) => state.resetImageZoom);
  const shadowOpacityPercent = Math.round(imageShadow.opacity * 100);
  const isZoomed = imageZoom > 100;

  return (
    <motion.section
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-100 py-4 dark:border-white/8"
    >
      <div className="mb-3 flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
          Screenshot style
        </h3>
      </div>

      <div className="space-y-4">
        <EditorSliderRow
          label="Padding"
          labelClassName="text-slate-600 dark:text-slate-300"
          min={BEAUTIFY_SETTING_LIMITS.imagePadding.min}
          max={BEAUTIFY_SETTING_LIMITS.imagePadding.max}
          step={BEAUTIFY_SETTING_LIMITS.imagePadding.step}
          value={imagePadding}
          suffix="px"
          onChange={setImagePadding}
        />
        <EditorSliderRow
          label="Corner radius"
          labelClassName="text-slate-600 dark:text-slate-300"
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
          min={BEAUTIFY_SETTING_LIMITS.imageScale.min}
          max={BEAUTIFY_SETTING_LIMITS.imageScale.max}
          step={BEAUTIFY_SETTING_LIMITS.imageScale.step}
          value={imageScale}
          suffix="%"
          onChange={setImageScale}
        />

        <Separator className="!my-3 bg-slate-100" />

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

        <div className="space-y-3 pl-1">
          <EditorSliderRow
            disabled={!imageShadow.enabled}
            label="Blur"
            labelClassName="text-slate-600 dark:text-slate-300"
            min={BEAUTIFY_SETTING_LIMITS.imageShadowBlur.min}
            max={BEAUTIFY_SETTING_LIMITS.imageShadowBlur.max}
            step={BEAUTIFY_SETTING_LIMITS.imageShadowBlur.step}
            value={imageShadow.blur}
            suffix="px"
            onChange={(blur) => setImageShadow({ blur })}
          />
          <EditorSliderRow
            disabled={!imageShadow.enabled}
            label="Opacity"
            labelClassName="text-slate-600 dark:text-slate-300"
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
            onChange={(opacity) => setImageShadow({ opacity: opacity / 100 })}
          />
          <EditorSliderRow
            disabled={!imageShadow.enabled}
            label="Offset Y"
            labelClassName="text-slate-600 dark:text-slate-300"
            min={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.min}
            max={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.max}
            step={BEAUTIFY_SETTING_LIMITS.imageShadowOffsetY.step}
            value={imageShadow.offsetY}
            suffix="px"
            onChange={(offsetY) => setImageShadow({ offsetY })}
          />
        </div>

        <Separator className="!my-3 bg-slate-100" />

        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor="border-toggle"
            className="text-[13px] font-medium text-slate-600"
          >
            Subtle border
          </Label>
          <Switch
            id="border-toggle"
            checked={imageBorderEnabled}
            onCheckedChange={setImageBorderEnabled}
            aria-label="Toggle subtle screenshot border"
          />
        </div>

        <Separator className="!my-3 bg-slate-100" />

        {/* Zoom & focus */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
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

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Scroll on the image to zoom in. Use Pan X and Pan Y to adjust focus.
        </p>

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
              onChange={(v) => setImageZoomOffset(v / 100, imageZoomOffsetY)}
            />
            <EditorSliderRow
              label="Pan Y"
              labelClassName="text-slate-600 dark:text-slate-300"
              min={-100}
              max={100}
              step={1}
              value={Math.round(imageZoomOffsetY * 100)}
              suffix=""
              onChange={(v) => setImageZoomOffset(imageZoomOffsetX, v / 100)}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
}
