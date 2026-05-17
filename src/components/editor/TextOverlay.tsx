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

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { TextAlign, TextLayerId, TextPosition } from "@/types/editor";

type TextOverlayProps = {
  badgeEnabled: boolean;
  badgeOffsetX: number;
  badgeOffsetY: number;
  badgeText: string;
  className?: string;
  headlineOffsetX: number;
  headlineOffsetY: number;
  headlineSize: number;
  headlineText: string;
  isEditable?: boolean;
  isExportMode?: boolean;
  isMovable?: boolean;
  onLayerClickCapture?: (
    layerId: TextLayerId,
    event: MouseEvent<HTMLDivElement>,
  ) => void;
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
  subtitleOffsetX: number;
  subtitleOffsetY: number;
  subtitleSize: number;
  subtitleText: string;
  textAlign: TextAlign;
  textColor: string;
  textPosition: TextPosition;
};

function getTextAlignClass(textAlign: TextAlign) {
  if (textAlign === "center") {
    return "items-center text-center";
  }

  if (textAlign === "right") {
    return "items-end text-right";
  }

  return "items-start text-left";
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

function createLayerPlacementStyle(offsetX: number, offsetY: number) {
  return {
    transform: `translate(calc(${offsetX} * 50cqw), calc(${offsetY} * 50cqh))`,
  } satisfies CSSProperties;
}

type EditableTextProps = {
  className?: string;
  isEditable: boolean;
  onCommit: (value: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  tag: "h2" | "p" | "span";
  value: string;
};

function EditableText({
  className,
  isEditable,
  onCommit,
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

  function handleClick(event: MouseEvent<HTMLElement>) {
    if (!isEditable) {
      return;
    }

    event.stopPropagation();
    setIsEditing(true);

    // Focus and select the text after a tick
    requestAnimationFrame(() => {
      const el = ref.current;

      if (!el) {
        return;
      }

      el.focus();

      // Select all text
      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
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
  badgeEnabled,
  badgeOffsetX,
  badgeOffsetY,
  badgeText,
  className,
  headlineOffsetX,
  headlineOffsetY,
  headlineSize,
  headlineText,
  isEditable = false,
  isExportMode = false,
  isMovable = false,
  onLayerClickCapture,
  onLayerPointerCancel,
  onLayerPointerDown,
  onLayerPointerMove,
  onLayerPointerUp,
  subtitleOffsetX,
  subtitleOffsetY,
  subtitleSize,
  subtitleText,
  textAlign,
  textColor,
  textPosition,
}, forwardedRef) {
  const setHeadlineText = useEditorStore((state) => state.setHeadlineText);
  const setSubtitleText = useEditorStore((state) => state.setSubtitleText);
  const setBadgeText = useEditorStore((state) => state.setBadgeText);
  const normalizedBadgeText = badgeText.trim();
  const normalizedHeadlineText = headlineText.trim();
  const normalizedSubtitleText = subtitleText.trim();
  const shouldShowBadge = badgeEnabled && normalizedBadgeText.length > 0;
  const hasText =
    shouldShowBadge ||
    normalizedHeadlineText.length > 0 ||
    normalizedSubtitleText.length > 0;

  if (!hasText) {
    return null;
  }

  const textStyle = {
    color: textColor,
    textShadow:
      "0 1px 2px rgba(15, 23, 42, 0.2), 0 18px 48px rgba(15, 23, 42, 0.28)",
  } satisfies CSSProperties;
  const headlineStyle = {
    fontSize: `${headlineSize}px`,
  } satisfies CSSProperties;
  const subtitleStyle = {
    fontSize: `${subtitleSize}px`,
  } satisfies CSSProperties;
  const badgePlacementStyle = createLayerPlacementStyle(
    badgeOffsetX,
    badgeOffsetY,
  );
  const headlinePlacementStyle = createLayerPlacementStyle(
    headlineOffsetX,
    headlineOffsetY,
  );
  const subtitlePlacementStyle = createLayerPlacementStyle(
    subtitleOffsetX,
    subtitleOffsetY,
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
      style={textStyle}
    >
      {shouldShowBadge && (
        <div
          {...createLayerInteractionProps("badge")}
          className={cn(
            "relative max-w-full touch-none",
            isMovable && "cursor-move select-none",
          )}
          style={badgePlacementStyle}
        >
          <div
            className={cn(
              "max-w-full rounded-full border border-white/25 bg-white/18 px-3 py-1 text-[11px] font-bold uppercase leading-tight tracking-normal shadow-sm",
              !isExportMode && "backdrop-blur-md",
            )}
          >
            <EditableText
              tag="span"
              value={normalizedBadgeText}
              isEditable={isEditable}
              onCommit={setBadgeText}
              placeholder="BADGE"
              className="block max-w-full whitespace-normal break-words [overflow-wrap:anywhere]"
            />
          </div>
        </div>
      )}

      {normalizedHeadlineText && (
        <div
          {...createLayerInteractionProps("headline")}
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
            placeholder="Headline text"
            className="max-w-full text-balance break-words font-black leading-[0.98] tracking-normal [overflow-wrap:anywhere] sm:max-w-[14em]"
            style={headlineStyle}
          />
        </div>
      )}

      {normalizedSubtitleText && (
        <div
          {...createLayerInteractionProps("subtitle")}
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
            placeholder="Subtitle text"
            className="max-w-full text-pretty break-words font-medium leading-snug opacity-90 [overflow-wrap:anywhere]"
            style={subtitleStyle}
          />
        </div>
      )}
    </div>
  );
  },
);

TextOverlay.displayName = "TextOverlay";

export default TextOverlay;
