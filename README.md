# HiddenClean

One hidden cleaning hack a day: www.hiddenclean.com. Next.js 16, deployed on Railway (Dockerfile).

- Tips: `lib/data.ts` (one line per tip, dated in order from `START`, gated by Europe/Berlin date). Every tip needs a safety check.
- Hubs: `HUBS` in `lib/tips.ts` → `/how-to/<id>`.
- `npm run verify` (production) or `SITE_URL=http://localhost:3000 npm run verify`.
- `npm run indexnow -- /tips/new-slug` after a deploy.
- See `docs/SEO.md`.
