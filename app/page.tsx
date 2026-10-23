import Link from "next/link";
import { TipCard } from "@/components/TipCard";
import { HeroLoop, ShortCard } from "@/components/Media";
import { Social } from "@/components/Social";
import { SHORTS } from "@/lib/videos";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd, pageAlternates } from "@/lib/seo";
import { byNewest, liveHubs, hubTips, SITE_URL, SAFETY_RULE } from "@/lib/tips";
export const revalidate = 3600;
export const metadata = { alternates: pageAlternates("/") };

export default function Home() {
  const tips = byNewest();
  const [today, ...rest] = tips;
  const liveSlugs = new Set(tips.map((t) => t.slug));
  return (
    <>
      <JsonLd data={itemListLd({ name: "Latest HiddenClean tips", url: SITE_URL, items: tips.slice(0, 12).map((t) => ({ name: t.title, url: `${SITE_URL}/tips/${t.slug}` })) })} />
      <section className="hero hero2">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="kicker">✦ One secret a day · {tips.length} tips so far</p>
            <h1>Your appliances have <mark>secret</mark> buttons.</h1>
            <p className="lede">Hidden filters, self-clean modes and button combos on the machines you already own. 30 seconds each, safety-checked.</p>
            <div className="cta"><Link className="btn" href={`/tips/${today.slug}`}>Today&apos;s hack →</Link><a className="btn ghost" href="#watch">Watch the videos</a></div>
            <Social />
          </div>
          <div className="phone"><HeroLoop /><span className="phone-tag">▶ Real hacks, 30 sec</span></div>
        </div>
      </section>
      <section className="today-band"><div className="wrap">
        <Link href={`/tips/${today.slug}`} className="today">
          <span className="tag">Today</span>
          <strong>{today.displayName}</strong>
          <p>{today.answer}</p>
          <span className="more">Show me how →</span>
        </Link>
      </div></section>
      <div className="wrap">
        <aside className="safety-strip"><b>Safety first:</b> {SAFETY_RULE}</aside>
        <h2 className="section" id="watch">Latest hacks <span className="h-sub">tap to watch</span></h2>
        <div className="shorts">{SHORTS.map((v) => <ShortCard key={v.id} s={v} href={liveSlugs.has(v.tipSlug) ? `/tips/${v.tipSlug}` : undefined} />)}
          <aside className="follow"><strong>New hack every day</strong><p>Follow along and never scrub the hard way again.</p><Social /><Link className="btn" href="/subscribe">Get it by email</Link></aside></div>
        <p className="credit">Stock footage via <a href="https://www.pexels.com/license/" rel="noopener">Pexels</a> (free licence). Follow for a new one every day.</p>
        <h2 className="section">By appliance</h2>
        <div className="hubs">
          {liveHubs().map((h) => (
            <Link key={h.id} href={`/how-to/${h.id}`} className="hub"><strong>{h.label}</strong><span>{hubTips(h).length} tips</span></Link>
          ))}
        </div>
        <h2 className="section">Latest hidden hacks</h2>
        <div className="grid">{rest.slice(0, 12).map((t) => <TipCard key={t.slug} tip={t} />)}</div>
        <p className="center"><Link className="btn" href="/tips">See all {tips.length} tips</Link></p>
      </div>
    </>
  );
}
