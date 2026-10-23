import { byNewest, SAFETY_RULE, SITE_NAME, SITE_URL } from "@/lib/tips";
import { shortFor } from "@/lib/videos";
export const revalidate = 3600;
export function GET() {
  const tips = byNewest().map((t) => {
    const v = shortFor(t.slug);
    return { url: `${SITE_URL}/tips/${t.slug}`, title: t.title, headline: t.displayName, published: t.date, appliances: t.hubs.map((h) => h.label),
      answer: t.answer, steps: t.steps, safety: `${t.safety} ${SAFETY_RULE}`, faq: t.faq,
      ...(v ? { video: `${SITE_URL}/v/${v.id}.mp4`, thumbnail: `${SITE_URL}/v/${v.id}.jpg` } : {}) };
  });
  return Response.json({ name: SITE_NAME, url: SITE_URL, safetyRule: SAFETY_RULE, count: tips.length, tips }, { headers: { "access-control-allow-origin": "*" } });
}
