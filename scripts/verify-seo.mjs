// Checks the live site against the SEO baseline in docs/SEO.md.
//
//   node scripts/verify-seo.mjs                      # every URL in the sitemap, on https://www.hiddenclean.com
//   SITE_URL=http://localhost:3000 node scripts/verify-seo.mjs
//   node scripts/verify-seo.mjs /tips/some-slug /how-to/best-iphone-battery-tips   # only these paths
//
// For each page: 200 with no redirect, canonical on the www host, one H1, the H1 matches the slug
// for tip/how-to/compare/alternatives pages, no noindex, every JSON-LD block parses, and the expected
// schema types (including FAQPage) are there. Every /tips/ link on a how-to, compare or alternatives
// page must return 200, which catches a future tip leaking onto a published page.
// It also checks the sitemap and robots point at www, that tip, task, compare and alternatives URLs
// are in llms.txt and llms-full.txt, and that a sample of old URLs 301 to a 200.
// Exits 1 on any failure.

const CANONICAL = "https://www.hiddenclean.com";
const site = (process.env.SITE_URL || CANONICAL).replace(/\/$/, "");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const failures = [];
const tipLinks = new Set();
const fail = (url, msg) => failures.push(`${url}: ${msg}`);

const normalize = (s) => s.toLowerCase().replace(/wi-fi/g, "wifi").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const slugify = (s) => normalize(s).replace(/ /g, "-");
const decode = (s) =>
  s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

function expectedTypes(path) {
  if (path.startsWith("/tips/")) return ["HowTo", "FAQPage", "BreadcrumbList"];
  if (path.startsWith("/how-to/")) return ["CollectionPage", "ItemList", "FAQPage", "BreadcrumbList"];
  if (path.startsWith("/compare/") || path.startsWith("/alternatives/")) return ["ItemList", "FAQPage", "BreadcrumbList"];
  if (path === "/how-to" || path === "/compare") return ["CollectionPage", "ItemList", "BreadcrumbList"];
  if (["/iphone", "/android", "/mac", "/windows", "/chrome"].includes(path) || path.startsWith("/categories/") || path.startsWith("/apps/"))
    return ["CollectionPage", "ItemList", "BreadcrumbList"];
  return [];
}

function collectTypes(node, out) {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out));
  if (!node || typeof node !== "object") return;
  const t = node["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) t.forEach((x) => out.add(x));
  for (const value of Object.values(node)) if (value && typeof value === "object") collectTypes(value, out);
}

async function checkPage(path) {
  const url = site + path;
  let res;
  try {
    res = await fetch(url, { redirect: "manual", headers: { "user-agent": "hiddenclean-verify" } });
  } catch (e) {
    return fail(path, `fetch failed: ${e.message}`);
  }
  if (res.status !== 200) return fail(path, `status ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`);
  const html = await res.text();
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1]));
  if (h1s.length !== 1) fail(path, `expected one H1, found ${h1s.length}`);
  const h1 = h1s[0] ?? "";
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 2) {
    const h = slugify(h1);
    // Tips: slug is the H1. Comparisons: the H1 starts with the a-vs-b slug. Task hubs drop a leading "how-to-". Alternatives pages: "<slug> alternatives ...".
    if (seg[0] === "tips" && h !== seg[1]) fail(path, `H1 "${h1}" does not match the slug`);
    if (seg[0] === "compare" && !h.startsWith(seg[1])) fail(path, `H1 "${h1}" does not start with the slug`);
    if (seg[0] === "how-to" && h.replace(/^how-to-/, "") !== seg[1]) fail(path, `H1 "${h1}" does not match the slug`);
    if (seg[0] === "alternatives" && !h.startsWith(`${seg[1]}-alternatives`)) fail(path, `H1 "${h1}" does not match the slug`);
  }
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const wantCanonical = CANONICAL + (path === "/" ? "" : path);
  if (canonical !== wantCanonical && canonical !== wantCanonical + "/") fail(path, `canonical ${canonical ?? "missing"}, want ${wantCanonical}`);
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) fail(path, "in the sitemap but marked noindex");
  const types = new Set();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const [, raw] of blocks) {
    try {
      collectTypes(JSON.parse(raw), types);
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
    }
  }
  for (const t of expectedTypes(path)) if (!types.has(t)) fail(path, `missing JSON-LD ${t}`);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (seg[0] === "tips" && seg.length === 2) {
    if (!title.startsWith(h1)) fail(path, `title "${title}" does not start with the H1`);
    if (!decode(desc).startsWith(h1)) fail(path, "meta description does not use the H1 phrase");
    if (!/class="answer"/.test(html)) fail(path, "no answer block");
    if (!/class="safety"/.test(html)) fail(path, "no safety check block");
  }
  if (["how-to", "compare", "alternatives"].includes(seg[0])) {
    for (const href of new Set([...html.matchAll(/href="(\/tips\/[^"#?]+)"/g)].map((m) => m[1]))) tipLinks.add(href);
  }
  return { path, h1, types: [...types] };
}

async function checkRedirect(from, host) {
  const url = (host ? `https://${host}` : site) + from;
  const res = await fetch(url, { redirect: "manual" }).catch((e) => ({ status: 0, error: e }));
  const loc = res.headers?.get("location");
  if (res.status !== 301 || !loc) return fail(url, `expected 301, got ${res.status}`);
  const target = new URL(loc, url).toString();
  if (!host && !target.startsWith(CANONICAL) && site === CANONICAL) fail(url, `redirects off www: ${target}`);
  const end = await fetch(target, { redirect: "manual" });
  if (end.status !== 200) fail(url, `301 target ${target} returned ${end.status}`);
  return `${url} -> ${target}`;
}

async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const item = items[i++];
        out.push(await fn(item));
      }
    }),
  );
  return out;
}

