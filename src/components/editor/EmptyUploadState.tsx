"use client";

import {
  ArrowUpFromLine,
  FileImage,
  Loader2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type EmptyUploadStateProps = {
  dragState?: "idle" | "accept" | "reject";
  isUploading?: boolean;
  onBrowse?: () => void;
};

export default function EmptyUploadState({
  dragState = "idle",
  isUploading = false,
  onBrowse,
}: EmptyUploadStateProps) {
  const shouldReduceMotion = useReducedMotion();
  const copy = {
    accept: {
      title: "Drop to upload",
      description: "Release your screenshot and we will preview it instantly.",
    },
    idle: {
      title: "Make your screenshot launch-ready",
      description: "Drop screenshots here, browse files, or paste from clipboard.",
    },
    reject: {
      title: "Only PNG, JPG, or WebP supported",
      description: "Choose an image file under 10 MB.",
    },
  }[dragState];

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex h-full w-full items-center justify-center p-4 text-center sm:p-5"
    >
      <div className="relative flex w-full max-w-[25rem] flex-col items-center overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white/95 px-4.5 py-6 shadow-xl shadow-slate-950/[0.03] backdrop-blur-2xl sm:px-6 sm:py-6.5 dark:border-white/10 dark:bg-black dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]">
        {/* Shimmer shining reflection layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        {/* Subtle accent glow at the top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-80 dark:opacity-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <Sparkles
            className="h-3 w-3 text-[var(--editor-coral)]"
            aria-hidden="true"
          />
          New canvas
        </div>

        <motion.button
          type="button"
          aria-label="Browse for a screenshot image"
          disabled={isUploading}
          onClick={(event) => {
            event.stopPropagation();
            onBrowse?.();
          }}
          whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -2.5 }}
          whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
          animate={
            dragState === "idle" && !shouldReduceMotion && !isUploading
              ? { scale: [1, 1.04, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 1.8,
            ease: "easeInOut",
            repeat:
              dragState === "idle" && !shouldReduceMotion && !isUploading
                ? Infinity
                : 0,
          }}
          className={cn(
            "group relative mt-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.1rem] border bg-white shadow-[0_12px_40px_-20px_rgba(15,23,42,0.8)] outline-none transition dark:bg-zinc-950",
            "focus-visible:ring-2 focus-visible:ring-sky-400/30",
            dragState === "idle" &&
              "border-sky-300/70 bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100 text-sky-600 shadow-[0_16px_45px_-20px_rgba(2,132,199,0.85)] hover:border-sky-400/80 hover:text-sky-700 dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-black dark:text-zinc-300 dark:shadow-[0_16px_45px_-20px_rgba(0,0,0,0.5)] dark:hover:border-zinc-600 dark:hover:text-white",
            dragState === "accept" &&
              "border-emerald-300 bg-emerald-50/95 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/80 dark:text-emerald-400",
            dragState === "reject" &&
              "border-rose-300 bg-rose-50/95 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/80 dark:text-rose-400",
          )}
        >
          {dragState === "idle" && !shouldReduceMotion && !isUploading && (
            <motion.span
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/75 to-transparent"
              animate={{ x: ["0%", "330%"] }}
              transition={{
                duration: 2.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.6,
              }}
              aria-hidden="true"
            />
          )}
          <span className="absolute inset-2.5 rounded-[0.8rem] border border-dashed border-current/30 transition group-hover:border-current/50" />
          {isUploading ? (
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud
              className="h-7.5 w-7.5 transition group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          )}
        </motion.button>

        <h1 className="relative mt-4 max-w-xs text-balance font-display text-[1.32rem] font-extrabold leading-tight text-slate-950 sm:text-[1.5rem] dark:text-white">
          {isUploading ? (
            "Reading screenshot..."
          ) : dragState === "idle" ? (
            <>
              Make your screenshot{" "}
              <span className="bg-gradient-to-r from-teal-500 via-cyan-500 via-indigo-500 via-sky-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-black tracking-tight animate-gradient-flow">
                launch-ready
              </span>
            </>
          ) : (
            copy.title
          )}
        </h1>
        <p className="relative mt-1.5 max-w-xs text-xs sm:text-[13px] font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {copy.description}
        </p>

        <div className="relative mt-4.5 flex flex-col items-center gap-1.5 text-[10px] font-bold text-slate-600 sm:flex-row dark:text-slate-400">
          <button
            type="button"
            disabled={isUploading}
            onClick={(event) => {
              event.stopPropagation();
              onBrowse?.();
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-white shadow-md shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/25 disabled:pointer-events-none disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            <ArrowUpFromLine className="h-3 w-3" aria-hidden="true" />
            Browse files
          </button>
          <span className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300">
            <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
            PNG, JPG, WebP
          </span>
          <span className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[var(--editor-teal)]"
              aria-hidden="true"
            />
            Local only
          </span>
        </div>
      </div>
    </motion.div>
  );
}
