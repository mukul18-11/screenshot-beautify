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
      description: "Drop one here, browse files, or paste from clipboard.",
    },
    reject: {
      title: "Only PNG, JPG, or WebP supported",
      description: "Choose an image file under 10 MB.",
    },
  }[dragState];

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex h-full w-full items-center justify-center p-4 text-center sm:p-6"
    >
      <div className="relative flex w-full max-w-[34rem] flex-col items-center overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/70 px-5 py-7 shadow-[0_28px_90px_-52px_rgba(15,23,42,0.65)] backdrop-blur-2xl sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-80"
          style={{
            background:
              "linear-gradient(135deg, rgba(49, 87, 213, 0.12), rgba(15, 159, 143, 0.1) 45%, rgba(243, 107, 79, 0.09))",
          }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[11px] font-bold uppercase text-[var(--editor-muted)] shadow-sm">
          <Sparkles
            className="h-3.5 w-3.5 text-[var(--editor-coral)]"
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
          whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -3 }}
          whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
          className={cn(
            "group relative mt-5 flex h-28 w-28 items-center justify-center rounded-[1.45rem] border bg-white shadow-[0_18px_55px_-28px_rgba(15,23,42,0.85)] outline-none transition",
            "focus-visible:ring-2 focus-visible:ring-[var(--editor-accent)]/25",
            dragState === "idle" &&
              "border-slate-200 text-slate-950 hover:border-[var(--editor-accent)]/30 hover:text-[var(--editor-accent)]",
            dragState === "accept" &&
              "border-emerald-300 bg-emerald-50/95 text-emerald-700",
            dragState === "reject" &&
              "border-rose-300 bg-rose-50/95 text-rose-700",
          )}
        >
          <span className="absolute inset-3 rounded-[1rem] border border-dashed border-slate-200 transition group-hover:border-current" />
          {isUploading ? (
            <Loader2 className="h-9 w-9 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud
              className="h-9 w-9 transition group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          )}
        </motion.button>

        <h1 className="relative mt-5 max-w-md text-balance text-[1.72rem] font-extrabold leading-tight text-slate-950 sm:text-[2rem]">
          {isUploading ? "Reading screenshot..." : copy.title}
        </h1>
        <p className="relative mt-2 max-w-sm text-sm font-medium leading-6 text-slate-600 sm:text-[15px]">
          {copy.description}
        </p>

        <div className="relative mt-5 flex flex-col items-center gap-2 text-xs font-bold text-slate-600 sm:flex-row">
          <button
            type="button"
            disabled={isUploading}
            onClick={(event) => {
              event.stopPropagation();
              onBrowse?.();
            }}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-950 px-4 text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/25 disabled:pointer-events-none disabled:opacity-60"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" aria-hidden="true" />
            Browse files
          </button>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 shadow-sm backdrop-blur-xl">
            <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
            PNG, JPG, WebP
          </span>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/80 bg-white/80 px-3 shadow-sm backdrop-blur-xl">
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
