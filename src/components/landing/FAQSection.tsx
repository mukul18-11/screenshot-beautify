"use client";

import { motion, useReducedMotion } from "motion/react";
import { HelpCircle } from "lucide-react";

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

function FAQCard({ faq }: { faq: typeof FAQS[number] }) {
  return (
    <div className="w-[280px] sm:w-[350px] shrink-0 rounded-2xl border border-slate-250/70 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:border-cyan-300/80 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] cursor-default flex flex-col justify-between whitespace-normal">
      <div>
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4.5 w-4.5 text-cyan-600 shrink-0 mt-0.5" />
          <h3 className="text-sm font-bold font-display tracking-tight text-slate-900">
            {faq.question}
          </h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();

  const ROW1_FAQS = [FAQS[0], FAQS[1], FAQS[2]];
  const ROW2_FAQS = [FAQS[3], FAQS[4], FAQS[5]];

  // Repeat for seamless marquee
  const row1Items = [...ROW1_FAQS, ...ROW1_FAQS, ...ROW1_FAQS, ...ROW1_FAQS];
  const row2Items = [...ROW2_FAQS, ...ROW2_FAQS, ...ROW2_FAQS, ...ROW2_FAQS];

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 overflow-hidden"
    >
      <style>{`
        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-ltr {
          display: flex;
          width: max-content;
          animation: marquee-ltr 32s linear infinite;
        }
        .animate-marquee-rtl {
          display: flex;
          width: max-content;
          animation: marquee-rtl 32s linear infinite;
        }
        .animate-marquee-ltr:hover,
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-xl text-center mb-10"
      >
        <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
          Practical answers before you start
        </h2>
      </motion.div>

      {shouldReduceMotion ? (
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          {FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                <h3 className="text-sm font-bold font-display tracking-tight text-slate-900">
                  {faq.question}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden py-2">
          {/* Edge Fading Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#f0fdfa] via-[#f0fdfa]/70 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#f0fdfa] via-[#f0fdfa]/70 to-transparent z-10 pointer-events-none" />

          {/* Row 1 (LTR) */}
          <div className="flex w-full overflow-hidden py-2">
            <div className="animate-marquee-ltr flex gap-4">
              {row1Items.map((faq, i) => (
                <FAQCard key={`${faq.question}-${i}`} faq={faq} />
              ))}
            </div>
          </div>

          {/* Row 2 (RTL) */}
          <div className="flex w-full overflow-hidden mt-4 py-2">
            <div className="animate-marquee-rtl flex gap-4">
              {row2Items.map((faq, i) => (
                <FAQCard key={`${faq.question}-${i}`} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
