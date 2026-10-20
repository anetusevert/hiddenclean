// Ping IndexNow (Bing, Yandex, Seznam, Naver) after a deploy. URLs are always on www.
//
//   node scripts/indexnow.mjs                    # every URL in the live sitemap
//   node scripts/indexnow.mjs /tips/new-slug     # just these paths (new or changed pages)
//   node scripts/indexnow.mjs --file urls.txt    # one URL or path per line, e.g. old URLs that now 301
const KEY = "3f87d8c8e68a37ab5bf1c371be99fef7";
const site = "https://www.hiddenclean.com";
const argv = process.argv.slice(2);
let urlList = [];
const fileAt = argv.indexOf("--file");
if (fileAt >= 0) {
  const fs = await import("node:fs");
  urlList.push(...fs.readFileSync(argv[fileAt + 1], "utf8").split("\n").map((l) => l.trim()).filter(Boolean));
}
urlList.push(...argv.filter((a, i) => !a.startsWith("--") && (fileAt < 0 || i !== fileAt + 1)));
if (!urlList.length) {
  const xml = await (await fetch(site + "/sitemap.xml")).text();
  urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}
urlList = [...new Set(urlList.map((u) => (u.startsWith("http") ? u : site + u)))];
const bad = urlList.filter((u) => !u.startsWith(site));
if (bad.length) throw new Error(`Only www URLs can be submitted: ${bad.join(", ")}`);
for (let i = 0; i < urlList.length; i += 10000) {
  const batch = urlList.slice(i, i + 10000);
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: batch }),
  });
  console.log("IndexNow", r.status, r.statusText, batch.length, "urls", (await r.text()).slice(0, 200));
}
