import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ComparisonView from "@/components/compare/ComparisonView";
import { COMPARISONS, getComparisonBySlug } from "@/lib/compare-content";
import { SITE_URL } from "@/lib/site-metadata";

type ComparePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return {};
  }

  const url = `/compare/${comparison.slug}`;

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    keywords: comparison.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      type: "article",
      url,
      siteName: "Snapingly",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: comparison.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

function StructuredData({
  comparison,
}: {
  comparison: NonNullable<ReturnType<typeof getComparisonBySlug>>;
}) {
  const url = `${SITE_URL}/compare/${comparison.slug}`;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Snapingly", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/#features` },
      { "@type": "ListItem", position: 3, name: comparison.competitor, item: url },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparison.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: comparison.heading,
    description: comparison.metaDescription,
    url,
    datePublished: comparison.updated,
    dateModified: comparison.updated,
    author: { "@type": "Organization", name: "Snapingly" },
    publisher: { "@type": "Organization", name: "Snapingly" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
    </>
  );
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  return (
    <>
      <StructuredData comparison={comparison} />
      <ComparisonView comparison={comparison} />
    </>
  );
}
