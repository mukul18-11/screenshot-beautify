import type { CSSProperties } from "react";

import type { ImageBorder, ImageBorderPreset } from "@/types/editor";

export const IMAGE_BORDER_PRESETS = [
  {
    id: "none",
    name: "None",
  },
  {
    id: "solid",
    name: "Solid",
  },
  {
    id: "glass-light",
    name: "Glass Light",
  },
  {
    id: "glass-dark",
    name: "Glass Dark",
  },
  {
    id: "liquid",
    name: "Liquid",
  },
  {
    id: "inset-light",
    name: "Inset Light",
  },
  {
    id: "inset-dark",
    name: "Inset Dark",
  },
  {
    id: "outline",
    name: "Outline",
  },
  {
    id: "retro",
    name: "Retro",
  },
  {
    id: "card",
    name: "Card",
  },
  {
    id: "stack",
    name: "Stack",
  },
  {
    id: "stack-2",
    name: "Stack 2",
  },
] as const satisfies readonly {
  id: ImageBorderPreset;
  name: string;
}[];

function parseHexColor(color: string) {
  const normalized = color.trim().replace("#", "");

  if (/^[0-9a-fA-F]{3}$/.test(normalized)) {
    return {
      r: Number.parseInt(normalized[0] + normalized[0], 16),
      g: Number.parseInt(normalized[1] + normalized[1], 16),
      b: Number.parseInt(normalized[2] + normalized[2], 16),
    };
  }

  if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  return { r: 255, g: 255, b: 255 };
}

