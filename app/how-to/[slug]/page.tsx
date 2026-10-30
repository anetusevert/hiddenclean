import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { TipCard } from "@/components/TipCard";
import { GuidePage } from "@/components/GuidePage";
import Link from "next/link";
import { breadcrumbLd, collectionLd, faqLd, metaDescription, pageAlternates } from "@/lib/seo";
import { getGuide, liveGuides } from "@/lib/guides";
import { hubTips, liveHubs, SAFETY_RULE, SITE_NAME, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() { return [...liveHubs().map((h) => ({ slug: h.id })), ...liveGuides().map((g) => ({ slug: g.id }))]; }
const find = (slug: string) => liveHubs().find((h) => h.id === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const guide = getGuide(slug);
  if (guide) return { title: { absolute: `${guide.metaTitle} | ${SITE_NAME}` }, description: metaDescription(guide.title, guide.answer), alternates: pageAlternates(`/how-to/${guide.id}`), openGraph: { title: guide.displayName, description: guide.intro, url: `/how-to/${guide.id}`, type: "article" } };
  const hub = find(slug);
  return hub ? { title: { absolute: `${hub.title}: ${hubTips(hub).length} safety-checked hacks | ${SITE_NAME}` }, description: metaDescription(hub.title, `${hubTips(hub).length} safety-checked hacks. ${hub.intro} Start with ${hubTips(hub)[0]?.searchPhrase ?? hub.searchPhrase}.`), alternates: pageAlternates(`/how-to/${hub.id}`) } : {};
}
export default async function Hub({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const guide = getGuide(slug);
  if (guide) return <GuidePage guide={guide} />;
  const hub = find(slug);
  if (!hub) notFound();
  const tips = hubTips(hub);
  const url = `${SITE_URL}/how-to/${hub.id}`;
  const faq = [{ q: `What's the safest way to ${hub.searchPhrase.replace(/^how to /, "")}?`, a: SAFETY_RULE }, ...tips.slice(0, 3).map((t) => ({ q: `${t.title}?`, a: t.answer }))];
  const guides = liveGuides();
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
      {guides.length > 0 && (<><h2>Quick cleaning routines</h2><div className="hubs">{guides.map((g) => <Link key={g.id} href={`/how-to/${g.id}`} className="hub"><strong>{g.displayName}</strong><span>{g.title}</span></Link>)}</div></>)}
    </div>
  );
}
