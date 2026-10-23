import { byNewest, liveHubs, hubTips, SITE_DESC, SITE_NAME, SITE_URL, SAFETY_RULE } from "./tips";

export function llmsTxt() {
  const tips = byNewest();
  return [
    `# ${SITE_NAME}`, "", `> ${SITE_DESC}`, "", `Safety rule on every tip: ${SAFETY_RULE}`, "",
    "## Find by task", ...liveHubs().map((h) => `- ${SITE_URL}/how-to/${h.id}: ${h.title}. ${h.intro} (${hubTips(h).length} tips)`), "",
    "## Tips", ...tips.map((t) => `- ${SITE_URL}/tips/${t.slug}: ${t.searchPhrase} - ${t.answer}`), "",
    "## More", `- Full text: ${SITE_URL}/llms-full.txt`, `- JSON for agents: ${SITE_URL}/tips.json`, `- RSS: ${SITE_URL}/feed.xml`, `- Videos: https://www.tiktok.com/@hiddenclean.tips and https://www.instagram.com/hiddenclean.hacks`, `- Sitemap: ${SITE_URL}/sitemap.xml`, "",
  ].join("\n");
}

export function llmsFullTxt() {
  return [`# ${SITE_NAME}: every live tip in full`, "", `> ${SITE_DESC}`, "",
    "## Find by task", ...liveHubs().map((h) => `- ${SITE_URL}/how-to/${h.id}: ${h.title}. ${h.intro}`), "",
    ...byNewest().flatMap((t) => [
      `## ${t.title}`, `URL: ${SITE_URL}/tips/${t.slug}`, `Published: ${t.date}`, `Search phrase: ${t.searchPhrase}`,
      `Answer: ${t.answer}`, "Steps:", ...t.steps.map((s, i) => `${i + 1}. ${s}`),
      `Safety check: ${t.safety} ${SAFETY_RULE}`, ...t.faq.map((f) => `- FAQ: ${f.q} ${f.a}`), "",
    ]),
  ].join("\n");
}
