import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { BrowserFrameStyle, BrowserFrameTheme } from "@/types/editor";

type BrowserFrameProps = {
  imageAlt: string;
  imageSrc: string;
  onImageLoad?: () => void;
  radius: number;
  showUrl: boolean;
  theme: BrowserFrameTheme;
  url: string;
  variant: BrowserFrameStyle;
};

const DOTS = [
  "bg-[#ff5f57] ring-[#e34840]/35",
  "bg-[#ffbd2e] ring-[#d89b16]/35",
  "bg-[#28c840] ring-[#1fa032]/35",
] as const;

function getFrameClasses(theme: BrowserFrameTheme) {
  if (theme === "dark") {
    return {
      body: "bg-slate-950",
      surface: "bg-slate-900 text-slate-200",
      topBar: "border-white/10 bg-slate-900/95",
      urlBar: "border-white/10 bg-white/[0.07] text-slate-300",
      minimalText: "text-slate-300",
    };
  }

  return {
    body: "bg-white",
    surface: "bg-white text-slate-700",
    topBar: "border-slate-200/80 bg-slate-50/95",
    urlBar: "border-slate-200/90 bg-white/90 text-slate-500",
    minimalText: "text-slate-500",
  };
}

function MacosTopBar({
  frameClasses,
  showUrl,
  url,
}: {
  frameClasses: ReturnType<typeof getFrameClasses>;
  showUrl: boolean;
  url: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 shrink-0 items-center gap-3 border-b px-3",
        frameClasses.topBar,
      )}
    >
      <div className="flex w-14 shrink-0 items-center gap-1.5">
        {DOTS.map((dotClass) => (
          <span
            key={dotClass}
            className={cn("h-2.5 w-2.5 rounded-full ring-1", dotClass)}
            aria-hidden="true"
          />
        ))}
      </div>

      {showUrl ? (
        <>
          <div
            className={cn(
              "min-w-0 flex-1 rounded-md border px-3 py-1 text-center text-[11px] font-medium leading-none",
              frameClasses.urlBar,
            )}
          >
            <span className="block truncate">{url}</span>
          </div>
          <div className="w-14 shrink-0" aria-hidden="true" />
        </>
      ) : (
        <div className="min-w-0 flex-1" aria-hidden="true" />
      )}
    </div>
  );
}

function MinimalTopBar({
  frameClasses,
  showUrl,
  url,
}: {
  frameClasses: ReturnType<typeof getFrameClasses>;
  showUrl: boolean;
  url: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 shrink-0 items-center border-b px-3",
        frameClasses.topBar,
      )}
    >
      {showUrl ? (
        <p
          className={cn(
            "min-w-0 truncate text-[11px] font-medium leading-none",
            frameClasses.minimalText,
          )}
        >
          {url}
        </p>
      ) : (
        <div className="h-1.5 w-12 rounded-full bg-current opacity-15" />
      )}
    </div>
  );
}

export default function BrowserFrame({
  imageAlt,
  imageSrc,
  onImageLoad,
  radius,
  showUrl,
  theme,
  url,
  variant,
}: BrowserFrameProps) {
  const frameClasses = getFrameClasses(theme);
  const innerRadius = Math.max(radius - 2, 0);
  const frameStyle = {
    borderRadius: `${radius}px`,
  } satisfies CSSProperties;
  const imageWrapStyle = {
    borderBottomLeftRadius: `${innerRadius}px`,
    borderBottomRightRadius: `${innerRadius}px`,
  } satisfies CSSProperties;

  return (
    <div
      className={cn(
        "flex max-h-full max-w-full flex-col overflow-hidden",
        frameClasses.surface,
      )}
      style={frameStyle}
    >
      {variant === "macos" ? (
        <MacosTopBar
          frameClasses={frameClasses}
          showUrl={showUrl}
          url={url}
        />
      ) : (
        <MinimalTopBar
          frameClasses={frameClasses}
          showUrl={showUrl}
          url={url}
        />
      )}

      <div
        className={cn("min-h-0 overflow-hidden", frameClasses.body)}
        style={imageWrapStyle}
      >
        {/* Object URLs from local uploads are not compatible with next/image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          onLoad={onImageLoad}
          className="block h-auto max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}
