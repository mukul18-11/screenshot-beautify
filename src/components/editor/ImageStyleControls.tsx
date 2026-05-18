"use client";

import { Image as ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
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
  const setImagePadding = useEditorStore((state) => state.setImagePadding);
  const setImageRadius = useEditorStore((state) => state.setImageRadius);
  const setImageScale = useEditorStore((state) => state.setImageScale);
  const setImageShadow = useEditorStore((state) => state.setImageShadow);
  const setImageBorderEnabled = useEditorStore(
    (state) => state.setImageBorderEnabled,
  );
  const shadowOpacityPercent = Math.round(imageShadow.opacity * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
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
      </div>
    </motion.section>
  );
}
