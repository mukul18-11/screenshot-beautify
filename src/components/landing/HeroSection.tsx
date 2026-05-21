"use client";

import Link from "next/link";

import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
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

          <div className="relative grid gap-6 md:grid-cols-2 items-stretch mt-4">
            {/* Left Card: Before (Raw, Boring Screenshot) */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/70 p-5 text-slate-800 shadow-md backdrop-blur-xl flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:border-slate-350"
            >
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Raw Screenshot</span>
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  Before
                </span>
              </div>
              
              <div className="relative flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col justify-center items-center overflow-hidden">
                {/* A plain, straight screenshot image with crisp borders, fully visible, no faded overlay */}
                <div className="w-full rounded-lg border border-slate-300 bg-white overflow-hidden shadow-sm aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" 
                    alt="Raw SaaS Dashboard" 
                    className="w-full h-full object-cover object-top opacity-100"
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
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-xl flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:border-teal-300"
                settings={{
                  perspective: 1200,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                  sensitivity: 10,
                }}
              >
                {/* Canvas Background with Premium Oceanic Shifting Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 via-cyan-500 to-emerald-500 opacity-95 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

                <div className="relative z-10 w-full flex items-center justify-between mb-4 border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Polished Output</span>
                  </div>
                  <span className="rounded-full bg-white/25 border border-white/30 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    After
                  </span>
                </div>

                <div className="relative z-10 flex-1 w-full rounded-xl border border-white/20 bg-white/10 p-3 sm:p-4 flex flex-col justify-between overflow-hidden backdrop-blur-sm min-h-[280px]">
                  {/* Floating Text Caption Overlay */}
                  <div className="text-left w-full">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-white/50 px-2.5 py-0.5 text-[9px] font-bold text-teal-800 shadow-sm backdrop-blur-md">
                      <Sparkles className="h-2.5 w-2.5 text-teal-600 animate-pulse" />
                      1-CLICK BEAUTIFIED
                    </div>
                    <p className="mt-1 text-sm font-bold text-white leading-tight drop-shadow-sm">
                      Marketing Analytics Dashboard
                    </p>
                  </div>

                  {/* Elegant macOS Browser Mockup - Larger, filling container */}
                  <div className="w-full rounded-lg border border-white/10 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.22)] overflow-hidden flex flex-col transform translate-y-2 group-hover:translate-y-0.5 transition-transform duration-500 [transform-style:preserve-3d] mt-3">
                    {/* Browser Bar */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-2.5 py-2">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <div className="h-4 w-28 rounded bg-slate-200/50 border border-slate-200/30 flex items-center justify-center text-[7.5px] font-medium text-slate-500">
                        analytics.acme.com
                      </div>
                      <div className="w-6" />
                    </div>
                    
                    {/* High-fidelity screenshot */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" 
                        alt="Beautified SaaS Dashboard" 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
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
              className="inline-block"
            >
              <motion.div
                animate={shouldReduceMotion ? undefined : {
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative group p-[1.5px] rounded-[13px] overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 animate-gradient-flow inline-flex items-center justify-center shadow-xl shadow-slate-950/10"
              >
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-[13px] blur-md opacity-35 group-hover:opacity-75 transition-opacity duration-350 animate-gradient-flow pointer-events-none" />

                <Button
                  asChild
                  size="lg"
                  className="relative z-10 bg-slate-950 text-white hover:bg-slate-900 border-none flex items-center gap-2 group rounded-xl shadow-none"
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
