import {
  Abril_Fatface,
  Anton,
  Audiowide,
  Bebas_Neue,
  Bungee,
  Inter,
  Montserrat,
  Orbitron,
  Oswald,
  Pixelify_Sans,
  Playfair_Display,
  Poppins,
  Rajdhani,
  Righteous,
  Russo_One,
  Syncopate,
} from "next/font/google";

import type { TextFontId } from "@/types/editor";

type TextFontCategory = "Reference" | "Recommended" | "System";

export type TextFontOption = {
  category: TextFontCategory;
  className?: string;
  fontFamily?: string;
  id: TextFontId;
  name: string;
};

const interFont = Inter({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const orbitronFont = Orbitron({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const audiowideFont = Audiowide({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const righteousFont = Righteous({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const russoOneFont = Russo_One({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const syncopateFont = Syncopate({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "700"],
});
const rajdhaniFont = Rajdhani({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const bungeeFont = Bungee({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const pixelifySansFont = Pixelify_Sans({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const playfairDisplayFont = Playfair_Display({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const bebasNeueFont = Bebas_Neue({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const antonFont = Anton({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});
const oswaldFont = Oswald({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const montserratFont = Montserrat({
  display: "swap",
  preload: false,
  subsets: ["latin"],
});
const poppinsFont = Poppins({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});
const abrilFatfaceFont = Abril_Fatface({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  weight: "400",
});

export const TEXT_FONT_OPTIONS = [
  {
    id: "inter",
    name: "Inter",
    category: "Reference",
    className: interFont.className,
  },
  {
    id: "orbitron",
    name: "Orbitron",
    category: "Reference",
    className: orbitronFont.className,
  },
  {
    id: "audiowide",
    name: "Audiowide",
    category: "Reference",
    className: audiowideFont.className,
  },
  {
    id: "righteous",
    name: "Righteous",
    category: "Reference",
    className: righteousFont.className,
  },
  {
    id: "russo-one",
    name: "Russo One",
    category: "Reference",
    className: russoOneFont.className,
  },
  {
    id: "syncopate",
    name: "Syncopate",
    category: "Reference",
    className: syncopateFont.className,
  },
  {
    id: "rajdhani",
    name: "Rajdhani",
    category: "Reference",
    className: rajdhaniFont.className,
  },
  {
    id: "bungee",
    name: "Bungee",
    category: "Reference",
    className: bungeeFont.className,
  },
  {
    id: "pixelify-sans",
    name: "Pixelify Sans",
    category: "Reference",
    className: pixelifySansFont.className,
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    category: "Reference",
    className: playfairDisplayFont.className,
  },
  {
    id: "bebas-neue",
    name: "Bebas Neue",
    category: "Reference",
    className: bebasNeueFont.className,
  },
  {
    id: "anton",
    name: "Anton",
    category: "Recommended",
    className: antonFont.className,
  },
  {
    id: "oswald",
    name: "Oswald",
    category: "Recommended",
    className: oswaldFont.className,
  },
  {
    id: "montserrat",
    name: "Montserrat",
    category: "Recommended",
    className: montserratFont.className,
  },
  {
    id: "poppins",
    name: "Poppins",
    category: "Recommended",
    className: poppinsFont.className,
  },
  {
    id: "abril-fatface",
    name: "Abril Fatface",
    category: "Recommended",
    className: abrilFatfaceFont.className,
  },
  {
    id: "system",
    name: "System",
    category: "System",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    id: "sans-serif",
    name: "Sans Serif",
    category: "System",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  {
    id: "serif",
    name: "Serif",
    category: "System",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "monospace",
    name: "Monospace",
    category: "System",
    fontFamily:
      "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  {
    id: "impact",
    name: "Impact",
    category: "System",
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  },
] as const satisfies readonly TextFontOption[];

export const TEXT_FONT_CATEGORIES = [
  "Reference",
  "Recommended",
  "System",
] as const satisfies readonly TextFontCategory[];

export function getTextFontOption(fontId: TextFontId): TextFontOption {
  return (
    TEXT_FONT_OPTIONS.find((fontOption) => fontOption.id === fontId) ??
    TEXT_FONT_OPTIONS[0]
  );
}
