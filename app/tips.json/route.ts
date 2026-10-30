import { byNewest, SAFETY_RULE, SITE_NAME, SITE_URL } from "@/lib/tips";
import { shortFor } from "@/lib/videos";
import { guideTips, liveGuides } from "@/lib/guides";
export const revalidate = 3600;
export function GET() {
  const tips = byNewest().map((t) => {
    const v = shortFor(t.slug);
    return { url: `${SITE_URL}/tips/${t.slug}`, title: t.title, headline: t.displayName, published: t.date, appliances: t.hubs.map((h) => h.label),
      answer: t.answer, steps: t.steps, safety: `${t.safety} ${SAFETY_RULE}`, faq: t.faq,
      ...(v ? { video: `${SITE_URL}/v/${v.id}.mp4`, thumbnail: `${SITE_URL}/v/${v.id}.jpg` } : {}) };
  });
  const guides = liveGuides().map((g) => ({ url: `${SITE_URL}/how-to/${g.id}`, title: g.title, headline: g.displayName, kind: g.kind, published: g.date, minutes: g.minutes, answer: g.answer,
    sections: g.sections.map((s) => ({ title: s.title, minutes: s.minutes, items: s.items.map((it) => it.text) })), faq: g.faq, tips: guideTips(g).map((t) => `${SITE_URL}/tips/${t.slug}`) }));
  return Response.json({ name: SITE_NAME, url: SITE_URL, safetyRule: SAFETY_RULE, count: tips.length, guides, tips }, { headers: { "access-control-allow-origin": "*" } });
}
