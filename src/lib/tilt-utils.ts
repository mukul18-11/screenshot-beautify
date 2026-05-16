import type { TiltSettings } from "@/types/editor";

export type TiltTransformSettings = Pick<
  TiltSettings,
  "perspective" | "rotateX" | "rotateY" | "rotateZ" | "translateY"
>;

function formatNumber(value: number) {
  return Number(value.toFixed(3));
}

export function buildTiltTransform(settings: TiltTransformSettings) {
  return [
    `perspective(${formatNumber(settings.perspective)}px)`,
    `rotateX(${formatNumber(settings.rotateX)}deg)`,
    `rotateY(${formatNumber(settings.rotateY)}deg)`,
    `rotateZ(${formatNumber(settings.rotateZ)}deg)`,
    `translateY(${formatNumber(settings.translateY)}px)`,
  ].join(" ");
}

export function createTiltTransformCss(settings: TiltTransformSettings) {
  return buildTiltTransform(settings);
}

export function createFlatTiltTransformCss() {
  return buildTiltTransform({
    perspective: 1200,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    translateY: 0,
  });
}

export function createParallaxTransformCss(
  offsetX: number,
  offsetY: number,
  strength: number,
) {
  const normalizedStrength = Math.max(0, strength);

  return `translate3d(${formatNumber(
    offsetX * normalizedStrength,
  )}px, ${formatNumber(offsetY * normalizedStrength)}px, 0)`;
}

export function multiplyTiltShadow(
  shadowValue: number,
  tiltShadowMultiplier: number,
) {
  return shadowValue * Math.max(0, tiltShadowMultiplier);
}
