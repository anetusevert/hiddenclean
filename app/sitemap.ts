import type { MetadataRoute } from "next";
import { byNewest, liveHubs, SITE_URL } from "@/lib/tips";
import { liveGuides } from "@/lib/guides";
import { shortFor } from "@/lib/videos";
import { berlinOffset } from "@/lib/tips";
export const revalidate = 3600;
// Next writes video/image fields into the XML raw, so escape text ourselves.
const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export default function sitemap(): MetadataRoute.Sitemap {
  const tips = byNewest();
  const latest = tips[0]?.date;
  return [
    { url: SITE_URL, lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/tips`, lastModified: latest, changeFrequency: "daily" },
    { url: `${SITE_URL}/how-to`, lastModified: latest, changeFrequency: "weekly" },
    { url: `${SITE_URL}/about` }, { url: `${SITE_URL}/subscribe` },
    ...liveGuides().map((g) => ({ url: `${SITE_URL}/how-to/${g.id}`, lastModified: g.date, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...liveHubs().map((h) => ({ url: `${SITE_URL}/how-to/${h.id}`, lastModified: latest })),
    // Image + video sitemap extensions: per-tip share card, and the short for tips that have one.
    ...tips.map((t) => {
      const v = shortFor(t.slug);
      return {
        url: `${SITE_URL}/tips/${t.slug}`, lastModified: t.date,
        images: [`${SITE_URL}/og/${t.slug}`, ...(v ? [`${SITE_URL}/v/${v.id}.jpg`] : [])],
        ...(v ? { videos: [{ title: xml(t.displayName), description: xml(t.answer.slice(0, 2000)), thumbnail_loc: `${SITE_URL}/v/${v.id}.jpg`, content_loc: `${SITE_URL}/v/${v.id}.mp4`, duration: v.sec ?? 30, publication_date: `${t.date}T07:30:00${berlinOffset(t.date)}`, family_friendly: "yes" as const }] } : {}),
      };
    }),
  ];
}
