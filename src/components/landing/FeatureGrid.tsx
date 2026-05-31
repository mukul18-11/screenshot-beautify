"use client";

import {
  Palette,
  Frame,
  Box,
  Type,
  Layers,
  Grid,
  Download,
  Images,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Palette,
    title: "1-Click Quick Styles",
    description: "Instantly apply pre-designed beautiful templates, paddings, and background themes.",
    color: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
  },
  {
    icon: Frame,
    title: "macOS Browser Frames",
    description: "Wrap screenshots in highly realistic macOS dark/light address bar mockups.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  },
  {
    icon: Box,
    title: "Interactive 3D Tilt",
    description: "Rotate and position your mockups in 3D space with dynamic perspective depth.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  },
  {
    icon: Type,
    title: "Rich Text & Badges",
    description: "Add multiple bold titles, captions, and pill badges with custom fonts.",
    color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  {
    icon: Layers,
    title: "Vibrant Mesh Gradients",
    description: "Customize unlimited backgrounds using linear, radial, or soft mesh patterns.",
    color: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  {
    icon: Grid,
    title: "Social Canvas Presets",
    description: "Auto-layout ratios optimized for X/Twitter, LinkedIn, Product Hunt, and stories.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  {
    icon: Download,
    title: "High-Res Exports & Copy",
    description: "Export clean PNG files upscaled to 1x, 2x, 4x, or 6x, or copy directly to clipboard.",
    color: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  {
    icon: Images,
    title: "Multi-Image History Tray",
    description: "Quickly manage, switch, and batch-edit multiple uploaded screenshot assets.",
    color: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Local-First Privacy",
    description: "Zero servers, zero tracking. Perfect for private analytics and financial dashboards.",
    color: "bg-lime-50 text-lime-600 border-lime-100 dark:bg-lime-500/10 dark:text-lime-400 dark:border-lime-500/20",
  },
  {
    icon: Sliders,
    title: "Screenshot Styling",
    description: "Fine-tune border-radius, scale, drop shadows, and exact canvas margin spacings.",
    color: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
] as const;

export default function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl text-center mb-10"
      >
        <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider dark:text-cyan-400">Features</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-[2.25rem] tracking-tight leading-tight dark:text-white">
          Stunning graphics <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent font-black tracking-tighter drop-shadow-[0_1px_4px_rgba(6,182,212,0.1)]">in one clean editor</span>
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Everything you need to turn raw screenshots or visual mockups into launch-ready marketing creatives.
        </p>
      </motion.div>

      {/* Sleek, Ranked 10-Feature Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -4, borderColor: "rgba(15, 23, 42, 0.15)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)" }
              }
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
                delay: shouldReduceMotion ? 0 : index * 0.02,
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-soft backdrop-blur-md transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.08] dark:shadow-slate-950/20"
            >
              <div>
                {/* Visual Icon Container */}
                <div
                  className={cn(
                    "mb-3.5 flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold shadow-sm select-none",
                    feature.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <h3 className="text-sm font-bold font-display tracking-tight text-slate-900 flex items-center gap-1.5 dark:text-white">
                  <span className="text-[10px] text-slate-400 font-mono tracking-tighter dark:text-slate-600">0{index + 1}</span>
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
