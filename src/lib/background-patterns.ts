import type { CSSProperties } from "react";

import type { BackgroundPatternId } from "@/types/editor";

type BackgroundPattern = {
  id: BackgroundPatternId;
  name: string;
  previewClassName: string;
};

type BackgroundPatternStyle = Pick<
  CSSProperties,
  "backgroundImage" | "backgroundPosition" | "backgroundSize" | "opacity"
>;

export const BACKGROUND_PATTERNS = [
  {
    id: "none",
    name: "None",
    previewClassName: "bg-white",
  },
  {
    id: "soft-grid",
    name: "Grid",
    previewClassName: "bg-slate-950",
  },
  {
    id: "dot-grid",
    name: "Dots",
    previewClassName: "bg-slate-950",
  },
  {
    id: "diagonal-lines",
    name: "Lines",
    previewClassName: "bg-slate-950",
  },
  {
    id: "micro-grain",
    name: "Grain",
    previewClassName: "bg-slate-950",
  },
] as const satisfies readonly BackgroundPattern[];

export function getBackgroundPattern(patternId: string) {
  return (
    BACKGROUND_PATTERNS.find((pattern) => pattern.id === patternId) ??
    BACKGROUND_PATTERNS[0]
  );
}

function hexToRgb(color: string) {
  const normalizedColor = color.trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedColor)) {
    return { r: 255, g: 255, b: 255 };
  }

  const colorValue = Number.parseInt(normalizedColor, 16);

  return {
    r: (colorValue >> 16) & 255,
    g: (colorValue >> 8) & 255,
    b: colorValue & 255,
  };
}

function createRgb(color: string, alpha = 1) {
  const { r, g, b } = hexToRgb(color);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function createBackgroundPatternStyle({
  color,
  intensity,
  patternId,
}: {
  color: string;
  intensity: number;
  patternId: BackgroundPatternId;
}): BackgroundPatternStyle {
  if (patternId === "none") {
    return {};
  }

  const opacity = Math.max(0, Math.min(80, intensity)) / 100;

  if (patternId === "soft-grid") {
    return {
      backgroundImage: [
        `linear-gradient(90deg, ${createRgb(color)} 1px, transparent 1px)`,
        `linear-gradient(0deg, ${createRgb(color, 0.72)} 1px, transparent 1px)`,
      ].join(", "),
      backgroundSize: "44px 44px",
      opacity,
    };
  }

  if (patternId === "dot-grid") {
    return {
      backgroundImage: `radial-gradient(circle, ${createRgb(color)} 1px, transparent 1.2px)`,
      backgroundSize: "18px 18px",
      opacity,
    };
  }

  if (patternId === "diagonal-lines") {
    return {
      backgroundImage: `repeating-linear-gradient(135deg, ${createRgb(color)} 0 1px, transparent 1px 16px)`,
      backgroundSize: "32px 32px",
      opacity,
    };
  }

  return {
    backgroundImage: [
      `radial-gradient(circle at 20% 30%, ${createRgb(color)} 0 0.8px, transparent 1px)`,
      `radial-gradient(circle at 70% 65%, ${createRgb(color, 0.7)} 0 0.8px, transparent 1px)`,
    ].join(", "),
    backgroundPosition: "0 0, 5px 5px",
    backgroundSize: "10px 10px",
    opacity,
  };
}
