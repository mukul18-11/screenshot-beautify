"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import type { DesignTemplate } from "@/types/editor";

type TemplateCardProps = {
  isActive: boolean;
  onApply: () => void;
  template: DesignTemplate;
};

function createPreviewShadow(
  blur: number,
  opacity: number,
  offsetY: number,
) {
  if (opacity <= 0 || blur <= 0) {
    return "none";
  }

  return `0 ${Math.max(4, offsetY / 4)}px ${Math.max(10, blur / 2.5)}px rgba(15, 23, 42, ${opacity})`;
}

function TemplatePreview({
  isActive,
  template,
}: {
  isActive: boolean;
  template: DesignTemplate;
}) {
  const previewShadow = createPreviewShadow(
    template.imageStyle.imageShadow.blur,
    template.imageStyle.imageShadow.opacity,
    template.imageStyle.imageShadow.offsetY,
  );
  const hasTextOverlay = template.textOverlay.textOverlayEnabled;

  return (
    <div
      className={cn(
        "relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        isActive
          ? "border-white/20 dark:border-slate-950/10"
          : "border-white/80 dark:border-white/10",
      )}
      style={{ background: template.background.backgroundValue }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:14px_14px] opacity-30" />

      {hasTextOverlay && (
        <div
          className={cn(
            "absolute h-1 rounded-full bg-current opacity-80",
            template.textOverlay.textPosition === "bottom"
              ? "bottom-2"
              : "top-2",
            template.textOverlay.textAlign === "left"
              ? "left-2 w-8"
              : "left-1/2 w-10 -translate-x-1/2",
          )}
          style={{ color: template.textOverlay.textColor }}
        />
      )}

      <div
        className={cn(
          "relative overflow-hidden bg-white/95 ring-1 ring-slate-950/5",
          template.imageStyle.imageBorderEnabled && "border border-white/70",
          template.browserFrame.browserFrameTheme === "dark" &&
            "bg-slate-900 ring-white/10",
        )}
        style={{
          width: "52px",
          height: "34px",
          borderRadius: `${Math.max(5, template.imageStyle.imageRadius / 4)}px`,
          boxShadow: previewShadow,
          transform: template.tilt.tiltEnabled
            ? `perspective(${template.tilt.perspective / 4}px) rotateX(${template.tilt.rotateX / 2}deg) rotateY(${template.tilt.rotateY / 2}deg) rotateZ(${template.tilt.rotateZ / 2}deg) scale(${template.imageStyle.imageScale / 100})`
            : `scale(${template.imageStyle.imageScale / 100})`,
        }}
      >
        {template.browserFrame.browserFrameEnabled && (
          <div
            className={cn(
              "flex h-2.5 items-center gap-0.5 px-1.5",
              template.browserFrame.browserFrameTheme === "dark"
                ? "bg-slate-800"
                : "bg-slate-100",
            )}
          >
            <span className="h-1 w-1 rounded-full bg-rose-400" />
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
          </div>
        )}
        <div className="space-y-1 p-1.5">
          <div
            className={cn(
              "h-1 w-8 rounded-full",
              template.browserFrame.browserFrameTheme === "dark"
                ? "bg-white/40"
                : "bg-slate-300",
            )}
          />
          <div
            className={cn(
              "h-1 w-6 rounded-full",
              template.browserFrame.browserFrameTheme === "dark"
                ? "bg-white/25"
                : "bg-slate-200",
            )}
          />
          <div
            className={cn(
              "h-1 w-9 rounded-full",
              template.browserFrame.browserFrameTheme === "dark"
                ? "bg-white/25"
                : "bg-slate-200",
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default function TemplateCard({
  isActive,
  onApply,
  template,
}: TemplateCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      whileHover={{ y: shouldReduceMotion ? 0 : -1 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.99 }}
      aria-label={`Apply ${template.name} template`}
      aria-pressed={isActive}
      onClick={onApply}
      className={cn(
        "group w-full rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
        isActive
          ? "border-indigo-500 bg-[linear-gradient(135deg,#14b8a6,#6366f1)] text-white shadow-lg shadow-indigo-500/20"
          : "border-slate-200 bg-white/70 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10",
      )}
    >
      <div className="flex gap-3">
        <TemplatePreview isActive={isActive} template={template} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold leading-5">
                {template.name}
              </h4>
              <span
                className={cn(
                  "mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold leading-4",
                  isActive
                    ? "bg-white/12 text-white/75 dark:bg-slate-950/10 dark:text-slate-600"
                    : "bg-slate-950/5 text-slate-500 dark:bg-white/10 dark:text-slate-300",
                )}
              >
                {template.category}
              </span>
            </div>

            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 dark:bg-slate-950 dark:text-white"
              >
                <Check className="h-3 w-3" aria-hidden="true" />
              </motion.span>
            )}
          </div>

          <p
            className={cn(
              "mt-2 line-clamp-2 text-xs leading-4",
              isActive
                ? "text-white/70 dark:text-slate-600"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            {template.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
