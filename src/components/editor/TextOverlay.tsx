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

import { Move, RotateCw } from "lucide-react";

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
  badgeWidth: number;
  className?: string;
  customTextLayers: CustomTextLayer[];
  activeLayerId?: TextLayerId | null;
  headlineOffsetX: number;
  headlineOffsetY: number;
  headlineRotation: number;
  headlineSize: number;
  headlineText: string;
  headlineWidth: number;
  isEditable?: boolean;
  isCanvasOverlay?: boolean;
  isExportMode?: boolean;
  isMovable?: boolean;
  layerScope?: "all" | "default" | "custom";
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
  onLayerMovePointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerMovePointerDown?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerMovePointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onLayerMovePointerUp?: (
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
  subtitleWidth: number;
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

export type TextResizeHandleId = "nw" | "ne" | "sw" | "se" | "w" | "e";

const TEXT_RESIZE_HANDLES = [
  "nw",
  "ne",
  "se",
  "sw",
] as const satisfies readonly Exclude<TextResizeHandleId, "w" | "e">[];

const TEXT_WIDTH_HANDLES = [
  "w",
  "e",
] as const satisfies readonly Extract<TextResizeHandleId, "w" | "e">[];

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
    return "max-w-[96%]";
  }

  return "max-w-[96%]";
}

function createLayerPlacementStyle(
  offsetX: number,
  offsetY: number,
  rotation: number,
  anchorToCenter = false,
  placementBounds?: { height: number; width: number },
) {
  const translateX = placementBounds
    ? `${offsetX * placementBounds.width * 0.5}px`
    : `calc(${offsetX} * 50cqw)`;
  const translateY = placementBounds
    ? `${offsetY * placementBounds.height * 0.5}px`
    : `calc(${offsetY} * 50cqh)`;

  return {
    transform: `${
      anchorToCenter ? "translate(-50%, -50%) " : ""
    }translate(${translateX}, ${translateY}) rotate(${rotation}deg)`,
    transformOrigin: "center",
  } satisfies CSSProperties;
}

