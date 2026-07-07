import Link from "next/link";
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react";

import CompareFaqAccordion from "@/components/compare/CompareFaqAccordion";
import CompareHeader from "@/components/compare/CompareHeader";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import type { Comparison } from "@/lib/compare-content";
import { COMPARISONS } from "@/lib/compare-content";

function formatUpdatedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ComparisonView({ comparison }: { comparison: Comparison }) {
  const otherComparisons = COMPARISONS.filter((item) => item.slug !== comparison.slug);

  return (
    <main className="min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <CompareHeader />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-4xl px-4 pt-8 text-xs font-medium text-slate-500 sm:px-6 dark:text-slate-400"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-slate-950 dark:hover:text-white">
              Snapingly
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-white">Compare</li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-white">{comparison.competitor}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-10 pt-6 sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-700/10 dark:from-cyan-500/20 dark:to-indigo-500/20 dark:text-cyan-300 dark:ring-cyan-500/30">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {comparison.eyebrow}
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl leading-tight dark:text-white">
          {comparison.heading}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {comparison.dek}
        </p>

        {/* Direct-answer callout: written for people scanning fast and for AI answer engines quoting a single paragraph */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Short answer
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {comparison.answer}
          </p>
        </div>

        <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
          Last updated {formatUpdatedDate(comparison.updated)}
        </p>
      </section>

      {/* Best for / Not for */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <h2 className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">
              Choose Snapingly if
            </h2>
            <ul className="mt-3 space-y-2.5">
              {comparison.bestForSnapingly.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-sm font-bold tracking-tight text-slate-950 dark:text-white">
              Choose {comparison.competitor} if
            </h2>
            <ul className="mt-3 space-y-2.5">
              {comparison.bestForCompetitor.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
          Snapingly vs {comparison.competitor} at a glance
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400">Criterion</th>
                <th className="px-4 py-3 font-semibold text-slate-950 dark:text-white">Snapingly</th>
                <th className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{comparison.competitor}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row, index) => (
                <tr
                  key={row.criterion}
                  className={
                    index % 2 === 0
                      ? "border-b border-slate-100 dark:border-white/5"
                      : "border-b border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/[0.02]"
                  }
                >
                  <td className="px-4 py-3.5 font-medium text-slate-500 dark:text-slate-400">{row.criterion}</td>
                  <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">{row.snapingly}</td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{row.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Long-form sections */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <div className="space-y-10">
          {comparison.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="mt-4">
          <CompareFaqAccordion faqs={comparison.faqs} />
        </div>
      </section>

      {/* Other comparisons */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-4 sm:px-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          More comparisons
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherComparisons.map((item) => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-white"
            >
              vs {item.competitor}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
