"use client";

import Footer from "@/components/landing/Footer";
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

function StructuredData() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Snapingly",
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
    name: "Snapingly",
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
      <main className="relative min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
        {/* Ambient page backdrop: top brand glow + film grain */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(64rem_32rem_at_50%_-14%,rgba(34,211,238,0.11),transparent_72%)] dark:bg-[radial-gradient(64rem_32rem_at_50%_-14%,rgba(34,211,238,0.09),transparent_72%)]" />
          <div className="bg-noise absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" />
        </div>
        <div className="relative z-10">
        <LandingNav />
        <HeroSection />
        <ExampleShowcase />
        <HowItWorks />
        <FeatureGrid />
        <FAQSection />
        <CTASection />
        <Footer />
        </div>
      </main>
    </>
  );
}
