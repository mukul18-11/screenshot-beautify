"use client";

import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import ExampleCard from "@/components/landing/ExampleCard";
import SectionHeading from "@/components/landing/SectionHeading";
import { Button } from "@/components/ui/button";
import { EXAMPLE_SHOWCASE_ITEMS } from "@/lib/example-showcase";

export default function ExampleShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="examples"
      className="relative w-full scroll-mt-20 border-y border-slate-950/[0.04] bg-slate-50/70 dark:border-white/[0.06] dark:bg-white/[0.02]"
    >
      {/* Section backdrop: faded grid + grain */}
      <div
        className="bg-grid-fade pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.045]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Examples"
          icon={Images}
          title={
            <>
              Beautify{" "}
              <span className="text-gradient-brand font-black">
                any picture or screenshot
              </span>
            </>
          }
          description="From developer snips and creator analytics dashboards to full-bleed travel posters, style layouts in seconds."
        />

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
              <motion.div
                key={example.id}
                className={spanClass}
                initial={
                  shouldReduceMotion ? undefined : { opacity: 0, y: 20 }
                }
                whileInView={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: (index % 3) * 0.08,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <ExampleCard example={example} index={index} />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <div className="group relative inline-flex items-center justify-center overflow-hidden rounded-[13px] bg-gradient-brand p-[1.5px] shadow-lg shadow-cyan-500/10">
            <div className="pointer-events-none absolute inset-0 rounded-[13px] bg-gradient-brand opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60" />
            <Button
              asChild
              size="lg"
              className="relative z-10 rounded-xl border-none bg-slate-950 px-6 py-5 font-semibold text-white shadow-none hover:bg-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900"
            >
              <Link href="/editor">
                Create your own visual
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
