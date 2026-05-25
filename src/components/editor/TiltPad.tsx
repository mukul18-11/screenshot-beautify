"use client";

import { useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { buildTiltTransform } from "@/lib/tilt-utils";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

/* ------------------------------------------------------------------ */
/*  Range helpers                                                      */
/* ------------------------------------------------------------------ */

const X_LIMITS = BEAUTIFY_SETTING_LIMITS.rotateX; // { min: -30, max: 30, step: 1 }
const Y_LIMITS = BEAUTIFY_SETTING_LIMITS.rotateY; // { min: -35, max: 35, step: 1 }
const X_SPAN = X_LIMITS.max - X_LIMITS.min; // 60
const Y_SPAN = Y_LIMITS.max - Y_LIMITS.min; // 70

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function snap(v: number, step: number) {
  return Math.round(v / step) * step;
}

/** Normalised pad Y (0 = top, 1 = bottom) → rotateX degrees. */
function padToRotateX(normY: number) {
  return snap(X_LIMITS.max - normY * X_SPAN, X_LIMITS.step);
}

/** Normalised pad X (0 = left, 1 = right) → rotateY degrees. */
function padToRotateY(normX: number) {
  return snap(Y_LIMITS.min + normX * Y_SPAN, Y_LIMITS.step);
}

/** rotateX degrees → normalised pad Y. */
function rotateXToNormY(rx: number) {
  return clamp((X_LIMITS.max - rx) / X_SPAN, 0, 1);
}

/** rotateY degrees → normalised pad X. */
function rotateYToNormX(ry: number) {
  return clamp((ry - Y_LIMITS.min) / Y_SPAN, 0, 1);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface TiltPadProps {
  disabled?: boolean;
}

export default function TiltPad({ disabled = false }: TiltPadProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  /* Store reads ---------------------------------------------------- */
  const rotateX = useEditorStore((s) => s.rotateX);
  const rotateY = useEditorStore((s) => s.rotateY);
  const perspective = useEditorStore((s) => s.perspective);
  const rotateZ = useEditorStore((s) => s.rotateZ);
  const setRotateX = useEditorStore((s) => s.setRotateX);
  const setRotateY = useEditorStore((s) => s.setRotateY);
  const setRotateZ = useEditorStore((s) => s.setRotateZ);
  const backgroundValue = useEditorStore((s) => s.backgroundValue);
  const uploadedImage = useEditorStore((s) => s.uploadedImage);
  const screenshots = useEditorStore((s) => s.screenshots);

  /* Indicator position --------------------------------------------- */
  const normX = rotateYToNormX(rotateY);
  const normY = rotateXToNormY(rotateX);

  /* Pointer handlers ----------------------------------------------- */
  const applyPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = padRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = clamp((clientX - rect.left) / rect.width, 0, 1);
      const ny = clamp((clientY - rect.top) / rect.height, 0, 1);
      setRotateX(padToRotateX(ny));
      setRotateY(padToRotateY(nx));
    },
    [setRotateX, setRotateY],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      dragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      applyPointer(e.clientX, e.clientY);
    },
    [disabled, applyPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      applyPointer(e.clientX, e.clientY);
    },
    [applyPointer],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  /* Reset handler -------------------------------------------------- */
  const resetRotation = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setRotateZ(0);
  }, [setRotateX, setRotateY, setRotateZ]);

  const isFlat = rotateX === 0 && rotateY === 0 && rotateZ === 0;
  const fmtDeg = (v: number) => `${v > 0 ? "+" : ""}${v}°`;

  /* Resolve the image to display ----------------------------------- */
  const imageUrl =
    uploadedImage?.objectUrl ??
    screenshots?.find((s) => s.isPlaced)?.uploadedImage?.objectUrl ??
    screenshots?.[0]?.uploadedImage?.objectUrl ??
    null;

  return (
    <div
      className={cn(
        "space-y-2.5",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {/* ---- Pad surface ---- */}
      <div
        ref={padRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-[160px] w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-slate-200 dark:border-white/10"
        style={{ background: backgroundValue }}
        aria-label="Tilt adjustment pad — drag to set Tilt X and Tilt Y"
        aria-valuetext={`Tilt X: ${rotateX}°, Tilt Y: ${rotateY}°`}
        tabIndex={disabled ? -1 : 0}
      >
        {/* subtle dark overlay for contrast */}
        <div className="pointer-events-none absolute inset-0 bg-black/10" />

        {/* "Drag to tilt" label */}
        <span className="pointer-events-none absolute right-2.5 top-2 select-none rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
          Drag to tilt
        </span>

        {/* live 3D mini-preview */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="overflow-hidden rounded-md shadow-2xl shadow-black/40 ring-1 ring-white/20"
            style={{
              transform: buildTiltTransform({
                perspective,
                rotateX,
                rotateY,
                rotateZ,
                translateY: 0,
              }),
              transformStyle: "preserve-3d",
              transition: "transform 120ms ease-out",
            }}
          >
            {imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl}
                alt=""
                className="block h-[112px] w-auto max-w-[185px] object-cover"
                draggable={false}
              />
            ) : (
              /* Fallback generic mockup when no image is uploaded */
              <div className="h-[52px] w-[84px] bg-white">
                <div className="flex h-[10px] items-center gap-[3px] bg-slate-100 px-1.5">
                  <span className="h-[4px] w-[4px] rounded-full bg-red-400/70" />
                  <span className="h-[4px] w-[4px] rounded-full bg-yellow-400/70" />
                  <span className="h-[4px] w-[4px] rounded-full bg-green-400/70" />
                </div>
                <div className="space-y-[3px] p-[6px]">
                  <div className="h-[3px] w-10 rounded-full bg-slate-200" />
                  <div className="h-[3px] w-14 rounded-full bg-slate-100" />
                  <div className="h-[3px] w-6 rounded-full bg-slate-100" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* coordinate labels */}
        <span className="pointer-events-none absolute bottom-2 left-2.5 select-none rounded bg-black/30 px-1 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur-sm">
          X {fmtDeg(rotateX)}
        </span>
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none font-mono text-[8px] uppercase tracking-wider text-white/40">
          drag card to tilt
        </span>
        <span className="pointer-events-none absolute bottom-2 right-2.5 select-none rounded bg-black/30 px-1 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur-sm">
          Y {fmtDeg(rotateY)}
        </span>

        {/* crosshair indicator */}
        <div
          className="pointer-events-none absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${normX * 100}%`,
            top: `${normY * 100}%`,
            transition: "left 75ms ease-out, top 75ms ease-out",
          }}
        >
          <span className="absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_0_8px_rgba(0,0,0,0.2)]" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_2px_rgba(0,0,0,0.4)]" />
        </div>
      </div>

      {/* ---- Value readouts ---- */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center justify-between rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Tilt X
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-slate-700 dark:text-white">
            {fmtDeg(rotateX)}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-between rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Tilt Y
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-slate-700 dark:text-white">
            {fmtDeg(rotateY)}
          </span>
        </div>
      </div>

      <EditorSliderRow
        label="Screenshot rotate"
        labelClassName="text-slate-600 dark:text-slate-300"
        min={BEAUTIFY_SETTING_LIMITS.rotateZ.min}
        max={BEAUTIFY_SETTING_LIMITS.rotateZ.max}
        step={BEAUTIFY_SETTING_LIMITS.rotateZ.step}
        value={rotateZ}
        suffix="deg"
        onChange={setRotateZ}
      />

      {/* ---- Reset ---- */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={resetRotation}
        disabled={isFlat}
        className="w-full gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 disabled:opacity-30"
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" />
        Reset Tilt
      </Button>
    </div>
  );
}
