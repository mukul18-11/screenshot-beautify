import type { BackgroundPreset } from "@/types/editor";

export const BACKGROUND_PRESETS = [
  {
    id: "blue-arc-ribbons",
    name: "Blue Arc Ribbons",
    type: "mesh",
    cssValue:
      "radial-gradient(120% 82% at 56% 116%, transparent 0 38%, rgba(8, 47, 73, 0.96) 38% 47%, transparent 47% 54%, rgba(37, 99, 235, 0.88) 54% 63%, transparent 63% 70%, rgba(34, 211, 238, 0.9) 70% 77%, transparent 77%), radial-gradient(at 78% 28%, rgba(56, 189, 248, 0.28) 0%, transparent 34%), radial-gradient(at 16% 22%, rgba(99, 102, 241, 0.24) 0%, transparent 32%), radial-gradient(rgba(255, 255, 255, 0.16) 0.7px, transparent 0.7px) 0 0 / 12px 12px, linear-gradient(135deg, #020617 0%, #030712 100%)",
  },
  {
    id: "electric-contours",
    name: "Electric Contours",
    type: "mesh",
    cssValue:
      "radial-gradient(ellipse at 24% 84%, transparent 0 18%, rgba(34, 211, 238, 0.52) 18% 19.5%, transparent 19.5% 31%, rgba(59, 130, 246, 0.38) 31% 32.5%, transparent 32.5% 44%, rgba(147, 51, 234, 0.36) 44% 45.5%, transparent 45.5%), radial-gradient(ellipse at 84% 12%, transparent 0 16%, rgba(99, 102, 241, 0.42) 16% 17.5%, transparent 17.5% 30%, rgba(34, 211, 238, 0.32) 30% 31.5%, transparent 31.5%), linear-gradient(135deg, #020617 0%, #0f172a 48%, #020617 100%)",
  },
  {
    id: "neon-grid-glow",
    name: "Neon Grid Glow",
    type: "mesh",
    cssValue:
      "linear-gradient(rgba(56, 189, 248, 0.11) 1px, transparent 1px) 0 0 / 34px 34px, linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px) 0 0 / 34px 34px, radial-gradient(at 50% 92%, rgba(34, 211, 238, 0.6) 0%, transparent 46%), radial-gradient(at 78% 18%, rgba(99, 102, 241, 0.34) 0%, transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  },
  {
    id: "midnight-spotlight",
    name: "Midnight Spotlight",
    type: "mesh",
    cssValue:
      "radial-gradient(70% 54% at 50% 0%, rgba(255, 255, 255, 0.2) 0%, transparent 56%), radial-gradient(64% 46% at 52% 86%, rgba(59, 130, 246, 0.38) 0%, transparent 62%), radial-gradient(rgba(255, 255, 255, 0.12) 0.7px, transparent 0.7px) 0 0 / 14px 14px, linear-gradient(135deg, #030712 0%, #111827 54%, #020617 100%)",
  },
  {
    id: "obsidian-silk",
    name: "Obsidian Silk",
    type: "mesh",
    cssValue:
      "radial-gradient(90% 52% at 22% 8%, rgba(248, 250, 252, 0.34) 0%, transparent 48%), radial-gradient(88% 46% at 86% 18%, rgba(56, 189, 248, 0.26) 0%, transparent 46%), linear-gradient(158deg, transparent 0 18%, rgba(148, 163, 184, 0.34) 25%, transparent 36%, rgba(15, 23, 42, 0.08) 46%, rgba(226, 232, 240, 0.26) 54%, transparent 68%), radial-gradient(130% 62% at 48% 110%, rgba(2, 6, 23, 0) 0%, rgba(15, 23, 42, 0.86) 52%, #020617 100%), linear-gradient(135deg, #020617 0%, #0f172a 52%, #030712 100%)",
  },
  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    type: "mesh",
    cssValue:
      "radial-gradient(90% 44% at 12% 22%, rgba(255, 255, 255, 0.5) 0%, transparent 44%), radial-gradient(82% 42% at 82% 22%, rgba(96, 165, 250, 0.36) 0%, transparent 48%), linear-gradient(142deg, rgba(255, 255, 255, 0.28) 0 8%, transparent 18% 28%, rgba(71, 85, 105, 0.52) 38%, transparent 50%, rgba(226, 232, 240, 0.32) 62%, transparent 76%), radial-gradient(120% 76% at 50% 116%, #020617 0%, #111827 54%, #020617 100%)",
  },
  {
    id: "glass-ridge",
    name: "Glass Ridge",
    type: "mesh",
    cssValue:
      "repeating-linear-gradient(164deg, transparent 0 38px, rgba(125, 211, 252, 0.18) 39px 41px, transparent 42px 92px), radial-gradient(86% 48% at 18% 18%, rgba(186, 230, 253, 0.34) 0%, transparent 46%), radial-gradient(72% 42% at 84% 80%, rgba(14, 165, 233, 0.3) 0%, transparent 48%), linear-gradient(135deg, #020617 0%, #082f49 48%, #020617 100%)",
  },
  {
    id: "velvet-storm",
    name: "Velvet Storm",
    type: "mesh",
    cssValue:
      "conic-gradient(from 220deg at 48% 54%, rgba(236, 72, 153, 0.34), rgba(79, 70, 229, 0.28), transparent 34%, rgba(15, 23, 42, 0.72), rgba(236, 72, 153, 0.26)), radial-gradient(64% 54% at 50% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 54%), radial-gradient(78% 52% at 82% 12%, rgba(99, 102, 241, 0.34) 0%, transparent 46%), linear-gradient(135deg, #07030f 0%, #020617 100%)",
  },
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
