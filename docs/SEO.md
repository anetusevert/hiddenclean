# SEO on HiddenClean

Canonical host: **https://www.hiddenclean.com**. `hiddenclean.com` 301s to www (Cloudflare + `proxy.ts`). Add the Railway host to `REDIRECT_HOSTS` in `proxy.ts` only after the custom domain is live.

| Layer | URL | JSON-LD |
| --- | --- | --- |
| Tip pages | `/tips/<slug>` (slug = slugify(search phrase)) | HowTo, FAQPage, BreadcrumbList |
| Topic hubs (rooms, stains, appliances) | `/how-to/<hub>` and `/how-to` | CollectionPage + ItemList, FAQPage, BreadcrumbList |
| Home, `/tips` | | ItemList / CollectionPage |

- Everything reads from `byNewest()`: only tips dated on or before today (Europe/Berlin). Future tips 404 and are linked nowhere.
- `title`/H1/slug use the plain search phrase; `displayName` is the catchy hook shown above the H1 and on cards.
- Every tip has a safety check plus the global rule (never mix products; bleach + ammonia/acids is toxic). `assertLibrary()` fails the build if one is missing.
- A hub goes live at 2 live tips.
- Share images: `/og/<slug>` renders a 1200x630 card per live tip (hook, hub, steps; the short's still if there is one). It is og:image #1, twitter:image and HowTo.image; future tips 404. Fonts in `public/fonts` (OFL).
- Sitemap carries image entries for every tip and a video entry (title, thumbnail, mp4, real duration from `sec` in `lib/videos.ts`, publication date) for tips with a live short. Set `sec` (ffprobe, rounded) when adding a short.
- Discovery: `/sitemap.xml`, `/robots.txt`, `/llms.txt` (sections "Find by task" and "Tips"), `/llms-full.txt`, IndexNow (`scripts/indexnow.mjs`, key file in `public/`).
- Verify: `npm run verify` checks 200s, www canonicals, one H1 matching the slug, JSON-LD types, answer + safety blocks, llms coverage, and future-tip leaks.
- Editorial mix (general hacks vs appliance secrets): `docs/CONTENT.md`.
