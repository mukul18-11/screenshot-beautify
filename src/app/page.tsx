"use client";

import { useEffect } from "react";
import Footer from "@/components/landing/Footer";
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
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <>
      <StructuredData />
      <main className="min-h-screen overflow-x-clip bg-white text-slate-950">
        <LandingNav />
        <HeroSection />
        <ExampleShowcase />
        <FeatureGrid />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}

