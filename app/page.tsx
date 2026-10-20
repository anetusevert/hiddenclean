import Link from "next/link";
import { TipCard } from "@/components/TipCard";
import { JsonLd } from "@/components/JsonLd";
import { itemListLd, pageAlternates } from "@/lib/seo";
import { byNewest, liveHubs, hubTips, SITE_URL, SAFETY_RULE } from "@/lib/tips";
export const revalidate = 3600;
export const metadata = { alternates: pageAlternates("/") };

export default function Home() {
  const tips = byNewest();
  const [today, ...rest] = tips;
  return (
    <>
      <JsonLd data={itemListLd({ name: "Latest HiddenClean tips", url: SITE_URL, items: tips.slice(0, 12).map((t) => ({ name: t.title, url: `${SITE_URL}/tips/${t.slug}` })) })} />
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">✦ One secret a day · {tips.length} tips so far</p>
            <h1>The hidden cleaning settings your appliances never told you about.</h1>
            <p className="lede">Secret buttons, buried filters and self-clean modes on the machines you already own. Short, tested, and safety-checked.</p>
            <div className="cta"><Link className="btn" href={`/tips/${today.slug}`}>Today&apos;s tip</Link><Link className="btn ghost" href="/how-to">Browse by appliance</Link></div>
          </div>
          <Link href={`/tips/${today.slug}`} className="today">
            <span className="tag light">Today</span>
            <strong>{today.displayName}</strong>
            <p>{today.answer}</p>
            <span className="more">Show me how →</span>
          </Link>
        </div>
      </section>
      <div className="wrap">
        <aside className="safety-strip"><b>Safety first:</b> {SAFETY_RULE}</aside>
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
