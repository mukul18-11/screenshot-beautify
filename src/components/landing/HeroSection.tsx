"use client";

import Link from "next/link";

import { ArrowRight, Check, ShieldCheck, WandSparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

function HeroMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-5xl lg:max-w-none"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(20,184,166,0.38),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(251,146,60,0.32),transparent_28%),radial-gradient(circle_at_78%_86%,rgba(236,72,153,0.22),transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_48%,#164e63_100%)] p-4 shadow-2xl shadow-slate-950/25 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
        <div className="absolute -right-16 top-12 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-white">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xl">
                QUICK STYLE PREVIEW
              </div>
              <p className="text-2xl font-semibold sm:text-4xl">
                Before post. After launch visual.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur-xl sm:flex">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Local-only export
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white/75 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:mb-10">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Raw screenshot
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  before
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 h-2 w-28 rounded-full bg-white/10" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-32 rounded-full bg-white/25" />
                  <div className="h-3 w-44 rounded-full bg-white/10" />
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <div className="h-16 rounded-lg bg-white/10" />
                    <div className="h-16 rounded-lg bg-white/10" />
                    <div className="h-16 rounded-lg bg-white/10" />
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="origin-center rounded-2xl border border-white/20 bg-white shadow-2xl shadow-slate-950/35 ring-1 ring-white/30 lg:[transform:perspective(1100px)_rotateX(8deg)_rotateY(-10deg)_rotateZ(-1deg)]"
            >
              <div className="flex h-10 items-center gap-2 rounded-t-2xl border-b border-slate-200 bg-slate-50 px-4">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 hidden w-52 rounded-full bg-white py-1.5 text-center text-xs text-slate-400 shadow-sm sm:block">
                  yourproduct.com
                </span>
              </div>
              <div className="bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.28),transparent_28%),linear-gradient(135deg,#ecfeff_0%,#fff7ed_56%,#fdf2f8_100%)] p-5 sm:p-7">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    <WandSparkles className="h-3.5 w-3.5" />
                    Launch visual
                  </div>
                  <p className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                    New dashboard is live
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Built for posts, decks, and hero images.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
                  <div className="rounded-2xl bg-slate-950 p-5 text-white">
                    <div className="mb-8 flex items-center justify-between">
                      <div className="h-3 w-28 rounded-full bg-white/30" />
                      <div className="h-8 w-8 rounded-xl bg-cyan-300" />
                    </div>
                    <div className="h-4 w-44 rounded-full bg-white/80" />
                    <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-white/25" />
                    <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                      <div className="h-20 rounded-xl bg-white/10" />
                      <div className="h-20 rounded-xl bg-cyan-300/80" />
                      <div className="h-20 rounded-xl bg-white/10" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-24 rounded-2xl bg-white/70 shadow-sm" />
                    <div className="h-24 rounded-2xl bg-white/70 shadow-sm" />
                    <div className="h-24 rounded-2xl bg-slate-900 shadow-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:py-16">
      <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-4xl lg:mx-0"
        >
          <div className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:mx-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="truncate">Your screenshots never leave your browser.</span>
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
            Screenshot Beautifier turns raw screenshots into launch-ready visuals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl lg:mx-0">
            Paste a product screenshot, choose a quick style, add browser
            frames, text, and tasteful depth, then export a sharp PNG for X,
            LinkedIn, Product Hunt, decks, or landing pages.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <motion.div
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-slate-950 text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-800"
              >
                <Link href="/editor">
                  Start beautifying
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="border border-white/70 bg-white/70 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950"
            >
              <Link href="#examples">View examples</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-left text-sm font-medium text-slate-600 sm:grid-cols-3">
            {["No account", "No upload server", "PNG export"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <HeroMockup />
    </section>
  );
}
