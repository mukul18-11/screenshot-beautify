import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { BrowserFrameStyle, BrowserFrameTheme } from "@/types/editor";

type BrowserFrameProps = {
  children: ReactNode;
  radius: number;
  showUrl: boolean;
  theme: BrowserFrameTheme;
  url: string;
  variant: BrowserFrameStyle;
};

/** macOS-style top bar height in px (traffic lights + optional URL bar). */
export const MACOS_TOP_BAR_HEIGHT = 40;

/** Minimal-style top bar height in px. */
export const MINIMAL_TOP_BAR_HEIGHT = 32;

const DOTS = [
  "bg-[#ff5f57] ring-[#e34840]/35",
  "bg-[#ffbd2e] ring-[#d89b16]/35",
  "bg-[#28c840] ring-[#1fa032]/35",
] as const;

function getFrameClasses(theme: BrowserFrameTheme) {
  if (theme === "dark") {
    return {
      body: "bg-transparent",
      surface: "text-slate-200",
      topBar: "border-white/10 bg-slate-900/95",
      urlBar: "border-white/10 bg-white/[0.07] text-slate-300",
      minimalText: "text-slate-300",
    };
  }

  return {
    body: "bg-transparent",
    surface: "text-slate-700",
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
        "pointer-events-none relative z-10 flex shrink-0 items-center gap-3 border-b px-3",
        frameClasses.topBar,
      )}
      style={{ height: `${MACOS_TOP_BAR_HEIGHT}px` }}
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
        "pointer-events-none relative z-10 flex shrink-0 items-center border-b px-3",
        frameClasses.topBar,
      )}
      style={{ height: `${MINIMAL_TOP_BAR_HEIGHT}px` }}
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
  children,
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
    borderRadius: `${innerRadius}px`,
  } satisfies CSSProperties;

  const TopBar =
    variant === "macos" ? (
      <MacosTopBar
        frameClasses={frameClasses}
        showUrl={showUrl}
        url={url}
      />
    ) : (
      <MinimalTopBar frameClasses={frameClasses} showUrl={showUrl} url={url} />
    );

  return (
    <div
      className={cn(
        "relative inline-block max-w-full overflow-hidden align-top",
        frameClasses.surface,
      )}
      style={frameStyle}
    >
      {TopBar}

      <div
        className={cn("overflow-hidden", frameClasses.body)}
        style={imageWrapStyle}
      >
        {children}
      </div>
    </div>
  );
}
