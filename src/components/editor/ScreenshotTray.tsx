"use client";

import { Image as ImageIcon, Plus, RefreshCw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MAX_SCREENSHOT_UPLOADS,
  useEditorStore,
} from "@/store/editor-store";

type ScreenshotTrayProps = {
  isUploading?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  onReplace?: () => void;
};

export default function ScreenshotTray({
  isUploading = false,
  onAdd,
  onRemove,
  onReplace,
}: ScreenshotTrayProps) {
  const shouldReduceMotion = useReducedMotion();
  const screenshots = useEditorStore((state) => state.screenshots);
  const activeScreenshotId = useEditorStore((state) => state.activeScreenshotId);
  const isExporting = useEditorStore((state) => state.isExporting);
  const selectScreenshot = useEditorStore((state) => state.selectScreenshot);
  const isAtLimit = screenshots.length >= MAX_SCREENSHOT_UPLOADS;
  const isBusy = isUploading || isExporting;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/75 bg-white/78 p-2 shadow-sm shadow-slate-950/[0.04] backdrop-blur-xl">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div
          role="list"
          aria-label="Uploaded screenshots"
          className="flex w-max min-w-full items-center gap-2"
        >
          {screenshots.map((screenshot, index) => {
            const isSelected = screenshot.id === activeScreenshotId;

            return (
              <div key={screenshot.id} role="listitem" className="shrink-0">
                <motion.button
                  type="button"
                  aria-label={`Edit screenshot ${index + 1}: ${screenshot.uploadedImage.name}`}
                  aria-pressed={isSelected}
                  disabled={isBusy}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectScreenshot(screenshot.id);
                  }}
                  whileHover={{ y: shouldReduceMotion || isBusy ? 0 : -1 }}
                  whileTap={{
                    scale: shouldReduceMotion || isBusy ? 1 : 0.98,
                  }}
                  className={cn(
                    "group relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border bg-slate-100 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-slate-950/20",
                    isSelected
                      ? "border-slate-950 ring-2 ring-slate-950/12"
                      : "border-white/80 hover:border-slate-300",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="block h-full w-full"
                    style={{
                      backgroundImage: `url(${screenshot.uploadedImage.objectUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  />
                  <span
                    className={cn(
                      "absolute left-1.5 top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold shadow-sm",
                      isSelected
                        ? "bg-slate-950 text-white"
                        : "bg-white/85 text-slate-600",
                    )}
                  >
                    {index + 1}
                  </span>
                  {isSelected && (
                    <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-inset ring-slate-950" />
                  )}
                </motion.button>
              </div>
            );
          })}

          <div role="listitem" className="shrink-0">
            <motion.button
              type="button"
              aria-label={
                isAtLimit
                  ? `Limit reached: ${MAX_SCREENSHOT_UPLOADS} screenshots`
                  : "Add screenshots"
              }
              disabled={isBusy || isAtLimit}
              onClick={(event) => {
                event.stopPropagation();
                onAdd?.();
              }}
              whileHover={{
                y: shouldReduceMotion || isBusy || isAtLimit ? 0 : -1,
              }}
              whileTap={{
                scale: shouldReduceMotion || isBusy || isAtLimit ? 1 : 0.98,
              }}
              className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/65 text-slate-500 outline-none transition hover:border-slate-400 hover:bg-white hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-45"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-l border-slate-200/70 pl-2">
        <span className="hidden min-w-10 text-center text-[11px] font-bold text-slate-500 sm:inline">
          {screenshots.length}/{MAX_SCREENSHOT_UPLOADS}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isBusy || isAtLimit}
          aria-label="Add screenshots"
          title="Add screenshots"
          onClick={(event) => {
            event.stopPropagation();
            onAdd?.();
          }}
          className="h-8 w-8 rounded-lg bg-white/65 text-slate-500 shadow-sm hover:bg-white hover:text-slate-950"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isBusy || !activeScreenshotId}
          aria-label="Replace active screenshot"
          title="Replace active screenshot"
          onClick={(event) => {
            event.stopPropagation();
            onReplace?.();
          }}
          className="h-8 w-8 rounded-lg bg-white/65 text-slate-500 shadow-sm hover:bg-white hover:text-slate-950"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isBusy || !activeScreenshotId}
          aria-label="Remove active screenshot"
          title="Remove active screenshot"
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.();
          }}
          className="h-8 w-8 rounded-lg bg-white/65 text-slate-400 shadow-sm hover:bg-white hover:text-rose-600"
        >
          {activeScreenshotId ? (
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
