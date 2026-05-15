"use client";

import { Keyboard } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export default function PasteHint() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-5 flex flex-col items-center gap-3 text-base leading-7 text-slate-500">
      <p>Paste screenshot with ⌘V / Ctrl+V</p>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: shouldReduceMotion
            ? "0 1px 2px rgba(15, 23, 42, 0.04)"
            : [
                "0 1px 2px rgba(15, 23, 42, 0.04)",
                "0 0 0 6px rgba(45, 212, 191, 0.08)",
                "0 1px 2px rgba(15, 23, 42, 0.04)",
              ],
        }}
        transition={{
          boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          duration: 0.28,
          ease: "easeOut",
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
      >
        <Keyboard className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
          ⌘V
        </span>
        <span className="text-slate-400">/</span>
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
          Ctrl+V
        </span>
      </motion.div>
    </div>
  );
}
