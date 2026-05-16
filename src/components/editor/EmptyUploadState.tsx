"use client";

import {
  FileImage,
  Loader2,
  MonitorUp,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import EditorEmptyStateTips from "@/components/editor/EditorEmptyStateTips";
import PasteHint from "@/components/editor/PasteHint";
import { Button } from "@/components/ui/button";
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
      title: "Upload a screenshot to make it launch-ready",
      description:
        "Drop, browse, or paste with ⌘V / Ctrl+V. Your image stays in your browser.",
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
      className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
    >
      <div
        className={cn(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-white/85 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-white/10",
          dragState === "accept" &&
            "border-emerald-200 bg-emerald-50/90 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
          dragState === "reject" &&
            "border-rose-200 bg-rose-50/90 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100",
        )}
      >
        {isUploading ? (
          <Loader2
            className="h-9 w-9 animate-spin text-slate-900 dark:text-white"
            aria-hidden="true"
          />
        ) : (
          <UploadCloud
            className="h-9 w-9 text-slate-900 dark:text-white"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
        <MonitorUp className="h-3.5 w-3.5 text-cyan-600" aria-hidden="true" />
        Screenshot Beautifier
      </div>

      <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
        {isUploading ? "Reading screenshot..." : copy.title}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-300 sm:text-base">
        {copy.description}
      </p>

      <PasteHint />

      <motion.div
        className="mt-7"
        whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
      >
        <Button
          type="button"
          size="lg"
          aria-label="Browse for a screenshot image"
          disabled={isUploading}
          onClick={(event) => {
            event.stopPropagation();
            onBrowse?.();
          }}
          className="bg-slate-950 text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-800"
        >
          {isUploading ? "Reading screenshot..." : "Browse screenshot"}
        </Button>
      </motion.div>

      <EditorEmptyStateTips />

      <div className="mt-5 flex w-full flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-300 sm:flex-row sm:justify-center sm:gap-3">
        <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <FileImage className="h-4 w-4 text-slate-500" aria-hidden="true" />
          PNG, JPG, WebP up to 10 MB
        </p>
        <p className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <ShieldCheck
            className="h-4 w-4 text-emerald-600"
            aria-hidden="true"
          />
          No upload. No server. Everything happens locally.
        </p>
      </div>
    </motion.div>
  );
}
