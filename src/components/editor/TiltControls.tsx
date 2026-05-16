"use client";

import { Box, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import TiltPresetSelector from "@/components/editor/TiltPresetSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

type SliderRowProps = {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  value: number;
};

function formatSliderValue(value: number, step: number) {
  if (step < 1) {
    return value.toFixed(1);
  }

  return String(value);
}

function SliderRow({
  label,
  max,
  min,
  onChange,
  step,
  suffix = "",
  value,
}: SliderRowProps) {
  const inputId = `${label.toLowerCase().replace(/\s+/g, "-")}-tilt-slider`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={inputId}
          className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
        >
          {label}
        </Label>
        <span className="text-[11px] font-semibold tabular-nums text-slate-400">
          {formatSliderValue(value, step)}
          {suffix}
        </span>
      </div>
      <Slider
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => {
          const [nextValue] = values;

          if (typeof nextValue === "number") {
            onChange(nextValue);
          }
        }}
        aria-label={label}
      />
    </div>
  );
}

export default function TiltControls() {
  const shouldReduceMotion = useReducedMotion();
  const tiltEnabled = useEditorStore((state) => state.tiltEnabled);
  const perspective = useEditorStore((state) => state.perspective);
  const rotateX = useEditorStore((state) => state.rotateX);
  const rotateY = useEditorStore((state) => state.rotateY);
  const rotateZ = useEditorStore((state) => state.rotateZ);
  const translateY = useEditorStore((state) => state.translateY);
  const tiltShadowMultiplier = useEditorStore(
    (state) => state.tiltShadowMultiplier,
  );
  const hoverTiltEnabled = useEditorStore((state) => state.hoverTiltEnabled);
  const hoverTiltSensitivity = useEditorStore(
    (state) => state.hoverTiltSensitivity,
  );
  const backgroundParallaxEnabled = useEditorStore(
    (state) => state.backgroundParallaxEnabled,
  );
  const backgroundParallaxStrength = useEditorStore(
    (state) => state.backgroundParallaxStrength,
  );
  const setTiltEnabled = useEditorStore((state) => state.setTiltEnabled);
  const setPerspective = useEditorStore((state) => state.setPerspective);
  const setRotateX = useEditorStore((state) => state.setRotateX);
  const setRotateY = useEditorStore((state) => state.setRotateY);
  const setRotateZ = useEditorStore((state) => state.setRotateZ);
  const setTranslateY = useEditorStore((state) => state.setTranslateY);
  const setTiltShadowMultiplier = useEditorStore(
    (state) => state.setTiltShadowMultiplier,
  );
  const setHoverTiltEnabled = useEditorStore(
    (state) => state.setHoverTiltEnabled,
  );
  const setHoverTiltSensitivity = useEditorStore(
    (state) => state.setHoverTiltSensitivity,
  );
  const setBackgroundParallaxEnabled = useEditorStore(
    (state) => state.setBackgroundParallaxEnabled,
  );
  const setBackgroundParallaxStrength = useEditorStore(
    (state) => state.setBackgroundParallaxStrength,
  );
  const resetTiltSettings = useEditorStore((state) => state.resetTiltSettings);

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-100 py-4 dark:border-white/8"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
            3D tilt
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={resetTiltSettings}
            className="h-6 gap-1 px-1.5 text-[11px] text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </Button>
          <Switch
            id="tilt-toggle"
            checked={tiltEnabled}
            onCheckedChange={setTiltEnabled}
            aria-label="Enable 3D tilt"
          />
        </div>
      </div>

      <div className="space-y-4">
        <TiltPresetSelector />

        <div
          className={cn(
            "grid grid-cols-2 gap-3",
            !tiltEnabled && "opacity-40",
          )}
        >
          <SliderRow
            label="Perspective"
            min={BEAUTIFY_SETTING_LIMITS.perspective.min}
            max={BEAUTIFY_SETTING_LIMITS.perspective.max}
            step={BEAUTIFY_SETTING_LIMITS.perspective.step}
            value={perspective}
            onChange={setPerspective}
          />
          <SliderRow
            label="Rotate X"
            min={BEAUTIFY_SETTING_LIMITS.rotateX.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateX.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateX.step}
            value={rotateX}
            suffix="°"
            onChange={setRotateX}
          />
          <SliderRow
            label="Rotate Y"
            min={BEAUTIFY_SETTING_LIMITS.rotateY.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateY.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateY.step}
            value={rotateY}
            suffix="°"
            onChange={setRotateY}
          />
          <SliderRow
            label="Rotate Z"
            min={BEAUTIFY_SETTING_LIMITS.rotateZ.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateZ.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateZ.step}
            value={rotateZ}
            suffix="°"
            onChange={setRotateZ}
          />
          <SliderRow
            label="Lift"
            min={BEAUTIFY_SETTING_LIMITS.translateY.min}
            max={BEAUTIFY_SETTING_LIMITS.translateY.max}
            step={BEAUTIFY_SETTING_LIMITS.translateY.step}
            value={translateY}
            suffix="px"
            onChange={setTranslateY}
          />
          <SliderRow
            label="Depth shadow"
            min={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.min}
            max={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.max}
            step={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.step}
            value={tiltShadowMultiplier}
            onChange={setTiltShadowMultiplier}
          />
        </div>

        <Separator className="!my-2 bg-slate-100" />

        {/* Motion effects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="hover-tilt-toggle"
              className="text-[13px] font-medium text-slate-600"
            >
              Mouse-follow hover
            </Label>
            <Switch
              id="hover-tilt-toggle"
              checked={hoverTiltEnabled}
              onCheckedChange={setHoverTiltEnabled}
              aria-label="Toggle mouse-follow 3D hover movement"
            />
          </div>

          <div className="pl-1">
            <SliderRow
              label="Hover sensitivity"
              min={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.min}
              max={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.max}
              step={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.step}
              value={hoverTiltSensitivity}
              onChange={setHoverTiltSensitivity}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="background-parallax-toggle"
              className="text-[13px] font-medium text-slate-600"
            >
              Background parallax
            </Label>
            <Switch
              id="background-parallax-toggle"
              checked={backgroundParallaxEnabled}
              onCheckedChange={setBackgroundParallaxEnabled}
              aria-label="Toggle background parallax"
            />
          </div>

          <div className="pl-1">
            <SliderRow
              label="Parallax strength"
              min={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.min}
              max={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.max}
              step={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.step}
              value={backgroundParallaxStrength}
              onChange={setBackgroundParallaxStrength}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
