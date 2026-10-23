// node v2/build.mjs <slug> [--dry] : v2 footage short. Reuses VO (optional spliced hook), whisper re-timing, shots from v2/config.json.
import { spawnSync } from "node:child_process"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { buildScript } from "../script.mjs";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); const FPS = 30, LEAD = 0.15, OUTRO = 3.2;
const slug = process.argv[2]; const cfg = JSON.parse(fs.readFileSync(path.join(dir, "v2/config.json"), "utf8"))[slug]; if (!cfg) throw new Error("no config for " + slug);
const s = await buildScript(slug); if (cfg.hookSay) { s.pieces[0].say = cfg.hookSay; s.pieces[0].text = cfg.hookSay; }
for (const p of s.pieces) if (/\b(mix|mixing|combine)\b/i.test(p.say) && !/\b(never|don't|no|not)\b/i.test(p.say)) throw new Error("safety: " + p.say);
if (!s.pieces.some((p) => p.beat === "safety")) throw new Error("missing safety piece");
const vo = path.join(dir, "public/vo", cfg.vo ?? `${s.key}.mp3`); const key = "v2-" + s.key;
const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo], { encoding: "utf8" }).stdout);
const voNorm = path.join(dir, "public/vo/.norm", `${key}.wav`); fs.mkdirSync(path.dirname(voNorm), { recursive: true });
spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", vo, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", voNorm]);
const r = spawnSync(process.env.WHISPER_PY ?? "/home/box/whisper-venv/bin/python", [path.join(dir, "align.py"), vo, JSON.stringify(s.pieces.map((p) => p.say))], { encoding: "utf8" });
const al = JSON.parse(r.stdout.trim().split("\n").at(-1)); const f = (x) => Math.round(x * FPS);
const voStart = f(LEAD), voEnd = f(LEAD + dur);
const pieces = s.pieces.map((p, i) => ({ ...p, start: i === 0 ? voStart : voStart + f(al.starts[i]) }));
const words = al.words.map((w) => ({ w: w.w, p: w.p, s: voStart + f(w.s), e: voStart + f(w.e) }));
const total = voEnd + f(OUTRO); const cta = pieces.find((p) => p.beat === "cta").start;
// shots: split each piece into <=1.8s cuts, cycling its clip list
const shots = []; let stepN = 0;
pieces.forEach((p, i) => { if (p.beat === "cta") return; const key2 = p.beat === "steps" ? "s" + (++stepN) : p.beat; const list = cfg.clips[key2] ?? cfg.clips.result;
  const st = i === 0 ? 0 : p.start, en = pieces[i + 1].start; const n = Math.max(1, Math.ceil((en - st) / (1.8 * FPS)));
  const lastClean = p.beat === "steps" && pieces[i + 1].beat !== "steps";
  for (let k = 0; k < n; k++) { const e = list[k % list.length]; const [clip, ss] = e.split("@"); const a = st + Math.round(((en - st) * k) / n);
    shots.push({ from: a, clip: clip.startsWith("gfx:") ? undefined : clip, gfx: clip.startsWith("gfx:") ? clip.slice(4) : undefined,
      ss: f(Number(ss ?? 0) + Math.floor(k / list.length) * 1.6), sparkle: p.beat === "result" || (p.beat === "do" && k === 0) || (lastClean && k === n - 1) }); } });
shots.forEach((x, i) => (x.to = shots[i + 1]?.from ?? cta));
const props = { appliance: s.appliance, n: s.n, title: s.title, url: s.url, pieces, words, voStart, voEnd, total, voFile: `vo/.norm/${key}.wav`, hook: cfg.hook, shots };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${key}.props.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 1));
console.log(`${key}: VO ${dur.toFixed(2)}s total ${(total / FPS).toFixed(1)}s shots ${shots.length} max ${Math.max(...shots.map((x) => x.to - x.from)) / FPS}s`, pieces.map((p) => `${p.beat}@${(p.start / FPS).toFixed(2)}`).join(" "));
if (process.argv.includes("--dry")) process.exit(0);
const out = `/workspace/hiddenclean/video-out/${key.replace(/^v2-how-to-|^v2-/, "v2-")}.mp4`;
const rr = spawnSync(path.join(dir, "node_modules/.bin/remotion"), ["render", "src/index.ts", "HiddenCleanV2", out, `--props=${pp}`, "--overwrite", "--concurrency=4", "--browser-executable=/usr/bin/google-chrome", "--gl=angle", "--log=error"], { cwd: dir, stdio: "inherit" });
console.log(rr.status === 0 ? `Rendered ${out}` : "render failed"); process.exit(rr.status ?? 1);
