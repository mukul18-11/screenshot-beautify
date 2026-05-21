"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import CTASection from "@/components/landing/CTASection";
import ExampleShowcase from "@/components/landing/ExampleShowcase";
import FAQSection, { FAQS } from "@/components/landing/FAQSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingNav from "@/components/landing/LandingNav";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-metadata";

const USE_CASES = [
  "X build-in-public posts",
  "LinkedIn launch posts",
  "Product Hunt graphics",
  "Landing page hero images",
  "Changelog visuals",
  "Investor/demo screenshots",
] as const;

function UseCasesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="use-cases"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="grid gap-7 border-y border-slate-950/10 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-xl"
        >
          <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">Use cases</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
            Made for the moments builders <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-650 bg-clip-text text-transparent font-extrabold tracking-tighter">actually share</span>
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Screenshot Beautifier is for founders, makers, marketers, and
            product teams who need polished product screenshots quickly without
            opening a full design tool.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {USE_CASES.map((useCase, index) => (
            <motion.div
              key={useCase}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: shouldReduceMotion ? 0 : -3 }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 17,
                delay: shouldReduceMotion ? 0 : index * 0.035,
              }}
            >
              <Link
                href="/editor"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white/65 px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition hover:border-slate-300 hover:bg-white hover:text-slate-950 hover:shadow-md"
              >
                <span>{useCase}</span>
                <ArrowRight
                  className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-950"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchIntentSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, type: "spring", stiffness: 70, damping: 15 }}
        className="grid gap-7 rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-2xl sm:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:p-8"
      >
        <div>
          <p className="text-sm font-semibold text-cyan-700 uppercase tracking-wider">
            Screenshot tool for launches
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.25rem] leading-tight">
            A browser-based <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent font-extrabold tracking-tighter">screenshot beautifier</span>, not a full design suite
          </h2>
        </div>

        <div className="space-y-4 text-base leading-7 text-slate-600">
          <p>
            Use it when you need a fast screenshot mockup generator for SaaS
            dashboards, product updates, changelogs, social posts, pitch decks,
            and landing page hero images.
          </p>
          <p>
            The editor keeps image handling local in the browser, supports PNG,
            JPG, and WebP screenshots, and exports high-resolution PNG artwork
            with quick styles, browser frames, text overlays, and CSS 3D tilt.
          </p>
          <div className="grid gap-3 pt-1 sm:grid-cols-3">
            {["Client-side", "No signup", "Fast PNG export"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function StructuredData() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Screenshot Beautifier",
    headline: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "UseAction",
      target: `${SITE_URL}/editor`,
      name: "Beautify a screenshot",
    },
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Screenshot Beautifier",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Screenshot beautifier",
      "Browser frame mockups",
      "Quick styles",
      "Text overlays",
      "CSS 3D tilt",
      "High-resolution PNG export",
      "Client-side image handling",
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSite),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPage),
        }}
      />
    </>
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_88%_4%,rgba(251,146,60,0.16),transparent_30%),radial-gradient(circle_at_74%_92%,rgba(236,72,153,0.14),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_48%,#fff7ed_100%)] text-slate-950">
        <LandingNav />
        <HeroSection />
        <ExampleShowcase />
        <SearchIntentSection />
        <FeatureGrid />
        <HowItWorks />
        <UseCasesSection />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}
