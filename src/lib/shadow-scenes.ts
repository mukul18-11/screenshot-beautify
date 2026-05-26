import type { CSSProperties } from "react";

import type {
  ShadowScenePlacement,
  ShadowScenePresetId,
} from "@/types/editor";

export type ShadowScenePreset = {
  id: ShadowScenePresetId;
  name: string;
  preview: string;
  scene: string;
};

export const SHADOW_SCENE_PRESETS = [
  {
    id: "soft-bars",
    name: "Soft bars",
    preview:
      "linear-gradient(128deg, rgba(255,255,255,0) 0 9%, rgba(15,23,42,0.82) 15% 22%, rgba(255,255,255,0.54) 30% 39%, rgba(15,23,42,0.72) 48% 55%, rgba(255,255,255,0.48) 64% 73%, rgba(15,23,42,0.68) 83% 90%, rgba(255,255,255,0) 100%), linear-gradient(38deg, rgba(15,23,42,0.46), rgba(255,255,255,0.2) 48%, rgba(15,23,42,0.54))",
    scene:
      "linear-gradient(128deg, transparent 0 7%, rgba(15,23,42,0.58) 12%, rgba(15,23,42,0.18) 18%, transparent 25%), linear-gradient(126deg, transparent 18%, rgba(255,255,255,0.18) 27%, rgba(255,255,255,0.06) 36%, transparent 44%), linear-gradient(132deg, transparent 36%, rgba(15,23,42,0.68) 45%, rgba(15,23,42,0.22) 54%, transparent 64%), linear-gradient(124deg, transparent 56%, rgba(255,255,255,0.2) 66%, rgba(255,255,255,0.04) 74%, transparent 82%), linear-gradient(130deg, transparent 72%, rgba(15,23,42,0.54) 82%, rgba(15,23,42,0.14) 91%, transparent 100%), radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.2), transparent 34%), radial-gradient(ellipse at 72% 92%, rgba(15,23,42,0.34), transparent 38%)",
  },
  {
    id: "window-light",
    name: "Window",
    preview:
      "linear-gradient(90deg, rgba(15,23,42,0.82) 0 14%, rgba(255,255,255,0.92) 15% 39%, rgba(15,23,42,0.82) 40% 52%, rgba(255,255,255,0.9) 53% 100%)",
    scene:
      "repeating-linear-gradient(90deg, rgba(15,23,42,0.72) 0 8%, transparent 9% 29%), repeating-linear-gradient(0deg, transparent 0 38%, rgba(15,23,42,0.58) 39% 47%, transparent 48% 100%)",
  },
  {
    id: "leaf-dapple",
    name: "Dapple",
    preview:
      "radial-gradient(ellipse at 22% 28%, rgba(15,23,42,0.82) 0 11%, transparent 12%), radial-gradient(ellipse at 72% 36%, rgba(15,23,42,0.74) 0 13%, transparent 14%), radial-gradient(ellipse at 46% 78%, rgba(15,23,42,0.68) 0 16%, transparent 17%), linear-gradient(135deg, #f8fafc, #94a3b8)",
    scene:
      "radial-gradient(ellipse at 16% 22%, rgba(15,23,42,0.62) 0 9%, transparent 10%), radial-gradient(ellipse at 34% 58%, rgba(15,23,42,0.72) 0 13%, transparent 14%), radial-gradient(ellipse at 62% 30%, rgba(15,23,42,0.54) 0 11%, transparent 12%), radial-gradient(ellipse at 84% 72%, rgba(15,23,42,0.66) 0 15%, transparent 16%)",
  },
  {
    id: "spotlight",
    name: "Spotlight",
    preview:
      "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.96) 0 30%, rgba(15,23,42,0.78) 68%, rgba(15,23,42,0.96))",
    scene:
      "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.18) 0 18%, transparent 38%), radial-gradient(circle at 50% 48%, transparent 0 32%, rgba(15,23,42,0.82) 72%, rgba(15,23,42,0.96) 100%)",
  },
  {
    id: "silk-sweep",
    name: "Silk",
    preview:
      "linear-gradient(115deg, rgba(255,255,255,0.95) 0 21%, rgba(15,23,42,0.78) 22% 33%, rgba(255,255,255,0.64) 34% 58%, rgba(15,23,42,0.58) 59% 70%, rgba(255,255,255,0.9) 71%)",
    scene:
      "linear-gradient(115deg, transparent 0 18%, rgba(15,23,42,0.66) 20% 31%, transparent 33% 56%, rgba(15,23,42,0.42) 58% 68%, transparent 70% 100%)",
  },
  {
    id: "mesh-depth",
    name: "Mesh",
    preview:
      "radial-gradient(circle at 28% 28%, rgba(15,23,42,0.84), transparent 24%), radial-gradient(circle at 78% 52%, rgba(15,23,42,0.7), transparent 28%), conic-gradient(from 120deg, #f8fafc, #94a3b8, #f8fafc)",
    scene:
      "radial-gradient(circle at 18% 22%, rgba(15,23,42,0.68), transparent 24%), radial-gradient(circle at 78% 34%, rgba(15,23,42,0.48), transparent 25%), radial-gradient(circle at 56% 86%, rgba(15,23,42,0.6), transparent 31%)",
  },
] as const satisfies readonly ShadowScenePreset[];

export function getShadowScenePreset(presetId: ShadowScenePresetId) {
  return (
    SHADOW_SCENE_PRESETS.find((preset) => preset.id === presetId) ??
    SHADOW_SCENE_PRESETS[0]
  );
}

export function createShadowSceneStyle({
  borderRadius,
  opacity,
  placement,
  presetId,
}: {
  borderRadius: number;
  opacity: number;
  placement: ShadowScenePlacement;
  presetId: ShadowScenePresetId;
}): CSSProperties {
  const preset = getShadowScenePreset(presetId);
  const isOverlay = placement === "overlay";

  return {
    backgroundImage: preset.scene,
    borderRadius: `${Math.max(0, borderRadius)}px`,
    filter: isOverlay ? "blur(5px)" : "blur(16px)",
    mixBlendMode: isOverlay ? "soft-light" : "normal",
    opacity,
    transform: isOverlay ? undefined : "scale(1.04)",
  };
}
