"use client";

import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    title: "Upload or paste screenshot",
    description: "Drop a PNG, JPG, or WebP into the editor.",
  },
  {
    title: "Apply a quick style",
    description: "Choose a polished starting look for your screenshot.",
  },
  {
    title: "Customize style",
    description: "Tune backgrounds, frames, text, spacing, and depth.",
  },
  {
    title: "Export PNG",
    description: "Save a sharp final image for the channel you need.",
  },
] as const;

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="workflow"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 sm:py-20"
    >
      <div className="rounded-[2rem] border border-slate-200 bg-white/70 p-6 shadow-soft backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-cyan-700">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Four steps from raw screenshot to launch visual
          </h2>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.28,
                delay: shouldReduceMotion ? 0 : index * 0.04,
                ease: "easeOut",
              }}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-base font-semibold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
