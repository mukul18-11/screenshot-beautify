import type { TextLayoutPreset } from "@/types/editor";

export const TEXT_LAYOUT_PRESETS = [
  {
    id: "launch-top",
    name: "Launch Top",
    headlineText: "Launch-ready in seconds",
    subtitleText: "Turn a plain screenshot into a polished product visual.",
    badgeText: "New launch",
    textPosition: "top",
    textAlign: "center",
    textColor: "#ffffff",
    headlineSize: 56,
    subtitleSize: 22,
    badgeEnabled: true,
  },
  {
    id: "launch-bottom",
    name: "Launch Bottom",
    headlineText: "Built for faster launches",
    subtitleText: "A clean visual for posts, decks, and landing pages.",
    badgeText: "Now live",
    textPosition: "bottom",
    textAlign: "left",
    textColor: "#ffffff",
    headlineSize: 52,
    subtitleSize: 21,
    badgeEnabled: true,
  },
  {
    id: "founder-story",
    name: "Founder Story",
    headlineText: "The simple workflow behind our launch",
    subtitleText: "From raw screenshot to story-ready product visual.",
    badgeText: "Founder story",
    textPosition: "left",
    textAlign: "left",
    textColor: "#f8fafc",
    headlineSize: 48,
    subtitleSize: 21,
    badgeEnabled: true,
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    headlineText: "Meet your new screenshot workflow",
    subtitleText: "Create crisp launch assets without opening a design tool.",
    badgeText: "Product Hunt",
    textPosition: "top",
    textAlign: "left",
    textColor: "#111827",
    headlineSize: 50,
    subtitleSize: 20,
    badgeEnabled: true,
  },
  {
    id: "clean-center",
    name: "Clean Center",
    headlineText: "Make every product shot feel intentional",
    subtitleText: "A calm, centered layout for premium screenshot posts.",
    badgeText: "Preview",
    textPosition: "center",
    textAlign: "center",
    textColor: "#ffffff",
    headlineSize: 54,
    subtitleSize: 22,
    badgeEnabled: false,
  },
  {
    id: "side-note",
    name: "Side Note",
    headlineText: "Small detail. Big clarity.",
    subtitleText: "Use side copy when the screenshot should stay in focus.",
    badgeText: "Note",
    textPosition: "right",
    textAlign: "left",
    textColor: "#f8fafc",
    headlineSize: 42,
    subtitleSize: 19,
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
