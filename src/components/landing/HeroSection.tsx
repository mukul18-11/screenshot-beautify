"use client";

import Link from "next/link";

import { ArrowRight, Check, ShieldCheck, WandSparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import LandingHoverTilt from "@/components/landing/LandingHoverTilt";

const textContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const;

const textItemVariants = {
  hidden: { opacity: 1, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
} as const;

function HeroMockup() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.15, type: "spring", stiffness: 60, damping: 14 }}
      className="relative mx-auto w-full max-w-4xl lg:max-w-none"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(20,184,166,0.38),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(251,146,60,0.32),transparent_28%),radial-gradient(circle_at_78%_86%,rgba(236,72,153,0.22),transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_48%,#164e63_100%)] p-3 shadow-2xl shadow-slate-950/25 sm:p-5 lg:p-6">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        
        {/* Animated ambient backdrop glows */}
        <motion.div
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.45, 0.3],
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
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
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -left-12 bottom-12 h-56 w-56 rounded-full bg-pink-400/10 blur-3xl pointer-events-none"
        />

        <div className="relative">
          <motion.div 
            variants={textContainerVariants}
            initial="hidden"
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

          <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <motion.div
              initial={{ opacity: 1, x: 0, rotate: shouldReduceMotion ? 0 : -1 }}
              animate={{ opacity: 1, x: 0, rotate: shouldReduceMotion ? 0 : -1 }}
              transition={{ duration: 0.65, delay: 0.35, type: "spring", stiffness: 70, damping: 14 }}
              className="rounded-[1.25rem] border border-white/15 bg-white/10 p-3 text-white/75 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:mb-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Raw screenshot
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs">
                  before
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 h-2 w-24 rounded-full bg-white/10" />
                </div>
                <div className="space-y-3">
                  <div className="h-3.5 w-28 rounded-full bg-white/25" />
                  <div className="h-2.5 w-40 rounded-full bg-white/10" />
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <div className="h-14 rounded-lg bg-white/10" />
                    <div className="h-14 rounded-lg bg-white/10" />
                    <div className="h-14 rounded-lg bg-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LandingHoverTilt
                className="overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-slate-950/35 ring-1 ring-white/30"
                settings={{
                  perspective: 1100,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  sensitivity: 9,
                }}
              >
                <div className="flex h-10 items-center gap-2 rounded-t-2xl border-b border-slate-200 bg-slate-50 px-4">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 hidden w-44 rounded-full bg-white py-1.5 text-center text-xs text-slate-400 shadow-sm sm:block">
                    yourproduct.com
                  </span>
                </div>
                <div className="bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.28),transparent_28%),linear-gradient(135deg,#ecfeff_0%,#fff7ed_56%,#fdf2f8_100%)] p-4 sm:p-6">
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                      <WandSparkles className="h-3.5 w-3.5" />
                      Launch visual
                    </div>
                    <p className="text-xl font-semibold text-slate-950 sm:text-2xl">
                      New dashboard is live
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Built for posts, decks, and hero images.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
                    <div className="rounded-2xl bg-slate-950 p-4 text-white">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="h-3 w-24 rounded-full bg-white/30" />
                        <div className="h-7 w-7 rounded-xl bg-cyan-300" />
                      </div>
                      <div className="h-3.5 w-40 rounded-full bg-white/80" />
                      <div className="mt-3 h-2.5 w-56 max-w-full rounded-full bg-white/25" />
                      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="h-16 rounded-xl bg-white/10" />
                        <div className="h-16 rounded-xl bg-cyan-300/80" />
                        <div className="h-16 rounded-xl bg-white/10" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-20 rounded-2xl bg-white/70 shadow-sm" />
                      <div className="h-20 rounded-2xl bg-white/70 shadow-sm" />
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
      <div className="text-center lg:text-left">
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl lg:mx-0"
        >
          <motion.div 
            variants={textItemVariants}
            className="mx-auto mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl lg:mx-0"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="truncate">Your screenshots never leave your browser.</span>
          </motion.div>
          
          <motion.h1 
            variants={textItemVariants}
            className="text-balance font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-slate-950 sm:text-5xl lg:text-[4.25rem]"
          >
            Screenshot Beautifier turns raw screenshots into <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(6,182,212,0.1)]">launch-ready visuals</span>
          </motion.h1>
          
          <motion.p 
            variants={textItemVariants}
            className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0"
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
              whileHover={{ y: shouldReduceMotion ? 0 : -3 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-slate-950 text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-800 flex items-center gap-2 group"
              >
                <Link href="/editor">
                  Start beautifying
                  <motion.span
                    variants={{
                      hidden: { x: 0 },
                      hover: { x: 4 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ y: shouldReduceMotion ? 0 : -3 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border border-white/70 bg-white/70 text-slate-700 shadow-sm hover:bg-white hover:text-slate-950"
              >
                <Link href="#examples">View examples</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={textItemVariants}
            className="mt-6 grid gap-3 text-left text-sm font-medium text-slate-600 sm:grid-cols-3"
          >
            {["No account", "No upload server", "PNG export"].map((item) => (
              <motion.div 
                key={item} 
                className="flex items-center gap-2"
                variants={itemVariants}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <HeroMockup />
    </section>
  );
}
