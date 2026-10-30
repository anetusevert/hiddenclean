import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { hubTips, liveHubs, SITE_URL } from "@/lib/tips";
import { liveGuides } from "@/lib/guides";
export const revalidate = 3600;
export const metadata = { title: "Cleaning guides by room and task", description: "Cleaning hacks grouped by bathroom, floors, stains, kitchen and appliances.", alternates: pageAlternates("/how-to") };
export default function HowTo() {
  const hubs = liveHubs();
  const guides = liveGuides();
  return (
    <div className="wrap page">
      <JsonLd data={collectionLd({ name: "Cleaning guides by room and task", url: `${SITE_URL}/how-to`, description: "Hubs", items: [...guides.map((g) => ({ name: g.title, url: `${SITE_URL}/how-to/${g.id}` })), ...hubs.map((h) => ({ name: h.title, url: `${SITE_URL}/how-to/${h.id}` }))] })} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: SITE_URL }, { name: "How to", url: `${SITE_URL}/how-to` }])} />
      <h1>Cleaning guides by room and task</h1>
      <p className="lede">Bathrooms, floors, stains and kitchens — plus the secret settings on appliances you already own.</p>
      <h2>Quick cleaning routines and checklists</h2>
      <div className="hubs">{guides.map((g) => <Link key={g.id} href={`/how-to/${g.id}`} className="hub"><strong>{g.displayName}</strong><span>{g.title}</span></Link>)}</div>
      <h2>By room and appliance</h2>
      <div className="hubs">{hubs.map((h) => <Link key={h.id} href={`/how-to/${h.id}`} className="hub"><strong>{h.title}</strong><span>{h.intro} · {hubTips(h).length} tips</span></Link>)}</div>
    </div>
  );
}
