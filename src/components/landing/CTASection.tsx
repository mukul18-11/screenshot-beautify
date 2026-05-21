"use client";

import Link from "next/link";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6">
      <motion.div 
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 15 }}
        className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.28),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(6,182,212,0.24),transparent_30%),linear-gradient(135deg,#0f172a_0%,#312e81_58%,#111827_100%)] px-5 py-10 text-center text-white shadow-2xl shadow-slate-950/20 sm:px-8 sm:py-14"
      >
        {/* Pulsing floating background color orbs */}
        <motion.div
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.25, 1],
            opacity: [0.24, 0.4, 0.24],
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/35 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={shouldReduceMotion ? undefined : {
            scale: [1, 1.2, 1],
            opacity: [0.18, 0.3, 0.18],
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Local-first screenshot polish
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl leading-tight">
            Make your next product screenshot <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">launch-ready</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            Open the editor, paste a screenshot, choose a quick style, and
            export a sharp PNG without sending the image anywhere.
          </p>
          <div className="mt-7">
            <motion.div
              className="inline-block"
              whileHover={{ y: shouldReduceMotion ? 0 : -3 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
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
                className="relative group p-[1.5px] rounded-[13px] overflow-hidden bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 animate-gradient-flow inline-flex items-center justify-center shadow-xl shadow-slate-950/15"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-400 rounded-[13px] blur-md opacity-35 group-hover:opacity-75 transition-opacity duration-350 animate-gradient-flow pointer-events-none" />

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
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
