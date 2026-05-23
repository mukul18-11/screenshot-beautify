"use client";

import { motion, useReducedMotion } from "motion/react";

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
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-white/70 p-5 shadow-soft backdrop-blur-2xl sm:p-7 lg:p-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
            Raw to launch visual <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent font-extrabold tracking-tighter">in four simple steps</span>
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover="hover"
              variants={{
                hover: {
                  y: shouldReduceMotion ? 0 : -5,
                  borderColor: "rgba(14, 116, 144, 0.25)",
                  boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.03)",
                }
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
                delay: shouldReduceMotion ? 0 : index * 0.04,
              }}
              className="relative rounded-2xl border border-slate-200 bg-white p-4.5 shadow-sm cursor-default transition-all duration-300"
            >
              <motion.div 
                variants={{
                  hover: {
                    scale: 1.08,
                    backgroundColor: "rgb(14, 116, 144)",
                  }
                }}
                className="mb-4 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white shadow-md shadow-slate-950/10 transition-colors duration-250 select-none"
              >
                {index + 1}
              </motion.div>
              <h3 className="text-sm font-bold font-display tracking-tight text-slate-950">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
