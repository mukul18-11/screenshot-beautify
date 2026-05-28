import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { BrowserFrameStyle, BrowserFrameTheme } from "@/types/editor";

type BrowserFrameProps = {
  children: ReactNode;
  radius: number;
  showUrl: boolean;
  theme: BrowserFrameTheme;
  url: string;
  urlBold: boolean;
  variant: BrowserFrameStyle;
};

type FrameClasses = ReturnType<typeof getFrameClasses>;

type TopBarProps = {
  frameClasses: FrameClasses;
  showUrl: boolean;
  theme: BrowserFrameTheme;
  url: string;
  urlBold: boolean;
};

type BrowserFrameStyleDefinition = {
  chromeHeight: number;
  label: string;
  renderTopBar: (props: TopBarProps) => ReactNode;
};

export const MACOS_TOP_BAR_HEIGHT = 40;
export const MINIMAL_TOP_BAR_HEIGHT = 32;
export const SAFARI_TOP_BAR_HEIGHT = 46;
export const CHROME_TOP_BAR_HEIGHT = 58;
export const ARC_TOP_BAR_HEIGHT = 48;

const DOTS = [
  "bg-[#ff5f57] ring-[#e34840]/35",
  "bg-[#ffbd2e] ring-[#d89b16]/35",
  "bg-[#28c840] ring-[#1fa032]/35",
] as const;

const textRenderingStyle = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  letterSpacing: "0px",
  textRendering: "geometricPrecision",
} satisfies CSSProperties;

function getFrameClasses(theme: BrowserFrameTheme) {
  if (theme === "dark") {
    return {
      body: "bg-transparent",
      hairline: "bg-white/12",
      muted: "text-slate-500",
      surface: "text-slate-200",
      topBar: "border-white/10 bg-slate-900/95",
      tab: "border-white/10 bg-white/[0.08] text-slate-200",
      urlBar: "border-white/10 bg-white/[0.09] text-slate-100 shadow-black/15",
      urlMuted: "text-slate-300",
    };
  }

  return {
    body: "bg-transparent",
    hairline: "bg-slate-200/90",
    muted: "text-slate-400",
    surface: "text-slate-700",
    topBar: "border-slate-200/80 bg-slate-50/95",
    tab: "border-slate-200/90 bg-white/90 text-slate-700",
    urlBar: "border-slate-200/90 bg-white/95 text-slate-700 shadow-slate-950/5",
    urlMuted: "text-slate-500",
  };
}

function TrafficLights() {
  return (
    <div className="flex w-14 shrink-0 items-center gap-1.5">
      {DOTS.map((dotClass) => (
        <span
          key={dotClass}
          className={cn("h-2.5 w-2.5 rounded-full ring-1", dotClass)}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function UrlText({
  className,
  url,
  urlBold,
}: {
  className?: string;
  url: string;
  urlBold: boolean;
}) {
  return (
    <span
      className={cn(
        "block min-w-0 truncate text-[12px] leading-none",
        urlBold ? "font-extrabold" : "font-semibold",
        className,
      )}
      style={textRenderingStyle}
    >
      {url}
    </span>
  );
}

function MacosTopBar({ frameClasses, showUrl, url, urlBold }: TopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 flex shrink-0 items-center gap-3 border-b px-3",
        frameClasses.topBar,
      )}
      style={{ height: `${MACOS_TOP_BAR_HEIGHT}px` }}
    >
      <TrafficLights />

      {showUrl ? (
        <>
          <div
            className={cn(
              "min-w-0 flex-1 rounded-md border px-3 py-1.5 text-center shadow-sm",
              frameClasses.urlBar,
            )}
          >
            <UrlText url={url} urlBold={urlBold} />
          </div>
          <div className="w-14 shrink-0" aria-hidden="true" />
        </>
      ) : (
        <div className="min-w-0 flex-1" aria-hidden="true" />
      )}
    </div>
  );
}

function MinimalTopBar({ frameClasses, showUrl, url, urlBold }: TopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 flex shrink-0 items-center border-b px-3",
        frameClasses.topBar,
      )}
      style={{ height: `${MINIMAL_TOP_BAR_HEIGHT}px` }}
    >
      {showUrl ? (
        <UrlText
          className={frameClasses.urlMuted}
          url={url}
          urlBold={urlBold}
        />
      ) : (
        <div className="h-1.5 w-12 rounded-full bg-current opacity-15" />
      )}
    </div>
  );
}

function SafariTopBar({ frameClasses, showUrl, url, urlBold }: TopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 flex shrink-0 items-center gap-3 border-b px-3",
        frameClasses.topBar,
      )}
      style={{ height: `${SAFARI_TOP_BAR_HEIGHT}px` }}
    >
      <TrafficLights />
      <div className={cn("text-[15px] font-bold", frameClasses.muted)}>
        {"<"}
      </div>
      <div className={cn("text-[15px] font-bold", frameClasses.muted)}>
        {">"}
      </div>
      {showUrl ? (
        <div
          className={cn(
            "min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-center shadow-sm",
            frameClasses.urlBar,
          )}
        >
          <UrlText url={url} urlBold={urlBold} />
        </div>
      ) : (
        <div className="min-w-0 flex-1" aria-hidden="true" />
      )}
      <div className="flex w-12 shrink-0 justify-end gap-1.5" aria-hidden="true">
        <span className={cn("h-3.5 w-3.5 rounded-sm", frameClasses.hairline)} />
        <span className={cn("h-3.5 w-3.5 rounded-sm", frameClasses.hairline)} />
      </div>
    </div>
  );
}

