"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
} from "react";

import { RotateCw } from "lucide-react";

import { createTextShadowCss } from "@/lib/text-effect-presets";
import { getTextFontOption } from "@/lib/text-fonts";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type {
  CustomTextLayer,
  DefaultTextLayerId,
  TextAlign,
  TextFontId,
  TextFontWeight,
  TextLayerId,
  TextLayerStyle,
  TextPosition,
  TextShadowMode,
} from "@/types/editor";

type TextOverlayProps = {
  badgeEnabled: boolean;
  badgeOffsetX: number;
  badgeOffsetY: number;
  badgeRotation: number;
  badgeSize: number;
  badgeText: string;
  className?: string;
  customTextLayers: CustomTextLayer[];
  activeLayerId?: TextLayerId | null;
  headlineOffsetX: number;
  headlineOffsetY: number;
  headlineRotation: number;
  headlineSize: number;
  headlineText: string;
  isEditable?: boolean;
  isExportMode?: boolean;
  isMovable?: boolean;
  placementBounds?: {
    height: number;
    width: number;
  };
  onLayerClickCapture?: (
    layerId: TextLayerId,
    event: MouseEvent<HTMLDivElement>,
  ) => void;
  onLayerEditStart?: (layerId: TextLayerId) => void;
  onLayerPointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
  onLayerPointerDown?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
  onLayerPointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
  onLayerPointerUp?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
  onLayerResizePointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerResizePointerDown?: (
    layerId: TextLayerId,
    handleId: TextResizeHandleId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerResizePointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerResizePointerUp?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerRotatePointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerRotatePointerDown?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerRotatePointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerRotatePointerUp?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  subtitleOffsetX: number;
  subtitleOffsetY: number;
  subtitleRotation: number;
  subtitleSize: number;
  subtitleText: string;
  textAlign: TextAlign;
  textColor: string;
  textFontId: TextFontId;
  textFontWeight: TextFontWeight;
  textLayerStyles: Record<DefaultTextLayerId, TextLayerStyle>;
  textItalic: boolean;
  textLetterSpacing: number;
  textLineHeight: number;
  textOpacity: number;
  textPosition: TextPosition;
  textShadowBlur: number;
  textShadowColor: string;
  textShadowDepth: number;
  textShadowEnabled: boolean;
  textShadowMode: TextShadowMode;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textShadowOpacity: number;
  textUnderline: boolean;
};

export type TextResizeHandleId = "nw" | "ne" | "sw" | "se";

const TEXT_RESIZE_HANDLES = [
  "nw",
  "ne",
  "se",
  "sw",
] as const satisfies readonly TextResizeHandleId[];

const TEXT_FONT_WEIGHT_VALUES = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const satisfies Record<Exclude<TextFontWeight, "auto">, number>;

function getTextAlignClass(textAlign: TextAlign) {
  if (textAlign === "center") {
    return "items-center text-center";
  }

  if (textAlign === "right") {
    return "items-end text-right";
  }

  return "items-start text-left";
}

function getTextContentAlignClass(textAlign: TextAlign) {
  if (textAlign === "center") {
    return "text-center";
  }

  if (textAlign === "right") {
    return "text-right";
  }

  return "text-left";
}

function getTextWidthClass(textPosition: TextPosition) {
  if (textPosition === "left" || textPosition === "right") {
    return "max-w-[34%]";
  }

  if (textPosition === "center") {
    return "max-w-[76%]";
  }

  return "max-w-[82%]";
}

function createLayerPlacementStyle(
  offsetX: number,
  offsetY: number,
  rotation: number,
  placementBounds?: { height: number; width: number },
) {
  const translateX = placementBounds
    ? `${offsetX * placementBounds.width * 0.5}px`
    : `calc(${offsetX} * 50cqw)`;
  const translateY = placementBounds
    ? `${offsetY * placementBounds.height * 0.5}px`
    : `calc(${offsetY} * 50cqh)`;

  return {
    transform: `translate(${translateX}, ${translateY}) rotate(${rotation}deg)`,
    transformOrigin: "center",
  } satisfies CSSProperties;
}

function getTextFontWeightValue(textFontWeight: TextFontWeight) {
  if (textFontWeight === "auto") {
    return undefined;
  }

  return TEXT_FONT_WEIGHT_VALUES[textFontWeight];
}

function createLayerTextStyle(
  layerStyle: TextLayerStyle,
  fontSize: number,
) {
  const selectedTextFont = getTextFontOption(layerStyle.textFontId);
  const selectedFontWeight = getTextFontWeightValue(layerStyle.textFontWeight);

  return {
    className: selectedTextFont.className,
    style: {
      color: layerStyle.textColor,
      fontFamily: selectedTextFont.fontFamily,
      fontSize: `${fontSize}px`,
      fontStyle: layerStyle.textItalic ? "italic" : undefined,
      fontWeight: selectedFontWeight,
      letterSpacing:
        layerStyle.textLetterSpacing === 0
          ? undefined
          : `${layerStyle.textLetterSpacing}px`,
      lineHeight:
        layerStyle.textLineHeight > 0 ? layerStyle.textLineHeight : undefined,
      opacity: layerStyle.textOpacity,
      textDecorationLine: layerStyle.textUnderline ? "underline" : undefined,
      textShadow: createTextShadowCss({
        textShadowBlur: layerStyle.textShadowBlur,
        textShadowColor: layerStyle.textShadowColor,
        textShadowDepth: layerStyle.textShadowDepth,
        textShadowEnabled: layerStyle.textShadowEnabled,
        textShadowMode: layerStyle.textShadowMode,
        textShadowOffsetX: layerStyle.textShadowOffsetX,
        textShadowOffsetY: layerStyle.textShadowOffsetY,
        textShadowOpacity: layerStyle.textShadowOpacity,
      }),
    } satisfies CSSProperties,
  };
}

function getTextResizeHandleTargetClass(handleId: TextResizeHandleId) {
  const positionClasses = {
    ne: "right-0 top-0 h-9 w-9 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
    nw: "left-0 top-0 h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
    se: "bottom-0 right-0 h-9 w-9 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
    sw: "bottom-0 left-0 h-9 w-9 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  } satisfies Record<TextResizeHandleId, string>;

  return positionClasses[handleId];
}

type TextLayerResizeControlsProps = {
  layerId: TextLayerId;
  onPointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onPointerDown?: (
    layerId: TextLayerId,
    handleId: TextResizeHandleId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onPointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onPointerUp?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onRotatePointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onRotatePointerDown?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onRotatePointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onRotatePointerUp?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
};

function TextLayerResizeControls({
  layerId,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onRotatePointerCancel,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
}: TextLayerResizeControlsProps) {
  return (
    <div
      data-export-ignore="true"
      data-editor-live-overlay="text-resize"
      className="pointer-events-none absolute -inset-1.5 z-20 rounded-md ring-2 ring-blue-400/80 ring-offset-1 ring-offset-white/25"
    >
      {TEXT_RESIZE_HANDLES.map((handleId) => (
        <button
          key={handleId}
          type="button"
          aria-label={`Resize ${layerId} text ${handleId}`}
          className={cn(
            "group pointer-events-auto absolute flex touch-none items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
            getTextResizeHandleTargetClass(handleId),
          )}
          onPointerCancel={(event) => {
            event.stopPropagation();
            onPointerCancel?.(layerId, event);
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            onPointerDown?.(layerId, handleId, event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            onPointerMove?.(layerId, event);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            onPointerUp?.(layerId, event);
          }}
        >
          <span
            aria-hidden="true"
            className="block h-3 w-3 rounded-full border border-blue-500/60 bg-white shadow-sm shadow-slate-950/20 transition group-hover:scale-110"
          />
        </button>
      ))}
      <button
        type="button"
        aria-label={`Rotate ${layerId} text`}
        className="pointer-events-auto absolute -top-8 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-blue-500/60 bg-white text-slate-700 shadow-sm shadow-slate-950/20 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-300"
        onPointerCancel={(event) => {
          event.stopPropagation();
          onRotatePointerCancel?.(layerId, event);
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onRotatePointerDown?.(layerId, event);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          onRotatePointerMove?.(layerId, event);
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          onRotatePointerUp?.(layerId, event);
        }}
      >
        <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

type EditableTextProps = {
  className?: string;
  isEditable: boolean;
  onCommit: (value: string) => void;
  onEditStart?: () => void;
  placeholder?: string;
  style?: CSSProperties;
  tag: "h2" | "p" | "span";
  value: string;
};

function EditableText({
  className,
  isEditable,
  onCommit,
  onEditStart,
  placeholder,
  style,
  tag: Tag,
  value,
}: EditableTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const lastCommittedRef = useRef(value);

  // Sync external changes when not editing
  useEffect(() => {
    if (!isEditing && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }

    lastCommittedRef.current = value;
  }, [value, isEditing]);

  const commitValue = useCallback(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const nextValue = (el.textContent ?? "").trim();

    if (nextValue !== lastCommittedRef.current.trim()) {
      onCommit(nextValue);
      lastCommittedRef.current = nextValue;
    }

    setIsEditing(false);
  }, [onCommit]);

  function startEditing() {
    if (!isEditable) {
      return;
    }

    onEditStart?.();
    setIsEditing(true);

    requestAnimationFrame(() => {
      const el = ref.current;

      if (!el) {
        return;
      }

      el.focus();

      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (!isEditable) {
      return;
    }

    event.stopPropagation();
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!isEditable) {
      return;
    }

    event.stopPropagation();
    startEditing();
  }

  function handleBlur() {
    commitValue();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitValue();
      ref.current?.blur();
    }

    if (event.key === "Escape") {
      event.preventDefault();

      // Revert to last committed value
      if (ref.current) {
        ref.current.textContent = lastCommittedRef.current;
      }

      setIsEditing(false);
      ref.current?.blur();
    }
  }

  return (
    <Tag
      ref={ref as Ref<
        HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement
      >}
      className={cn(
        className,
        isEditable && "px-2 py-1",
        isEditing && "select-text",
        isEditable && !isEditing &&
          "cursor-pointer rounded-md transition-colors hover:ring-2 hover:ring-white/30",
        isEditing &&
          "cursor-text rounded-md outline-none ring-2 ring-white/50",
      )}
      contentEditable={isEditable && isEditing}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={style}
    >
      {value}
    </Tag>
  );
}

const TextOverlay = forwardRef<HTMLDivElement, TextOverlayProps>(
  function TextOverlay({
    activeLayerId = null,
    badgeEnabled,
    badgeOffsetX,
    badgeOffsetY,
    badgeRotation,
    badgeSize,
    badgeText,
    className,
    customTextLayers,
    headlineOffsetX,
    headlineOffsetY,
    headlineRotation,
    headlineSize,
    headlineText,
    isEditable = false,
    isExportMode = false,
    isMovable = false,
    placementBounds,
    onLayerClickCapture,
    onLayerEditStart,
    onLayerPointerCancel,
    onLayerPointerDown,
    onLayerPointerMove,
    onLayerPointerUp,
    onLayerResizePointerCancel,
    onLayerResizePointerDown,
    onLayerResizePointerMove,
    onLayerResizePointerUp,
    onLayerRotatePointerCancel,
    onLayerRotatePointerDown,
    onLayerRotatePointerMove,
    onLayerRotatePointerUp,
    subtitleOffsetX,
    subtitleOffsetY,
    subtitleRotation,
    subtitleSize,
    subtitleText,
    textAlign,
    textColor,
    textFontId,
    textFontWeight,
    textLayerStyles,
    textItalic,
    textLetterSpacing,
    textLineHeight,
    textOpacity,
    textPosition,
    textShadowBlur,
    textShadowColor,
    textShadowDepth,
    textShadowEnabled,
    textShadowMode,
    textShadowOffsetX,
    textShadowOffsetY,
    textShadowOpacity,
    textUnderline,
  }, forwardedRef) {
  const setHeadlineText = useEditorStore((state) => state.setHeadlineText);
  const setSubtitleText = useEditorStore((state) => state.setSubtitleText);
  const setBadgeText = useEditorStore((state) => state.setBadgeText);
  const setCustomTextLayerText = useEditorStore(
    (state) => state.setCustomTextLayerText,
  );
  const removeTextLayer = useEditorStore((state) => state.removeTextLayer);
  const normalizedBadgeText = badgeText.trim();
  const normalizedHeadlineText = headlineText.trim();
  const normalizedSubtitleText = subtitleText.trim();
  const shouldShowBadge = badgeEnabled && normalizedBadgeText.length > 0;
  const hasText =
    shouldShowBadge ||
    normalizedHeadlineText.length > 0 ||
    normalizedSubtitleText.length > 0 ||
    customTextLayers.some((layer) => layer.text.trim().length > 0);

  if (!hasText) {
    return null;
  }

  const fallbackTextLayerStyle = {
    textAlign,
    textColor,
    textFontId,
    textFontWeight,
    textItalic,
    textUnderline,
    textLetterSpacing,
    textLineHeight,
    textOpacity,
    textShadowEnabled,
    textShadowMode,
    textShadowPresetId: "custom",
    textShadowColor,
    textShadowBlur,
    textShadowOffsetX,
    textShadowOffsetY,
    textShadowOpacity,
    textShadowDepth,
  } satisfies TextLayerStyle;
  const badgeLayerStyle = textLayerStyles.badge ?? fallbackTextLayerStyle;
  const headlineLayerStyle =
    textLayerStyles.headline ?? fallbackTextLayerStyle;
  const subtitleLayerStyle =
    textLayerStyles.subtitle ?? fallbackTextLayerStyle;
  const badgeTextStyle = createLayerTextStyle(badgeLayerStyle, badgeSize);
  const headlineTextStyle = createLayerTextStyle(
    headlineLayerStyle,
    headlineSize,
  );
  const subtitleTextStyle = createLayerTextStyle(
    subtitleLayerStyle,
    subtitleSize,
  );
  const badgePlacementStyle = createLayerPlacementStyle(
    badgeOffsetX,
    badgeOffsetY,
    badgeRotation,
    placementBounds,
  );
  const headlinePlacementStyle = createLayerPlacementStyle(
    headlineOffsetX,
    headlineOffsetY,
    headlineRotation,
    placementBounds,
  );
  const subtitlePlacementStyle = createLayerPlacementStyle(
    subtitleOffsetX,
    subtitleOffsetY,
    subtitleRotation,
    placementBounds,
  );

  function createLayerInteractionProps(layerId: TextLayerId) {
    return {
      onClickCapture(event: MouseEvent<HTMLDivElement>) {
        onLayerClickCapture?.(layerId, event);
      },
      onPointerCancel(event: PointerEvent<HTMLDivElement>) {
        onLayerPointerCancel?.(layerId, event);
      },
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        onLayerPointerDown?.(layerId, event);
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        onLayerPointerMove?.(layerId, event);
      },
      onPointerUp(event: PointerEvent<HTMLDivElement>) {
        onLayerPointerUp?.(layerId, event);
      },
    };
  }

  return (
    <div
      className={cn(
        "relative z-10 flex min-w-0 shrink-0 flex-col gap-3 overflow-visible",
        getTextAlignClass(textAlign),
        getTextWidthClass(textPosition),
        className,
      )}
      ref={forwardedRef}
    >
      {shouldShowBadge && (
        <div
          {...createLayerInteractionProps("badge")}
          data-text-layer-id="badge"
          className={cn(
            "relative max-w-full touch-none",
            isMovable && "cursor-move select-none",
          )}
          style={badgePlacementStyle}
        >
          <div
            className={cn(
              "max-w-full rounded-full border border-white/25 bg-white/18 px-3 py-1 font-bold uppercase leading-tight tracking-normal shadow-sm",
              badgeTextStyle.className,
              getTextContentAlignClass(badgeLayerStyle.textAlign),
              !isExportMode && "backdrop-blur-md",
            )}
            style={badgeTextStyle.style}
          >
            <EditableText
              tag="span"
              value={normalizedBadgeText}
              isEditable={isEditable}
              onCommit={setBadgeText}
              onEditStart={() => onLayerEditStart?.("badge")}
              placeholder="BADGE"
              className="block max-w-full whitespace-normal break-words [overflow-wrap:anywhere]"
            />
          </div>
          {!isExportMode && activeLayerId === "badge" && (
            <TextLayerResizeControls
              layerId="badge"
              onPointerCancel={onLayerResizePointerCancel}
              onPointerDown={onLayerResizePointerDown}
              onPointerMove={onLayerResizePointerMove}
              onPointerUp={onLayerResizePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {normalizedHeadlineText && (
        <div
          {...createLayerInteractionProps("headline")}
          data-text-layer-id="headline"
          className={cn(
            "relative max-w-full touch-none",
            isMovable && "cursor-move select-none",
          )}
          style={headlinePlacementStyle}
        >
          <EditableText
            tag="h2"
            value={normalizedHeadlineText}
            isEditable={isEditable}
            onCommit={setHeadlineText}
            onEditStart={() => onLayerEditStart?.("headline")}
            placeholder="Headline text"
            className={cn(
              "max-w-full text-balance break-words font-black leading-[0.98] tracking-normal [overflow-wrap:anywhere] sm:max-w-[14em]",
              headlineTextStyle.className,
              getTextContentAlignClass(headlineLayerStyle.textAlign),
            )}
            style={headlineTextStyle.style}
          />
          {!isExportMode && activeLayerId === "headline" && (
            <TextLayerResizeControls
              layerId="headline"
              onPointerCancel={onLayerResizePointerCancel}
              onPointerDown={onLayerResizePointerDown}
              onPointerMove={onLayerResizePointerMove}
              onPointerUp={onLayerResizePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {normalizedSubtitleText && (
        <div
          {...createLayerInteractionProps("subtitle")}
          data-text-layer-id="subtitle"
          className={cn(
            "relative max-w-full touch-none",
            isMovable && "cursor-move select-none",
          )}
          style={subtitlePlacementStyle}
        >
          <EditableText
            tag="p"
            value={normalizedSubtitleText}
            isEditable={isEditable}
            onCommit={setSubtitleText}
            onEditStart={() => onLayerEditStart?.("subtitle")}
            placeholder="Subtitle text"
            className={cn(
              "max-w-full text-pretty break-words font-medium leading-snug opacity-90 [overflow-wrap:anywhere]",
              subtitleTextStyle.className,
              getTextContentAlignClass(subtitleLayerStyle.textAlign),
            )}
            style={subtitleTextStyle.style}
          />
          {!isExportMode && activeLayerId === "subtitle" && (
            <TextLayerResizeControls
              layerId="subtitle"
              onPointerCancel={onLayerResizePointerCancel}
              onPointerDown={onLayerResizePointerDown}
              onPointerMove={onLayerResizePointerMove}
              onPointerUp={onLayerResizePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {customTextLayers.map((layer) => {
        const normalizedCustomText = layer.text.trim();

        if (!normalizedCustomText) {
          return null;
        }

        const customTextStyle = createLayerTextStyle(layer.style, layer.size);
        const customPlacementStyle = createLayerPlacementStyle(
          layer.offsetX,
          layer.offsetY,
          layer.rotation,
          placementBounds,
        );

        return (
          <div
            key={layer.id}
            {...createLayerInteractionProps(layer.id)}
            data-text-layer-id={layer.id}
            className={cn(
              "relative max-w-full touch-none",
              isMovable && "cursor-move select-none",
            )}
            style={customPlacementStyle}
          >
            <EditableText
              tag="h2"
              value={normalizedCustomText}
              isEditable={isEditable}
              onCommit={(value) => {
                if (value.trim()) {
                  setCustomTextLayerText(layer.id, value);
                  return;
                }

                removeTextLayer(layer.id);
              }}
              onEditStart={() => onLayerEditStart?.(layer.id)}
              placeholder="New text"
              className={cn(
                "max-w-full text-balance break-words font-black leading-[0.98] tracking-normal [overflow-wrap:anywhere] sm:max-w-[14em]",
                customTextStyle.className,
                getTextContentAlignClass(layer.style.textAlign),
              )}
              style={customTextStyle.style}
            />
            {!isExportMode && activeLayerId === layer.id && (
              <TextLayerResizeControls
                layerId={layer.id}
                onPointerCancel={onLayerResizePointerCancel}
                onPointerDown={onLayerResizePointerDown}
                onPointerMove={onLayerResizePointerMove}
                onPointerUp={onLayerResizePointerUp}
                onRotatePointerCancel={onLayerRotatePointerCancel}
                onRotatePointerDown={onLayerRotatePointerDown}
                onRotatePointerMove={onLayerRotatePointerMove}
                onRotatePointerUp={onLayerRotatePointerUp}
              />
            )}
          </div>
        );
      })}
    </div>
  );
  },
);

TextOverlay.displayName = "TextOverlay";

export default TextOverlay;
