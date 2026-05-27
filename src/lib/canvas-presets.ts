import type { CanvasPreset } from "@/types/editor";

export const CANVAS_PRESETS = [
  {
    id: "ratio-16-9",
    name: "16:9",
    width: 1920,
    height: 1080,
  },
  {
    id: "ratio-3-2",
    name: "3:2",
    width: 1620,
    height: 1080,
  },
  {
    id: "ratio-4-3",
    name: "4:3",
    width: 1440,
    height: 1080,
  },
  {
    id: "ratio-5-4",
    name: "5:4",
    width: 1350,
    height: 1080,
  },
  {
    id: "ratio-1-1",
    name: "1:1",
    width: 1080,
    height: 1080,
  },
  {
    id: "ratio-4-5",
    name: "4:5",
    width: 1080,
    height: 1350,
  },
  {
    id: "ratio-3-4",
    name: "3:4",
    width: 1080,
    height: 1440,
  },
  {
    id: "ratio-2-3",
    name: "2:3",
    width: 1080,
    height: 1620,
  },
  {
    id: "ratio-9-16",
    name: "9:16",
    width: 1080,
    height: 1920,
  },
] as const satisfies readonly CanvasPreset[];

export type CanvasPresetId = (typeof CANVAS_PRESETS)[number]["id"];

const LEGACY_CANVAS_PRESET_ALIASES: Record<string, CanvasPresetId> = {
  "square-post": "ratio-1-1",
  "linkedin-post": "ratio-4-5",
  "wide-hero": "ratio-16-9",
  "og-image": "ratio-16-9",
  "story-reel": "ratio-9-16",
  "product-hunt": "ratio-16-9",
};

export function getCanvasPreset(presetId: string) {
  const normalizedPresetId = LEGACY_CANVAS_PRESET_ALIASES[presetId] ?? presetId;

  return (
    CANVAS_PRESETS.find((preset) => preset.id === normalizedPresetId) ??
    CANVAS_PRESETS[0]
  );
}
