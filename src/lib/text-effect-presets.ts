import type {
  TextOverlaySettings,
  TextShadowPresetId,
} from "@/types/editor";

type TextShadowPresetSettings = Pick<
  TextOverlaySettings,
  | "textShadowBlur"
  | "textShadowColor"
  | "textShadowDepth"
  | "textShadowMode"
  | "textShadowOffsetX"
  | "textShadowOffsetY"
  | "textShadowOpacity"
>;

export type TextShadowPreset = TextShadowPresetSettings & {
  id: Exclude<TextShadowPresetId, "custom">;
  name: string;
};

type TextShadowCssSettings = TextShadowPresetSettings &
  Pick<TextOverlaySettings, "textShadowEnabled">;

const FALLBACK_SHADOW_COLOR = {
  b: 42,
  g: 23,
  r: 15,
};

export const TEXT_SHADOW_PRESETS = [
  {
    id: "soft-depth",
    name: "Soft Depth",
    textShadowMode: "drop",
    textShadowColor: "#0f172a",
    textShadowBlur: 48,
    textShadowOffsetX: 0,
    textShadowOffsetY: 18,
    textShadowOpacity: 0.28,
    textShadowDepth: 1,
  },
  {
    id: "deep-3d",
    name: "Deep 3D",
    textShadowMode: "depth",
    textShadowColor: "#111827",
    textShadowBlur: 8,
    textShadowOffsetX: 12,
    textShadowOffsetY: 12,
    textShadowOpacity: 0.58,
    textShadowDepth: 12,
  },
  {
    id: "long-shadow",
    name: "Long Shadow",
    textShadowMode: "depth",
    textShadowColor: "#334155",
    textShadowBlur: 0,
    textShadowOffsetX: 22,
    textShadowOffsetY: 22,
    textShadowOpacity: 0.42,
    textShadowDepth: 22,
  },
  {
    id: "neon",
    name: "Neon",
    textShadowMode: "glow",
    textShadowColor: "#a855f7",
    textShadowBlur: 32,
    textShadowOffsetX: 0,
    textShadowOffsetY: 0,
    textShadowOpacity: 0.82,
    textShadowDepth: 6,
  },
  {
    id: "fire",
    name: "Fire",
    textShadowMode: "fire",
    textShadowColor: "#f97316",
    textShadowBlur: 30,
    textShadowOffsetX: 0,
    textShadowOffsetY: 5,
    textShadowOpacity: 0.86,
    textShadowDepth: 10,
  },
  {
    id: "ice-glow",
    name: "Ice Glow",
    textShadowMode: "glow",
    textShadowColor: "#38bdf8",
    textShadowBlur: 34,
    textShadowOffsetX: 0,
    textShadowOffsetY: 0,
    textShadowOpacity: 0.74,
    textShadowDepth: 5,
  },
] as const satisfies readonly TextShadowPreset[];

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function formatPx(value: number) {
  const roundedValue = Math.round(value * 100) / 100;

  return `${roundedValue}px`;
}

