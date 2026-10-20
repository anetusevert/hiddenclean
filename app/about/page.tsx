import { pageAlternates } from "@/lib/seo";
import { SAFETY_RULE } from "@/lib/tips";
export const metadata = { title: "About HiddenClean and our safety rules", description: "Why HiddenClean exists and the safety rules every tip follows.", alternates: pageAlternates("/about") };
export default function About() {
  return (
    <div className="wrap page narrow">
      <h1>About HiddenClean</h1>
      <p className="lede">Your dishwasher, washer and oven have settings and filters most people never find. We publish one each morning, in plain steps.</p>
      <h2>Our safety rules</h2>
      <ul className="steps"><li>{SAFETY_RULE}</li><li>Bleach + ammonia makes chloramine gas. Bleach + vinegar or other acids makes chlorine gas. Bleach + rubbing alcohol makes chloroform.</li><li>Unplug or switch off at the mains before cleaning any appliance, and let hot parts cool.</li><li>Check your manual. If it says not to do something, follow the manual.</li></ul>
    </div>
  );
}
