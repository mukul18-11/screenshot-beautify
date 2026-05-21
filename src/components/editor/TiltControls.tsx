"use client";

import { Box, RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import TiltPresetSelector from "@/components/editor/TiltPresetSelector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

function formatSliderValue(value: number, step: number) {
  if (step < 1) {
    return value.toFixed(1);
  }

  return String(value);
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
      initial={{ opacity: 1, y: 0 }}
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
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Perspective"
            min={BEAUTIFY_SETTING_LIMITS.perspective.min}
            max={BEAUTIFY_SETTING_LIMITS.perspective.max}
            step={BEAUTIFY_SETTING_LIMITS.perspective.step}
            value={perspective}
            valueFormatter={(value) =>
              formatSliderValue(value, BEAUTIFY_SETTING_LIMITS.perspective.step)
            }
            onChange={setPerspective}
          />
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Rotate X"
            min={BEAUTIFY_SETTING_LIMITS.rotateX.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateX.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateX.step}
            value={rotateX}
            suffix="°"
            valueFormatter={(value) =>
              formatSliderValue(value, BEAUTIFY_SETTING_LIMITS.rotateX.step)
            }
            onChange={setRotateX}
          />
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Rotate Y"
            min={BEAUTIFY_SETTING_LIMITS.rotateY.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateY.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateY.step}
            value={rotateY}
            suffix="°"
            valueFormatter={(value) =>
              formatSliderValue(value, BEAUTIFY_SETTING_LIMITS.rotateY.step)
            }
            onChange={setRotateY}
          />
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Rotate Z"
            min={BEAUTIFY_SETTING_LIMITS.rotateZ.min}
            max={BEAUTIFY_SETTING_LIMITS.rotateZ.max}
            step={BEAUTIFY_SETTING_LIMITS.rotateZ.step}
            value={rotateZ}
            suffix="°"
            valueFormatter={(value) =>
              formatSliderValue(value, BEAUTIFY_SETTING_LIMITS.rotateZ.step)
            }
            onChange={setRotateZ}
          />
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Lift"
            min={BEAUTIFY_SETTING_LIMITS.translateY.min}
            max={BEAUTIFY_SETTING_LIMITS.translateY.max}
            step={BEAUTIFY_SETTING_LIMITS.translateY.step}
            value={translateY}
            suffix="px"
            valueFormatter={(value) =>
              formatSliderValue(value, BEAUTIFY_SETTING_LIMITS.translateY.step)
            }
            onChange={setTranslateY}
          />
          <EditorSliderRow
            idSuffix="tilt-slider"
            label="Depth shadow"
            min={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.min}
            max={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.max}
            step={BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.step}
            value={tiltShadowMultiplier}
            valueFormatter={(value) =>
              formatSliderValue(
                value,
                BEAUTIFY_SETTING_LIMITS.tiltShadowMultiplier.step,
              )
            }
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
            <EditorSliderRow
              idSuffix="tilt-slider"
              label="Hover sensitivity"
              min={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.min}
              max={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.max}
              step={BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.step}
              value={hoverTiltSensitivity}
              valueFormatter={(value) =>
                formatSliderValue(
                  value,
                  BEAUTIFY_SETTING_LIMITS.hoverTiltSensitivity.step,
                )
              }
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
            <EditorSliderRow
              idSuffix="tilt-slider"
              label="Parallax strength"
              min={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.min}
              max={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.max}
              step={BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.step}
              value={backgroundParallaxStrength}
              valueFormatter={(value) =>
                formatSliderValue(
                  value,
                  BEAUTIFY_SETTING_LIMITS.backgroundParallaxStrength.step,
                )
              }
              onChange={setBackgroundParallaxStrength}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
