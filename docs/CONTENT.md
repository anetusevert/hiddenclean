# HiddenClean content mix

**Approved by Utena 2026-10-25.** Do not drift back to appliance-only.

## Mix rule
- **Most tips are general cleaning hacks:** bathrooms, floors, stains, kitchen surfaces, bedding, everyday messes.
- **About 1 appliance / secret-button tip per week** stays as the brand signature (hidden filter, self-clean mode, button combo).
- Rough weekly shape for the daily pipeline (site tip + Buffer video): **6 general, 1 appliance**.

## Voice
- Young, modern, human. Punchy first line. No corporate filler.
- Every tip needs a real **safety** line. Never suggest mixing products (bleach + ammonia/acids, etc.). `assertLibrary()` and `script.mjs` enforce this.
- Prefer one product at a time; unplug appliances; follow the manual/label.

## Where tips live
- Append rows at the end of `lib/data.ts`. Optional 7th field = `YYYY-MM-DD` to publish on a set day; otherwise the tip gets the day after the previous tip.
- Site pages, `/tips.json`, `/llms.txt`, sitemap and RSS all read from `byNewest()` (Europe/Berlin date gate).
- Videos: see `video/VIDEO.md`. Same mix rule — general footage/hooks first, appliance reveals about once a week.
