import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { TipCard } from "@/components/TipCard";
import { breadcrumbLd, collectionLd, faqLd } from "@/lib/seo";
import { guideTips, liveGuides, type Guide } from "@/lib/guides";
import { byNewest, SAFETY_RULE, SITE_NAME, SITE_URL } from "@/lib/tips";

export function GuidePage({ guide }: { guide: Guide }) {
  const url = `${SITE_URL}/how-to/${guide.id}`;
  const live = new Set(byNewest().map((t) => t.slug));
  const tips = guideTips(guide);
  const others = liveGuides().filter((g) => g.id !== guide.id);
  const checklist = guide.kind === "checklist";
  const howTo = {
    "@context": "https://schema.org", "@type": "HowTo", name: guide.displayName, description: guide.answer, url,
    datePublished: guide.date, inLanguage: "en", totalTime: `PT${guide.minutes}M`, image: `${SITE_URL}/og.png`,
    publisher: { "@id": `${SITE_URL}/#org` }, isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(guide.supplies ? { supply: guide.supplies.map((s) => ({ "@type": "HowToSupply", name: s })) } : {}),
    step: guide.sections.map((s, i) => ({
      "@type": "HowToSection", position: i + 1, name: s.minutes ? `${s.title} (${s.minutes} min)` : s.title,
      itemListElement: s.items.map((it, j) => ({ "@type": "HowToStep", position: j + 1, text: it.text, url: `${url}#s${i + 1}` })),
    })),
  };
  return (
    <article className={`wrap page tip guide${checklist ? " checklist-page" : ""}`}>
      {guide.kind !== "list" && <JsonLd data={howTo} />}
      <JsonLd data={collectionLd({ name: guide.title, url, description: guide.intro, items: tips.map((t) => ({ name: t.title, url: `${SITE_URL}/tips/${t.slug}` })) })} />
      <JsonLd data={faqLd(guide.faq)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: SITE_URL }, { name: "How to", url: `${SITE_URL}/how-to` }, { name: guide.title, url }])} />
      <header>
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/how-to">How to</Link></nav>
        <p className="display">{guide.displayName}</p>
        <h1>{guide.title}</h1>
        <p className="meta">{guide.kind === "list" ? `${tips.length} hidden settings and filters` : `${guide.minutes} min${checklist ? " a day" : ""} · ${guide.sections.length} ${checklist ? "days" : "stages"}`} · {SITE_NAME}</p>
      </header>
      <p className="lede">{guide.intro}</p>
      <div className="answer"><b>Quick answer</b><p>{guide.answer}</p></div>
      <div className="safety" role="note"><b>⚠ Safety check</b><p className="rule">{SAFETY_RULE}</p></div>
      {guide.supplies && (<><h2>You&apos;ll need</h2><ul className="supplies">{guide.supplies.map((s) => <li key={s}>{s}</li>)}</ul></>)}
      {checklist && <p className="print-hint no-print">Printable: use your browser&apos;s Print (Ctrl+P / Cmd+P). Links and menus drop away and you get tick boxes.</p>}
      {guide.sections.map((s, i) => (
        <section key={s.title} id={`s${i + 1}`} className="guide-sec">
          <h2>{checklist ? "" : `${i + 1}. `}{s.title}{s.minutes ? <span className="h-sub"> {s.minutes} min</span> : null}</h2>
          <ul className={checklist ? "checklist" : "guide-steps"}>
            {s.items.map((it) => (
              <li key={it.text}>
                {checklist && <span className="box" aria-hidden="true" />}
                <span>{it.text}{" "}
                  {it.tip && live.has(it.tip) && <Link className="how no-print" href={`/tips/${it.tip}`}>How →</Link>}
                  {it.guide && <Link className="how no-print" href={`/how-to/${it.guide}`}>Open the routine →</Link>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h2>FAQ</h2>
      <div className="faq">{guide.faq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
      <div className="no-print">
        <h2>Every tip in this guide</h2>
        <div className="grid">{tips.map((t) => <TipCard key={t.slug} tip={t} />)}</div>
        {others.length > 0 && (<><h2>More cleaning routines</h2><div className="hubs">{others.map((g) => <Link key={g.id} href={`/how-to/${g.id}`} className="hub"><strong>{g.displayName}</strong><span>{g.title}</span></Link>)}</div></>)}
      </div>
    </article>
  );
}
