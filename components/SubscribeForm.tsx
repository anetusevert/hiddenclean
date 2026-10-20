export const BEEHIIV_URL = "https://hiddenclean.beehiiv.com";
export default function SubscribeForm({ compact = false }: { compact?: boolean }) {
  return (
    <form className={compact ? "subform compact" : "subform"} action={`${BEEHIIV_URL}/subscribe`} method="get" target="_blank">
      <label htmlFor={compact ? "sub-email-c" : "sub-email"} className="sr">Email address</label>
      <input id={compact ? "sub-email-c" : "sub-email"} type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
      <button type="submit">Get the daily hack</button>
    </form>
  );
}
