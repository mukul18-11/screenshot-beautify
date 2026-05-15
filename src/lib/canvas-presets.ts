import type { CanvasPreset } from "@/types/editor";

export const CANVAS_PRESETS = [
  {
    id: "square-post",
    name: "Square Post",
    width: 1080,
    height: 1080,
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    width: 1080,
    height: 1350,
  },
  {
    id: "wide-hero",
    name: "Wide Hero",
    width: 1600,
    height: 900,
  },
  {
    id: "og-image",
    name: "OG Image",
    width: 1200,
    height: 630,
  },
  {
    id: "story-reel",
    name: "Story/Reel",
    width: 1080,
    height: 1920,
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    width: 1270,
    height: 760,
  },
] as const satisfies readonly CanvasPreset[];

export type CanvasPresetId = (typeof CANVAS_PRESETS)[number]["id"];

export function getCanvasPreset(presetId: string) {
  return (
    CANVAS_PRESETS.find((preset) => preset.id === presetId) ??
    CANVAS_PRESETS[0]
  );
}