function rgba(color: string, alpha: number) {
  const { r, g, b } = parseHexColor(color);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function joinShadows(...shadows: (string | undefined)[]) {
  return shadows.filter((shadow) => shadow && shadow !== "none").join(", ");
}

export function createImageBorderCss(
  border: ImageBorder,
  baseBoxShadow?: string,
): Pick<CSSProperties, "backgroundClip" | "border" | "boxShadow"> {
  if (!border.enabled || border.preset === "none") {
    return {
      border: "none",
      boxShadow: baseBoxShadow,
    };
  }

  const width = Math.round(border.width);

  if (width <= 0) {
    return {
      border: "none",
      boxShadow: baseBoxShadow,
    };
  }

  const color = border.color;

  if (border.preset === "outline") {
    return {
      border: "none",
      boxShadow: joinShadows(
        `0 0 0 ${width}px ${rgba(color, 0.9)}`,
        `0 0 0 ${width + 1}px rgba(255, 255, 255, 0.2)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "retro") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.92)}`,
      boxShadow: joinShadows(
        `0 0 0 ${Math.max(3, width + 2)}px rgba(15, 23, 42, 0.92)`,
        `0 ${Math.max(8, width * 4)}px 0 rgba(15, 23, 42, 0.32)`,
        `inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "card") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.82)}`,
      boxShadow: joinShadows(
        `inset 0 1px 0 rgba(255, 255, 255, 0.72)`,
        `0 1px 0 rgba(255, 255, 255, 0.66)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "stack" || border.preset === "stack-2") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.78)}`,
      boxShadow: joinShadows(
        `inset 0 1px 0 rgba(255, 255, 255, 0.64)`,
        `0 1px 0 rgba(255, 255, 255, 0.5)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "glass-light") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.42)}`,
      boxShadow: joinShadows(
        `inset 0 1px 0 rgba(255, 255, 255, 0.72)`,
        `inset 0 -1px 0 ${rgba(color, 0.18)}`,
        `0 0 0 1px rgba(255, 255, 255, 0.12)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "glass-dark") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.22)}`,
      boxShadow: joinShadows(
        `inset 0 1px 0 rgba(255, 255, 255, 0.16)`,
        `inset 0 0 0 1px rgba(2, 6, 23, 0.36)`,
        `0 0 0 1px rgba(2, 6, 23, 0.28)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "liquid") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.5)}`,
      boxShadow: joinShadows(
        `inset 0 1px 0 rgba(255, 255, 255, 0.86)`,
        `inset 0 -1px 0 ${rgba(color, 0.5)}`,
        `inset 0 0 ${Math.max(8, width * 4)}px ${rgba(color, 0.18)}`,
        `0 0 ${Math.max(10, width * 5)}px ${rgba(color, 0.2)}`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "inset-light") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.34)}`,
      boxShadow: joinShadows(
        `inset 0 0 0 ${width}px rgba(255, 255, 255, 0.62)`,
        `inset 0 ${width}px ${Math.max(8, width * 3)}px rgba(255, 255, 255, 0.22)`,
        baseBoxShadow,
      ),
    };
  }

  if (border.preset === "inset-dark") {
    return {
      backgroundClip: "padding-box",
      border: `${width}px solid ${rgba(color, 0.2)}`,
      boxShadow: joinShadows(
        `inset 0 0 0 ${width}px rgba(2, 6, 23, 0.34)`,
        `inset 0 ${width}px ${Math.max(10, width * 4)}px rgba(2, 6, 23, 0.28)`,
        baseBoxShadow,
      ),
    };
  }

  return {
    backgroundClip: "padding-box",
    border: `${width}px solid ${rgba(color, 0.88)}`,
    boxShadow: baseBoxShadow,
  };
}

export function createImageBorderBackingLayers(
  border: ImageBorder,
  radius: number,
  isPreview = false,
): CSSProperties[] {
  if (!border.enabled) {
    return [];
  }

  const width = Math.round(border.width);

  if (width <= 0) {
    return [];
  }

  const layerRadius = `${Math.max(0, radius)}px`;
  const paperSurface = `linear-gradient(180deg, ${rgba(border.color, 0.92)}, ${rgba(border.color, 0.74)})`;
  const layerBorder = `${width}px solid ${rgba(border.color, 0.72)}`;

  if (border.preset === "card") {
    return [
      {
        background: paperSurface,
        border: layerBorder,
        borderRadius: layerRadius,
        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.24)",
        opacity: 0.92,
        transform: isPreview
          ? "translate3d(0, 3px, 0) scale(0.96)"
          : "translate3d(0, 14px, 0) scale(0.96)",
      },
    ];
  }

  if (border.preset === "stack") {
    return [
      {
        background: paperSurface,
        border: layerBorder,
        borderRadius: layerRadius,
        boxShadow: "0 16px 28px rgba(15, 23, 42, 0.2)",
        opacity: 0.84,
        transform: isPreview
          ? "translate3d(3px, 4px, 0) rotate(0.6deg) scale(0.97)"
          : "translate3d(12px, 16px, 0) rotate(0.6deg) scale(0.97)",
      },
      {
        background: paperSurface,
        border: layerBorder,
        borderRadius: layerRadius,
        boxShadow: "0 12px 20px rgba(15, 23, 42, 0.14)",
        opacity: 0.64,
        transform: isPreview
          ? "translate3d(5px, 6px, 0) rotate(1.1deg) scale(0.94)"
          : "translate3d(22px, 26px, 0) rotate(1.1deg) scale(0.94)",
      },
    ];
  }

  if (border.preset === "stack-2") {
    return [
      {
        background: paperSurface,
        border: layerBorder,
        borderRadius: layerRadius,
        boxShadow: "0 18px 34px rgba(15, 23, 42, 0.22)",
        opacity: 0.9,
        transform: isPreview
          ? "translate3d(4px, -3px, 0) rotate(1.4deg) scale(0.98)"
          : "translate3d(16px, -14px, 0) rotate(1.4deg) scale(0.98)",
      },
      {
        background: paperSurface,
        border: layerBorder,
        borderRadius: layerRadius,
        boxShadow: "0 12px 22px rgba(15, 23, 42, 0.16)",
        opacity: 0.72,
        transform: isPreview
          ? "translate3d(7px, -5px, 0) rotate(2.6deg) scale(0.96)"
          : "translate3d(30px, -24px, 0) rotate(2.6deg) scale(0.96)",
      },
    ];
  }

  return [];
}
