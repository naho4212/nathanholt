import type { MetadataRoute } from "next";
import { cases } from "@/lib/cases";

const BASE = "https://nateholt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...cases.map((c) => ({
      url: `${BASE}/case/${c.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
