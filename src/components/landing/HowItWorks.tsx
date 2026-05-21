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
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/70 p-5 shadow-soft backdrop-blur-2xl sm:p-7 lg:p-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
            Four steps from raw screenshot to <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent font-extrabold tracking-tighter">launch visual</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover="hover"
              variants={{
                hover: {
                  y: shouldReduceMotion ? 0 : -6,
                  borderColor: "rgba(14, 116, 144, 0.3)",
                  boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
                }
              }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 17,
                delay: shouldReduceMotion ? 0 : index * 0.05,
              }}
              className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm cursor-default"
            >
              <motion.div 
                variants={{
                  hover: {
                    scale: 1.12,
                    backgroundColor: "rgb(14, 116, 144)",
                  }
                }}
                className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-md shadow-slate-950/10 transition-colors duration-250"
              >
                {index + 1}
              </motion.div>
              <h3 className="text-base font-bold font-display tracking-tight text-slate-950">
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
