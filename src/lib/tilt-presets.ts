import type { TiltPreset, TiltSettings } from "@/types/editor";

export const TILT_PRESETS = [
  {
    id: "flat",
    name: "Flat",
    description: "Keep the screenshot straight with no depth effect.",
    perspective: 1200,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateY: 0,
    tiltShadowMultiplier: 1,
  },
  {
    id: "left-angle",
    name: "Left Angle",
    description: "A clean left-facing product angle for social posts.",
    perspective: 1200,
    rotateX: 8,
    rotateY: -16,
    rotateZ: 0,
    translateY: 0,
    tiltShadowMultiplier: 1.18,
  },
  {
    id: "right-angle",
    name: "Right Angle",
    description: "A balanced right-facing angle with subtle depth.",
    perspective: 1200,
    rotateX: 8,
    rotateY: 16,
    rotateZ: 0,
    translateY: 0,
    tiltShadowMultiplier: 1.18,
  },
  {
    id: "floating-card",
    name: "Floating Card",
    description: "Lift the mockup slightly for a premium card feel.",
    perspective: 1200,
    rotateX: 10,
    rotateY: -10,
    rotateZ: -1,
    translateY: -8,
    tiltShadowMultiplier: 1.3,
  },
  {
    id: "product-hero",
    name: "Product Hero",
    description: "A launch-page style angle with stronger presence.",
    perspective: 1000,
    rotateX: 12,
    rotateY: -18,
    rotateZ: 0,
    translateY: 0,
    tiltShadowMultiplier: 1.35,
  },
  {
    id: "deep-perspective",
    name: "Deep Perspective",
    description: "A more dimensional angle for dramatic product shots.",
    perspective: 800,
    rotateX: 18,
    rotateY: -24,
    rotateZ: 1,
    translateY: 0,
    tiltShadowMultiplier: 1.55,
  },
  {
    id: "subtle-lift",
    name: "Subtle Lift",
    description: "A restrained depth effect that stays close to flat.",
    perspective: 1200,
    rotateX: 4,
    rotateY: -6,
    rotateZ: 0,
    translateY: -4,
    tiltShadowMultiplier: 1.12,
  },
  {
    id: "dramatic-launch",
    name: "Dramatic Launch",
    description: "A bold launch angle for high-impact visuals.",
    perspective: 900,
    rotateX: 16,
    rotateY: 22,
    rotateZ: -2,
    translateY: 0,
    tiltShadowMultiplier: 1.65,
  },
] as const satisfies readonly TiltPreset[];

export type TiltPresetOptionId = (typeof TILT_PRESETS)[number]["id"];

export type TiltPresetSettings = Pick<
  TiltSettings,
  | "tiltPresetId"
  | "perspective"
  | "rotateX"
  | "rotateY"
  | "rotateZ"
  | "translateY"
  | "tiltShadowMultiplier"
>;

export function getTiltPreset(presetId: string) {
  return (
    TILT_PRESETS.find((preset) => preset.id === presetId) ?? TILT_PRESETS[0]
  );
}

export function createTiltPresetSettings(
  presetId: string,
): TiltPresetSettings {
  const preset = getTiltPreset(presetId);

  return {
    tiltPresetId: preset.id,
    perspective: preset.perspective,
    rotateX: preset.rotateX,
    rotateY: preset.rotateY,
    rotateZ: preset.rotateZ,
    translateY: preset.translateY,
    tiltShadowMultiplier: preset.tiltShadowMultiplier,
  };
}
