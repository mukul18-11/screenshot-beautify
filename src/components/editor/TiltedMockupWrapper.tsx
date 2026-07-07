"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useReducedMotion } from "motion/react";

import { buildTiltTransform } from "@/lib/tilt-utils";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { TiltSettings } from "@/types/editor";

type TiltedMockupWrapperProps = {
  children: ReactNode;
  className?: string;
  isTransforming?: boolean;
  settings?: Pick<
    TiltSettings,
    | "tiltEnabled"
    | "perspective"
    | "rotateX"
    | "rotateY"
    | "rotateZ"
    | "translateY"
    | "hoverTiltEnabled"
    | "hoverTiltSensitivity"
  >;
  style?: CSSProperties;
};

export default function TiltedMockupWrapper({
  children,
  className,
  isTransforming = false,
  settings,
  style,
}: TiltedMockupWrapperProps) {
  const shouldReduceMotion = useReducedMotion();
  const storeTiltEnabled = useEditorStore((state) => state.tiltEnabled);
  const storePerspective = useEditorStore((state) => state.perspective);
  const storeRotateX = useEditorStore((state) => state.rotateX);
  const storeRotateY = useEditorStore((state) => state.rotateY);
  const storeRotateZ = useEditorStore((state) => state.rotateZ);
  const storeTranslateY = useEditorStore((state) => state.translateY);
  const storeHoverTiltEnabled = useEditorStore(
    (state) => state.hoverTiltEnabled,
  );
  const storeHoverTiltSensitivity = useEditorStore(
    (state) => state.hoverTiltSensitivity,
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const tiltSettings = useMemo(
    () =>
      settings ?? {
        tiltEnabled: storeTiltEnabled,
        perspective: storePerspective,
        rotateX: storeRotateX,
        rotateY: storeRotateY,
        rotateZ: storeRotateZ,
        translateY: storeTranslateY,
        hoverTiltEnabled: storeHoverTiltEnabled,
        hoverTiltSensitivity: storeHoverTiltSensitivity,
      },
    [
      settings,
      storeHoverTiltEnabled,
      storeHoverTiltSensitivity,
      storePerspective,
      storeRotateX,
      storeRotateY,
      storeRotateZ,
      storeTiltEnabled,
      storeTranslateY,
    ],
  );
  const baseTransform = useMemo(
    () => (tiltSettings.tiltEnabled ? buildTiltTransform(tiltSettings) : "none"),
    [tiltSettings],
  );
  const canHoverTilt =
    tiltSettings.tiltEnabled &&
    tiltSettings.hoverTiltEnabled &&
    !shouldReduceMotion;

  const applyTransform = useCallback(
    (hoverRotateX = 0, hoverRotateY = 0) => {
      const element = wrapperRef.current;

      if (!element) {
        return;
      }

      if (!tiltSettings.tiltEnabled) {
        element.style.transform = "none";
        return;
      }

      element.style.transform = buildTiltTransform({
        ...tiltSettings,
        rotateX: tiltSettings.rotateX + hoverRotateX,
        rotateY: tiltSettings.rotateY + hoverRotateY,
      });
    },
    [tiltSettings],
  );

  const scheduleTransform = useCallback(
    (hoverRotateX = 0, hoverRotateY = 0) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        applyTransform(hoverRotateX, hoverRotateY);
        frameRef.current = null;
      });
    },
    [applyTransform],
  );

  useEffect(() => {
    applyTransform();

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [applyTransform]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canHoverTilt || event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width;
    const offsetY = (event.clientY - bounds.top) / bounds.height;
    const normalizedX = offsetX * 2 - 1;
    const normalizedY = offsetY * 2 - 1;
    const hoverRotateX = -normalizedY * tiltSettings.hoverTiltSensitivity * 0.45;
    const hoverRotateY = normalizedX * tiltSettings.hoverTiltSensitivity * 0.55;

    scheduleTransform(hoverRotateX, hoverRotateY);
  }

  function handlePointerLeave() {
    if (!canHoverTilt) {
      return;
    }

    scheduleTransform();
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("origin-center", className)}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{
        ...style,
        transform: baseTransform,
        transformStyle: "preserve-3d",
        transition: shouldReduceMotion || isTransforming || !tiltSettings.tiltEnabled
          ? undefined
          : "transform 250ms ease-out",
        willChange:
          tiltSettings.tiltEnabled
            ? "transform"
            : undefined,
      }}
    >
      {children}
    </div>
  );
}
