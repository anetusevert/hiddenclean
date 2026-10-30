// node v2/recut.mjs <id> [--dry] : 15-25s TikTok recut of an existing v2 short (v2/recut.json).
// New hook line (public/vo/r/<id>-hook.wav) + the original VO from the "do" piece on, minus dropped steps
// (only while the cut is over budget). Same HiddenCleanV2 composition, locked style, same clips.
import { spawnSync } from "node:child_process"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { original } from "./timings.mjs";
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); const FPS = 30, LEAD = 0.15, OUTRO = 1.3, MAX = 24.4, GAP = 0.12;
const id = process.argv[2]; const rc = JSON.parse(fs.readFileSync(path.join(dir, "v2/recut.json"), "utf8"))[id]; if (!rc) throw new Error("no recut " + id);
const o = await original(rc.slug); const { s, cfg, al, ends } = o;
const hookWav = path.join(dir, "public/vo/r", `${id}-hook.wav`);
const hookDur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", hookWav], { encoding: "utf8" }).stdout);
// Drop the "Here's the hidden part." lead-in of the do piece: the new hook already sets it up.
const spec = JSON.parse(fs.readFileSync(path.join(dir, "specs", `${rc.slug}.json`), "utf8"));
const leadN = (spec.doLead ?? "Here's the hidden setting.").split(/\s+/).length; const doI = s.pieces.findIndex((p) => p.beat === "do");
const doWords = al.words.filter((w) => w.p === doI);
if (doWords[leadN]) { al.starts[doI] = doWords[leadN].s - 0.05; s.pieces[doI] = { ...s.pieces[doI], say: spec.doThis }; }
// keep pieces 1..n; piece i audio = [start_i, end_i]
let keep = s.pieces.map((p, i) => i).filter((i) => i > 0);
const segDur = (i) => ends[i] - al.starts[i];
const total = () => LEAD + hookDur + GAP + keep.reduce((a, i) => a + segDur(i) + GAP, 0) + OUTRO;
const stepIdx = (name) => s.pieces.findIndex((p) => p.beat === "steps" && "s" + p.step === name);
for (const d of rc.drop ?? []) { if (total() <= MAX) break; keep = keep.filter((i) => i !== stepIdx(d)); }
if (total() > MAX) console.warn(`⚠ ${id} still ${total().toFixed(1)}s`);
// splice audio
const voOut = path.join(dir, "public/vo/r", `${id}.wav`);
const inputs = ["-i", hookWav, "-i", o.vo]; let fc = "", labels = "[h]";
fc += `[0:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur=${GAP}[h];`;
keep.forEach((i, k) => { const a = Math.max(0, al.starts[i] - 0.04), b = ends[i];
  fc += `[1:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=mono,afade=t=in:d=0.03,afade=t=out:st=${(b - a - 0.06).toFixed(3)}:d=0.06,apad=pad_dur=${GAP}[p${k}];`; labels += `[p${k}]`; });
fc += `${labels}concat=n=${keep.length + 1}:v=0:a=1[out]`;
let r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...inputs, "-filter_complex", fc, "-map", "[out]", voOut], { encoding: "utf8" }); if (r.status) throw new Error(r.stderr);
const dur = Number(spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", voOut], { encoding: "utf8" }).stdout);
const pieces0 = [{ ...s.pieces[0], say: rc.say, text: rc.say }, ...keep.map((i) => s.pieces[i])];
const key = id; const voNorm = path.join(dir, "public/vo/.norm", `${key}.wav`); fs.mkdirSync(path.dirname(voNorm), { recursive: true });
spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", voOut, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "44100", voNorm]);
r = spawnSync("/home/box/whisper-venv/bin/python", [path.join(dir, "align.py"), voOut, JSON.stringify(pieces0.map((p) => p.say))], { encoding: "utf8" });
const al2 = JSON.parse(r.stdout.trim().split("\n").at(-1)); const f = (x) => Math.round(x * FPS);
const voStart = f(LEAD), voEnd = f(LEAD + dur);
const pieces = pieces0.map((p, i) => ({ ...p, start: i === 0 ? voStart : voStart + f(al2.starts[i]) }));
const words = al2.words.map((w) => ({ w: w.w, p: w.p, s: voStart + f(w.s), e: voStart + f(w.e) }));
const tot = voEnd + f(OUTRO); const cta = pieces.find((p) => p.beat === "cta").start;
const clips = { ...cfg.clips, hook: rc.first === "do" ? [cfg.clips.do[0].startsWith("gfx:") ? cfg.clips.hook[1] : cfg.clips.do[0], ...cfg.clips.hook] : [cfg.clips.hook[1] ?? cfg.clips.hook[0], cfg.clips.hook[0]] };
const shots = [];
pieces.forEach((p, i) => { if (p.beat === "cta") return; const key2 = p.beat === "steps" ? "s" + p.step : p.beat; const list = clips[key2] ?? clips.result;
  const st = i === 0 ? 0 : p.start, en = pieces[i + 1].start; const n = Math.max(1, Math.ceil((en - st) / (1.8 * FPS)));
  const lastClean = p.beat === "steps" && pieces[i + 1].beat !== "steps";
  for (let k = 0; k < n; k++) { const e = list[k % list.length]; const [clip, ss] = e.split("@"); const a = st + Math.round(((en - st) * k) / n);
    shots.push({ from: a, clip: clip.startsWith("gfx:") ? undefined : clip, gfx: clip.startsWith("gfx:") ? clip.slice(4) : undefined,
      ss: f(Number(ss ?? 0) + Math.floor(k / list.length) * 1.6), sparkle: p.beat === "result" || (p.beat === "do" && k === 0) || (lastClean && k === n - 1) }); } });
shots.forEach((x, i) => (x.to = shots[i + 1]?.from ?? cta));
const props = { appliance: s.appliance, n: s.n, title: s.title, url: s.url, pieces, words, voStart, voEnd, total: tot, voFile: `vo/.norm/${key}.wav`, hook: rc.hook, shots };
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true }); const pp = path.join(dir, ".cache", `${key}.props.json`); fs.writeFileSync(pp, JSON.stringify(props, null, 1));
console.log(`${key}: total ${(tot / FPS).toFixed(1)}s kept ${pieces.map((p) => p.beat[0] + (p.step ?? "")).join(",")}`, pieces.map((p) => `${p.beat}@${(p.start / FPS).toFixed(2)}`).join(" "));
if (process.argv.includes("--dry")) process.exit(0);
const out = `/workspace/hiddenclean/video-out/${key}.mp4`;
const rr = spawnSync(path.join(dir, "node_modules/.bin/remotion"), ["render", "src/index.ts", "HiddenCleanV2", out, `--props=${pp}`, "--overwrite", "--concurrency=4", "--browser-executable=/usr/bin/google-chrome", "--gl=angle", "--log=error"], { cwd: dir, stdio: "inherit" });
console.log(rr.status === 0 ? `Rendered ${out}` : "render failed"); process.exit(rr.status ?? 1);
