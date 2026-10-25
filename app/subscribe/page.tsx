import { pageAlternates } from "@/lib/seo";
import SubscribeForm, { BEEHIIV_URL } from "@/components/SubscribeForm";
export const metadata = { title: "Get one cleaning hack a day", description: "Subscribe to the free HiddenClean daily email: one cleaning hack every morning.", alternates: pageAlternates("/subscribe") };
export default function Subscribe() {
  return (
    <div className="wrap page narrow">
      <div className="subcard">
        <p className="kicker">Free daily email</p>
        <h1>Get one cleaning hack a day</h1>
        <p className="lede">One tip, one minute, every morning. Bathrooms, stains, floors and the odd appliance secret, each with a safety check.</p>
        <SubscribeForm />
        <ul className="subperks"><li>✓ Free, unsubscribe anytime</li><li>✓ No spam, one email a day</li><li>✓ Safe, tested methods only</li></ul>
        <p className="subnote">You&apos;ll finish signing up on our newsletter page at <a href={BEEHIIV_URL} target="_blank" rel="noopener">hiddenclean.beehiiv.com</a>.</p>
      </div>
    </div>
  );
}