const robots = await (await fetch(site + "/robots.txt")).text();
if (!robots.includes(`Sitemap: ${CANONICAL}/sitemap.xml`)) fail("/robots.txt", "Sitemap line does not point at www");
const xml = await (await fetch(site + "/sitemap.xml")).text();
const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) if (!loc.startsWith(CANONICAL)) fail("/sitemap.xml", `non-www URL ${loc}`);
const llms = await (await fetch(site + "/llms.txt")).text();
const llmsFull = await (await fetch(site + "/llms-full.txt")).text();
for (const section of ["## Find by task", "## Tips"]) if (!llms.includes(section)) fail("/llms.txt", `missing section ${section}`);
if (!llmsFull.includes("- FAQ:")) fail("/llms-full.txt", "no FAQ lines");

const paths = args.length ? args : locs.map((loc) => loc.slice(CANONICAL.length) || "/");
for (const path of paths) {
  if (!args.length) continue;
  if (!locs.includes(CANONICAL + (path === "/" ? "" : path))) fail(path, "not in sitemap.xml");
}
for (const path of paths) {
  if (/^\/(tips|how-to|compare|alternatives)\//.test(path)) {
    if (!llms.includes(CANONICAL + path + ":") && !llms.includes(CANONICAL + path + "\n")) fail(path, "not in llms.txt");
    if (!llmsFull.includes(CANONICAL + path)) fail(path, "not in llms-full.txt");
  }
}
const results = (await pool(paths, 6, checkPage)).filter(Boolean);
// No future (or missing) tip may be linked from a published hub, compare or alternatives page.
await pool([...tipLinks], 6, async (href) => {
  const res = await fetch(site + href, { redirect: "manual" });
  if (res.status !== 200) fail(href, `linked from a hub/compare page but returned ${res.status}`);
  if (!locs.includes(CANONICAL + href)) fail(href, "linked from a hub/compare page but not in the sitemap");
});

const redirects = [];
if (site === CANONICAL && (!args.length || process.argv.includes("--redirects"))) {
  redirects.push(await checkRedirect("/tips", "hiddenclean.com"));
}

const byKind = {};
for (const r of results) {
  if (!r || typeof r !== "object") continue;
  const kind = r.path === "/" ? "home" : r.path.split("/")[1];
  byKind[kind] = (byKind[kind] ?? 0) + 1;
}
console.log(`Checked ${results.length} pages on ${site}:`, JSON.stringify(byKind));
console.log(`Checked ${tipLinks.size} tip links from how-to, compare and alternatives pages.`);
for (const r of redirects.filter(Boolean)) console.log("301", r);
if (failures.length) {
  console.log(`\n${failures.length} problem(s):`);
  for (const f of failures) console.log(" -", f);
  process.exit(1);
}
console.log("All good.");
