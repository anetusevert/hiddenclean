import type { MetadataRoute } from "next";
import { byNewest, liveHubs, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
export default function sitemap(): MetadataRoute.Sitemap {
  const tips = byNewest();
  const latest = tips[0]?.date;
  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tips`, lastModified: latest, changeFrequency: "daily" },
    { url: `${SITE_URL}/how-to`, lastModified: latest, changeFrequency: "weekly" },
    { url: `${SITE_URL}/about` }, { url: `${SITE_URL}/subscribe` },
    ...liveHubs().map((h) => ({ url: `${SITE_URL}/how-to/${h.id}`, lastModified: latest })),
    ...tips.map((t) => ({ url: `${SITE_URL}/tips/${t.slug}`, lastModified: t.date })),
  ];
}
