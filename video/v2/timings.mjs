// node v2/timings.mjs <slug...> : align original v2 VO, print piece durations (s). Cached in .cache/align-<slug>.json
import { spawnSync } from "node:child_process"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { buildScript } from "../script.mjs";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CFG = JSON.parse(fs.readFileSync(path.join(dir, "v2/config.json"), "utf8"));
export async function original(slug) {
  const cfg = CFG[slug]; const s = await buildScript(slug); if (cfg.hookSay) { s.pieces[0].say = cfg.hookSay; s.pieces[0].text = cfg.hookSay; }
  const vo = path.join(dir, "public/vo", cfg.vo ?? `${s.key}.mp3`);
  const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo], { encoding: "utf8" }).stdout);
  const cache = path.join(dir, ".cache", `align-${slug}.json`); fs.mkdirSync(path.dirname(cache), { recursive: true });
  let al; if (fs.existsSync(cache)) al = JSON.parse(fs.readFileSync(cache, "utf8")); else {
    const r = spawnSync("/home/box/whisper-venv/bin/python", [path.join(dir, "align.py"), vo, JSON.stringify(s.pieces.map((p) => p.say))], { encoding: "utf8" });
    al = JSON.parse(r.stdout.trim().split("\n").at(-1)); fs.writeFileSync(cache, JSON.stringify(al)); }
  // piece end = last caption word end of that piece (+0.12s), so cuts don't keep trailing silence
  const ends = s.pieces.map((_, i) => Math.min(dur, Math.max(...al.words.filter((w) => w.p === i).map((w) => w.e)) + 0.12));
  return { s, cfg, vo, dur, al, ends };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const slug of process.argv.slice(2)) { const o = await original(slug);
    console.log(slug, o.dur.toFixed(1), o.s.pieces.map((p, i) => `${p.beat[0]}${p.step ?? ""}:${(o.ends[i] - o.al.starts[i]).toFixed(1)}`).join(" ")); }
}
