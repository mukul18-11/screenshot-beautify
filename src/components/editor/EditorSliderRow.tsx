"use client";

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
  value,
  valueFormatter,
}: EditorSliderRowProps) {
  const inputId = createInputId(label, idSuffix);
  const displayValue = valueFormatter ? valueFormatter(value) : String(value);

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
