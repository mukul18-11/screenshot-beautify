"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import ExampleCard from "@/components/landing/ExampleCard";
import { Button } from "@/components/ui/button";
import { EXAMPLE_SHOWCASE_ITEMS } from "@/lib/example-showcase";

export default function ExampleShowcase() {
  return (
    <section
      id="examples"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <motion.div 
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">Examples</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
          Beautify <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-teal-500 bg-clip-text text-transparent font-black tracking-tighter drop-shadow-[0_1px_5px_rgba(249,115,22,0.1)]">any picture or screenshot</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          From developer snips and creator analytics dashboards to full-bleed travel posters, style layouts in seconds.
        </p>
      </motion.div>

      {/* Symmetric 6-Column Bento Grid Layout for 7 items */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 items-stretch">
        {EXAMPLE_SHOWCASE_ITEMS.map((example, index) => {
          let spanClass = "col-span-1 flex flex-col";
          if (example.id === "payment-analytics") {
            spanClass = "sm:col-span-2 lg:col-span-4 flex flex-col";
          } else if (example.id === "ride-camper") {
            spanClass = "sm:col-span-2 lg:col-span-2 flex flex-col";
          } else if (example.id === "neon-urban-life") {
            spanClass = "sm:col-span-2 lg:col-span-2 flex flex-col";
          } else if (example.id === "new-york-statue") {
            spanClass = "sm:col-span-2 lg:col-span-2 flex flex-col";
          } else if (example.id === "breaking-bad-desert") {
            spanClass = "sm:col-span-2 lg:col-span-2 flex flex-col";
          } else if (example.id === "x-analytics") {
            spanClass = "sm:col-span-2 lg:col-span-3 flex flex-col";
          } else if (example.id === "developer-code") {
            spanClass = "sm:col-span-2 lg:col-span-3 flex flex-col";
          }

          return (
            <div key={example.id} className={spanClass}>
              <ExampleCard example={example} index={index} />
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-slate-950 font-semibold px-6 py-5 text-center text-white shadow-xl shadow-slate-950/15 hover:bg-slate-800 transition"
        >
          <Link href="/editor">
            Create your own visual
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
