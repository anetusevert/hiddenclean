import Link from "next/link";
import { prettyDate, type Tip } from "@/lib/tips";
export function TipCard({ tip }: { tip: Tip }) {
  return (
    <Link href={`/tips/${tip.slug}`} className="card">
      <span className="tag">{tip.hubs[0].label}</span>
      <strong>{tip.displayName}</strong>
      <span className="phrase">{tip.title}</span>
      <time dateTime={tip.date}>{prettyDate(tip.date)}</time>
    </Link>
  );
}
