"use client";

import Link from "next/link";

import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
      className="relative mx-auto mt-10 w-full max-w-5xl sm:mt-12"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.32),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(244,114,182,0.28),transparent_28%),linear-gradient(135deg,#101828_0%,#312e81_48%,#f97316_100%)] p-5 shadow-2xl shadow-slate-950/20 sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.11)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-5 text-center text-white">
            <div className="mx-auto mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xl">
              LAUNCH VISUAL
            </div>
            <p className="text-2xl font-semibold sm:text-4xl">
              New dashboard is live
            </p>
            <p className="mt-2 text-sm text-white/72 sm:text-base">
              Polished screenshots for posts, launches, and decks.
            </p>
          </div>

          <div className="origin-center rounded-2xl border border-white/20 bg-white shadow-2xl shadow-slate-950/35 ring-1 ring-white/30 sm:[transform:perspective(1100px)_rotateX(8deg)_rotateY(-12deg)]">
            <div className="flex h-10 items-center gap-2 rounded-t-2xl border-b border-slate-200 bg-slate-50 px-4">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 hidden w-52 rounded-full bg-white py-1.5 text-center text-xs text-slate-400 shadow-sm sm:block">
                yourproduct.com
              </span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-[1.25fr_0.75fr] sm:p-6">
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
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-100" />
                <div className="h-24 rounded-2xl bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-4 pb-12 pt-4 sm:px-6 sm:pt-6">
      <header className="flex items-center justify-between rounded-3xl border border-white/70 bg-white/55 px-4 py-3 shadow-soft backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-slate-950">
            Screenshot Beautifier
          </span>
        </Link>
        <Button
          asChild
          size="sm"
          className="bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800"
        >
          <Link href="/editor">
            Start
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/65 px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="truncate">Your screenshots never leave your browser.</span>
          </div>
          <h1 className="text-balance text-4xl font-semibold text-slate-950 sm:text-6xl lg:text-7xl">
            Turn boring screenshots into launch-ready visuals
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            Upload, beautify, add browser frames, 3D depth, text overlays, and
            export sharp PNGs — all in your browser.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}
