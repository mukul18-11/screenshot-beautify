"use client";

import { AppWindow } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { BrowserFrameStyle, BrowserFrameTheme } from "@/types/editor";

type SegmentOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
  disabled?: boolean;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly SegmentOption<TValue>[];
  value: TValue;
};

const THEME_OPTIONS = [
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
] as const satisfies readonly SegmentOption<BrowserFrameTheme>[];

const STYLE_OPTIONS = [
  {
    label: "macOS",
    value: "macos",
  },
  {
    label: "Minimal",
    value: "minimal",
  },
] as const satisfies readonly SegmentOption<BrowserFrameStyle>[];

function SegmentedControl<TValue extends string>({
  disabled = false,
  label,
  onChange,
  options,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50")}>
      <Label className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white/55 p-1 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-8 rounded-lg px-2 text-xs font-semibold transition",
                isSelected
                  ? "bg-slate-950 text-white shadow-sm hover:bg-slate-950 hover:text-white dark:bg-white dark:text-slate-950 dark:hover:bg-white"
                  : "text-slate-500 hover:bg-white/80 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default function BrowserFrameControls() {
  const shouldReduceMotion = useReducedMotion();
  const browserFrameEnabled = useEditorStore(
    (state) => state.browserFrameEnabled,
  );
  const browserFrameTheme = useEditorStore(
    (state) => state.browserFrameTheme,
  );
  const browserFrameStyle = useEditorStore(
    (state) => state.browserFrameStyle,
  );
  const browserFrameUrl = useEditorStore((state) => state.browserFrameUrl);
  const browserFrameShowUrl = useEditorStore(
    (state) => state.browserFrameShowUrl,
  );
  const toggleBrowserFrame = useEditorStore(
    (state) => state.toggleBrowserFrame,
  );
  const setBrowserFrameTheme = useEditorStore(
    (state) => state.setBrowserFrameTheme,
  );
  const setBrowserFrameStyle = useEditorStore(
    (state) => state.setBrowserFrameStyle,
  );
  const setBrowserFrameUrl = useEditorStore(
    (state) => state.setBrowserFrameUrl,
  );
  const toggleBrowserFrameUrl = useEditorStore(
    (state) => state.toggleBrowserFrameUrl,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-200/70 py-5 dark:border-white/10"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <AppWindow className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Browser frame
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
            Wrap your screenshot in a clean browser mockup.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="min-w-0">
            <Label
              htmlFor="browser-frame-toggle"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Browser frame
            </Label>
            <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
              Add a lightweight browser shell.
            </p>
          </div>
          <Switch
            id="browser-frame-toggle"
            checked={browserFrameEnabled}
            onCheckedChange={toggleBrowserFrame}
            aria-label="Toggle browser frame"
          />
        </div>

        <AnimatePresence initial={false}>
          {browserFrameEnabled && (
            <motion.div
              key="browser-frame-settings"
              initial={{
                opacity: 0,
                height: shouldReduceMotion ? "auto" : 0,
                y: shouldReduceMotion ? 0 : -4,
              }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{
                opacity: 0,
                height: shouldReduceMotion ? "auto" : 0,
                y: shouldReduceMotion ? 0 : -4,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <SegmentedControl
                  label="Theme"
                  value={browserFrameTheme}
                  options={THEME_OPTIONS}
                  onChange={setBrowserFrameTheme}
                />

                <SegmentedControl
                  label="Style"
                  value={browserFrameStyle}
                  options={STYLE_OPTIONS}
                  onChange={setBrowserFrameStyle}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Label
                  htmlFor="browser-frame-url-toggle"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Show URL
                </Label>
                <Switch
                  id="browser-frame-url-toggle"
                  checked={browserFrameShowUrl}
                  onCheckedChange={toggleBrowserFrameUrl}
                  aria-label="Toggle browser frame URL"
                />
              </div>

              <AnimatePresence initial={false}>
                {browserFrameShowUrl && (
                  <motion.div
                    key="browser-frame-url"
                    initial={{
                      opacity: 0,
                      height: shouldReduceMotion ? "auto" : 0,
                      y: shouldReduceMotion ? 0 : -4,
                    }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{
                      opacity: 0,
                      height: shouldReduceMotion ? "auto" : 0,
                      y: shouldReduceMotion ? 0 : -4,
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="mt-4 overflow-hidden"
                  >
                    <Label
                      htmlFor="browser-frame-url"
                      className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300"
                    >
                      URL
                    </Label>
                    <input
                      id="browser-frame-url"
                      type="text"
                      value={browserFrameUrl}
                      placeholder="app.yourproduct.com"
                      onChange={(event) => setBrowserFrameUrl(event.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/15"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
