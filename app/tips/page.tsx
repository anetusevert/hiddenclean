import { TipCard } from "@/components/TipCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, collectionLd, pageAlternates } from "@/lib/seo";
import { byNewest, SITE_URL } from "@/lib/tips";
export const revalidate = 3600;
export const metadata = { title: "All cleaning tips", description: "Every HiddenClean tip, newest first.", alternates: pageAlternates("/tips") };
export default function Tips() {
  const tips = byNewest();
  return (
    <div className="wrap page">
      <JsonLd data={collectionLd({ name: "All HiddenClean tips", url: `${SITE_URL}/tips`, description: "Every tip, newest first.", items: tips.map((t) => ({ name: t.title, url: `${SITE_URL}/tips/${t.slug}` })) })} />
      <JsonLd data={breadcrumbLd([{ name: "Home", url: SITE_URL }, { name: "Tips", url: `${SITE_URL}/tips` }])} />
      <h1>All cleaning tips</h1>
      <p className="lede">{tips.length} cleaning hacks — bathrooms, stains, floors and appliance secrets. A new one every morning.</p>
      <div className="grid">{tips.map((t) => <TipCard key={t.slug} tip={t} />)}</div>
    </div>
  );
}
