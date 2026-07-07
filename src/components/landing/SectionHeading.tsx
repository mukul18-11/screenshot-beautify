"use client";

import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  icon?: LucideIcon;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "max-w-xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        {Icon ? (
          <Icon
            className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400"
            aria-hidden="true"
          />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
        )}
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      {description ? (
        <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
