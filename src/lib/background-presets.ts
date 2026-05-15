import type { BackgroundPreset } from "@/types/editor";

export const BACKGROUND_PRESETS = [
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #160f2e 0%, #4c1d95 48%, #c084fc 100%)",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #082f49 0%, #0284c7 46%, #bae6fd 100%)",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #7c2d12 0%, #fb7185 48%, #fde68a 100%)",
  },
  {
    id: "mint-glass",
    name: "Mint Glass",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #ecfeff 0%, #99f6e4 45%, #f0fdfa 100%)",
  },
  {
    id: "founder-dark",
    name: "Founder Dark",
    type: "solid",
    cssValue: "#111827",
  },
  {
    id: "soft-peach",
    name: "Soft Peach",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 52%, #fbcfe8 100%)",
  },
  {
    id: "cyber-lime",
    name: "Cyber Lime",
    type: "mesh",
    cssValue:
      "radial-gradient(circle at 18% 18%, #bef264 0%, transparent 32%), radial-gradient(circle at 82% 20%, #22d3ee 0%, transparent 30%), linear-gradient(135deg, #052e16 0%, #111827 100%)",
  },
  {
    id: "clean-gray",
    name: "Clean Gray",
    type: "solid",
    cssValue: "#f1f5f9",
  },
  {
    id: "deep-space",
    name: "Deep Space",
    type: "mesh",
    cssValue:
      "radial-gradient(circle at 20% 16%, #6366f1 0%, transparent 28%), radial-gradient(circle at 80% 72%, #ec4899 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  },
  {
    id: "product-hunt-orange",
    name: "Product Hunt Orange",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #ff6154 0%, #ff8a3d 52%, #fff1d6 100%)",
  },
  {
    id: "blur-from-screenshot",
    name: "Blur from screenshot",
    type: "image-blur",
    cssValue:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.62) 0%, rgba(15, 23, 42, 0.28) 100%)",
  },
] as const satisfies readonly BackgroundPreset[];

export type BackgroundPresetId = (typeof BACKGROUND_PRESETS)[number]["id"];

export function getBackgroundPreset(presetId: string) {
  return (
    BACKGROUND_PRESETS.find((preset) => preset.id === presetId) ??
    BACKGROUND_PRESETS[0]
  );
}
