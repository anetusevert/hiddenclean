import { byNewest, liveHubs, hubTips, SITE_DESC, SITE_NAME, SITE_URL, SAFETY_RULE } from "./tips";
import { guideTips, liveGuides } from "./guides";

export function llmsTxt() {
  const tips = byNewest();
  return [
    `# ${SITE_NAME}`, "", `> ${SITE_DESC}`, "", `Safety rule on every tip: ${SAFETY_RULE}`, "",
    "## Routines and checklists", ...liveGuides().map((g) => `- ${SITE_URL}/how-to/${g.id}: ${g.title} (${g.displayName}). ${g.answer}`), "",
    "## Find by task", ...liveHubs().map((h) => `- ${SITE_URL}/how-to/${h.id}: ${h.title}. ${h.intro} (${hubTips(h).length} tips)`), "",
    "## Tips", ...tips.map((t) => `- ${SITE_URL}/tips/${t.slug}: ${t.searchPhrase} - ${t.answer}`), "",
    "## More", `- Full text: ${SITE_URL}/llms-full.txt`, `- JSON for agents: ${SITE_URL}/tips.json`, `- RSS: ${SITE_URL}/feed.xml`, `- Videos: https://www.tiktok.com/@hiddenclean.tips and https://www.instagram.com/hiddenclean.hacks`, `- Sitemap: ${SITE_URL}/sitemap.xml`, "",
  ].join("\n");
}

export function llmsFullTxt() {
  return [`# ${SITE_NAME}: every live tip in full`, "", `> ${SITE_DESC}`, "",
    "## Find by task", ...liveHubs().map((h) => `- ${SITE_URL}/how-to/${h.id}: ${h.title}. ${h.intro}`), "",
    ...liveGuides().flatMap((g) => [
      `## ${g.title} (${g.displayName})`, `URL: ${SITE_URL}/how-to/${g.id}`, `Published: ${g.date}`, `Answer: ${g.answer}`,
      ...g.sections.flatMap((s) => [`### ${s.title}${s.minutes ? ` (${s.minutes} min)` : ""}`, ...s.items.map((it) => `- ${it.text}${it.tip && guideTips(g).some((t) => t.slug === it.tip) ? ` (${SITE_URL}/tips/${it.tip})` : ""}`)]),
      ...g.faq.map((f) => `- FAQ: ${f.q} ${f.a}`), "",
    ]),
    ...byNewest().flatMap((t) => [
      `## ${t.title}`, `URL: ${SITE_URL}/tips/${t.slug}`, `Published: ${t.date}`, `Search phrase: ${t.searchPhrase}`,
      `Answer: ${t.answer}`, "Steps:", ...t.steps.map((s, i) => `${i + 1}. ${s}`),
      `Safety check: ${t.safety} ${SAFETY_RULE}`, ...t.faq.map((f) => `- FAQ: ${f.q} ${f.a}`), "",
    ]),
  ].join("\n");
}
