"use client";

import { Type } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className={cn("space-y-1.5", disabled && "opacity-50")}>
      <Label className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </Label>
      <div
        className={cn(
          "grid gap-0.5 rounded-lg bg-slate-100/80 p-0.5 dark:bg-white/[0.06]",
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
                "h-7 rounded-md px-2 text-xs font-semibold transition",
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

function TextField({
  disabled,
  id,
  label,
  onChange,
  placeholder,
  value,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-1.5", disabled && "opacity-50")}>
      <Label
        htmlFor={id}
        className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
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
        className="h-8 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
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
      className="border-b border-slate-100 py-4 dark:border-white/8"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <h3 className="text-[13px] font-semibold text-slate-700 dark:text-white">
            Text overlay
          </h3>
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
              <p className="text-[11px] text-slate-400">
                Click text on the canvas to edit directly.
              </p>

              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <TextField
                    id="badge-text"
                    label="Badge"
                    value={badgeText}
                    disabled={false}
                    placeholder="NEW LAUNCH"
                    onChange={setBadgeText}
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
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

              <div className="space-y-1.5">
                <Label
                  htmlFor="subtitle-text"
                  className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
                >
                  Subtitle
                </Label>
                <textarea
                  id="subtitle-text"
                  value={subtitleText}
                  placeholder="Make your product updates look premium in seconds."
                  onChange={(event) => setSubtitleText(event.target.value)}
                  rows={2}
                  className="min-h-16 w-full resize-none rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-[13px] leading-5 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
              </div>

              <SegmentedControl
                label="Position"
                value={textPosition}
                options={POSITION_OPTIONS}
                gridClassName="grid-cols-5"
                onChange={setTextPosition}
              />

              <SegmentedControl
                label="Align"
                value={textAlign}
                options={ALIGN_OPTIONS}
                onChange={setTextAlign}
              />

              <div className="flex items-center gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="text-color"
                    className="text-[13px] font-medium text-slate-500"
                  >
                    Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={(event) => setTextColor(event.target.value)}
                      className="h-8 w-10 shrink-0 cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5"
                    />
                    <span className="font-mono text-[11px] uppercase text-slate-400">
                      {textColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EditorSliderRow
                  label="Headline"
                  min={BEAUTIFY_SETTING_LIMITS.headlineSize.min}
                  max={BEAUTIFY_SETTING_LIMITS.headlineSize.max}
                  step={BEAUTIFY_SETTING_LIMITS.headlineSize.step}
                  value={headlineSize}
                  suffix="px"
                  disabled={false}
                  onChange={setHeadlineSize}
                />

                <EditorSliderRow
                  label="Subtitle"
                  min={BEAUTIFY_SETTING_LIMITS.subtitleSize.min}
                  max={BEAUTIFY_SETTING_LIMITS.subtitleSize.max}
                  step={BEAUTIFY_SETTING_LIMITS.subtitleSize.step}
                  value={subtitleSize}
                  suffix="px"
                  disabled={false}
                  onChange={setSubtitleSize}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
