"use client";

import { Keyboard } from "lucide-react";
import { motion } from "motion/react";

export default function PasteHint() {
  return (
    <div className="mt-4 flex flex-col items-center gap-3 text-base leading-7 text-slate-500">
      <p>Paste screenshot with ⌘V / Ctrl+V</p>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl"
      >
        <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-700">
          ⌘V
        </span>
        <span className="text-slate-400">/</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-700">
          Ctrl+V
        </span>
      </motion.div>
    </div>
  );
}