function ChromeTopBar({ frameClasses, showUrl, url, urlBold }: TopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 flex shrink-0 flex-col border-b",
        frameClasses.topBar,
      )}
      style={{ height: `${CHROME_TOP_BAR_HEIGHT}px` }}
    >
      <div className="flex h-7 items-end gap-2 px-3">
        <TrafficLights />
        <div
          className={cn(
            "flex h-6 min-w-0 flex-1 items-center rounded-t-lg border border-b-0 px-2",
            frameClasses.tab,
          )}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
          <span className="ml-2 h-1.5 w-24 max-w-[40%] rounded-full bg-current opacity-20" />
        </div>
        <span className={cn("mb-2 h-1.5 w-1.5 rounded-full", frameClasses.hairline)} />
      </div>
      <div className="flex h-8 items-center gap-2 px-3 pb-2">
        <span className={cn("text-[14px] font-bold", frameClasses.muted)}>
          {"<"}
        </span>
        <span className={cn("text-[14px] font-bold", frameClasses.muted)}>
          {">"}
        </span>
        {showUrl ? (
          <div
            className={cn(
              "min-w-0 flex-1 rounded-full border px-3 py-1.5 text-center shadow-sm",
              frameClasses.urlBar,
            )}
          >
            <UrlText url={url} urlBold={urlBold} />
          </div>
        ) : (
          <div className={cn("h-4 min-w-0 flex-1 rounded-full", frameClasses.hairline)} />
        )}
        <span className={cn("h-4 w-4 rounded-full", frameClasses.hairline)} />
      </div>
    </div>
  );
}

function ArcTopBar({ frameClasses, showUrl, url, urlBold, theme }: TopBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-10 flex shrink-0 items-center gap-3 border-b px-3",
        frameClasses.topBar,
        theme === "dark" ? "bg-[#17131e]/95" : "bg-[#f7f3ff]/95",
      )}
      style={{ height: `${ARC_TOP_BAR_HEIGHT}px` }}
    >
      <TrafficLights />
      <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
        <span className="h-5 w-5 rounded-md bg-violet-500/20" />
        <span className="h-5 w-5 rounded-md bg-fuchsia-500/20" />
      </div>
      {showUrl ? (
        <div
          className={cn(
            "min-w-0 flex-1 rounded-xl border px-3 py-1.5 text-center shadow-sm",
            frameClasses.urlBar,
          )}
        >
          <UrlText url={url} urlBold={urlBold} />
        </div>
      ) : (
        <div className="min-w-0 flex-1" aria-hidden="true" />
      )}
      <div className="grid w-8 shrink-0 grid-cols-2 gap-1" aria-hidden="true">
        <span className={cn("h-2 rounded-full", frameClasses.hairline)} />
        <span className={cn("h-2 rounded-full", frameClasses.hairline)} />
        <span className={cn("h-2 rounded-full", frameClasses.hairline)} />
        <span className={cn("h-2 rounded-full", frameClasses.hairline)} />
      </div>
    </div>
  );
}

export const BROWSER_FRAME_STYLES = {
  macos: {
    chromeHeight: MACOS_TOP_BAR_HEIGHT,
    label: "macOS",
    renderTopBar: MacosTopBar,
  },
  minimal: {
    chromeHeight: MINIMAL_TOP_BAR_HEIGHT,
    label: "Minimal",
    renderTopBar: MinimalTopBar,
  },
  safari: {
    chromeHeight: SAFARI_TOP_BAR_HEIGHT,
    label: "Safari",
    renderTopBar: SafariTopBar,
  },
  chrome: {
    chromeHeight: CHROME_TOP_BAR_HEIGHT,
    label: "Chrome",
    renderTopBar: ChromeTopBar,
  },
  arc: {
    chromeHeight: ARC_TOP_BAR_HEIGHT,
    label: "Arc",
    renderTopBar: ArcTopBar,
  },
} as const satisfies Record<BrowserFrameStyle, BrowserFrameStyleDefinition>;

export function getBrowserFrameChromeHeight(style: BrowserFrameStyle) {
  return BROWSER_FRAME_STYLES[style].chromeHeight;
}

export default function BrowserFrame({
  children,
  radius,
  showUrl,
  theme,
  url,
  urlBold,
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
  const TopBar = BROWSER_FRAME_STYLES[variant].renderTopBar;

  return (
    <div
      className={cn(
        "relative inline-block max-w-full overflow-hidden align-top",
        frameClasses.surface,
      )}
      style={frameStyle}
    >
      <TopBar
        frameClasses={frameClasses}
        showUrl={showUrl}
        theme={theme}
        url={url}
        urlBold={urlBold}
      />

      <div
        className={cn("overflow-hidden", frameClasses.body)}
        style={imageWrapStyle}
      >
        {children}
      </div>
    </div>
  );
}
