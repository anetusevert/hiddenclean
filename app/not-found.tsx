import Link from "next/link";
export default function NotFound() {
  return <div className="wrap page narrow"><h1>That page is still hidden</h1><p><Link href="/tips">See all tips</Link></p></div>;
}
