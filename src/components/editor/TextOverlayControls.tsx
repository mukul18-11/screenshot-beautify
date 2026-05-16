"use client";

import { Type } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { TextAlign, TextPosition } from "@/types/editor";

type SegmentOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
  disabled?: boolean;
  gridClassName?: string;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly SegmentOption<TValue>[];
  value: TValue;
};

type TextFieldProps = {
  disabled: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

type SliderRowProps = {
  disabled: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
};

const POSITION_OPTIONS = [
  {
    label: "Top",
    value: "top",
  },
  {
    label: "Bottom",
    value: "bottom",
  },
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Right",
    value: "right",
  },
  {
    label: "Center",
    value: "center",
  },
] as const satisfies readonly SegmentOption<TextPosition>[];

const ALIGN_OPTIONS = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Right",
    value: "right",
  },
] as const satisfies readonly SegmentOption<TextAlign>[];

function SegmentedControl<TValue extends string>({
  disabled = false,
  gridClassName = "grid-cols-3",
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
      <div
        className={cn(
          "grid gap-1 rounded-xl border border-slate-200 bg-white/55 p-1 shadow-sm dark:border-white/10 dark:bg-white/[0.06]",
          gridClassName,
        )}
      >
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

function TextField({
  disabled,
  id,
  label,
  onChange,
  placeholder,
  value,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", disabled && "opacity-50")}>
      <Label
        htmlFor={id}
        className="text-sm font-medium text-slate-600 dark:text-slate-300"
      >
        {label}
      </Label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/15"
      />
    </div>
  );
}

function SliderRow({
  disabled,
  label,
  max,
  min,
  onChange,
  step,
  value,
}: SliderRowProps) {
  const inputId = `${label.toLowerCase().replace(/\s+/g, "-")}-slider`;

  return (
    <div className={cn("space-y-2.5", disabled && "opacity-50")}>
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </Label>
        <span className="min-w-14 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
          {value}px
        </span>
      </div>
      <Slider
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={[value]}
        disabled={disabled}
        onValueChange={(values) => {
          const [nextValue] = values;

          if (typeof nextValue === "number") {
            onChange(nextValue);
          }
        }}
        aria-label={label}
      />
    </div>
  );
}

export default function TextOverlayControls() {
  const shouldReduceMotion = useReducedMotion();
  const textOverlayEnabled = useEditorStore(
    (state) => state.textOverlayEnabled,
  );
  const badgeText = useEditorStore((state) => state.badgeText);
  const badgeEnabled = useEditorStore((state) => state.badgeEnabled);
  const headlineText = useEditorStore((state) => state.headlineText);
  const subtitleText = useEditorStore((state) => state.subtitleText);
  const textPosition = useEditorStore((state) => state.textPosition);
  const textAlign = useEditorStore((state) => state.textAlign);
  const textColor = useEditorStore((state) => state.textColor);
  const headlineSize = useEditorStore((state) => state.headlineSize);
  const subtitleSize = useEditorStore((state) => state.subtitleSize);
  const toggleTextOverlay = useEditorStore((state) => state.toggleTextOverlay);
  const setBadgeText = useEditorStore((state) => state.setBadgeText);
  const toggleBadge = useEditorStore((state) => state.toggleBadge);
  const setHeadlineText = useEditorStore((state) => state.setHeadlineText);
  const setSubtitleText = useEditorStore((state) => state.setSubtitleText);
  const setTextPosition = useEditorStore((state) => state.setTextPosition);
  const setTextAlign = useEditorStore((state) => state.setTextAlign);
  const setTextColor = useEditorStore((state) => state.setTextColor);
  const setHeadlineSize = useEditorStore((state) => state.setHeadlineSize);
  const setSubtitleSize = useEditorStore((state) => state.setSubtitleSize);

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
          <Type className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            Text overlay
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-300">
            Add a launch-ready headline, subtitle, or badge.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/55 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          <div className="min-w-0">
            <Label
              htmlFor="text-overlay-toggle"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Text overlay
            </Label>
            <p className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
              Show launch copy on the canvas.
            </p>
          </div>
          <Switch
            id="text-overlay-toggle"
            checked={textOverlayEnabled}
            onCheckedChange={toggleTextOverlay}
            aria-label="Toggle text overlay"
          />
        </div>

        <AnimatePresence initial={false}>
          {textOverlayEnabled && (
            <motion.div
              key="text-overlay-settings"
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
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto]">
                  <TextField
                    id="badge-text"
                    label="Badge"
                    value={badgeText}
                    disabled={false}
                    placeholder="NEW LAUNCH"
                    onChange={setBadgeText}
                  />

                  <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/55 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
                    <Label
                      htmlFor="badge-toggle"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Show badge
                    </Label>
                    <Switch
                      id="badge-toggle"
                      checked={badgeEnabled}
                      onCheckedChange={toggleBadge}
                      aria-label="Toggle text overlay badge"
                    />
                  </div>
                </div>

                <TextField
                  id="headline-text"
                  label="Headline"
                  value={headlineText}
                  disabled={false}
                  placeholder="Turn screenshots into launch-ready visuals"
                  onChange={setHeadlineText}
                />

                <div className="space-y-2">
                  <Label
                    htmlFor="subtitle-text"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300"
                  >
                    Subtitle
                  </Label>
                  <textarea
                    id="subtitle-text"
                    value={subtitleText}
                    placeholder="Make your product updates look premium in seconds."
                    onChange={(event) => setSubtitleText(event.target.value)}
                    rows={3}
                    className="min-h-20 w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm font-medium leading-5 text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-white/25 dark:focus:ring-white/15"
                  />
                </div>

                <SegmentedControl
                  label="Position"
                  value={textPosition}
                  options={POSITION_OPTIONS}
                  gridClassName="grid-cols-2 sm:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5"
                  onChange={setTextPosition}
                />

                <SegmentedControl
                  label="Text align"
                  value={textAlign}
                  options={ALIGN_OPTIONS}
                  onChange={setTextAlign}
                />

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="space-y-2">
                    <Label
                      htmlFor="text-color"
                      className="text-sm font-medium text-slate-600 dark:text-slate-300"
                    >
                      Text color
                    </Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="text-color"
                        type="color"
                        value={textColor}
                        onChange={(event) => setTextColor(event.target.value)}
                        className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/10"
                      />
                      <span className="min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-xs font-semibold uppercase text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                        {textColor}
                      </span>
                    </div>
                  </div>

                  <SliderRow
                    label="Headline size"
                    min={BEAUTIFY_SETTING_LIMITS.headlineSize.min}
                    max={BEAUTIFY_SETTING_LIMITS.headlineSize.max}
                    step={BEAUTIFY_SETTING_LIMITS.headlineSize.step}
                    value={headlineSize}
                    disabled={false}
                    onChange={setHeadlineSize}
                  />
                </div>

                <SliderRow
                  label="Subtitle size"
                  min={BEAUTIFY_SETTING_LIMITS.subtitleSize.min}
                  max={BEAUTIFY_SETTING_LIMITS.subtitleSize.max}
                  step={BEAUTIFY_SETTING_LIMITS.subtitleSize.step}
                  value={subtitleSize}
                  disabled={false}
                  onChange={setSubtitleSize}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
