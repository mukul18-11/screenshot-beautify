"use client";

import { Loader2, ShieldCheck, UploadCloud } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import PasteHint from "@/components/editor/PasteHint";
import { Button } from "@/components/ui/button";

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
      title: "Drop your screenshot here",
      description: "PNG, JPG, or WebP up to 10 MB",
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
      className="mx-auto flex max-w-md flex-col items-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-white/85 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
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

      <h1 className="text-balance text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
        {isUploading ? "Reading screenshot..." : copy.title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
        {copy.description}
      </p>
      <PasteHint />

      <motion.div
        className="mt-8"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="button"
          size="lg"
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

      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-sm text-slate-500 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
        <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        Your screenshot never leaves your browser.
      </p>
    </motion.div>
  );
}
