"use client";

import { Box, Download, LayoutTemplate } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const BENEFITS = [
  {
    title: "Beautiful templates",
    icon: LayoutTemplate,
  },
  {
    title: "3D depth & browser frames",
    icon: Box,
  },
  {
    title: "Export sharp PNGs",
    icon: Download,
  },
] as const;

export default function EditorEmptyStateTips() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-6 grid w-full gap-2 sm:grid-cols-3">
      {BENEFITS.map((benefit, index) => {
        const Icon = benefit.icon;

        return (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.04 * index,
              duration: 0.24,
              ease: "easeOut",
            }}
            className="rounded-2xl border border-white/70 bg-white/65 p-3 text-left shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
          >
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold leading-5 text-slate-800 dark:text-white">
              {benefit.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
