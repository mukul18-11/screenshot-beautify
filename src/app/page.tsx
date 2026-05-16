import Link from "next/link";

import CTASection from "@/components/landing/CTASection";
import ExampleShowcase from "@/components/landing/ExampleShowcase";
import FAQSection from "@/components/landing/FAQSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";

const USE_CASES = [
  "X build-in-public posts",
  "LinkedIn launch posts",
  "Product Hunt graphics",
  "Landing page hero images",
  "Changelog visuals",
  "Investor/demo screenshots",
] as const;

function UseCasesSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-cyan-700">Use cases</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Made for the moments builders actually share
        </h2>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((useCase) => (
          <Link
            key={useCase}
            href="/editor"
            className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-md"
          >
            {useCase}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(45,212,191,0.24),transparent_28%),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_74%_92%,rgba(244,114,182,0.16),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_48%,#fff7ed_100%)] text-slate-950">
      <HeroSection />
      <ExampleShowcase />
      <FeatureGrid />
      <HowItWorks />
      <UseCasesSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
