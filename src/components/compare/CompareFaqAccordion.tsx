"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { ComparisonFaq } from "@/lib/compare-content";

export default function CompareFaqAccordion({ faqs }: { faqs: ComparisonFaq[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={faq.question}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "border-violet-500/30 bg-gradient-to-br from-white/95 via-violet-50/25 to-fuchsia-50/20 dark:border-violet-500/30 dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-violet-950/20 dark:to-fuchsia-950/20"
                : "border-slate-200/80 bg-white/40 backdrop-blur-md hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            }`}
          >
            <button
              onClick={() => setActiveIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
              aria-expanded={isOpen}
            >
              <span className="font-display text-sm font-semibold tracking-tight leading-snug text-slate-900 dark:text-slate-100">
                {faq.question}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rotate-180"
                    : "bg-slate-100/90 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 pt-0 border-t border-slate-100/30 dark:border-white/10">
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
