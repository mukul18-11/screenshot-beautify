"use client";

import { Box, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import TiltPresetSelector from "@/components/editor/TiltPresetSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </Label>
        <span className="min-w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
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
      className="border-b border-slate-200/70 py-5 dark:border-white/10"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <Box className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            3D tilt
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
            Add depth and motion to make your screenshot feel premium.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="min-w-0">
            <Label
              htmlFor="tilt-toggle"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Enable 3D tilt
            </Label>
            <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
              Apply CSS perspective to the screenshot mockup.
            </p>
          </div>
          <Switch
            id="tilt-toggle"
            checked={tiltEnabled}
            onCheckedChange={setTiltEnabled}
            aria-label="Enable 3D tilt"
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Presets
              </h4>
              <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                Pick a polished angle, then tune it if needed.
              </p>
            </div>
          </div>
          <TiltPresetSelector />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Angle & depth
              </h4>
              <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                Fine-tune perspective, rotation, lift, and shadow.
              </p>
            </div>
            <motion.div
              whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={resetTiltSettings}
                className="h-8 shrink-0 border border-white/70 bg-white/85 px-2.5 text-xs text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset 3D
              </Button>
            </motion.div>
          </div>

          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
              !tiltEnabled && "opacity-90",
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
              suffix="deg"
              onChange={setRotateX}
            />
            <SliderRow
              label="Rotate Y"
              min={BEAUTIFY_SETTING_LIMITS.rotateY.min}
              max={BEAUTIFY_SETTING_LIMITS.rotateY.max}
              step={BEAUTIFY_SETTING_LIMITS.rotateY.step}
              value={rotateY}
              suffix="deg"
              onChange={setRotateY}
            />
            <SliderRow
              label="Rotate Z"
              min={BEAUTIFY_SETTING_LIMITS.rotateZ.min}
              max={BEAUTIFY_SETTING_LIMITS.rotateZ.max}
              step={BEAUTIFY_SETTING_LIMITS.rotateZ.step}
              value={rotateZ}
              suffix="deg"
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
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Motion effects
            </h4>
            <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
              Add subtle pointer movement without changing the layout.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-slate-200/80 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label
                    htmlFor="hover-tilt-toggle"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Mouse-follow hover
                  </Label>
                  <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                    Let the mockup react gently to pointer movement.
                  </p>
                </div>
                <Switch
                  id="hover-tilt-toggle"
                  checked={hoverTiltEnabled}
                  onCheckedChange={setHoverTiltEnabled}
                  aria-label="Toggle mouse-follow 3D hover movement"
                />
              </div>

              <SliderRow
                label="Hover sensitivity"
                min={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.min}
                max={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.max}
                step={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.step}
                value={hoverTiltSensitivity}
                onChange={setHoverTiltSensitivity}
              />
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label
                    htmlFor="background-parallax-toggle"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Background parallax
                  </Label>
                  <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                    Move the backdrop slightly behind the mockup.
                  </p>
                </div>
                <Switch
                  id="background-parallax-toggle"
                  checked={backgroundParallaxEnabled}
                  onCheckedChange={setBackgroundParallaxEnabled}
                  aria-label="Toggle background parallax"
                />
              </div>

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
      </div>
    </motion.section>
  );
}
