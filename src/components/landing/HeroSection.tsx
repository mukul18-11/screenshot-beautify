"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import LandingHoverTilt from "@/components/landing/LandingHoverTilt";

const textContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

function HeroMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-4xl lg:max-w-none"
      aria-hidden="true"
    >
      {/* Soft ambient glow bleeding out behind the panel */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(34,211,238,0.14),transparent_70%)] blur-2xl" />

      <div className="shadow-elevated-dark relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_14%_16%,rgba(20,184,166,0.38),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(251,146,60,0.32),transparent_28%),radial-gradient(circle_at_78%_86%,rgba(236,72,153,0.22),transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_48%,#164e63_100%)] p-3 sm:p-5 lg:p-6">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]" />
        {/* Top-edge light catch */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

        {/* Animated ambient backdrop glows */}
        <motion.div
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-16 top-12 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.2, 1],
            opacity: [0.22, 0.35, 0.22],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -left-12 bottom-12 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none"
        />

        <div className="relative">
          <motion.div
            variants={textContainerVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            animate="show"
            className="mb-5 flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <motion.div
                variants={textItemVariants}
                className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[0.68rem] font-semibold backdrop-blur-xl"
              >
                QUICK STYLE PREVIEW
              </motion.div>
              <motion.p
                variants={textItemVariants}
                className="max-w-[34rem] font-display text-2xl font-bold leading-[1.04] sm:text-[2.45rem] lg:text-[2.65rem]"
              >
                Before post.
                <span className="block bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent font-extrabold tracking-tight">
                  After launch visual.
                </span>
              </motion.p>
            </div>
            <motion.div
              variants={textItemVariants}
              className="flex shrink-0 items-end justify-start lg:justify-end"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Local-only export
              </div>
            </motion.div>
          </motion.div>

          <div className="relative grid gap-6 md:grid-cols-2 items-stretch mt-4">
            {/* Left Card: Before (Raw, Boring Screenshot) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-950 shadow-md flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-700"
            >
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-900 dark:bg-slate-100" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-100">Raw Screenshot</span>
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                  Before
                </span>
              </div>

              <div className="relative flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-center items-center overflow-hidden dark:border-slate-800 dark:bg-slate-950">
                {/* A plain, straight screenshot image with crisp borders, fully visible, no faded overlay */}
                <div className="relative w-full overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm aspect-[16/10] dark:border-slate-800 dark:bg-slate-900">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                    alt="Raw SaaS Dashboard"
                    fill
                    priority
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 90vw"
                    className="object-cover object-top opacity-100"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Card: After (Stunning Beautified Oceanic Screenshot) */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="h-full"
            >
              <LandingHoverTilt
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-950 shadow-md flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-700"
                settings={{
                  perspective: 1200,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  sensitivity: 10,
                }}
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-slate-100">Polished Output</span>
                  </div>
                  <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-400">
                    After
                  </span>
                </div>

                <div className="relative flex-1 w-full rounded-xl border border-teal-500/20 bg-gradient-to-tr from-teal-600 via-cyan-500 to-emerald-500 p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-inner min-h-[280px]">
                  {/* Grid Overlay inside the exported area */}
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

                  {/* Floating Text Caption Overlay */}
                  <div className="relative z-10 text-left w-full">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-white/50 px-2.5 py-0.5 text-[9px] font-bold text-teal-800 shadow-sm backdrop-blur-md">
                      <Sparkles className="h-2.5 w-2.5 text-teal-600 animate-pulse" />
                      1-CLICK BEAUTIFIED
                    </div>
                    <p className="mt-1 text-sm font-bold text-white leading-tight drop-shadow-sm">
                      Marketing Analytics Dashboard
                    </p>
                  </div>

                  {/* Elegant macOS Browser Mockup - Larger, filling container */}
                  <div className="relative z-10 w-full rounded-lg border border-white/10 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.22)] overflow-hidden flex flex-col transform translate-y-2 group-hover:translate-y-0.5 transition-transform duration-500 [transform-style:preserve-3d] mt-3 dark:bg-slate-950 dark:border-slate-800">
                    {/* Browser Bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900/80">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <div className="h-4 w-28 rounded bg-slate-200/50 border border-slate-200/30 flex items-center justify-center text-[7.5px] font-medium text-slate-500 dark:bg-slate-800/50 dark:border-slate-700/30 dark:text-slate-400">
                        analytics.acme.com
                      </div>
                      <div className="w-6" />
                    </div>

                    {/* High-fidelity screenshot */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
                      <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                        alt="Beautified SaaS Dashboard"
                        fill
                        priority
                        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 90vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </LandingHoverTilt>
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
    <section className="relative mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.78fr_1.12fr] lg:gap-10 lg:py-12">
      {/* Dot grid fading out behind the copy column */}
      <div
        className="pointer-events-none absolute -top-14 left-1/2 -z-10 h-[36rem] w-screen max-w-[90rem] -translate-x-1/2 bg-[radial-gradient(rgba(15,23,42,0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_55%_at_38%_35%,black_20%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_65%_55%_at_38%_35%,black_20%,transparent_75%)] dark:bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="text-center lg:text-left">
        <motion.div
          variants={textContainerVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="show"
          className="mx-auto max-w-3xl lg:mx-0"
        >
          <motion.div
            variants={textItemVariants}
            className="mx-auto mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200/90 bg-white/70 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:mx-0 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">Your screenshots never leave your browser.</span>
          </motion.div>

          <motion.h1
            variants={textItemVariants}
            className="text-balance font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-[4.25rem] dark:text-white"
          >
            Snapingly turns raw screenshots into <span className="text-gradient-brand font-black">launch-ready visuals</span>
          </motion.h1>

          <motion.p
            variants={textItemVariants}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0 dark:text-slate-400"
          >
            Paste a product screenshot, choose a quick style, add browser
            frames, text, and tasteful depth, then export a sharp PNG for X,
            LinkedIn, Product Hunt, decks, or landing pages.
          </motion.p>

          <motion.div
            variants={textItemVariants}
            className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <motion.div
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-[13px] bg-gradient-brand p-[1.5px] shadow-lg shadow-cyan-500/10"
            >
              {/* Hover-only ambient glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[13px] bg-gradient-brand opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60" />

              <Button
                asChild
                size="lg"
                className="relative z-10 flex items-center gap-2 rounded-xl border-none bg-slate-950 text-white shadow-none hover:bg-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                <Link href="/editor">
                  Start beautifying
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border border-slate-200/90 bg-white/70 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
              >
                <Link href="#examples">View examples</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={textItemVariants}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-0 gap-y-2 text-sm font-medium text-slate-600 lg:justify-start dark:text-slate-300"
          >
            {["Free sign-up", "No upload server", "PNG export"].map((item, index) => (
              <span key={item} className="flex items-center">
                {index > 0 ? (
                  <span
                    className="mx-4 hidden h-4 w-px bg-slate-200 sm:block dark:bg-white/10"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="flex items-center gap-2 pr-4 sm:pr-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {item}
                </span>
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <HeroMockup />
    </section>
  );
}