function hexToRgb(color: string) {
  const normalizedColor = color.trim().replace(/^#/, "");
  const hex =
    normalizedColor.length === 3
      ? normalizedColor
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalizedColor;

  if (!/^[\da-f]{6}$/i.test(hex)) {
    return FALLBACK_SHADOW_COLOR;
  }

  const colorValue = Number.parseInt(hex, 16);

  return {
    b: colorValue & 255,
    g: (colorValue >> 8) & 255,
    r: (colorValue >> 16) & 255,
  };
}

function createRgba(color: string, opacity: number) {
  const rgb = hexToRgb(color);
  const alpha = Math.round(clamp(opacity, 0, 1) * 1000) / 1000;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function createShadowLayer(
  offsetX: number,
  offsetY: number,
  blur: number,
  color: string,
  opacity: number,
) {
  return `${formatPx(offsetX)} ${formatPx(offsetY)} ${formatPx(
    Math.max(0, blur),
  )} ${createRgba(color, opacity)}`;
}

function createDropShadowCss({
  textShadowBlur,
  textShadowColor,
  textShadowOffsetX,
  textShadowOffsetY,
  textShadowOpacity,
}: TextShadowPresetSettings) {
  const smallYOffset = textShadowOffsetY === 0 ? 1 : Math.sign(textShadowOffsetY);

  return [
    createShadowLayer(
      textShadowOffsetX * 0.08,
      smallYOffset,
      Math.min(2, Math.max(1, textShadowBlur * 0.08)),
      textShadowColor,
      Math.min(0.24, textShadowOpacity * 0.72),
    ),
    createShadowLayer(
      textShadowOffsetX,
      textShadowOffsetY,
      textShadowBlur,
      textShadowColor,
      textShadowOpacity,
    ),
  ].join(", ");
}

function createDepthShadowCss({
  textShadowBlur,
  textShadowColor,
  textShadowDepth,
  textShadowOffsetX,
  textShadowOffsetY,
  textShadowOpacity,
}: TextShadowPresetSettings) {
  const depth = Math.round(clamp(textShadowDepth, 0, 28));

  if (depth <= 0) {
    return createDropShadowCss({
      textShadowBlur,
      textShadowColor,
      textShadowDepth,
      textShadowMode: "drop",
      textShadowOffsetX,
      textShadowOffsetY,
      textShadowOpacity,
    });
  }

  const targetOffsetX = textShadowOffsetX || depth;
  const targetOffsetY = textShadowOffsetY || depth;
  const layers = Array.from({ length: depth }, (_, index) => {
    const layerIndex = index + 1;
    const progress = layerIndex / depth;
    const fade = 1 - progress * 0.32;

    return createShadowLayer(
      (targetOffsetX * layerIndex) / depth,
      (targetOffsetY * layerIndex) / depth,
      0,
      textShadowColor,
      textShadowOpacity * fade,
    );
  });

  if (textShadowBlur > 0) {
    layers.push(
      createShadowLayer(
        targetOffsetX,
        targetOffsetY,
        textShadowBlur,
        textShadowColor,
        textShadowOpacity * 0.42,
      ),
    );
  }

  return layers.join(", ");
}

function createGlowShadowCss({
  textShadowBlur,
  textShadowColor,
  textShadowOffsetX,
  textShadowOffsetY,
  textShadowOpacity,
}: TextShadowPresetSettings) {
  const blur = Math.max(1, textShadowBlur);

  return [
    createShadowLayer(0, 0, Math.max(2, blur * 0.18), textShadowColor, textShadowOpacity),
    createShadowLayer(
      textShadowOffsetX * 0.2,
      textShadowOffsetY * 0.2,
      blur * 0.55,
      textShadowColor,
      textShadowOpacity * 0.72,
    ),
    createShadowLayer(
      textShadowOffsetX * 0.45,
      textShadowOffsetY * 0.45,
      blur * 1.15,
      textShadowColor,
      textShadowOpacity * 0.48,
    ),
    createShadowLayer(
      textShadowOffsetX,
      textShadowOffsetY,
      blur * 1.9,
      textShadowColor,
      textShadowOpacity * 0.26,
    ),
  ].join(", ");
}

function createFireShadowCss({
  textShadowBlur,
  textShadowColor,
  textShadowDepth,
  textShadowOffsetX,
  textShadowOffsetY,
  textShadowOpacity,
}: TextShadowPresetSettings) {
  const blur = Math.max(1, textShadowBlur);
  const lift = Math.max(1, textShadowDepth * 0.2);
  const falloff = Math.max(2, textShadowDepth * 0.42);

  return [
    createShadowLayer(0, -lift, blur * 0.24, "#fef3c7", textShadowOpacity * 0.82),
    createShadowLayer(
      textShadowOffsetX * 0.2,
      textShadowOffsetY * 0.2,
      blur * 0.58,
      textShadowColor,
      textShadowOpacity,
    ),
    createShadowLayer(
      textShadowOffsetX * 0.5,
      textShadowOffsetY + falloff,
      blur * 1.05,
      "#ef4444",
      textShadowOpacity * 0.72,
    ),
    createShadowLayer(
      textShadowOffsetX,
      textShadowOffsetY + falloff * 1.5,
      blur * 1.75,
      "#7f1d1d",
      textShadowOpacity * 0.42,
    ),
    createShadowLayer(0, 0, blur * 2.2, "#facc15", textShadowOpacity * 0.26),
  ].join(", ");
}

export function getTextShadowPreset(presetId: TextShadowPresetId) {
  return (
    TEXT_SHADOW_PRESETS.find((preset) => preset.id === presetId) ??
    TEXT_SHADOW_PRESETS[0]
  );
}

export function createTextShadowPresetSettings(
  presetId: TextShadowPresetId,
): Pick<
  TextOverlaySettings,
  | "textShadowBlur"
  | "textShadowColor"
  | "textShadowDepth"
  | "textShadowEnabled"
  | "textShadowMode"
  | "textShadowOffsetX"
  | "textShadowOffsetY"
  | "textShadowOpacity"
  | "textShadowPresetId"
> {
  const preset = getTextShadowPreset(presetId);

  return {
    textShadowEnabled: true,
    textShadowPresetId: preset.id,
    textShadowMode: preset.textShadowMode,
    textShadowColor: preset.textShadowColor,
    textShadowBlur: preset.textShadowBlur,
    textShadowOffsetX: preset.textShadowOffsetX,
    textShadowOffsetY: preset.textShadowOffsetY,
    textShadowOpacity: preset.textShadowOpacity,
    textShadowDepth: preset.textShadowDepth,
  };
}

export function createTextShadowCss(settings: TextShadowCssSettings) {
  if (!settings.textShadowEnabled || settings.textShadowOpacity <= 0) {
    return "none";
  }

  const { textShadowMode } = settings;

  if (textShadowMode === "depth") {
    return createDepthShadowCss(settings);
  }

  if (textShadowMode === "glow") {
    return createGlowShadowCss(settings);
  }

  if (textShadowMode === "fire") {
    return createFireShadowCss(settings);
  }

  return createDropShadowCss(settings);
}
