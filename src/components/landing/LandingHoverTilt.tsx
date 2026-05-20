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

type LandingHoverTiltSettings = {
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  translateY?: number;
  sensitivity?: number;
};

type LandingHoverTiltProps = {
  children: ReactNode;
  className?: string;
  settings?: LandingHoverTiltSettings;
  style?: CSSProperties;
};

const DEFAULT_SETTINGS = {
  perspective: 1000,
  rotateX: 8,
  rotateY: -10,
  rotateZ: -1,
  translateY: 0,
  sensitivity: 8,
};

export default function LandingHoverTilt({
  children,
  className,
  settings,
  style,
}: LandingHoverTiltProps) {
  const shouldReduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const tiltSettings = useMemo(
    () => ({
      ...DEFAULT_SETTINGS,
      ...settings,
    }),
    [settings],
  );
  const baseTransform = useMemo(
    () => buildTiltTransform(tiltSettings),
    [tiltSettings],
  );
  const canHoverTilt = !shouldReduceMotion;

  const applyTransform = useCallback(
    (hoverRotateX = 0, hoverRotateY = 0, hoverTranslateY = 0) => {
      const element = wrapperRef.current;

      if (!element) {
        return;
      }

      element.style.transform = buildTiltTransform({
        ...tiltSettings,
        rotateX: tiltSettings.rotateX + hoverRotateX,
        rotateY: tiltSettings.rotateY + hoverRotateY,
        translateY: tiltSettings.translateY + hoverTranslateY,
      });
    },
    [tiltSettings],
  );

  const scheduleTransform = useCallback(
    (hoverRotateX = 0, hoverRotateY = 0, hoverTranslateY = 0) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        applyTransform(hoverRotateX, hoverRotateY, hoverTranslateY);
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
    const hoverRotateX = -normalizedY * tiltSettings.sensitivity * 0.45;
    const hoverRotateY = normalizedX * tiltSettings.sensitivity * 0.55;

    scheduleTransform(hoverRotateX, hoverRotateY, -4);
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
        transition: shouldReduceMotion
          ? undefined
          : "transform 100ms ease-out, box-shadow 100ms ease-out",
        willChange: shouldReduceMotion ? undefined : "transform",
      }}
    >
      {children}
    </div>
  );
}
