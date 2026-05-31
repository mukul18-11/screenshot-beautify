"use client";

import { Minus, Plus } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type EditorSliderRowProps = {
  disabled?: boolean;
  idSuffix?: string;
  label: string;
  labelClassName?: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  suffix?: string;
  variant?: "default" | "compactStepper";
  value: number;
  valueFormatter?: (value: number) => string;
};

function createInputId(label: string, idSuffix: string) {
  return `${label.toLowerCase().replace(/\s+/g, "-")}-${idSuffix}`;
}

export default function EditorSliderRow({
  disabled = false,
  idSuffix = "slider",
  label,
  labelClassName,
  max,
  min,
  onChange,
  step,
  suffix = "",
  variant = "default",
  value,
  valueFormatter,
}: EditorSliderRowProps) {
  const inputId = createInputId(label, idSuffix);
  const displayValue = valueFormatter ? valueFormatter(value) : String(value);
  const decrementDisabled = disabled || value <= min;
  const incrementDisabled = disabled || value >= max;

  function clampNextValue(nextValue: number) {
    return Math.min(max, Math.max(min, nextValue));
  }

  function handleStep(direction: -1 | 1) {
    onChange(clampNextValue(value + step * direction));
  }

  if (variant === "compactStepper") {
    return (
      <div
        className={cn(
          "group rounded-xl border border-slate-200/80 bg-white/80 p-2.5 shadow-sm transition dark:border-white/10 dark:bg-white/[0.04]",
          "hover:border-slate-300 hover:bg-white dark:hover:border-white/15 dark:hover:bg-white/[0.07]",
          disabled && "opacity-40",
        )}
      >
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Label
            htmlFor={inputId}
            className={cn(
              "min-w-0 truncate text-[12px] font-semibold text-slate-600 dark:text-slate-300",
              labelClassName,
            )}
          >
            {label}
          </Label>
          <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-100">
            {displayValue}
            {suffix}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={decrementDisabled}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/25"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
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
            className="min-w-0 flex-1"
          />
          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={incrementDisabled}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-white/25"
            aria-label={`Increase ${label}`}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 py-1", disabled && "opacity-40")}>
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={inputId}
          className={cn(
            "text-[13px] font-medium text-slate-500 dark:text-slate-400",
            labelClassName,
          )}
        >
          {label}
        </Label>
        <span className="text-[11px] font-semibold tabular-nums text-slate-400">
          {displayValue}
          {suffix}
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
