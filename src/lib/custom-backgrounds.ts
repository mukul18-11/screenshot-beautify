import type {
  CustomBackgroundConfig,
  CustomBackgroundPatternId,
} from "@/types/editor";

const DEFAULT_CUSTOM_COLOR_A = "#f8fafc";
const DEFAULT_CUSTOM_COLOR_B = "#030712";
const DEFAULT_CUSTOM_COLOR_C = "#334155";

export const DEFAULT_CUSTOM_BACKGROUND_CONFIG: CustomBackgroundConfig = {
  patternId: "radial",
  colorA: DEFAULT_CUSTOM_COLOR_A,
  colorB: DEFAULT_CUSTOM_COLOR_B,
  colorC: DEFAULT_CUSTOM_COLOR_C,
  angle: 135,
};

const EDITABLE_PRESET_CONFIGS: Record<string, CustomBackgroundConfig> = {
  "blue-arc-ribbons": {
    patternId: "arc-ribbons",
    colorA: "#22d3ee",
    colorB: "#2563eb",
    colorC: "#020617",
    angle: 135,
  },
  "neon-grid-glow": {
    patternId: "grid-glow",
    colorA: "#38bdf8",
    colorB: "#22d3ee",
    colorC: "#020617",
    angle: 135,
  },
  "liquid-chrome": {
    patternId: "liquid-chrome",
    colorA: "#f8fafc",
    colorB: "#60a5fa",
    colorC: "#111827",
    angle: 135,
  },
  "product-hunt-orange": {
    patternId: "radial",
    colorA: "#fb923c",
    colorB: "#f59e0b",
    colorC: "#fff7ed",
    angle: 135,
  },
  "classic-ocean-blue": {
    patternId: "linear",
    colorA: "#082f49",
    colorB: "#bae6fd",
    colorC: "#0284c7",
    angle: 135,
  },
  "classic-mint-glass": {
    patternId: "linear",
    colorA: "#ecfeff",
    colorB: "#f0fdfa",
    colorC: "#99f6e4",
    angle: 135,
  },
  "classic-soft-peach": {
    patternId: "linear",
    colorA: "#fff7ed",
    colorB: "#fbcfe8",
    colorC: "#fed7aa",
    angle: 135,
  },
  "classic-cyber-lime": {
    patternId: "radial",
    colorA: "#bef264",
    colorB: "#22d3ee",
    colorC: "#052e16",
    angle: 135,
  },
  "classic-deep-space": {
    patternId: "radial",
    colorA: "#6366f1",
    colorB: "#ec4899",
    colorC: "#020617",
    angle: 135,
  },
  "classic-product-hunt-orange": {
    patternId: "linear",
    colorA: "#ff6154",
    colorB: "#fff1d6",
    colorC: "#ff8a3d",
    angle: 135,
  },
};

export function cloneCustomBackgroundConfig(
  config: CustomBackgroundConfig,
): CustomBackgroundConfig {
  return { ...config };
}

export function getEditablePresetCustomBackgroundConfig(presetId: string) {
  const config = EDITABLE_PRESET_CONFIGS[presetId];

  return config ? cloneCustomBackgroundConfig(config) : null;
}

