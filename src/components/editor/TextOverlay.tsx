"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEventHandler,
  type PointerEventHandler,
} from "react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import type { TextAlign, TextPosition } from "@/types/editor";

type TextOverlayProps = {
  badgeEnabled: boolean;
  badgeText: string;
  className?: string;
  headlineSize: number;
  headlineText: string;
  isEditable?: boolean;
  isExportMode?: boolean;
  isMovable?: boolean;
  onClickCapture?: MouseEventHandler<HTMLDivElement>;
  onPointerCancel?: PointerEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerMove?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
  placementStyle?: CSSProperties;
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

  function handleClick(event: React.MouseEvent) {
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
      ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={cn(
        className,
        isEditable && "px-2 py-1",
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
  badgeText,
  className,
  headlineSize,
  headlineText,
  isEditable = false,
  isExportMode = false,
  isMovable = false,
  onClickCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  placementStyle,
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

  return (
    <div
      className={cn(
        "relative z-10 flex min-w-0 shrink-0 touch-none select-none flex-col gap-3 overflow-hidden",
        getTextAlignClass(textAlign),
        getTextWidthClass(textPosition),
        isMovable && "cursor-move",
        className,
      )}
      ref={forwardedRef}
      onClickCapture={onClickCapture}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ ...textStyle, ...placementStyle }}
    >
      {shouldShowBadge && (
        <div
          className={cn(
            "max-w-full rounded-full border border-white/25 bg-white/18 px-3 py-1 text-[11px] font-bold uppercase leading-none tracking-normal shadow-sm",
            !isExportMode && "backdrop-blur-md",
          )}
        >
          <EditableText
            tag="span"
            value={normalizedBadgeText}
            isEditable={isEditable}
            onCommit={setBadgeText}
            placeholder="BADGE"
            className="block truncate"
          />
        </div>
      )}

      {normalizedHeadlineText && (
        <EditableText
          tag="h2"
          value={normalizedHeadlineText}
          isEditable={isEditable}
          onCommit={setHeadlineText}
          placeholder="Headline text"
          className="max-w-full overflow-hidden text-balance font-black leading-[0.98] tracking-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:max-w-[14em]"
          style={headlineStyle}
        />
      )}

      {normalizedSubtitleText && (
        <EditableText
          tag="p"
          value={normalizedSubtitleText}
          isEditable={isEditable}
          onCommit={setSubtitleText}
          placeholder="Subtitle text"
          className="max-w-full overflow-hidden text-pretty font-medium leading-snug opacity-90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          style={subtitleStyle}
        />
      )}
    </div>
  );
  },
);

TextOverlay.displayName = "TextOverlay";

export default TextOverlay;
