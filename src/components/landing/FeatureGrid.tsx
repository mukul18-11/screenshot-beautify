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
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import SectionHeading from "@/components/landing/SectionHeading";

const FEATURES = [
  {
    icon: Palette,
    title: "1-Click Quick Styles",
    description: "Instantly apply pre-designed beautiful templates, paddings, and background themes.",
  },
  {
    icon: Frame,
    title: "macOS Browser Frames",
    description: "Wrap screenshots in highly realistic macOS dark/light address bar mockups.",
  },
  {
    icon: Box,
    title: "Interactive 3D Tilt",
    description: "Rotate and position your mockups in 3D space with dynamic perspective depth.",
  },
  {
    icon: Type,
    title: "Rich Text & Badges",
    description: "Add multiple bold titles, captions, and pill badges with custom fonts.",
  },
  {
    icon: Layers,
    title: "Vibrant Mesh Gradients",
    description: "Customize unlimited backgrounds using linear, radial, or soft mesh patterns.",
  },
  {
    icon: Grid,
    title: "Social Canvas Presets",
    description: "Auto-layout ratios optimized for X/Twitter, LinkedIn, Product Hunt, and stories.",
  },
  {
    icon: Download,
    title: "High-Res Exports & Copy",
    description: "Export clean PNG files upscaled to 1x, 2x, 4x, or 6x, or copy directly to clipboard.",
  },
  {
    icon: Images,
    title: "Multi-Image History Tray",
    description: "Quickly manage, switch, and batch-edit multiple uploaded screenshot assets.",
  },
  {
    icon: ShieldCheck,
    title: "Local-First Privacy",
    description: "Zero servers, zero tracking. Perfect for private analytics and financial dashboards.",
  },
  {
    icon: Sliders,
    title: "Screenshot Styling",
    description: "Fine-tune border-radius, scale, drop shadows, and exact canvas margin spacings.",
  },
] as const;

export default function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <SectionHeading
        eyebrow="Features"
        icon={Sparkles}
        className="mb-10"
        title={
          <>
            Stunning graphics{" "}
            <span className="text-gradient-brand font-black">
              in one clean editor
            </span>
          </>
        }
        description="Everything you need to turn raw screenshots or visual mockups into launch-ready marketing creatives."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-40px" }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -4,
                      boxShadow:
                        "0 1px 2px rgb(2 6 23 / 0.05), 0 10px 28px -10px rgb(2 6 23 / 0.12)",
                    }
              }
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : (index % 3) * 0.06,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-colors hover:border-cyan-600/20 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-400/20 dark:hover:bg-white/[0.08]"
            >
              {/* Hover spotlight */}
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(24rem_at_top,rgba(34,211,238,0.08),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="relative">
                <div className="mb-3.5 flex h-9 w-9 select-none items-center justify-center rounded-xl border border-slate-200 bg-slate-100/80 text-slate-700 shadow-sm transition-colors duration-300 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:group-hover:border-cyan-400/25 dark:group-hover:bg-cyan-500/10 dark:group-hover:text-cyan-400">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>

                <h3 className="text-sm font-bold font-display tracking-tight text-slate-900 flex items-center gap-1.5 dark:text-white">
                  <span className="text-[10px] text-slate-400 font-mono tracking-tighter dark:text-slate-600">{String(index + 1).padStart(2, "0")}</span>
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