function hexToRgb(color: string) {
  const normalizedColor = color.trim().replace(/^#/, "");
  const colorValue = Number.parseInt(normalizedColor, 16);

  return {
    r: (colorValue >> 16) & 255,
    g: (colorValue >> 8) & 255,
    b: colorValue & 255,
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHexColors(colorA: string, colorB: string, colorBWeight: number) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  const colorAWeight = 1 - colorBWeight;

  return rgbToHex({
    r: rgbA.r * colorAWeight + rgbB.r * colorBWeight,
    g: rgbA.g * colorAWeight + rgbB.g * colorBWeight,
    b: rgbA.b * colorAWeight + rgbB.b * colorBWeight,
  });
}

export function createCustomGradient({
  patternId,
  colorA,
  colorB,
  colorC,
  angle,
}: CustomBackgroundConfig) {
  if (patternId === "linear") {
    return `linear-gradient(${angle}deg, ${colorA} 0%, ${colorC} 50%, ${colorB} 100%)`;
  }

  if (patternId === "arc-ribbons") {
    return [
      `radial-gradient(120% 82% at 56% 116%, transparent 0 38%, ${colorA} 38% 47%, transparent 47% 54%, ${colorB} 54% 63%, transparent 63% 70%, ${mixHexColors(
        colorA,
        colorB,
        0.45,
      )} 70% 77%, transparent 77%)`,
      `radial-gradient(at 78% 28%, ${mixHexColors(
        colorA,
        "#ffffff",
        0.24,
      )} 0%, transparent 34%)`,
      `radial-gradient(at 16% 22%, ${mixHexColors(
        colorB,
        "#ffffff",
        0.16,
      )} 0%, transparent 32%)`,
      "radial-gradient(rgba(255, 255, 255, 0.16) 0.7px, transparent 0.7px) 0 0 / 12px 12px",
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.68,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "contours") {
    return [
      `radial-gradient(ellipse at 24% 84%, transparent 0 18%, ${colorA} 18% 19.5%, transparent 19.5% 31%, ${colorB} 31% 32.5%, transparent 32.5% 44%, ${mixHexColors(
        colorA,
        colorB,
        0.5,
      )} 44% 45.5%, transparent 45.5%)`,
      `radial-gradient(ellipse at 84% 12%, transparent 0 16%, ${colorB} 16% 17.5%, transparent 17.5% 30%, ${colorA} 30% 31.5%, transparent 31.5%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.62,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "grid-glow") {
    return [
      `linear-gradient(${mixHexColors(
        colorA,
        "#000000",
        0.2,
      )} 1px, transparent 1px) 0 0 / 34px 34px`,
      `linear-gradient(90deg, ${mixHexColors(
        colorA,
        "#000000",
        0.24,
      )} 1px, transparent 1px) 0 0 / 34px 34px`,
      `radial-gradient(at 50% 92%, ${colorB} 0%, transparent 46%)`,
      `radial-gradient(at 78% 18%, ${colorA} 0%, transparent 34%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.5,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "liquid-chrome") {
    return [
      `radial-gradient(90% 44% at 12% 22%, ${colorA} 0%, transparent 44%)`,
      `radial-gradient(82% 42% at 82% 22%, ${colorB} 0%, transparent 48%)`,
      `linear-gradient(142deg, ${mixHexColors(
        colorA,
        colorC,
        0.12,
      )} 0 8%, transparent 18% 28%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.26,
      )} 38%, transparent 50%, ${mixHexColors(
        colorA,
        colorB,
        0.18,
      )} 62%, transparent 76%)`,
      `radial-gradient(120% 76% at 50% 116%, ${mixHexColors(
        colorC,
        "#000000",
        0.72,
      )} 0%, ${colorC} 54%, ${mixHexColors(colorC, "#000000", 0.78)} 100%)`,
    ].join(", ");
  }

  if (patternId === "velvet-storm") {
    return [
      `conic-gradient(from 220deg at 48% 54%, ${colorA}, ${colorB}, transparent 34%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.1,
      )}, ${mixHexColors(colorA, colorC, 0.32)})`,
      `radial-gradient(64% 54% at 50% 50%, ${mixHexColors(
        colorA,
        "#ffffff",
        0.2,
      )} 0%, transparent 54%)`,
      `radial-gradient(78% 52% at 82% 12%, ${colorB} 0%, transparent 46%)`,
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#000000",
        0.76,
      )} 100%)`,
    ].join(", ");
  }

  if (patternId === "spotlight") {
    return [
      `radial-gradient(70% 54% at 50% 0%, ${colorA} 0%, transparent 56%)`,
      `radial-gradient(64% 46% at 52% 86%, ${colorB} 0%, transparent 62%)`,
      "radial-gradient(rgba(255, 255, 255, 0.12) 0.7px, transparent 0.7px) 0 0 / 14px 14px",
      `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
        colorC,
        "#ffffff",
        0.08,
      )} 54%, ${mixHexColors(colorC, "#000000", 0.72)} 100%)`,
    ].join(", ");
  }

  return [
    `radial-gradient(at 18% 24%, ${colorA} 0%, transparent 42%)`,
    `radial-gradient(at 78% 16%, ${colorB} 0%, transparent 58%)`,
    `radial-gradient(at 50% 80%, ${mixHexColors(
      colorC,
      colorB,
      0.34,
    )} 0%, transparent 52%)`,
    `linear-gradient(135deg, ${colorC} 0%, ${mixHexColors(
      colorC,
      "#000000",
      0.45,
    )} 100%)`,
  ].join(", ");
}

export function getCustomBackgroundType(config: CustomBackgroundConfig) {
  return config.patternId === "linear" ? "gradient" : "mesh";
}

export function getCustomPatternOptions(patternId: CustomBackgroundPatternId) {
  const options: { id: CustomBackgroundPatternId; label: string }[] = [
    { id: "radial", label: "Radial" },
    { id: "linear", label: "Linear" },
  ];

  if (patternId !== "linear" && patternId !== "radial") {
    return [{ id: patternId, label: "Pattern" }, ...options];
  }

  return options;
}
