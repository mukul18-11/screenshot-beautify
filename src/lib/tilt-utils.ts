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

export function multiplyTiltShadow(
  shadowValue: number,
  tiltShadowMultiplier: number,
) {
  return shadowValue * Math.max(0, tiltShadowMultiplier);
}
