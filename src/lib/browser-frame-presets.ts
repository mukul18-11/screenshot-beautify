import type { BrowserFrameStyle, BrowserFrameTheme } from "@/types/editor";

export type BrowserFrameThemeOption = {
  id: BrowserFrameTheme;
  name: string;
};

export type BrowserFrameStyleOption = {
  id: BrowserFrameStyle;
  name: string;
};

export const BROWSER_FRAME_THEMES = [
  {
    id: "light",
    name: "Light",
  },
  {
    id: "dark",
    name: "Dark",
  },
] as const satisfies readonly BrowserFrameThemeOption[];

export const BROWSER_FRAME_STYLES = [
  {
    id: "macos",
    name: "macOS",
  },
  {
    id: "minimal",
    name: "Minimal",
  },
] as const satisfies readonly BrowserFrameStyleOption[];
