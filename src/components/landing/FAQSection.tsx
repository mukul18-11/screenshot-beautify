"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";

export const FAQS = [
  {
    question: "What is Snapingly?",
    answer:
      "Snapingly is a fast browser-based tool for turning screenshots and photos into polished, launch-ready visual creatives for social posts, landing pages, and decks.",
  },
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. All image processing happens client-side. Your screenshots and private financial data never leave your browser, ensuring absolute privacy.",
  },
  {
    question: "What formats and sizes are supported?",
    answer:
      "We support PNG, JPG, and WebP files up to 10 MB. Perfect for dashboard screenshots or raw photographic mockups.",
  },
  {
    question: "How do exports work?",
    answer:
      "Download crisp, sharp PNG graphics upscaled to 1x, 2x, 4x, or 6x for retina displays, or copy directly to your clipboard for fast sharing.",
  },
  {
    question: "Who is this built for?",
    answer:
      "Founders, software builders, designers, and creators who want professional visuals without opening complex design tools like Figma.",
  },
  {
    question: "Is an account or card required?",
    answer:
      "You'll need a free Snapingly account — sign up in seconds with Google, Microsoft, GitHub, or email. No card details required, and your images still never leave your browser.",
  },
] as const;

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28 overflow-hidden relative"
    >
      {/* Ambient background glows in the brand family */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-teal-200/20 to-cyan-200/20 blur-[100px] pointer-events-none dark:from-teal-500/10 dark:to-cyan-500/10" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-cyan-200/15 to-indigo-200/15 blur-[90px] pointer-events-none dark:from-cyan-500/10 dark:to-indigo-500/10" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Sticky Section Title */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-5 relative"
        >
          {/* Subtle localized glow behind text */}
          <div className="absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-400/10 to-indigo-400/10 opacity-70 blur-[70px] pointer-events-none dark:from-cyan-500/15 dark:to-indigo-500/15" />

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              Common Questions
            </span>
          </div>

          <h2 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-5xl leading-[1.1] dark:text-white">
            Frequently asked questions
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md font-sans font-normal dark:text-slate-400">
            Got questions about Snapingly? Find answers here. Keep in mind that all image processing is 100% local inside your browser—keeping your files fully secure.
          </p>
        </motion.div>

        {/* Right Column: Expandable Accordion List */}
        <div className="lg:col-span-7 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
                whileInView={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.05,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-indigo-500/25 bg-white shadow-elevated dark:border-indigo-400/25 dark:bg-slate-900/95"
                    : "border-slate-200/80 bg-white/40 backdrop-blur-md hover:border-slate-300 hover:bg-white/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:shadow-none"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-sm sm:text-[15px] font-semibold tracking-tight transition-colors duration-200 leading-snug ${
                      isOpen
                        ? "text-slate-950 dark:text-white"
                        : "text-slate-900 group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Rotating indicator; brand gradient when open */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-gradient-brand text-white shadow-md shadow-cyan-500/20 rotate-180"
                        : "bg-slate-100/90 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-800 dark:bg-white/10 dark:text-slate-400 dark:group-hover:bg-white/20 dark:group-hover:text-slate-200"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{
                    height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                    opacity: { duration: 0.25, ease: "easeInOut" }
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-0 border-t border-slate-100/30 dark:border-white/10">
                    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600 font-sans font-normal dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
