"use client";

import { Workflow } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import SectionHeading from "@/components/landing/SectionHeading";

const STEPS = [
  {
    title: "Upload or paste",
    description: "Drop any PNG, JPG, or WebP image instantly.",
  },
  {
    title: "Apply quick style",
    description: "Pick a beautiful curated gradient template.",
  },
  {
    title: "Fine-tune design",
    description: "Customize background, text, and 3D tilt.",
  },
  {
    title: "Export & share",
    description: "Download upscaled PNG or copy to clipboard.",
  },
] as const;

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <SectionHeading
        eyebrow="How it works"
        icon={Workflow}
        align="left"
        title={
          <>
            Raw to launch visual{" "}
            <span className="text-gradient-brand font-black">
              in four simple steps
            </span>
          </>
        }
      />

      <div className="relative mt-10">
        {/* Gradient connector line running behind the step chips */}
        <div
          className="pointer-events-none absolute left-8 right-8 top-9 hidden h-px bg-gradient-to-r from-teal-400/40 via-cyan-400/40 to-indigo-500/40 md:block"
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-60px" }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -5,
                      boxShadow:
                        "0 1px 2px rgb(2 6 23 / 0.06), 0 8px 24px -8px rgb(2 6 23 / 0.12), 0 24px 64px -24px rgb(2 6 23 / 0.2)",
                    }
              }
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.06]"
            >
              {/* Number chip with gradient ring */}
              <div className="relative mb-4 inline-flex rounded-full bg-gradient-brand p-px shadow-md shadow-cyan-500/15">
                <span className="flex h-8 w-8 select-none items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white dark:bg-slate-950">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-sm font-bold font-display tracking-tight text-slate-950 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
