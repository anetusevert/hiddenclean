// HiddenClean short script builder. Usage: node script.mjs <n|slug>
// Reads the live tip from ../lib/tips.ts (ALL_TIPS) and the video spec from specs/<slug>.json,
// writes scripts/<slug>.json and prints the ElevenLabs prompt (voice.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
const dir = path.dirname(fileURLToPath(import.meta.url));
const MAX_WORDS = 75;
export const CTA_SAY = "Daily hidden cleaning hacks, at hiddenclean dot com.";
const BANNED = [/\bmix(ed|ing)?\b/i, /\bbleach\b/i, /bleach.*(vinegar|ammonia)|(vinegar|ammonia).*bleach/i, /\bcombine\b/i];
export async function loadTips() {
  const out = path.join(dir, ".cache", `tips-${process.pid}.mjs`); fs.mkdirSync(path.dirname(out), { recursive: true });
  await build({ entryPoints: [path.join(dir, "..", "lib", "tips.ts")], bundle: true, platform: "node", format: "esm", outfile: out, logLevel: "error" });
  const m = await import(pathToFileURL(out).href); fs.rmSync(out, { force: true }); return m.ALL_TIPS;
}
export async function buildScript(arg) {
  const tips = await loadTips();
  const i = tips.findIndex((t, k) => String(k + 1) === String(arg) || t.slug === arg);
  if (i < 0) throw new Error(`No tip "${arg}"`);
  const tip = tips[i]; const n = i + 1;
  const specPath = path.join(dir, "specs", `${tip.slug}.json`);
  if (!fs.existsSync(specPath)) throw new Error(`No spec ${path.relative(dir, specPath)}. See VIDEO.md.`);
  const v = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const pieces = [
    { beat: "hook", say: v.hook, text: v.hook, label: v.hookLabel ?? "HIDDEN SETTING" },
    { beat: "do", say: `${v.doLead ?? "Here's the hidden setting."} ${v.doThis}`, text: v.doText ?? v.doThis },
    ...v.steps.map((s, k) => ({ beat: "steps", say: s.say, text: s.text ?? s.say, step: k + 1, scene: s.scene, point: s.point })),
    ...(v.safety ? [{ beat: "safety", say: v.safety.say, text: v.safety.text }] : []),
    { beat: "result", say: v.result.say, text: v.result.headline, result: v.result },
    { beat: "cta", say: CTA_SAY, text: "Daily hidden cleaning hacks" },
  ];
  const tags = { hook: "[playful]", do: "[intrigued]", steps: "[friendly]", safety: "[friendly]", result: "[delighted]", cta: "[warm]" };
  const beats = []; for (const p of pieces) { const b = beats.at(-1); if (b && tags[b.beat] === tags[p.beat]) b.text += ` ${p.say}`; else beats.push({ beat: p.beat, text: p.say }); }
  const all = pieces.map((p) => p.say).join(" "); const words = all.split(/\s+/).length; const warn = [];
  if (words > MAX_WORDS) warn.push(`VO is ${words} words (> ${MAX_WORDS})`);
  const hw = v.hook.split(/\s+/).length; if (hw < 5 || hw > 12) warn.push(`hook is ${hw} words (want 5-12)`);
  if (!v.safety) warn.push("no safety line: add one unless the tip truly needs none");
  // Safety rule: no sentence may suggest mixing/combining products. Warning sentences (never/don't/no/not) are allowed.
  for (const sent of all.match(/[^.!?]+[.!?]*/g) ?? []) { if (/\b(never|don't|do not|no|not)\b/i.test(sent)) continue;
    for (const re of BANNED) if (re.test(sent)) throw new Error(`Safety: "${sent.trim()}" matches ${re} (never suggest mixing chemicals)`); }
  if (v.steps.length < 2 || v.steps.length > 4) warn.push(`${v.steps.length} steps (want 2-4)`);
  return { key: tip.slug, n, slug: tip.slug, title: tip.title, appliance: v.appliance ?? "dishwasher", revealAt: v.revealAt ?? "part", url: `https://www.hiddenclean.com/tips/${tip.slug}`,
    pieces, words, warn, elevenlabsPrompt: beats.map((b) => `${tags[b.beat]} ${b.text}`).join("\n\n") };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2]; if (!arg) { console.error("Usage: node script.mjs <n|slug>"); process.exit(1); }
  const s = await buildScript(arg); fs.mkdirSync(path.join(dir, "scripts"), { recursive: true });
  fs.writeFileSync(path.join(dir, "scripts", `${s.key}.json`), JSON.stringify(s, null, 2) + "\n");
  for (const w of s.warn) console.warn(`⚠ ${w}`);
  console.log(`Wrote scripts/${s.key}.json (${s.words} words). VO file: public/vo/${s.key}.mp3\n\nElevenLabs prompt (voice.json):\n\n${s.elevenlabsPrompt}`);
}
