"use client";

import Link from "next/link";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SnapinglyMark } from "@/components/brand/SnapinglyLogo";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="shadow-elevated-dark relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.28),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(6,182,212,0.24),transparent_30%),linear-gradient(135deg,#0f172a_0%,#312e81_58%,#111827_100%)] px-5 py-10 text-center text-white sm:px-8 sm:py-14"
      >
        {/* Depth layers: grid fade, grain, top-edge light */}
        <div
          className="bg-grid-fade-light pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
        />
        <div
          className="bg-noise pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(40rem_6rem_at_50%_0%,rgba(34,211,238,0.14),transparent)]"
          aria-hidden="true"
        />
        {/* Oversized ghost mark for texture */}
        <div
          className="pointer-events-none absolute -bottom-16 -right-14 opacity-[0.05]"
          aria-hidden="true"
        >
          <SnapinglyMark size={280} withTile={false} className="text-white" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Local-first screenshot polish
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl leading-tight">
            Make your next product screenshot <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-200 bg-clip-text text-transparent font-black">launch-ready</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            Open the editor, paste a screenshot, choose a quick style, and
            export a sharp PNG without sending the image anywhere.
          </p>
          <div className="mt-7">
            <motion.div
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-[13px] bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 p-[1.5px] shadow-xl shadow-slate-950/15"
              whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              {/* Hover-only glow */}
              <div className="pointer-events-none absolute inset-0 rounded-[13px] bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />

              <Button
                asChild
                size="lg"
                className="relative z-10 bg-white text-slate-950 hover:bg-slate-50 border-none flex items-center gap-2 rounded-xl shadow-none"
              >
                <Link href="/editor">
                  Start beautifying
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
