import type { MetadataRoute } from "next";

import { COMPARISONS } from "@/lib/compare-content";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const comparisonEntries: MetadataRoute.Sitemap = COMPARISONS.map(
    (comparison) => ({
      url: `${SITE_URL}/compare/${comparison.slug}`,
      lastModified: new Date(comparison.updated),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...comparisonEntries,
  ];
}
