# SEO on HiddenClean

Canonical host: **https://www.hiddenclean.com**. `hiddenclean.com` 301s to www (Cloudflare + `proxy.ts`). Add the Railway host to `REDIRECT_HOSTS` in `proxy.ts` only after the custom domain is live.

| Layer | URL | JSON-LD |
| --- | --- | --- |
| Tip pages | `/tips/<slug>` (slug = slugify(search phrase)) | HowTo, FAQPage, BreadcrumbList |
| Appliance hubs | `/how-to/<hub>` and `/how-to` | CollectionPage + ItemList, FAQPage, BreadcrumbList |
| Home, `/tips` | | ItemList / CollectionPage |

- Everything reads from `byNewest()`: only tips dated on or before today (Europe/Berlin). Future tips 404 and are linked nowhere.
- `title`/H1/slug use the plain search phrase; `displayName` is the catchy hook shown above the H1 and on cards.
- Every tip has a safety check plus the global rule (never mix products; bleach + ammonia/acids is toxic). `assertLibrary()` fails the build if one is missing.
- A hub goes live at 2 live tips.
- Discovery: `/sitemap.xml`, `/robots.txt`, `/llms.txt` (sections "Find by task" and "Tips"), `/llms-full.txt`, IndexNow (`scripts/indexnow.mjs`, key file in `public/`).
- Verify: `npm run verify` checks 200s, www canonicals, one H1 matching the slug, JSON-LD types, answer + safety blocks, llms coverage, and future-tip leaks.
