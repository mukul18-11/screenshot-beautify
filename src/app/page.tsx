"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.26),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.22),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_48%,#fdf2f8_100%)] px-6 py-8 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/55 shadow-soft backdrop-blur-xl">
            <Sparkles className="h-6 w-6 text-slate-900" aria-hidden="true" />
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Turn screenshots into launch-ready visuals
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Upload, paste, beautify, and export polished product screenshots.
          </p>
          <motion.div
            className="mt-10 inline-flex"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-slate-950 text-white shadow-2xl shadow-slate-950/20 hover:bg-slate-800"
            >
              <Link href="/editor">
                Open editor
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
