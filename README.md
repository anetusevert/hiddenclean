# HiddenClean

One cleaning hack a day (bathrooms, stains, floors + occasional appliance secrets): www.hiddenclean.com. Next.js 16, deployed on Railway (Dockerfile).

- Tips: `lib/data.ts` (append at end; optional ISO date, else day after previous; gated by Europe/Berlin). Every tip needs a safety check.
- Mix: mostly general cleaning; ~1 appliance/secret-button tip per week — see `docs/CONTENT.md`.
- Hubs: `HUBS` in `lib/tips.ts` → `/how-to/<id>`.
- `npm run verify` (production) or `SITE_URL=http://localhost:3000 npm run verify`.
- `npm run indexnow -- /tips/new-slug` after a deploy.
- See `docs/SEO.md`.
