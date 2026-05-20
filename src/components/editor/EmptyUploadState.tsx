"use client";

import {
  FileImage,
  Loader2,
  ShieldCheck,
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
      title: "Drop an image here",
      description: "Click to browse, or paste with ⌘V / Ctrl+V.",
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
      <div className="flex max-w-sm flex-col items-center">
        <motion.button
          type="button"
          aria-label="Browse for a screenshot image"
          disabled={isUploading}
          onClick={(event) => {
            event.stopPropagation();
            onBrowse?.();
          }}
          whileHover={{ y: shouldReduceMotion || isUploading ? 0 : -2 }}
          whileTap={{ scale: shouldReduceMotion || isUploading ? 1 : 0.98 }}
          className={cn(
            "group flex h-28 w-28 items-center justify-center rounded-[1.35rem] border border-dashed bg-white/80 shadow-xl shadow-slate-950/[0.06] outline-none backdrop-blur-xl transition dark:bg-white/10",
            "focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:focus-visible:ring-white/30",
            dragState === "idle" &&
              "border-slate-300 text-slate-900 hover:border-slate-400 hover:bg-white dark:border-white/15 dark:text-white dark:hover:bg-white/15",
            dragState === "accept" &&
              "border-emerald-400 bg-emerald-50/90 text-emerald-700 dark:border-emerald-300/40 dark:bg-emerald-400/10 dark:text-emerald-100",
            dragState === "reject" &&
              "border-rose-400 bg-rose-50/90 text-rose-700 dark:border-rose-300/40 dark:bg-rose-400/10 dark:text-rose-100",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-9 w-9 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud
              className="h-9 w-9 transition group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          )}
        </motion.button>

        <h1 className="mt-5 text-xl font-semibold tracking-normal text-slate-950 dark:text-white">
          {isUploading ? "Reading screenshot..." : copy.title}
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-300">
          {copy.description}
        </p>

        <div className="mt-4 flex flex-col items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-300 sm:flex-row">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
            PNG, JPG, WebP up to 10 MB
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <ShieldCheck
              className="h-3.5 w-3.5 text-emerald-600"
              aria-hidden="true"
            />
            Local only
          </span>
        </div>
      </div>
    </motion.div>
  );
}
