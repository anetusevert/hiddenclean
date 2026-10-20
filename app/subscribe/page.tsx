import { pageAlternates } from "@/lib/seo";
export const metadata = { title: "Get one hidden cleaning hack a day", description: "Subscribe to the HiddenClean daily email.", alternates: pageAlternates("/subscribe") };
export default function Subscribe() {
  return (
    <div className="wrap page narrow">
      <h1>Get one hidden cleaning hack a day</h1>
      <p className="lede">The daily email is launching soon. One tip, one minute, every morning.</p>
    </div>
  );
}
