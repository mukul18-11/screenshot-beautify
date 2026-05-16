"use client";

import {
  Box,
  Download,
  Frame,
  Image,
  Layers,
  LayoutTemplate,
  ShieldCheck,
  Type,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    title: "Drag, paste, or browse screenshots",
    description: "Get from screenshot to preview without extra setup.",
    icon: Image,
  },
  {
    title: "One-click design templates",
    description: "Start with launch-ready layouts for social and product use.",
    icon: LayoutTemplate,
  },
  {
    title: "Premium backgrounds",
    description: "Use gradients, meshes, clean solids, or screenshot blur.",
    icon: Layers,
  },
  {
    title: "Browser frames",
    description: "Wrap products in polished macOS or minimal browser chrome.",
    icon: Frame,
  },
  {
    title: "Text overlays",
    description: "Add launch headlines, badges, and short supporting copy.",
    icon: Type,
  },
  {
    title: "CSS 3D tilt",
    description: "Add tasteful depth without WebGL or heavy rendering.",
    icon: Box,
  },
  {
    title: "Sharp PNG export",
    description: "Export clean, high-resolution visuals for every channel.",
    icon: Download,
  },
  {
    title: "Local-first privacy",
    description: "Your screenshot stays in your browser from start to export.",
    icon: ShieldCheck,
  },
] as const;

export default function FeatureGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-cyan-700">Features</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Everything you need to make screenshots feel shipped
        </h2>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.28,
                delay: shouldReduceMotion ? 0 : index * 0.025,
                ease: "easeOut",
              }}
              className="rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm backdrop-blur-xl"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
