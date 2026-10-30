import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { shortFor } from "@/lib/videos";
import { guidesForTip, liveGuides } from "@/lib/guides";
import { JsonLd } from "@/components/JsonLd";
import { TipCard } from "@/components/TipCard";
import { breadcrumbLd, faqLd, metaDescription, pageAlternates } from "@/lib/seo";
import { berlinOffset, byNewest, getTip, hubTips, prettyDate, SAFETY_RULE, SITE_NAME, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() { return byNewest().map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tip = getTip((await params).slug);
  if (!tip) return {};
  const v = shortFor(tip.slug);
  const img = v ? { url: `/v/${v.id}.jpg`, width: 1080, height: 1920, alt: tip.displayName } : { url: "/og.png", width: 1200, height: 630, alt: tip.displayName };
  return { title: { absolute: `${tip.title} | ${SITE_NAME}` }, description: metaDescription(tip.title, tip.answer), alternates: pageAlternates(`/tips/${tip.slug}`), openGraph: { title: tip.displayName, description: tip.answer, type: "article", publishedTime: tip.date, url: `/tips/${tip.slug}`, images: [img] }, twitter: { card: "summary_large_image", title: tip.displayName, description: tip.answer, images: [img.url] } };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const tip = getTip((await params).slug);
  if (!tip) notFound();
  const url = `${SITE_URL}/tips/${tip.slug}`;
  const hub = tip.hubs[0];
  const v = shortFor(tip.slug);
  const video = v ? { "@type": "VideoObject", name: tip.displayName, description: `${tip.answer} Safety: ${tip.safety}`, thumbnailUrl: `${SITE_URL}/v/${v.id}.jpg`, contentUrl: `${SITE_URL}/v/${v.id}.mp4`, uploadDate: `${tip.date}T07:30:00${berlinOffset(tip.date)}`, duration: "PT30S", publisher: { "@id": `${SITE_URL}/#org` } } : null;
  // Related: the tips either side of this one in its hub (circular), so every tip gets inbound links, not just the newest 3.
  const inHub = hubTips(hub);
  const at = inHub.findIndex((t) => t.slug === tip.slug);
  const relatedSet = new Map<string, (typeof inHub)[number]>();
  for (const off of [1, -1, 2, -2, 3, -3]) {
    if (inHub.length < 2 || relatedSet.size >= 4) break;
    const t = inHub[(at + off + inHub.length * 4) % inHub.length];
    if (t.slug !== tip.slug) relatedSet.set(t.slug, t);
  }
  const related = [...relatedSet.values()];
  const inGuides = guidesForTip(tip.slug);
  const moreGuides = liveGuides().filter((g) => !inGuides.includes(g));
  const all = byNewest();
  const idx = all.findIndex((t) => t.slug === tip.slug);
  const newer = idx > 0 ? all[idx - 1] : undefined;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
  return (
    <article className="wrap page tip">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "HowTo", name: tip.title, description: tip.answer, url, datePublished: tip.date, inLanguage: "en", totalTime: "PT15M",
        ...(video ? { image: video.thumbnailUrl, video } : { image: `${SITE_URL}/og.png` }),
        publisher: { "@id": `${SITE_URL}/#org` }, isPartOf: { "@id": `${SITE_URL}/#website` }, about: hub.title,
        step: tip.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.split(/[.!]/)[0].slice(0, 80), text: s, url: `${url}#step-${i + 1}` })) }} />
      {video && <JsonLd data={{ "@context": "https://schema.org", ...video }} />}
      <JsonLd data={faqLd(tip.faq)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: SITE_URL }, { name: hub.title, url: `${SITE_URL}/how-to/${hub.id}` }, { name: tip.title, url }])} />
      <header>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href={`/how-to/${hub.id}`}>{hub.title}</Link></nav>
      <p className="display">{tip.displayName}</p>
      <h1>{tip.title}</h1>
      <p className="meta"><time dateTime={tip.date}>{prettyDate(tip.date)}</time> · {tip.steps.length} steps</p>
      </header>
      <div className="answer"><b>Quick answer</b><p>{tip.answer}</p></div>
      <div className="safety" role="note"><b>⚠ Safety check</b><p>{tip.safety}</p><p className="rule">{SAFETY_RULE}</p></div>
      {inGuides.length > 0 && <p className="in-guide">Part of: {inGuides.map((g, i) => <span key={g.id}>{i ? " · " : ""}<Link href={`/how-to/${g.id}`}>{g.displayName}</Link></span>)}</p>}
      <h2>Step by step</h2>
      <ol className="steps">{tip.steps.map((s, i) => <li key={s} id={`step-${i + 1}`}>{s}</li>)}</ol>
      {v && (<><h2>Watch it in 30 seconds</h2><video className="tip-video" src={`/v/${v.id}.mp4`} poster={`/v/${v.id}.jpg`} controls playsInline preload="none" width={1080} height={1920} aria-label={`Video: ${tip.displayName}`} /></>)}
      <h2>FAQ</h2>
      <div className="faq">{tip.faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      {related.length > 0 && (<><h2>More {hub.title.replace(/^How to /, "").toLowerCase()} hacks</h2><div className="grid">{related.map((t) => <TipCard key={t.slug} tip={t} />)}</div></>)}
      {tip.hubs.length > 1 && <p className="meta">Also in: {tip.hubs.slice(1).map((h, i) => <span key={h.id}>{i ? ", " : ""}<Link href={`/how-to/${h.id}`}>{h.title}</Link></span>)}</p>}
      {liveGuides().length > 0 && (<><h2>Quick cleaning routines</h2><div className="hubs">{[...inGuides, ...moreGuides].map((g) => <Link key={g.id} href={`/how-to/${g.id}`} className="hub"><strong>{g.displayName}</strong><span>{g.title}</span></Link>)}</div></>)}
      {(older || newer) && (<nav className="pager" aria-label="More tips">{older && <Link href={`/tips/${older.slug}`} rel="prev">← Previous hack: {older.title}</Link>}{newer && <Link href={`/tips/${newer.slug}`} rel="next">Next hack: {newer.title} →</Link>}</nav>)}
    </article>
  );
}
