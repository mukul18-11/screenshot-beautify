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
    <div className={cn("space-y-1.5", disabled && "opacity-50")}>
      <Label className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </Label>
      <div className="flex gap-1 rounded-lg bg-slate-100/80 p-0.5 dark:bg-white/[0.06]">
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
                "h-7 flex-1 rounded-md px-2 text-xs font-semibold transition",
                isSelected
                  ? "bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
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
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="border-b border-slate-100 py-4 dark:border-white/8"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AppWindow className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
            Browser frame
          </h3>
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
            }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{
              opacity: 0,
              height: shouldReduceMotion ? "auto" : 0,
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
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

              <div className="flex items-center justify-between gap-3">
                <Label
                  htmlFor="browser-frame-url-toggle"
                  className="text-[13px] font-medium text-slate-600"
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
                    }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{
                      opacity: 0,
                      height: shouldReduceMotion ? "auto" : 0,
                    }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <input
                      id="browser-frame-url"
                      type="text"
                      value={browserFrameUrl}
                      placeholder="app.yourproduct.com"
                      onChange={(event) => setBrowserFrameUrl(event.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