function createLayerWidthStyle(
  width: number,
  placementBounds?: { height: number; width: number },
) {
  return {
    maxWidth: placementBounds ? `${placementBounds.width}px` : "96cqw",
    width: placementBounds
      ? `${width * placementBounds.width}px`
      : `${width * 100}cqw`,
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
    e: "right-0 top-1/2 h-10 w-8 -translate-y-1/2 translate-x-1/2 cursor-ew-resize",
    ne: "right-0 top-0 h-9 w-9 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize",
    nw: "left-0 top-0 h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
    se: "bottom-0 right-0 h-9 w-9 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
    sw: "bottom-0 left-0 h-9 w-9 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
    w: "left-0 top-1/2 h-10 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  } satisfies Record<TextResizeHandleId, string>;

  return positionClasses[handleId];
}

function getTextResizeHandleVisualClass(handleId: TextResizeHandleId) {
  if (handleId === "e" || handleId === "w") {
    return "h-6 w-1.5 rounded-full";
  }

  return "h-3 w-3 rounded-full";
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
  onMovePointerCancel?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onMovePointerDown?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onMovePointerMove?: (
    layerId: TextLayerId,
    event: PointerEvent<HTMLButtonElement>,
  ) => void;
  onMovePointerUp?: (
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
  onMovePointerCancel,
  onMovePointerDown,
  onMovePointerMove,
  onMovePointerUp,
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
            className={cn(
              "block border border-blue-500/60 bg-white shadow-sm shadow-slate-950/20 transition group-hover:scale-110",
              getTextResizeHandleVisualClass(handleId),
            )}
          />
        </button>
      ))}
      {TEXT_WIDTH_HANDLES.map((handleId) => (
        <button
          key={handleId}
          type="button"
          aria-label={`Adjust ${layerId} text width ${handleId}`}
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
            className={cn(
              "block border border-blue-500/60 bg-white shadow-sm shadow-slate-950/20 transition group-hover:scale-110",
              getTextResizeHandleVisualClass(handleId),
            )}
          />
        </button>
      ))}
      <div className="pointer-events-none absolute -top-14 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          aria-label={`Rotate ${layerId} text`}
          title="Rotate text"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/60 bg-white text-slate-700 shadow-sm shadow-slate-950/20 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-300"
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
          <RotateCw className="h-7 w-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={`Move ${layerId} text`}
          title="Move text"
          className="pointer-events-auto flex h-12 w-12 touch-none items-center justify-center rounded-full border border-blue-500/60 bg-white text-slate-700 shadow-sm shadow-slate-950/20 outline-none transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-300"
          onPointerCancel={(event) => {
            event.stopPropagation();
            onMovePointerCancel?.(layerId, event);
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
            onMovePointerDown?.(layerId, event);
          }}
          onPointerMove={(event) => {
            event.stopPropagation();
            onMovePointerMove?.(layerId, event);
          }}
          onPointerUp={(event) => {
            event.stopPropagation();
            onMovePointerUp?.(layerId, event);
          }}
        >
          <Move className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
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

  function insertLineBreak() {
    const el = ref.current;
    const selection = window.getSelection();

    if (!el || !selection || selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);

    if (!el.contains(range.commonAncestorContainer)) {
      return;
    }

    if (
      document.queryCommandSupported?.("insertText") &&
      document.execCommand("insertText", false, "\n")
    ) {
      return;
    }

    range.deleteContents();

    const lineBreak = document.createTextNode("\n");
    range.insertNode(lineBreak);
    range.setStartAfter(lineBreak);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }

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

    if (event.detail >= 2) {
      event.preventDefault();
      event.stopPropagation();
      startEditing();
      return;
    }

    if (isEditing) {
      event.stopPropagation();
    }
  }

  function handleMouseDown(event: MouseEvent<HTMLElement>) {
    if (!isEditable || event.detail < 2) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    startEditing();
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!isEditable) {
      return;
    }

    event.stopPropagation();
  }

  function handleDoubleClick(event: MouseEvent<HTMLElement>) {
    if (!isEditable) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    startEditing();
  }

  function handleBlur() {
    commitValue();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      insertLineBreak();
      return;
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
        "whitespace-pre-wrap",
        isEditable && "px-2 py-1",
        isEditing && "select-text",
        isEditable && !isEditing &&
          "cursor-pointer rounded-md transition-colors hover:ring-2 hover:ring-white/30",
        isEditing &&
          "cursor-text rounded-md outline-none ring-2 ring-white/50",
      )}
      contentEditable={isEditable && isEditing}
      suppressContentEditableWarning
      data-editor-editable-text="true"
      data-placeholder={placeholder}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
    badgeWidth,
    className,
    customTextLayers,
    headlineOffsetX,
    headlineOffsetY,
    headlineRotation,
    headlineSize,
    headlineText,
    headlineWidth,
    isEditable = false,
    isCanvasOverlay = false,
    isExportMode = false,
    isMovable = false,
    layerScope = "all",
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
    onLayerMovePointerCancel,
    onLayerMovePointerDown,
    onLayerMovePointerMove,
    onLayerMovePointerUp,
    onLayerRotatePointerCancel,
    onLayerRotatePointerDown,
    onLayerRotatePointerMove,
    onLayerRotatePointerUp,
    subtitleOffsetX,
    subtitleOffsetY,
    subtitleRotation,
    subtitleSize,
    subtitleText,
    subtitleWidth,
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
  const shouldRenderDefaultLayers = layerScope !== "custom";
  const shouldRenderCustomLayers = layerScope !== "default";
  const hasDefaultText =
    shouldRenderDefaultLayers &&
    (shouldShowBadge ||
      normalizedHeadlineText.length > 0 ||
      normalizedSubtitleText.length > 0);
  const hasCustomText =
    shouldRenderCustomLayers &&
    customTextLayers.some((layer) => layer.text.trim().length > 0);
  const hasText =
    hasDefaultText || hasCustomText;

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
    false,
    placementBounds,
  );
  const headlinePlacementStyle = createLayerPlacementStyle(
    headlineOffsetX,
    headlineOffsetY,
    headlineRotation,
    false,
    placementBounds,
  );
  const subtitlePlacementStyle = createLayerPlacementStyle(
    subtitleOffsetX,
    subtitleOffsetY,
    subtitleRotation,
    false,
    placementBounds,
  );
  const badgeLayerStyleProperties = {
    ...badgePlacementStyle,
    ...createLayerWidthStyle(badgeWidth, placementBounds),
  } satisfies CSSProperties;
  const headlineLayerStyleProperties = {
    ...headlinePlacementStyle,
    ...createLayerWidthStyle(headlineWidth, placementBounds),
  } satisfies CSSProperties;
  const subtitleLayerStyleProperties = {
    ...subtitlePlacementStyle,
    ...createLayerWidthStyle(subtitleWidth, placementBounds),
  } satisfies CSSProperties;

  // An inactive layer keeps vertical page scrolling alive on touch devices;
  // full 2D dragging is enabled once the layer is selected.
  function getLayerTouchActionClass(layerId: TextLayerId) {
    return activeLayerId === layerId ? "touch-none" : "touch-pan-y";
  }

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
        isCanvasOverlay
          ? "pointer-events-none absolute inset-0 z-10 overflow-visible"
          : "pointer-events-none relative z-10 flex min-w-0 shrink-0 flex-col gap-3 overflow-visible",
        !isCanvasOverlay && getTextAlignClass(textAlign),
        !isCanvasOverlay && getTextWidthClass(textPosition),
        className,
      )}
      ref={forwardedRef}
    >
      {shouldRenderDefaultLayers && shouldShowBadge && (
        <div
          {...createLayerInteractionProps("badge")}
          data-text-layer-id="badge"
          className={cn(
            "pointer-events-auto relative max-w-full",
            getLayerTouchActionClass("badge"),
            isMovable && "cursor-move select-none",
          )}
          style={badgeLayerStyleProperties}
        >
          <div
            className={cn(
              "w-full max-w-full rounded-full border border-white/25 bg-white/18 px-3 py-1 font-bold uppercase leading-tight tracking-normal shadow-sm",
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
              className="block w-full max-w-full whitespace-normal break-words [overflow-wrap:anywhere]"
            />
          </div>
          {!isExportMode && activeLayerId === "badge" && (
            <TextLayerResizeControls
              layerId="badge"
              onPointerCancel={onLayerResizePointerCancel}
              onPointerDown={onLayerResizePointerDown}
              onPointerMove={onLayerResizePointerMove}
              onPointerUp={onLayerResizePointerUp}
              onMovePointerCancel={onLayerMovePointerCancel}
              onMovePointerDown={onLayerMovePointerDown}
              onMovePointerMove={onLayerMovePointerMove}
              onMovePointerUp={onLayerMovePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {shouldRenderDefaultLayers && normalizedHeadlineText && (
        <div
          {...createLayerInteractionProps("headline")}
          data-text-layer-id="headline"
          className={cn(
            "pointer-events-auto relative max-w-full",
            getLayerTouchActionClass("headline"),
            isMovable && "cursor-move select-none",
          )}
          style={headlineLayerStyleProperties}
        >
          <EditableText
            tag="h2"
            value={normalizedHeadlineText}
            isEditable={isEditable}
            onCommit={setHeadlineText}
            onEditStart={() => onLayerEditStart?.("headline")}
            placeholder="Headline text"
            className={cn(
              "w-full max-w-full text-balance break-words font-black leading-[0.98] tracking-normal [overflow-wrap:anywhere]",
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
              onMovePointerCancel={onLayerMovePointerCancel}
              onMovePointerDown={onLayerMovePointerDown}
              onMovePointerMove={onLayerMovePointerMove}
              onMovePointerUp={onLayerMovePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {shouldRenderDefaultLayers && normalizedSubtitleText && (
        <div
          {...createLayerInteractionProps("subtitle")}
          data-text-layer-id="subtitle"
          className={cn(
            "pointer-events-auto relative max-w-full",
            getLayerTouchActionClass("subtitle"),
            isMovable && "cursor-move select-none",
          )}
          style={subtitleLayerStyleProperties}
        >
          <EditableText
            tag="p"
            value={normalizedSubtitleText}
            isEditable={isEditable}
            onCommit={setSubtitleText}
            onEditStart={() => onLayerEditStart?.("subtitle")}
            placeholder="Subtitle text"
            className={cn(
              "w-full max-w-full text-pretty break-words font-medium leading-snug opacity-90 [overflow-wrap:anywhere]",
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
              onMovePointerCancel={onLayerMovePointerCancel}
              onMovePointerDown={onLayerMovePointerDown}
              onMovePointerMove={onLayerMovePointerMove}
              onMovePointerUp={onLayerMovePointerUp}
              onRotatePointerCancel={onLayerRotatePointerCancel}
              onRotatePointerDown={onLayerRotatePointerDown}
              onRotatePointerMove={onLayerRotatePointerMove}
              onRotatePointerUp={onLayerRotatePointerUp}
            />
          )}
        </div>
      )}

      {shouldRenderCustomLayers && customTextLayers.map((layer) => {
        const normalizedCustomText = layer.text.trim();

        if (!normalizedCustomText) {
          return null;
        }

        const customTextStyle = createLayerTextStyle(layer.style, layer.size);
        const customPlacementStyle = createLayerPlacementStyle(
          layer.offsetX,
          layer.offsetY,
          layer.rotation,
          isCanvasOverlay,
          placementBounds,
        );
        const customLayerStyleProperties = {
          ...customPlacementStyle,
          ...createLayerWidthStyle(layer.width ?? headlineWidth, placementBounds),
        } satisfies CSSProperties;

        return (
          <div
            key={layer.id}
            {...createLayerInteractionProps(layer.id)}
            data-text-layer-id={layer.id}
            className={cn(
              isCanvasOverlay
                ? "pointer-events-auto absolute left-1/2 top-1/2"
                : "pointer-events-auto relative max-w-full",
              getLayerTouchActionClass(layer.id),
              isMovable && "cursor-move select-none",
            )}
            style={customLayerStyleProperties}
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
                "w-full max-w-full text-balance break-words font-black leading-[0.98] tracking-normal [overflow-wrap:anywhere]",
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
                onMovePointerCancel={onLayerMovePointerCancel}
                onMovePointerDown={onLayerMovePointerDown}
                onMovePointerMove={onLayerMovePointerMove}
                onMovePointerUp={onLayerMovePointerUp}
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
