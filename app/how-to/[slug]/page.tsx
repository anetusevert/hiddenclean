import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { TipCard } from "@/components/TipCard";
import { breadcrumbLd, collectionLd, faqLd, pageAlternates } from "@/lib/seo";
import { hubTips, liveHubs, SAFETY_RULE, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
export function generateStaticParams() { return liveHubs().map((h) => ({ slug: h.id })); }
const find = (slug: string) => liveHubs().find((h) => h.id === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const hub = find((await params).slug);
  return hub ? { title: hub.title, description: `${hub.title}: ${hub.intro}`, alternates: pageAlternates(`/how-to/${hub.id}`) } : {};
}
export default async function Hub({ params }: { params: Promise<{ slug: string }> }) {
  const hub = find((await params).slug);
  if (!hub) notFound();
  const tips = hubTips(hub);
  const url = `${SITE_URL}/how-to/${hub.id}`;
  const faq = [{ q: `What's the safest way to ${hub.searchPhrase.replace(/^how to /, "")}?`, a: SAFETY_RULE }, ...tips.slice(0, 3).map((t) => ({ q: `${t.title}?`, a: t.answer }))];
  return (
    <div className="wrap page">
      <JsonLd data={collectionLd({ name: hub.title, url, description: hub.intro, items: tips.map((t) => ({ name: t.title, url: `${SITE_URL}/tips/${t.slug}` })) })} />
      <JsonLd data={faqLd(faq)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: SITE_URL }, { name: "How to", url: `${SITE_URL}/how-to` }, { name: hub.title, url }])} />
      <h1>{hub.title}</h1>
      <p className="lede">{hub.intro} {tips.length} tips, newest first.</p>
      <aside className="safety-strip"><b>Safety first:</b> {SAFETY_RULE}</aside>
      <div className="grid">{tips.map((t) => <TipCard key={t.slug} tip={t} />)}</div>
      <h2>FAQ</h2>
      <div className="faq">{faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
    </div>
  );
}
