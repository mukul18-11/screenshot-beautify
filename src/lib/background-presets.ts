import type { BackgroundPreset } from "@/types/editor";

export const BACKGROUND_PRESETS = [
  {
    id: "wall-4",
    name: "Wall 4",
    type: "mesh",
    cssValue: "url('/backgrounds/wall4.jpg') center / cover no-repeat",
  },
  {
    id: "blue-arc-ribbons",
    name: "Blue Arc Ribbons",
    type: "mesh",
    cssValue:
      "radial-gradient(120% 82% at 56% 116%, transparent 0 38%, rgba(8, 47, 73, 0.96) 38% 47%, transparent 47% 54%, rgba(37, 99, 235, 0.88) 54% 63%, transparent 63% 70%, rgba(34, 211, 238, 0.9) 70% 77%, transparent 77%), radial-gradient(at 78% 28%, rgba(56, 189, 248, 0.28) 0%, transparent 34%), radial-gradient(at 16% 22%, rgba(99, 102, 241, 0.24) 0%, transparent 32%), radial-gradient(rgba(255, 255, 255, 0.16) 0.7px, transparent 0.7px) 0 0 / 12px 12px, linear-gradient(135deg, #020617 0%, #030712 100%)",
  },
  {
    id: "neon-grid-glow",
    name: "Neon Grid Glow",
    type: "mesh",
    cssValue:
      "linear-gradient(rgba(56, 189, 248, 0.11) 1px, transparent 1px) 0 0 / 34px 34px, linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px) 0 0 / 34px 34px, radial-gradient(at 50% 92%, rgba(34, 211, 238, 0.6) 0%, transparent 46%), radial-gradient(at 78% 18%, rgba(99, 102, 241, 0.34) 0%, transparent 34%), linear-gradient(135deg, #020617 0%, #0f172a 100%)",
  },

  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    type: "mesh",
    cssValue:
      "radial-gradient(90% 44% at 12% 22%, rgba(255, 255, 255, 0.5) 0%, transparent 44%), radial-gradient(82% 42% at 82% 22%, rgba(96, 165, 250, 0.36) 0%, transparent 48%), linear-gradient(142deg, rgba(255, 255, 255, 0.28) 0 8%, transparent 18% 28%, rgba(71, 85, 105, 0.52) 38%, transparent 50%, rgba(226, 232, 240, 0.32) 62%, transparent 76%), radial-gradient(120% 76% at 50% 116%, #020617 0%, #111827 54%, #020617 100%)",
  },

  {
    id: "product-hunt-orange",
    name: "Orange Gradient",
    type: "mesh",
    cssValue:
      "radial-gradient(at 18% 28%, #fb923c 0%, transparent 56%), radial-gradient(at 82% 16%, #f59e0b 0%, transparent 50%), radial-gradient(at 54% 84%, #fdba74 0%, transparent 58%), linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
  },
  {
    id: "classic-ocean-blue",
    name: "Classic Ocean Blue",
    type: "gradient",
    cssValue: "linear-gradient(135deg, #082f49 0%, #0284c7 46%, #bae6fd 100%)",
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
  /* ──────────────────────────────────────────────────────────
   * Premium Tech Backgrounds (Generated HD Images)
   * ────────────────────────────────────────────────────────── */
  {
    id: "tech-cyber-circuit-glow",
    name: "Cyber Circuit Glow",
    type: "mesh",
    cssValue: "url('/backgrounds/cyber-circuit-glow.png') center / cover no-repeat",
  },

  /* ──────────────────────────────────────────────────────────
   * Premium Apple-Inspired Wallpapers (Generated HD)
   * ────────────────────────────────────────────────────────── */
  {
    id: "apple-sonoma-wave",
    name: "Apple Sonoma Wave",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-sonoma-wave.png') center / cover no-repeat",
  },

  {
    id: "apple-layered-organic",
    name: "Apple Layered Organic",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-layered-organic.png') center / cover no-repeat",
  },

  {
    id: "apple-sequoia-stream",
    name: "Apple Sequoia Stream",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-sequoia-stream.png') center / cover no-repeat",
  },
  {
    id: "apple-solar-flare",
    name: "Apple Solar Flare",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-solar-flare.png') center / cover no-repeat",
  },
  {
    id: "apple-obsidian-glow",
    name: "Apple Obsidian Glow",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-obsidian-glow.png') center / cover no-repeat",
  },
  {
    id: "abstract-energy-beams",
    name: "Abstract Energy Beams",
    type: "mesh",
    cssValue: "url('/backgrounds/abstract-energy-beams.png') center / cover no-repeat",
  },
  {
    id: "vibrant-fluid-splash",
    name: "Vibrant Fluid Splash",
    type: "mesh",
    cssValue: "url('/backgrounds/vibrant-fluid-splash.png') center / cover no-repeat",
  },
  {
    id: "colliding-elemental-flames",
    name: "Colliding Elemental Flames",
    type: "mesh",
    cssValue: "url('/backgrounds/colliding-elemental-flames.png') center / cover no-repeat",
  },
  {
    id: "rainbow-spectrum-clouds",
    name: "Rainbow Spectrum Clouds",
    type: "mesh",
    cssValue: "url('/backgrounds/rainbow-spectrum-clouds.png') center / cover no-repeat",
  },
  {
    id: "rainbow-acrylic-streaks",
    name: "Rainbow Acrylic Streaks",
    type: "mesh",
    cssValue: "url('/backgrounds/rainbow-acrylic-streaks.png') center / cover no-repeat",
  },
  {
    id: "elemental-flame-border",
    name: "Elemental Flame Border",
    type: "mesh",
    cssValue: "url('/backgrounds/elemental-flame-border.png') center / cover no-repeat",
  },
  {
    id: "cosmic-ink-cloud",
    name: "Cosmic Ink Cloud",
    type: "mesh",
    cssValue: "url('/backgrounds/cosmic-ink-cloud.png') center / cover no-repeat",
  },
  {
    id: "apple-cosmic-silk",
    name: "Apple Cosmic Silk",
    type: "mesh",
    cssValue: "url('/backgrounds/apple-cosmic-silk.png') center / cover no-repeat",
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
