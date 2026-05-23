"use client";

import CTASection from "@/components/landing/CTASection";
import ExampleShowcase from "@/components/landing/ExampleShowcase";
import FAQSection, { FAQS } from "@/components/landing/FAQSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HeroSection from "@/components/landing/HeroSection";
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
      <main className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_18%_8%,rgba(6,182,212,0.18),transparent_28%),radial-gradient(circle_at_88%_4%,rgba(99,102,241,0.14),transparent_30%),radial-gradient(circle_at_74%_92%,rgba(20,184,166,0.14),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_50%,#f0fdfa_100%)] text-slate-950">
        <LandingNav />
        <HeroSection />
        <ExampleShowcase />
        <FeatureGrid />
        <FAQSection />
        <CTASection />
      </main>
    </>
  );
}

