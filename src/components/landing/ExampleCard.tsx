"use client";

import { motion, useReducedMotion } from "motion/react";

import LandingHoverTilt from "@/components/landing/LandingHoverTilt";
import { cn } from "@/lib/utils";
import type { ExampleShowcaseItem } from "@/lib/example-showcase";

type ExampleCardProps = {
  example: ExampleShowcaseItem;
  index: number;
};

function getTiltSettings(tilt: ExampleShowcaseItem["tilt"]) {
  if (tilt === "left") {
    return {
      perspective: 900,
      rotateX: 8,
      rotateY: -11,
      rotateZ: -1,
      sensitivity: 7,
    };
  }

  if (tilt === "right") {
    return {
      perspective: 900,
      rotateX: 8,
      rotateY: 11,
      rotateZ: 1,
      sensitivity: 7,
    };
  }

  return {
    perspective: 950,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    sensitivity: 6,
  };
}

function BrowserBar({ theme }: { theme: ExampleShowcaseItem["frameTheme"] }) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-t-2xl border-b px-3",
        theme === "dark"
          ? "border-white/10 bg-slate-900"
          : "border-slate-200 bg-slate-50",
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      <span
        className={cn(
          "ml-2 hidden h-3 w-24 rounded-full sm:block",
          theme === "dark" ? "bg-white/10" : "bg-white",
        )}
      />
    </div>
  );
}

function DashboardMock({ theme }: { theme: ExampleShowcaseItem["frameTheme"] }) {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-[0.7fr_1.3fr] gap-3 p-4">
      <div
        className={cn(
          "space-y-2 rounded-xl p-3",
          isDark ? "bg-white/5" : "bg-slate-100",
        )}
      >
        <div
          className={cn(
            "h-3 w-14 rounded-full",
            isDark ? "bg-white/25" : "bg-slate-300",
          )}
        />
        <div
          className={cn(
            "h-2 w-20 rounded-full",
            isDark ? "bg-white/15" : "bg-slate-200",
          )}
        />
        <div
          className={cn(
            "h-2 w-16 rounded-full",
            isDark ? "bg-white/15" : "bg-slate-200",
          )}
        />
        <div
          className={cn(
            "mt-5 h-16 rounded-xl",
            isDark ? "bg-cyan-300/25" : "bg-white",
          )}
        />
      </div>
      <div className="space-y-3">
        <div
          className={cn(
            "h-4 w-36 rounded-full",
            isDark ? "bg-white/35" : "bg-slate-300",
          )}
        />
        <div className="grid grid-cols-3 gap-2">
          <div
            className={cn(
              "h-16 rounded-xl",
              isDark ? "bg-white/10" : "bg-slate-100",
            )}
          />
          <div
            className={cn(
              "h-16 rounded-xl",
              isDark ? "bg-cyan-300/70" : "bg-slate-950",
            )}
          />
          <div
            className={cn(
              "h-16 rounded-xl",
              isDark ? "bg-white/10" : "bg-slate-100",
            )}
          />
        </div>
        <div
          className={cn(
            "h-16 rounded-xl",
            isDark ? "bg-white/10" : "bg-slate-100",
          )}
        />
      </div>
    </div>
  );
}

function PostMock({ theme }: { theme: ExampleShowcaseItem["frameTheme"] }) {
  const isDark = theme === "dark";

  return (
    <div className="space-y-3 p-4">
      <div
        className={cn(
          "h-4 w-40 rounded-full",
          isDark ? "bg-white/40" : "bg-slate-300",
        )}
      />
      <div
        className={cn(
          "h-3 w-56 max-w-full rounded-full",
          isDark ? "bg-white/20" : "bg-slate-200",
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "h-20 rounded-xl",
            isDark ? "bg-white/10" : "bg-slate-100",
          )}
        />
        <div
          className={cn(
            "h-20 rounded-xl",
            isDark ? "bg-cyan-300/60" : "bg-slate-950",
          )}
        />
      </div>
    </div>
  );
}

