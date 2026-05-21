"use client";

export const FAQS = [
  {
    question: "What is Screenshot Beautifier?",
    answer:
      "Screenshot Beautifier is a browser-based tool for turning product screenshots into polished launch graphics with quick styles, browser frames, text overlays, depth, and PNG export.",
  },
  {
    question: "Do screenshots upload to a server?",
    answer:
      "No. Screenshot Beautifier handles the image in your browser for this MVP.",
  },
  {
    question: "What file types can I use?",
    answer: "PNG, JPG, and WebP screenshots up to 10 MB are supported.",
  },
  {
    question: "Can I export for social posts and landing pages?",
    answer:
      "Yes. Use built-in canvas sizes and export sharp PNGs for X, LinkedIn, Product Hunt, decks, and hero images.",
  },
  {
    question: "Who is it for?",
    answer:
      "It is built for founders, makers, marketers, and product teams who need polished screenshots for launches, changelogs, demos, and social posts.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. The editor runs locally in your browser and does not require login.",
  },
] as const;

import { motion, useReducedMotion } from "motion/react";

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <motion.div 
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
          Practical answers before you start
        </h2>
      </motion.div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
        {FAQS.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: shouldReduceMotion ? 0 : -3, 
              borderColor: "rgba(14, 116, 144, 0.25)",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)"
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 16,
              delay: shouldReduceMotion ? 0 : index * 0.04,
            }}
            className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl transition-all cursor-default"
          >
            <h3 className="text-base font-bold font-display tracking-tight text-slate-950">
              {faq.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
