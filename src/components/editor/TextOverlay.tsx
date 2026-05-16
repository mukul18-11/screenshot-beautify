import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { TextAlign, TextPosition } from "@/types/editor";

type TextOverlayProps = {
  badgeEnabled: boolean;
  badgeText: string;
  className?: string;
  headlineSize: number;
  headlineText: string;
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

export default function TextOverlay({
  badgeEnabled,
  badgeText,
  className,
  headlineSize,
  headlineText,
  subtitleSize,
  subtitleText,
  textAlign,
  textColor,
  textPosition,
}: TextOverlayProps) {
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
        "relative z-10 flex min-w-0 shrink-0 flex-col gap-3 overflow-hidden",
        getTextAlignClass(textAlign),
        getTextWidthClass(textPosition),
        className,
      )}
      style={textStyle}
    >
      {shouldShowBadge && (
        <div className="max-w-full rounded-full border border-white/25 bg-white/18 px-3 py-1 text-[11px] font-bold uppercase leading-none tracking-normal shadow-sm backdrop-blur-md">
          <span className="block truncate">{normalizedBadgeText}</span>
        </div>
      )}

      {normalizedHeadlineText && (
        <h2
          className="max-w-full overflow-hidden text-balance font-black leading-[0.98] tracking-normal [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          style={headlineStyle}
        >
          {normalizedHeadlineText}
        </h2>
      )}

      {normalizedSubtitleText && (
        <p
          className="max-w-full overflow-hidden text-pretty font-medium leading-snug opacity-90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
          style={subtitleStyle}
        >
          {normalizedSubtitleText}
        </p>
      )}
    </div>
  );
}