function MobileMock({ theme }: { theme: ExampleShowcaseItem["frameTheme"] }) {
  const isDark = theme === "dark";

  return (
    <div className="flex justify-center p-4">
      <div
        className={cn(
          "h-40 w-20 rounded-[1.4rem] border p-2 shadow-lg",
          isDark
            ? "border-white/10 bg-slate-950"
            : "border-slate-200 bg-white",
        )}
      >
        <div
          className={cn(
            "mx-auto mb-3 h-1.5 w-8 rounded-full",
            isDark ? "bg-white/20" : "bg-slate-200",
          )}
        />
        <div
          className={cn(
            "h-16 rounded-2xl",
            isDark ? "bg-cyan-300/70" : "bg-slate-950",
          )}
        />
        <div className="mt-3 space-y-1.5">
          <div
            className={cn(
              "h-2 w-12 rounded-full",
              isDark ? "bg-white/30" : "bg-slate-300",
            )}
          />
          <div
            className={cn(
              "h-2 w-9 rounded-full",
              isDark ? "bg-white/20" : "bg-slate-200",
            )}
          />
        </div>
      </div>
    </div>
  );
}

function ChangelogMock({ theme }: { theme: ExampleShowcaseItem["frameTheme"] }) {
  const isDark = theme === "dark";

  return (
    <div className="space-y-3 p-4">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className={cn(
            "flex items-center gap-3 rounded-xl p-3",
            isDark ? "bg-white/[0.08]" : "bg-slate-100",
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-lg",
              item === 0
                ? "bg-cyan-300"
                : isDark
                  ? "bg-white/15"
                  : "bg-white",
            )}
          />
          <div className="flex-1 space-y-1.5">
            <div
              className={cn(
                "h-2.5 w-28 rounded-full",
                isDark ? "bg-white/30" : "bg-slate-300",
              )}
            />
            <div
              className={cn(
                "h-2 w-20 rounded-full",
                isDark ? "bg-white/15" : "bg-slate-200",
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockContent({ example }: { example: ExampleShowcaseItem }) {
  if (example.layout === "dashboard" || example.layout === "launch") {
    return <DashboardMock theme={example.frameTheme} />;
  }

  if (example.layout === "mobile") {
    return <MobileMock theme={example.frameTheme} />;
  }

  if (example.layout === "changelog") {
    return <ChangelogMock theme={example.frameTheme} />;
  }

  return <PostMock theme={example.frameTheme} />;
}

export default function ExampleCard({ example, index }: ExampleCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isLightText = example.textColor === "light";
  const isDarkFrame = example.frameTheme === "dark";

  return (
    <motion.article
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
      transition={{
        duration: 0.32,
        delay: shouldReduceMotion ? 0 : index * 0.04,
        ease: "easeOut",
      }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/70 p-2.5 shadow-soft backdrop-blur-xl"
    >
      <div
        className="relative flex flex-1 min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-4"
        style={{ background: example.background }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30" />

        <div className="relative">
          <div
            className={cn(
              "mb-2.5 w-fit rounded-full border px-2.5 py-1 text-xs font-semibold",
              isLightText
                ? "border-white/20 bg-white/15 text-white"
                : "border-white/70 bg-white/45 text-slate-800",
            )}
          >
            {example.badge}
          </div>
          <h3
            className={cn(
              "text-xl font-semibold leading-tight",
              isLightText ? "text-white" : "text-slate-950",
            )}
          >
            {example.title}
          </h3>
          <p
            className={cn(
              "mt-2 max-w-[20rem] text-sm leading-5",
              isLightText ? "text-white/72" : "text-slate-700",
            )}
          >
            {example.description}
          </p>
        </div>

        <LandingHoverTilt
          className={cn(
            "relative mt-5 overflow-hidden rounded-2xl border shadow-2xl shadow-slate-950/25 transition-transform duration-300",
            isDarkFrame
              ? "border-white/10 bg-slate-950"
              : "border-white/25 bg-white",
          )}
          settings={getTiltSettings(example.tilt)}
        >
          {example.layout !== "mobile" && (
            <BrowserBar theme={example.frameTheme} />
          )}
          <MockContent example={example} />
        </LandingHoverTilt>
      </div>
    </motion.article>
  );
}
