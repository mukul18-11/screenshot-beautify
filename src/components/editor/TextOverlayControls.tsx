"use client";

import type { ReactNode } from "react";

import { Bold, Italic, Plus, Trash2, Type, Underline } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import EditorSliderRow from "@/components/editor/EditorSliderRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BEAUTIFY_SETTING_LIMITS } from "@/lib/editor-defaults";
import { TEXT_SHADOW_PRESETS } from "@/lib/text-effect-presets";
import { TEXT_FONT_CATEGORIES, TEXT_FONT_OPTIONS } from "@/lib/text-fonts";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type {
  TextAlign,
  DefaultTextLayerId,
  TextFontId,
  TextFontWeight,
  TextLayerId,
  TextPosition,
  TextShadowMode,
} from "@/types/editor";

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

type NativeSelectProps<TValue extends string> = {
  disabled?: boolean;
  id: string;
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
  onFocus?: () => void;
  placeholder: string;
  value: string;
};

type ControlGroupProps = {
  children: ReactNode;
  className?: string;
  title: string;
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

const FONT_WEIGHT_OPTIONS = [
  {
    label: "Auto",
    value: "auto",
  },
  {
    label: "Regular",
    value: "regular",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Semi",
    value: "semibold",
  },
  {
    label: "Bold",
    value: "bold",
  },
  {
    label: "Black",
    value: "black",
  },
] as const satisfies readonly SegmentOption<TextFontWeight>[];

const SHADOW_MODE_OPTIONS = [
  {
    label: "Drop",
    value: "drop",
  },
  {
    label: "3D",
    value: "depth",
  },
  {
    label: "Glow",
    value: "glow",
  },
  {
    label: "Fire",
    value: "fire",
  },
] as const satisfies readonly SegmentOption<TextShadowMode>[];

const TEXT_LAYER_OPTIONS = [
  {
    label: "Badge",
    value: "badge",
  },
  {
    label: "Headline",
    value: "headline",
  },
  {
    label: "Subtitle",
    value: "subtitle",
  },
] as const satisfies readonly SegmentOption<DefaultTextLayerId>[];

type SliderLimit = {
  max: number;
  min: number;
  step: number;
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDecimal(value: number) {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

function getCustomTextLayerLabel(text: string, index: number) {
  const normalizedText = text.trim();

  if (!normalizedText || normalizedText === "New text") {
    return `Text ${index + 1}`;
  }

  if (normalizedText.length <= 24) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, 24).trim()}...`;
}

function ControlGroup({ children, className, title }: ControlGroupProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/75 bg-slate-50/65 p-3 dark:border-white/10 dark:bg-white/[0.04]",
        className,
      )}
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-normal text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

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

function NativeSelect<TValue extends string>({
  disabled = false,
  id,
  label,
  onChange,
  options,
  value,
}: NativeSelectProps<TValue>) {
  return (
    <div className={cn("space-y-1.5", disabled && "opacity-50")}>
      <Label
        htmlFor={id}
        className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
      >
        {label}
      </Label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="h-9 w-full rounded-lg border border-slate-200/80 bg-white/80 px-2.5 text-[13px] font-medium text-slate-700 outline-none transition focus:border-slate-300 focus:ring-1 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  disabled,
  id,
  label,
  onChange,
  onFocus,
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
        onFocus={onFocus}
        className="h-8 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 text-[13px] text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      />
    </div>
  );
}

function ColorField({
  disabled = false,
  id,
  label,
  onChange,
  value,
}: {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className={cn("space-y-1.5", disabled && "opacity-50")}>
      <Label
        htmlFor={id}
        className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
      >
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-slate-200/80 bg-white p-0.5 disabled:cursor-not-allowed dark:border-white/10 dark:bg-white/[0.08]"
        />
        <span className="min-w-0 truncate font-mono text-[11px] uppercase text-slate-400">
          {value}
        </span>
      </div>
    </div>
  );
}

function FormattingToggle({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-lg border transition",
        active
          ? "border-slate-900 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
          : "border-slate-200/80 bg-white/65 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
      )}
    >
      {children}
    </Button>
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
  const activeTextLayerId = useEditorStore((state) => state.activeTextLayerId);
  const customTextLayers = useEditorStore((state) => state.customTextLayers);
  const textLayerStyles = useEditorStore((state) => state.textLayerStyles);
  const textPosition = useEditorStore((state) => state.textPosition);
  const headlineSize = useEditorStore((state) => state.headlineSize);
  const subtitleSize = useEditorStore((state) => state.subtitleSize);
  const badgeSize = useEditorStore((state) => state.badgeSize);
  const badgeRotation = useEditorStore((state) => state.badgeRotation);
  const headlineRotation = useEditorStore((state) => state.headlineRotation);
  const subtitleRotation = useEditorStore((state) => state.subtitleRotation);
  const toggleTextOverlay = useEditorStore((state) => state.toggleTextOverlay);
  const setBadgeText = useEditorStore((state) => state.setBadgeText);
  const toggleBadge = useEditorStore((state) => state.toggleBadge);
  const setHeadlineText = useEditorStore((state) => state.setHeadlineText);
  const setSubtitleText = useEditorStore((state) => state.setSubtitleText);
  const addCustomTextLayer = useEditorStore((state) => state.addCustomTextLayer);
  const removeTextLayer = useEditorStore((state) => state.removeTextLayer);
  const setCustomTextLayerText = useEditorStore(
    (state) => state.setCustomTextLayerText,
  );
  const setActiveTextLayerId = useEditorStore(
    (state) => state.setActiveTextLayerId,
  );
  const setTextPosition = useEditorStore((state) => state.setTextPosition);
  const setTextAlign = useEditorStore((state) => state.setTextAlign);
  const setTextColor = useEditorStore((state) => state.setTextColor);
  const setTextFont = useEditorStore((state) => state.setTextFont);
  const setTextFontWeight = useEditorStore(
    (state) => state.setTextFontWeight,
  );
  const toggleTextItalic = useEditorStore((state) => state.toggleTextItalic);
  const toggleTextUnderline = useEditorStore(
    (state) => state.toggleTextUnderline,
  );
  const setTextLetterSpacing = useEditorStore(
    (state) => state.setTextLetterSpacing,
  );
  const setTextLineHeight = useEditorStore(
    (state) => state.setTextLineHeight,
  );
  const setTextOpacity = useEditorStore((state) => state.setTextOpacity);
  const setTextShadowEnabled = useEditorStore(
    (state) => state.setTextShadowEnabled,
  );
  const setTextShadowMode = useEditorStore(
    (state) => state.setTextShadowMode,
  );
  const applyTextShadowPreset = useEditorStore(
    (state) => state.applyTextShadowPreset,
  );
  const setTextShadowColor = useEditorStore(
    (state) => state.setTextShadowColor,
  );
  const setTextShadowBlur = useEditorStore(
    (state) => state.setTextShadowBlur,
  );
  const setTextShadowOffset = useEditorStore(
    (state) => state.setTextShadowOffset,
  );
  const setTextShadowOpacity = useEditorStore(
    (state) => state.setTextShadowOpacity,
  );
  const setTextShadowDepth = useEditorStore(
    (state) => state.setTextShadowDepth,
  );
  const setTextLayerSize = useEditorStore((state) => state.setTextLayerSize);
  const setTextLayerRotation = useEditorStore(
    (state) => state.setTextLayerRotation,
  );
  const hasActiveCustomTextLayer =
    activeTextLayerId !== null &&
    customTextLayers.some((layer) => layer.id === activeTextLayerId);
  const selectedLayerId =
    activeTextLayerId === "badge" ||
    activeTextLayerId === "headline" ||
    activeTextLayerId === "subtitle" ||
    hasActiveCustomTextLayer
      ? activeTextLayerId
      : "headline";
  const selectedCustomTextLayerIndex = customTextLayers.findIndex(
    (layer) => layer.id === selectedLayerId,
  );
  const selectedCustomTextLayer =
    selectedCustomTextLayerIndex >= 0
      ? customTextLayers[selectedCustomTextLayerIndex]
      : undefined;
  const selectedDefaultLayerId: DefaultTextLayerId =
    selectedLayerId === "badge" ||
    selectedLayerId === "headline" ||
    selectedLayerId === "subtitle"
      ? selectedLayerId
      : "headline";
  const selectedLayerStyle =
    selectedCustomTextLayer?.style ?? textLayerStyles[selectedDefaultLayerId];
  const textAlign = selectedLayerStyle.textAlign;
  const textColor = selectedLayerStyle.textColor;
  const textFontId = selectedLayerStyle.textFontId;
  const textFontWeight = selectedLayerStyle.textFontWeight;
  const textItalic = selectedLayerStyle.textItalic;
  const textUnderline = selectedLayerStyle.textUnderline;
  const textLetterSpacing = selectedLayerStyle.textLetterSpacing;
  const textLineHeight = selectedLayerStyle.textLineHeight;
  const textOpacity = selectedLayerStyle.textOpacity;
  const textShadowEnabled = selectedLayerStyle.textShadowEnabled;
  const textShadowMode = selectedLayerStyle.textShadowMode;
  const textShadowPresetId = selectedLayerStyle.textShadowPresetId;
  const textShadowColor = selectedLayerStyle.textShadowColor;
  const textShadowBlur = selectedLayerStyle.textShadowBlur;
  const textShadowOffsetX = selectedLayerStyle.textShadowOffsetX;
  const textShadowOffsetY = selectedLayerStyle.textShadowOffsetY;
  const textShadowOpacity = selectedLayerStyle.textShadowOpacity;
  const textShadowDepth = selectedLayerStyle.textShadowDepth;
  const selectedLayerLabel = selectedCustomTextLayer
    ? getCustomTextLayerLabel(
        selectedCustomTextLayer.text,
        selectedCustomTextLayerIndex,
      )
    : (TEXT_LAYER_OPTIONS.find((option) => option.value === selectedLayerId)
        ?.label ?? "Headline");
  const textLayerOptions = [
    ...TEXT_LAYER_OPTIONS,
    ...customTextLayers.map((layer, index) => ({
      label: getCustomTextLayerLabel(layer.text, index),
      value: layer.id,
    })),
  ] satisfies SegmentOption<TextLayerId>[];
  const selectedLayerSize = {
    badge: badgeSize,
    headline: headlineSize,
    subtitle: subtitleSize,
  } satisfies Record<DefaultTextLayerId, number>;
  const selectedLayerRotation = {
    badge: badgeRotation,
    headline: headlineRotation,
    subtitle: subtitleRotation,
  } satisfies Record<DefaultTextLayerId, number>;
  const selectedLayerSizeLimit = {
    badge: BEAUTIFY_SETTING_LIMITS.badgeSize,
    headline: BEAUTIFY_SETTING_LIMITS.headlineSize,
    subtitle: BEAUTIFY_SETTING_LIMITS.subtitleSize,
  } satisfies Record<DefaultTextLayerId, SliderLimit>;
  const selectedSize =
    selectedCustomTextLayer?.size ?? selectedLayerSize[selectedDefaultLayerId];
  const selectedRotation =
    selectedCustomTextLayer?.rotation ??
    selectedLayerRotation[selectedDefaultLayerId];
  const selectedSizeLimit =
    selectedCustomTextLayer
      ? BEAUTIFY_SETTING_LIMITS.headlineSize
      : selectedLayerSizeLimit[selectedDefaultLayerId];
  const lineHeightSliderValue = textLineHeight > 0 ? textLineHeight : 1.1;

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
                Click text to edit. Drag corners to resize, top handle left or right to tilt.
              </p>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addCustomTextLayer}
                className="h-9 w-full justify-center rounded-lg border-slate-200/80 bg-white/70 text-[13px] font-semibold text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-white/10"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New text
              </Button>

              <NativeSelect
                id="active-text-layer"
                label="Active text"
                value={selectedLayerId}
                options={textLayerOptions}
                onChange={setActiveTextLayerId}
              />

              <ControlGroup title="Content">
                {selectedLayerId === "badge" && (
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <TextField
                        id="badge-text"
                        label="Badge"
                        value={badgeText}
                        disabled={false}
                        placeholder="NEW LAUNCH"
                        onChange={setBadgeText}
                        onFocus={() => setActiveTextLayerId("badge")}
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
                )}

                {selectedLayerId === "headline" && (
                  <TextField
                    id="headline-text"
                    label="Headline"
                    value={headlineText}
                    disabled={false}
                    placeholder="Turn screenshots into launch-ready visuals"
                    onChange={setHeadlineText}
                    onFocus={() => setActiveTextLayerId("headline")}
                  />
                )}

                {selectedCustomTextLayer && (
                  <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                    <TextField
                      id={`custom-text-${selectedCustomTextLayer.id}`}
                      label="Text"
                      value={selectedCustomTextLayer.text}
                      disabled={false}
                      placeholder="New text"
                      onChange={(value) =>
                        setCustomTextLayerText(selectedCustomTextLayer.id, value)
                      }
                      onFocus={() =>
                        setActiveTextLayerId(selectedCustomTextLayer.id)
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${selectedLayerLabel}`}
                      onClick={() => removeTextLayer(selectedCustomTextLayer.id)}
                      className="h-8 w-8 rounded-lg border border-slate-200/80 bg-white/65 text-slate-400 hover:bg-white hover:text-rose-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                )}

                {selectedLayerId === "subtitle" && (
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
                      onFocus={() => setActiveTextLayerId("subtitle")}
                      rows={2}
                      className="min-h-16 w-full resize-none rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-[13px] leading-5 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                    />
                  </div>
                )}
              </ControlGroup>

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

              <ControlGroup title="Typography">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="text-font"
                      className="text-[13px] font-medium text-slate-500 dark:text-slate-400"
                    >
                      Font
                    </Label>
                    <select
                      id="text-font"
                      value={textFontId}
                      onChange={(event) =>
                        setTextFont(event.target.value as TextFontId)
                      }
                      className="h-9 w-full rounded-lg border border-slate-200/80 bg-white/80 px-2.5 text-[13px] font-medium text-slate-700 outline-none transition focus:border-slate-300 focus:ring-1 focus:ring-slate-200 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100"
                    >
                      {TEXT_FONT_CATEGORIES.map((category) => (
                        <optgroup key={category} label={category}>
                          {TEXT_FONT_OPTIONS.filter(
                            (fontOption) => fontOption.category === category,
                          ).map((fontOption) => (
                            <option key={fontOption.id} value={fontOption.id}>
                              {fontOption.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <NativeSelect
                    id="text-weight"
                    label="Weight"
                    value={textFontWeight}
                    options={FONT_WEIGHT_OPTIONS}
                    onChange={setTextFontWeight}
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto] items-end gap-3">
                  <ColorField
                    id="text-color"
                    label="Text color"
                    value={textColor}
                    onChange={setTextColor}
                  />
                  <div className="flex items-center gap-1.5" aria-label="Text formatting">
                    <FormattingToggle
                      active={textFontWeight === "bold"}
                      label="Set text weight to bold"
                      onClick={() =>
                        setTextFontWeight(
                          textFontWeight === "bold" ? "auto" : "bold",
                        )
                      }
                    >
                      <Bold className="h-4 w-4" aria-hidden="true" />
                    </FormattingToggle>
                    <FormattingToggle
                      active={textItalic}
                      label="Toggle italic text"
                      onClick={toggleTextItalic}
                    >
                      <Italic className="h-4 w-4" aria-hidden="true" />
                    </FormattingToggle>
                    <FormattingToggle
                      active={textUnderline}
                      label="Toggle underlined text"
                      onClick={toggleTextUnderline}
                    >
                      <Underline className="h-4 w-4" aria-hidden="true" />
                    </FormattingToggle>
                  </div>
                </div>
              </ControlGroup>

              <ControlGroup title="Spacing">
                <div className="grid grid-cols-3 gap-3">
                  <EditorSliderRow
                    label="Letter"
                    min={BEAUTIFY_SETTING_LIMITS.textLetterSpacing.min}
                    max={BEAUTIFY_SETTING_LIMITS.textLetterSpacing.max}
                    step={BEAUTIFY_SETTING_LIMITS.textLetterSpacing.step}
                    value={textLetterSpacing}
                    suffix="px"
                    onChange={setTextLetterSpacing}
                  />

                  <EditorSliderRow
                    label="Line"
                    min={BEAUTIFY_SETTING_LIMITS.textLineHeight.min}
                    max={BEAUTIFY_SETTING_LIMITS.textLineHeight.max}
                    step={BEAUTIFY_SETTING_LIMITS.textLineHeight.step}
                    value={lineHeightSliderValue}
                    valueFormatter={() =>
                      textLineHeight > 0 ? formatDecimal(textLineHeight) : "Auto"
                    }
                    onChange={setTextLineHeight}
                  />

                  <EditorSliderRow
                    label="Opacity"
                    min={BEAUTIFY_SETTING_LIMITS.textOpacity.min}
                    max={BEAUTIFY_SETTING_LIMITS.textOpacity.max}
                    step={BEAUTIFY_SETTING_LIMITS.textOpacity.step}
                    value={textOpacity}
                    valueFormatter={formatPercent}
                    onChange={setTextOpacity}
                  />
                </div>
              </ControlGroup>

              <ControlGroup title="Size and tilt">
                <div className="grid grid-cols-2 gap-3">
                  <EditorSliderRow
                    label={`${selectedLayerLabel} size`}
                    min={selectedSizeLimit.min}
                    max={selectedSizeLimit.max}
                    step={selectedSizeLimit.step}
                    value={selectedSize}
                    suffix="px"
                    disabled={selectedLayerId === "badge" && !badgeEnabled}
                    onChange={(size) => setTextLayerSize(selectedLayerId, size)}
                  />

                  <EditorSliderRow
                    label={`${selectedLayerLabel} tilt`}
                    min={BEAUTIFY_SETTING_LIMITS.textRotation.min}
                    max={BEAUTIFY_SETTING_LIMITS.textRotation.max}
                    step={BEAUTIFY_SETTING_LIMITS.textRotation.step}
                    value={selectedRotation}
                    suffix="deg"
                    disabled={selectedLayerId === "badge" && !badgeEnabled}
                    onChange={(rotation) =>
                      setTextLayerRotation(selectedLayerId, rotation)
                    }
                  />
                </div>
              </ControlGroup>

              <ControlGroup title="Shadow effects">
                <div className="flex items-center justify-between gap-3">
                  <Label
                    htmlFor="text-shadow-toggle"
                    className="text-[13px] font-medium text-slate-600 dark:text-slate-300"
                  >
                    Text shadow
                  </Label>
                  <Switch
                    id="text-shadow-toggle"
                    checked={textShadowEnabled}
                    onCheckedChange={setTextShadowEnabled}
                    aria-label="Toggle text shadow"
                  />
                </div>

                <div
                  className={cn(
                    "grid grid-cols-2 gap-2",
                    !textShadowEnabled && "opacity-50",
                  )}
                >
                  {TEXT_SHADOW_PRESETS.map((preset) => {
                    const isSelected = preset.id === textShadowPresetId;

                    return (
                      <Button
                        key={preset.id}
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!textShadowEnabled}
                        aria-pressed={isSelected}
                        onClick={() => applyTextShadowPreset(preset.id)}
                        className={cn(
                          "h-8 justify-start rounded-lg border px-2 text-xs font-semibold",
                          isSelected
                            ? "border-slate-900 bg-white text-slate-950 shadow-sm dark:border-white dark:bg-white/15 dark:text-white"
                            : "border-slate-200/80 bg-white/55 text-slate-500 hover:bg-white hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10",
                        )}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: preset.textShadowColor }}
                          aria-hidden="true"
                        />
                        {preset.name}
                      </Button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <NativeSelect
                    id="text-shadow-mode"
                    label="Style"
                    value={textShadowMode}
                    options={SHADOW_MODE_OPTIONS}
                    disabled={!textShadowEnabled}
                    onChange={setTextShadowMode}
                  />

                  <ColorField
                    id="text-shadow-color"
                    label="Shadow color"
                    value={textShadowColor}
                    disabled={!textShadowEnabled}
                    onChange={setTextShadowColor}
                  />
                </div>

                <div
                  className={cn(
                    "grid grid-cols-2 gap-3",
                    !textShadowEnabled && "opacity-50",
                  )}
                >
                  <EditorSliderRow
                    label="Blur"
                    min={BEAUTIFY_SETTING_LIMITS.textShadowBlur.min}
                    max={BEAUTIFY_SETTING_LIMITS.textShadowBlur.max}
                    step={BEAUTIFY_SETTING_LIMITS.textShadowBlur.step}
                    value={textShadowBlur}
                    suffix="px"
                    disabled={!textShadowEnabled}
                    onChange={setTextShadowBlur}
                  />

                  <EditorSliderRow
                    label="Intensity"
                    min={BEAUTIFY_SETTING_LIMITS.textShadowOpacity.min}
                    max={BEAUTIFY_SETTING_LIMITS.textShadowOpacity.max}
                    step={BEAUTIFY_SETTING_LIMITS.textShadowOpacity.step}
                    value={textShadowOpacity}
                    valueFormatter={formatPercent}
                    disabled={!textShadowEnabled}
                    onChange={setTextShadowOpacity}
                  />

                  <EditorSliderRow
                    label="X offset"
                    min={BEAUTIFY_SETTING_LIMITS.textShadowOffset.min}
                    max={BEAUTIFY_SETTING_LIMITS.textShadowOffset.max}
                    step={BEAUTIFY_SETTING_LIMITS.textShadowOffset.step}
                    value={textShadowOffsetX}
                    suffix="px"
                    disabled={!textShadowEnabled}
                    onChange={(offsetX) =>
                      setTextShadowOffset(offsetX, textShadowOffsetY)
                    }
                  />

                  <EditorSliderRow
                    label="Y offset"
                    min={BEAUTIFY_SETTING_LIMITS.textShadowOffset.min}
                    max={BEAUTIFY_SETTING_LIMITS.textShadowOffset.max}
                    step={BEAUTIFY_SETTING_LIMITS.textShadowOffset.step}
                    value={textShadowOffsetY}
                    suffix="px"
                    disabled={!textShadowEnabled}
                    onChange={(offsetY) =>
                      setTextShadowOffset(textShadowOffsetX, offsetY)
                    }
                  />

                  <div className="col-span-2">
                    <EditorSliderRow
                      label="3D depth"
                      min={BEAUTIFY_SETTING_LIMITS.textShadowDepth.min}
                      max={BEAUTIFY_SETTING_LIMITS.textShadowDepth.max}
                      step={BEAUTIFY_SETTING_LIMITS.textShadowDepth.step}
                      value={textShadowDepth}
                      suffix="px"
                      disabled={!textShadowEnabled}
                      onChange={setTextShadowDepth}
                    />
                  </div>
                </div>
              </ControlGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
