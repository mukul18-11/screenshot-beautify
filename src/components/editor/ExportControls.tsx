"use client";

import { useRef } from "react";

import {
  CheckCircle2,
  Clipboard,
  Download,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import { useExportImage } from "@/components/editor/ExportProvider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getExportPixelSize } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import { useEditorStore, type UploadedImage } from "@/store/editor-store";
import type { ExportScale } from "@/types/editor";

type ExportControlsProps = {
  uploadedImage: UploadedImage | null;
};

const EXPORT_SCALES: ExportScale[] = [1, 2, 4];
const CLEAN_ERROR_MESSAGES = new Set([
  "An image could not be loaded for export.",
  "Copying images is not supported in this browser. Please download the PNG instead.",
  "Could not copy image. Try downloading instead.",
  "Export already in progress.",
  "Export dimensions did not match the selected scale.",
  "Export dimensions must be greater than zero.",
  "Export did not produce a PNG image.",
  "No artwork is ready to export.",
  "Unable to create PNG export.",
]);

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.trim();

    if (CLEAN_ERROR_MESSAGES.has(message)) {
      return message;
    }
  }

  return "Export failed. Please try again.";
}

export default function ExportControls({ uploadedImage }: ExportControlsProps) {
  const shouldReduceMotion = useReducedMotion();
  const exportActionInFlightRef = useRef(false);
  const { copyCurrentPng, exportCurrentPng } = useExportImage();
  const canvasWidth = useEditorStore((state) => state.canvasWidth);
  const canvasHeight = useEditorStore((state) => state.canvasHeight);
  const exportScale = useEditorStore((state) => state.exportScale);
  const exportFileName = useEditorStore((state) => state.exportFileName);
  const isExporting = useEditorStore((state) => state.isExporting);
  const lastExportedAt = useEditorStore((state) => state.lastExportedAt);
  const setExportScale = useEditorStore((state) => state.setExportScale);
  const setExportFileName = useEditorStore(
    (state) => state.setExportFileName,
  );
  const exportPixelSize = getExportPixelSize(
    canvasWidth,
    canvasHeight,
    exportScale,
  );
  const isExportDisabled = !uploadedImage || isExporting;
  const shouldShowHighResHint = exportScale === 4;

  async function handleDownloadPng() {
    if (!uploadedImage || isExporting || exportActionInFlightRef.current) {
      return;
    }

    exportActionInFlightRef.current = true;

    try {
      await exportCurrentPng();
      toast.success("PNG downloaded");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      exportActionInFlightRef.current = false;
    }
  }

  async function handleCopyImage() {
    if (!uploadedImage || isExporting || exportActionInFlightRef.current) {
      return;
    }

    exportActionInFlightRef.current = true;

    try {
      await copyCurrentPng();
      toast.success("Image copied to clipboard.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      exportActionInFlightRef.current = false;
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="border-b border-slate-200/70 py-5 dark:border-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Export
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
            Download or copy your final screenshot design.
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-slate-200/80 bg-white/75 px-2.5 py-1 text-[11px] font-semibold text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
          PNG
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="min-w-0 rounded-xl bg-slate-50/90 px-2 py-2 dark:bg-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-normal text-slate-400 dark:text-slate-500">
                Format
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-white">
                PNG
              </p>
            </div>
            <div className="min-w-0 rounded-xl bg-slate-50/90 px-2 py-2 dark:bg-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-normal text-slate-400 dark:text-slate-500">
                Scale
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-white">
                {exportScale}x
              </p>
            </div>
            <div className="min-w-0 rounded-xl bg-slate-50/90 px-2 py-2 dark:bg-white/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-normal text-slate-400 dark:text-slate-500">
                Size
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-900 dark:text-white">
                {exportPixelSize.width} x {exportPixelSize.height} px
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-300">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              Export happens in your browser.
            </span>
            {lastExportedAt && (
              <span className="inline-flex min-w-0 items-center gap-1.5 text-emerald-600 dark:text-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Exported just now
              </span>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="export-scale"
            className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-300"
          >
            Export scale
          </Label>
          <div
            id="export-scale"
            role="radiogroup"
            aria-label="Export scale"
            className="mt-2 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/80 bg-white/60 p-1.5 shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
          >
            {EXPORT_SCALES.map((scale) => {
              const isSelected = exportScale === scale;

              return (
                <button
                  key={scale}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setExportScale(scale)}
                  className={cn(
                    "h-9 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
                    isSelected
                      ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  {scale}x
                </button>
              );
            })}
          </div>
          {shouldShowHighResHint && (
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-slate-500 dark:text-slate-300"
            >
              <Info
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              Best for high-resolution posts and landing pages.
            </motion.p>
          )}
        </div>

        <div>
          <Label
            htmlFor="export-file-name"
            className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-300"
          >
            File name
          </Label>
          <input
            id="export-file-name"
            type="text"
            value={exportFileName}
            onChange={(event) => setExportFileName(event.target.value)}
            placeholder="screenshot-beautifier"
            className="mt-2 h-10 w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/10"
          />
        </div>

        {!uploadedImage && (
          <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            Upload a screenshot to export.
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
          <Button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportDisabled}
            className="w-full min-w-0 bg-slate-950 px-3 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            {isExporting ? (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">
              {isExporting ? "Exporting..." : "Download PNG"}
            </span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyImage}
            disabled={isExportDisabled}
            className="w-full min-w-0 border border-white/70 bg-white/85 px-3 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
          >
            {isExporting ? (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Clipboard className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">
              {isExporting ? "Exporting..." : "Copy image"}
            </span>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
