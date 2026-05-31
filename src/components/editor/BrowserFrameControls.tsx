"use client";

import { AppWindow, Layers2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BROWSER_FRAME_STYLES } from "@/components/editor/BrowserFrame";
import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { SHADOW_SCENE_PRESETS } from "@/lib/shadow-scenes";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type {
  BrowserFrameStyle,
  BrowserFrameTheme,
  ShadowScenePlacement,
} from "@/types/editor";

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
  {
    label: "Safari",
    value: "safari",
  },
  {
    label: "Chrome",
    value: "chrome",
  },
  {
    label: "Arc",
    value: "arc",
  },
] as const satisfies readonly SegmentOption<BrowserFrameStyle>[];

const SHADOW_SCENE_PLACEMENT_OPTIONS = [
  {
    label: "Underlay",
    value: "underlay",
  },
  {
    label: "Overlay",
    value: "overlay",
  },
] as const satisfies readonly SegmentOption<ShadowScenePlacement>[];

function SegmentedControl<TValue extends string>({
  disabled = false,
  label,
  onChange,
  options,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <div className={cn("space-y-1", disabled && "opacity-50")}>
      <Label className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
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
                "h-6 flex-1 rounded-md px-2 text-[11px] font-semibold transition",
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

function FrameStylePreview({
  style,
  theme,
}: {
  style: BrowserFrameStyle;
  theme: BrowserFrameTheme;
}) {
  const isDark = theme === "dark";
  const topBarClass = isDark
    ? "border-white/10 bg-slate-900"
    : "border-slate-200 bg-slate-50";
  const urlClass = isDark ? "bg-white/15" : "bg-white";
  const screenClass = isDark ? "bg-slate-800" : "bg-slate-100";

  if (style === "minimal") {
    return (
      <span className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <span className={cn("h-4 border-b px-2 py-1", topBarClass)}>
          <span className="block h-1.5 w-10 rounded-full bg-current opacity-20" />
        </span>
        <span className={cn("flex-1", screenClass)} />
      </span>
    );
  }

  if (style === "chrome") {
    return (
      <span className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <span className={cn("h-5 border-b px-1.5 pt-1", topBarClass)}>
          <span className={cn("block h-4 w-16 rounded-t-md", urlClass)} />
        </span>
        <span className={cn("flex h-5 items-center gap-1 px-1.5", topBarClass)}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-25" />
          <span className={cn("h-2 flex-1 rounded-full", urlClass)} />
        </span>
        <span className={cn("flex-1", screenClass)} />
      </span>
    );
  }

  if (style === "arc") {
    return (
      <span className="flex h-full w-full flex-col overflow-hidden rounded-md">
        <span
          className={cn(
            "flex h-7 items-center gap-1.5 border-b px-1.5",
            isDark ? "border-white/10 bg-[#17131e]" : "border-violet-100 bg-[#f7f3ff]",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
          <span className={cn("h-2 flex-1 rounded-full", urlClass)} />
        </span>
        <span className={cn("flex-1", screenClass)} />
      </span>
    );
  }

  return (
    <span className="flex h-full w-full flex-col overflow-hidden rounded-md">
      <span className={cn("flex h-7 items-center gap-1.5 border-b px-1.5", topBarClass)}>
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        {style === "safari" && (
          <span className={cn("ml-1 h-2 flex-1 rounded-md", urlClass)} />
        )}
      </span>
      <span className={cn("flex-1", screenClass)} />
    </span>
  );
}

function FrameStylePicker({
  onChange,
  theme,
  value,
}: {
  onChange: (value: BrowserFrameStyle) => void;
  theme: BrowserFrameTheme;
  value: BrowserFrameStyle;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
        Style
      </Label>
      <div className="grid grid-cols-3 gap-1.5">
        {STYLE_OPTIONS.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              title={`${option.label} browser frame`}
              onClick={() => onChange(option.value)}
              className={cn(
                "group min-w-0 rounded-lg border p-1 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/25",
                isSelected
                  ? "border-slate-950 bg-white shadow-sm dark:border-white dark:bg-white/10"
                  : "border-slate-200/80 bg-white/55 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/10",
              )}
            >
              <span
                aria-hidden="true"
                className="block aspect-[1.55] overflow-hidden rounded-md border border-black/5 shadow-inner dark:border-white/10"
              >
                <FrameStylePreview style={option.value} theme={theme} />
              </span>
              <span className="mt-1 block truncate text-[10px] font-semibold leading-3 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                {BROWSER_FRAME_STYLES[option.value].label}
              </span>
            </button>
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
  const browserFrameUrlBold = useEditorStore(
    (state) => state.browserFrameUrlBold,
  );
  const shadowScenePresetId = useEditorStore(
    (state) => state.shadowScenePresetId,
  );
  const shadowSceneOpacity = useEditorStore(
    (state) => state.shadowSceneOpacity,
  );
  const shadowScenePlacement = useEditorStore(
    (state) => state.shadowScenePlacement,
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
  const setBrowserFrameUrlBold = useEditorStore(
    (state) => state.setBrowserFrameUrlBold,
  );
  const setShadowScenePreset = useEditorStore(
    (state) => state.setShadowScenePreset,
  );
  const setShadowSceneOpacity = useEditorStore(
    (state) => state.setShadowSceneOpacity,
  );
  const setShadowScenePlacement = useEditorStore(
    (state) => state.setShadowScenePlacement,
  );
  const shadowSceneOpacityPercent = Math.round(shadowSceneOpacity * 100);
  const hasShadowScene = shadowScenePresetId !== "none";

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
            <div className="space-y-2.5 pt-0.5">
              <div className="grid grid-cols-2 gap-2">
                <SegmentedControl
                  label="Theme"
                  value={browserFrameTheme}
                  options={THEME_OPTIONS}
                  onChange={setBrowserFrameTheme}
                />
              </div>

              <FrameStylePicker
                value={browserFrameStyle}
                theme={browserFrameTheme}
                onChange={setBrowserFrameStyle}
              />

              <div className="flex items-center justify-between gap-3">
                <Label
                  htmlFor="browser-frame-url-toggle"
                  className="text-[12px] font-medium text-slate-600"
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
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <Label
                        htmlFor="browser-frame-url-bold-toggle"
                        className="text-[12px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        Bold URL
                      </Label>
                      <Switch
                        id="browser-frame-url-bold-toggle"
                        checked={browserFrameUrlBold}
                        onCheckedChange={setBrowserFrameUrlBold}
                        aria-label="Toggle bold browser frame URL"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 border-t border-slate-100 pt-3 dark:border-white/8">
        <div className="mb-2.5 flex items-center gap-2">
          <Layers2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
            Shadow scene
          </h3>
        </div>

        <div className="space-y-2.5 pt-0.5">
          <div className="grid grid-cols-3 gap-1.5">
            {SHADOW_SCENE_PRESETS.map((preset) => {
              const isSelected = preset.id === shadowScenePresetId;

              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setShadowScenePreset(preset.id)}
                  className={cn(
                    "group min-w-0 rounded-lg border p-1 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/25",
                    isSelected
                      ? "border-slate-950 bg-white shadow-sm dark:border-white dark:bg-white/10"
                      : "border-slate-200/80 bg-white/55 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/10",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="block aspect-[1.55] rounded-md border border-black/5 bg-slate-100 shadow-inner dark:border-white/10"
                    style={{ backgroundImage: preset.preview }}
                  />
                  <span className="mt-1 block truncate text-[10px] font-semibold leading-3 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {hasShadowScene && (
              <motion.div
                key="shadow-scene-settings"
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
                <div className="space-y-2.5 pb-1">
                  <SegmentedControl
                    label="Layer"
                    value={shadowScenePlacement}
                    options={SHADOW_SCENE_PLACEMENT_OPTIONS}
                    onChange={setShadowScenePlacement}
                  />

                  <EditorSliderRow
                    label="Opacity"
                    labelClassName="text-slate-600 dark:text-slate-300"
                    min={Math.round(
                      BEAUTIFY_SETTING_LIMITS.shadowSceneOpacity.min * 100,
                    )}
                    max={Math.round(
                      BEAUTIFY_SETTING_LIMITS.shadowSceneOpacity.max * 100,
                    )}
                    step={Math.round(
                      BEAUTIFY_SETTING_LIMITS.shadowSceneOpacity.step * 100,
                    )}
                    value={shadowSceneOpacityPercent}
                    suffix="%"
                    onChange={(opacity) => setShadowSceneOpacity(opacity / 100)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
