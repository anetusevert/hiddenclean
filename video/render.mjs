// HiddenClean one-command render: node render.mjs <n|slug> [--out=/path.mp4] [--dry]
// Script from specs/ + lib/tips.ts, VO normalised to -16 LUFS, whisper word timing (align.py), renders HiddenCleanShort.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildScript } from "./script.mjs";
const dir = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30, INTRO = 0.7, OUTRO = 3.2; // intro = sparkle sting on the secret button; outro = CTA card + sting after the voice
const arg = process.argv[2]; if (!arg) { console.error("Usage: node render.mjs <n|slug> [--out=file.mp4]"); process.exit(1); }
const outArg = process.argv.find((a) => a.startsWith("--out="));
const s = await buildScript(arg); for (const w of s.warn) console.warn(`⚠ ${w}`);
const vo = path.join(dir, "public", "vo", `${s.key}.mp3`);
if (!fs.existsSync(vo)) { console.error(`Missing public/vo/${s.key}.mp3 (generate the VO first, see VIDEO.md)`); process.exit(1); }
const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vo], { encoding: "utf8" }).stdout);
const voNorm = path.join(dir, "public", "vo", ".norm", `${s.key}.wav`); fs.mkdirSync(path.dirname(voNorm), { recursive: true });
spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", vo, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", voNorm]);
const PY = process.env.WHISPER_PY ?? "/home/box/whisper-venv/bin/python";
const r = spawnSync(PY, [path.join(dir, "align.py"), vo, JSON.stringify(s.pieces.map((p) => p.say))], { encoding: "utf8" });
let al; try { al = JSON.parse(r.stdout.trim().split("\n").at(-1)); } catch { console.error("align.py failed:", r.stderr?.slice(-500)); process.exit(1); }
const f = (x) => Math.round(x * FPS);
const voStart = f(INTRO), voEnd = f(INTRO + dur);
const pieces = s.pieces.map((p, i) => ({ ...p, start: voStart + f(al.starts[i]) }));
const words = al.words.map((w) => ({ w: w.w, p: w.p, s: voStart + f(w.s), e: voStart + f(w.e) }));
const props = { n: s.n, title: s.title, url: s.url, pieces, words, voStart, voEnd, total: voEnd + f(OUTRO), voFile: `vo/.norm/${s.key}.wav` };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${s.key}.props.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 2));
console.log(`VO ${dur.toFixed(2)}s, total ${(props.total / FPS).toFixed(1)}s. Piece starts (s):`, pieces.map((p) => `${p.beat}@${(p.start / FPS).toFixed(2)}`).join(" "));
if (process.argv.includes("--dry")) process.exit(0);
const out = outArg ? path.resolve(outArg.slice(6)) : path.join(dir, "out", `${s.key}.mp4`); fs.mkdirSync(path.dirname(out), { recursive: true });
const args = ["render", "src/index.ts", "HiddenCleanShort", out, `--props=${pp}`, "--overwrite", "--concurrency=4"];
const chrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome"].find((c) => fs.existsSync(c)); if (chrome) args.push(`--browser-executable=${chrome}`, "--gl=angle");
const rr = spawnSync(path.join(dir, "node_modules", ".bin", "remotion"), args, { cwd: dir, stdio: "inherit" });
if (rr.status === 0) console.log(`\nRendered ${out}`);
process.exit(rr.status ?? 1);
