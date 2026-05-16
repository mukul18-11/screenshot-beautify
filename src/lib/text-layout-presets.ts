import type { TextLayoutPreset } from "@/types/editor";

export const TEXT_LAYOUT_PRESETS = [
  {
    id: "launch-top",
    name: "Launch Top",
    headlineText: "Launch-ready screenshots in seconds",
    subtitleText: "Make your product updates look premium without opening Figma.",
    badgeText: "NEW LAUNCH",
    textPosition: "top",
    textAlign: "center",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: true,
  },
  {
    id: "launch-bottom",
    name: "Launch Bottom",
    headlineText: "Built for faster launches",
    subtitleText: "Polish your product screenshots before you post.",
    badgeText: "NOW LIVE",
    textPosition: "bottom",
    textAlign: "center",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: true,
  },
  {
    id: "founder-story",
    name: "Founder Story",
    headlineText: "From rough screenshot to polished product visual",
    subtitleText: "Share progress that looks clean, credible, and launch-ready.",
    badgeText: "BUILDING IN PUBLIC",
    textPosition: "bottom",
    textAlign: "left",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: true,
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    headlineText: "Show your product like a launch page",
    subtitleText: "Create clean visuals for launches, changelogs, and updates.",
    badgeText: "PRODUCT HUNT",
    textPosition: "top",
    textAlign: "left",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: true,
  },
  {
    id: "clean-center",
    name: "Clean Center",
    headlineText: "A cleaner way to share product screenshots",
    subtitleText: "Simple, polished, and ready for social.",
    badgeText: "",
    textPosition: "center",
    textAlign: "center",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: false,
  },
  {
    id: "side-note",
    name: "Side Note",
    headlineText: "New dashboard is live",
    subtitleText: "A quick visual update for your users and followers.",
    badgeText: "FEATURE UPDATE",
    textPosition: "left",
    textAlign: "left",
    textColor: "#ffffff",
    headlineSize: 44,
    subtitleSize: 20,
    badgeEnabled: true,
  },
] as const satisfies readonly TextLayoutPreset[];

export type TextLayoutPresetId = (typeof TEXT_LAYOUT_PRESETS)[number]["id"];

export function getTextLayoutPreset(presetId: string) {
  return (
    TEXT_LAYOUT_PRESETS.find((preset) => preset.id === presetId) ??
    TEXT_LAYOUT_PRESETS[0]
  );
}
