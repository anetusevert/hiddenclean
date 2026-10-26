import { berlinOffset, byNewest, SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function GET() {
  const tips = byNewest();
  const built = tips[0] ? new Date(`${tips[0].date}T07:30:00${berlinOffset(tips[0].date)}`).toUTCString() : new Date().toUTCString();
  const items = tips.slice(0, 50).map((t) => `<item><title>${esc(t.displayName)}</title><link>${SITE_URL}/tips/${t.slug}</link><guid>${SITE_URL}/tips/${t.slug}</guid><pubDate>${new Date(`${t.date}T07:30:00${berlinOffset(t.date)}`).toUTCString()}</pubDate><description>${esc(`${t.answer} Safety: ${t.safety}`)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME}</title><link>${SITE_URL}</link><description>${esc(SITE_DESC)}</description><language>en</language><lastBuildDate>${built}</lastBuildDate><ttl>60</ttl><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
