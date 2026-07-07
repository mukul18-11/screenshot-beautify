"use client";

import Image from "next/image";

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
      perspective: 1000,
      rotateX: 5,
      rotateY: -7,
      rotateZ: -0.3,
      sensitivity: 4,
    };
  }

  if (tilt === "right") {
    return {
      perspective: 1000,
      rotateX: 5,
      rotateY: 7,
      rotateZ: 0.3,
      sensitivity: 4,
    };
  }

  return {
    perspective: 1000,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    sensitivity: 3,
  };
}

function BrowserBar({ theme, id }: { theme: "light" | "dark"; id: string }) {
  const isDark = theme === "dark";
  const domainName =
    id === "payment-analytics"
      ? "analytics.stripe.com"
      : id === "new-york-statue"
      ? "new-york.sh"
      : id === "ride-camper"
      ? "van-life.sh"
      : id === "neon-urban-life"
      ? "life-outdoors.sh"
      : id === "x-analytics"
      ? "x.com/creator-analytics"
      : id === "developer-code"
      ? "MainContent.tsx"
      : "snapingly.sh";

  return (
    <div
      className={cn(
        "flex h-7 items-center justify-between border-b px-3 select-none shrink-0",
        isDark
          ? "border-white/10 bg-slate-900 text-white/40"
          : "border-slate-200 bg-slate-50 text-slate-400",
      )}
    >
      <div className="flex gap-1.5 shrink-0">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div
        className={cn(
          "h-4 w-44 rounded border flex items-center justify-center text-[8px] font-medium tracking-tight",
          isDark
            ? "bg-slate-950 border-white/5 text-white/30"
            : "bg-white border-slate-200/50 text-slate-400",
        )}
      >
        {domainName}
      </div>
      <div className="w-10 shrink-0" />
    </div>
  );
}

function MockContent({ example }: { example: ExampleShowcaseItem }) {
  if (example.imagePath) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-slate-950 flex flex-col justify-center items-center select-none",
          example.layout === "mobile" ? "aspect-[9/16] h-[340px]" : "aspect-[16/10] w-full"
        )}
      >
        {/* Premium high-fidelity screenshot or picture */}
        <Image
          src={example.imagePath}
          alt={example.title}
          fill
          sizes={
            example.layout === "mobile"
              ? "(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
              : "(min-width: 1024px) 35vw, (min-width: 640px) 45vw, 90vw"
          }
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Gradient Overlay for legibility */}
        {example.overlayText && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/15 pointer-events-none" />
        )}

        {/* Surgical Text Overlay Positioning based on item ID */}
        {example.overlayText && (
          <div
            className={cn(
              "absolute z-10 pointer-events-none w-full px-4",
              example.id === "ride-camper" && "inset-x-0 top-14 flex justify-center text-center",
              example.id === "neon-urban-life" && "left-4 top-8 flex flex-col items-start text-left",
              example.id === "new-york-statue" && "inset-x-0 top-12 flex justify-center text-center",
              example.id === "breaking-bad-desert" && "left-4 top-8 flex flex-col items-start text-left"
            )}
          >
            <span className={cn(example.overlayColor, example.overlayClass)}>
              {example.overlayText}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Generic fallback if image is missing
  return (
    <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 w-full aspect-[16/10] flex items-center justify-center">
      Mock preview placeholder
    </div>
  );
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
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-2 shadow-soft backdrop-blur-xl transition hover:border-slate-350 hover:shadow-md h-full justify-between dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:shadow-slate-950/20"
    >
      <div
        className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-xl p-4 sm:p-5"
        style={{ background: example.background }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative mb-5 z-20">
          <div
            className={cn(
              "mb-2.5 w-fit rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase select-none",
              isLightText
                ? "border-white/20 bg-white/10 text-white"
                : "border-slate-950/10 bg-white/45 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white",
            )}
          >
            {example.badge}
          </div>
          <h3
            className={cn(
              "text-lg font-extrabold font-display tracking-tight leading-snug",
              isLightText ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" : "text-slate-950 dark:text-white",
            )}
          >
            {example.title}
          </h3>
          <p
            className={cn(
              "mt-1.5 max-w-[20rem] text-xs leading-relaxed",
              isLightText ? "text-white/80" : "text-slate-600 dark:text-slate-300",
            )}
          >
            {example.description}
          </p>
        </div>

        <LandingHoverTilt
          className={cn(
            "relative mt-auto overflow-hidden rounded-xl border shadow-xl shadow-slate-950/20 transition-transform duration-300 w-full flex flex-col",
            isDarkFrame
              ? "border-white/10 bg-slate-950"
              : "border-white/20 bg-white",
          )}
          settings={getTiltSettings(example.tilt)}
        >
          {example.showBrowserBar && (
            <BrowserBar theme={example.browserTheme} id={example.id} />
          )}
          <MockContent example={example} />
        </LandingHoverTilt>
      </div>
    </motion.article>
  );
}
