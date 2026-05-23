import type { BackgroundPreset } from "@/types/editor";

export const BACKGROUND_PRESETS = [
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    type: "mesh",
    cssValue:
      "radial-gradient(at 18% 32%, #1d4ed8 0%, transparent 58%), radial-gradient(at 82% 14%, #22d3ee 0%, transparent 48%), radial-gradient(at 56% 84%, #0ea5e9 0%, transparent 56%), linear-gradient(135deg, #020617 0%, #082f49 100%)",
  },
  {
    id: "sunset-glow",
    name: "Sunset Red-Pink",
    type: "mesh",
    cssValue:
      "radial-gradient(at 18% 26%, #fb7185 0%, transparent 56%), radial-gradient(at 80% 18%, #f43f5e 0%, transparent 50%), radial-gradient(at 54% 82%, #fb923c 0%, transparent 60%), linear-gradient(135deg, #3b0a16 0%, #111827 100%)",
  },
  {
    id: "product-hunt-orange",
    name: "Orange Gradient",
    type: "mesh",
    cssValue:
      "radial-gradient(at 18% 28%, #fb923c 0%, transparent 56%), radial-gradient(at 82% 16%, #f59e0b 0%, transparent 50%), radial-gradient(at 54% 84%, #fdba74 0%, transparent 58%), linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
  },
  {
    id: "classic-midnight-purple",
    name: "Classic Midnight Purple",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #160f2e 0%, #4c1d95 48%, #c084fc 100%)",
  },
  {
    id: "classic-ocean-blue",
    name: "Classic Ocean Blue",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #082f49 0%, #0284c7 46%, #bae6fd 100%)",
  },
  {
    id: "classic-sunset-glow",
    name: "Classic Sunset Glow",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #7c2d12 0%, #fb7185 48%, #fde68a 100%)",
  },
  {
    id: "classic-mint-glass",
    name: "Classic Mint Glass",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #ecfeff 0%, #99f6e4 45%, #f0fdfa 100%)",
  },
  {
    id: "classic-soft-peach",
    name: "Classic Soft Peach",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 52%, #fbcfe8 100%)",
  },
  {
    id: "classic-cyber-lime",
    name: "Classic Cyber Lime",
    type: "mesh",
    cssValue:
      "radial-gradient(circle at 18% 18%, #bef264 0%, transparent 32%), radial-gradient(circle at 82% 20%, #22d3ee 0%, transparent 30%), linear-gradient(135deg, #052e16 0%, #111827 100%)",
  },
  {
    id: "classic-clean-gray",
    name: "Classic Clean Gray",
    type: "solid",
    cssValue: "#f1f5f9",
  },
  {
    id: "classic-deep-space",
    name: "Classic Deep Space",
    type: "mesh",
    cssValue:
      "radial-gradient(circle at 20% 16%, #6366f1 0%, transparent 28%), radial-gradient(circle at 80% 72%, #ec4899 0%, transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  },
  {
    id: "classic-product-hunt-orange",
    name: "Classic Product Hunt Orange",
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
