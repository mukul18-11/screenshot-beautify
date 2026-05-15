"use client";

import { UploadCloud } from "lucide-react";
import { motion } from "motion/react";

import PasteHint from "@/components/editor/PasteHint";
import { Button } from "@/components/ui/button";

type EmptyUploadStateProps = {
  isUploading?: boolean;
  onBrowse?: () => void;
};

export default function EmptyUploadState({
  isUploading = false,
  onBrowse,
}: EmptyUploadStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-lg shadow-slate-900/10">
        <UploadCloud className="h-9 w-9 text-slate-900" aria-hidden="true" />
      </div>

      <h1 className="text-balance text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
        Drop your screenshot here
      </h1>
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

      <p className="mt-5 text-sm text-slate-500">
        Your image stays in your browser.
      </p>
    </div>
  );
}
