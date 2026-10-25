# HiddenClean daily short (9:16, 1080x1920, 30 fps, ~25-35s)

Content mix (Utena 2026-10-25): mostly **general cleaning hacks** (bathroom, floors, stains, kitchen surfaces). About **one appliance / secret-button** video per week as the signature. Same safety rules. Details in `docs/CONTENT.md`.

Pipeline copied from TechTipADay's Remotion setup (script / align / render), with a new HiddenClean look, sound and voice. Composition: `HiddenCleanShort` (`src/HiddenCleanShort.tsx`).

## Locked style (APPROVED by Utena 2026-10-20: do not change voice, sound kit or reveal motif)
- **Palette:** navy `#14325f` (deep `#0c2245`), mint `#4dbb9f`, pale mint `#9fd9c8`, white ink; warm amber `#ffb85c` only for the hook pill/last hook word and safety.
- **Type:** Fredoka 700 (display), Nunito 900 (captions, pills).
- **Backdrop:** navy with a faint bathroom-tile grid and a mint glow behind the appliance.
- **Header:** secret-button mark + Hidden**Clean** wordmark, `HACK #NN` pill (NN = tip number in `lib/data.ts` order).
- **Signature REVEAL motif** (`Reveal` in `src/brand.tsx`): a mint glow ring expands from the hidden part, a mint halo breathes, white/mint 4-point sparkles burst and twinkle, with `sparkle.wav`. Used on: intro (button press), "hidden spot" beat, the part snapping back clean, the AFTER panel, the CTA logo.
- **Brand pointer:** the secret button as a cursor (navy disc, white ring, mint core, mint sparkle) with a tap ripple.
- **Captions:** bold uppercase Nunito 900, word-by-word from whisper timing, chunks of <=3 words, active word on a tilted mint chip. Spelled from the script (not the transcript).
- **Beat dots** at the bottom (hook, reveal, steps, result).

## The 5-beat arc (fixed)
0. Intro 0.7s: the secret button is pressed and sparkles (sting).
1. **Pain hook** (amber pill, e.g. `YOU'RE DOING IT WRONG`): words pop in, last word amber; appliance looks grimy with stink lines and a slight shake. VO starts at 0.7s so the hook lands in the first 2s.
2. **Reveal** (`★ HIDDEN SPOT`): "Here's the hidden setting/part." + the thing; the hidden part glows and sparkles.
3. **Steps** (`STEP n`, 2-4): flat appliance illustration acts each step; brand pointer taps the part. Then a **safety** card (shield + text) whenever relevant.
4. **Before / after:** two panels, gunky vs sparkling (reveal on AFTER) + headline.
5. **CTA:** logo reveal, "Daily hidden cleaning hacks", `hiddenclean.com` pill; VO: "Daily hidden cleaning hacks, at hiddenclean dot com."

## Sound & voice
- Kit in `public/audio/` (see its README), generated once, reused forever.
- Voice (`voice.json`): **Mira - Bright & Friendly Narrator** `rdEyNni8e60Jlx1RsV9N`, `eleven_v4`, `generations_count: 1`, ~460 credits per ~26s VO. Tags: [playful] hook, [intrigued] reveal, [friendly] steps+safety, [delighted] result, [warm] CTA.
- render normalises the VO to -16 LUFS (loudnorm, TP -1.5); the bed sits at 0.10 under the voice. Final mix measured -16.2 LUFS integrated.

## Safety rules (enforced by script.mjs)
- Every spec should have a `safety` line (warns if missing). Never suggest mixing products: script.mjs checks every sentence and throws if one mentions mix/mixing/combine/bleach (or bleach with vinegar/ammonia) unless that sentence is a warning (never/don't/no/not).
- Keep tips to one product at a time; unplug/switch off appliances first.

## Content: `specs/<slug>.json` (the site's lib/tips.ts is not touched)
```json
{ "hook": "You've been cleaning your dishwasher wrong.", "hookLabel": "YOU'RE DOING IT WRONG",
  "doLead": "Here's the hidden part.", "doThis": "There's a filter under the bottom spray arm.", "doText": "The hidden filter",
  "appliance": "dishwasher",
  "steps": [{ "say": "spoken step", "text": "short on-screen", "scene": "rack-out|twist|rinse" }],
  "safety": { "say": "No bleach, and never mix cleaners.", "text": "No bleach. Never mix cleaners." },
  "result": { "say": "...", "headline": "2-5 words", "before": "Gunky filter", "after": "Sparkling clean" } }
```
Copy: VO <= 75 words, hook 5-12 words, 2-4 steps. Illustrations: `src/Dishwasher.tsx` (`appliance: "dishwasher"`, scenes rack-out, twist, rinse) and `src/appliances.tsx` for
`washer`, `oven`, `fridge`, `microwave`, `kettle`, `coffee`, `dryer`, `vacuum`, `airfryer`. Each has a hidden `part`, a `button`, a `Draw` driven by one generic
state and a `Closeup` for the before/after panels. Generic step scenes: `open`, `remove`, `rinse`, `refit`, `pour`, `press` (button glows, mode on), `steam`,
`wait` (clock), `wipe` (cloth), `close`. `"revealAt": "button"` puts the hidden-spot reveal on the setting button (hidden-setting tips), otherwise on the part.
The last rinse/wipe/refit step ends with a second reveal + sparkle. Note: `dryer` currently reuses the washer body (own lint-screen closeup).

## Daily commands (from `video/`)
1. Write `specs/<slug>.json`, then `node script.mjs <n|slug>` -> `scripts/<slug>.json` + the ElevenLabs prompt.
2. ElevenLabs `creative_generate_speech` (voice/model from voice.json, `generations_count: 1`, prompt = printed text exactly). Poll `creative_get_flow_run_status`, then `curl -L -o public/vo/<slug>.mp3 "<content_url>"`. Never re-call to retry.
3. `node render.mjs <n|slug> --out=/workspace/hiddenclean/video-out/<slug>.mp4` (`--dry` prints timings). Word timing: `align.py` (faster-whisper base.en in `/home/box/whisper-venv`), outputs piece starts + caption words. ~2.5 min render.
4. Quick pre-render check: `./qa-stills.sh <slug>` -> `out/<slug>-sheet.png` (one still per piece).
5. QA: frames at hook (~1.9s), a step and the CTA (`ffmpeg -ss <t> -i out.mp4 -frames:v 1 f.png`), look at them; loudness `ffmpeg -i out.mp4 -af ebur128 -f null -` (target -16 LUFS).

Setup: `npm ci` (needs ffmpeg; uses google-chrome if present). Sound kit: `python3 kit-src/make_kit.py` (only if the files are lost).

## Hook standard (Utena, 2026-10-23: applies to ALL videos, overrides the 0.7s intro above)
- **No logo/intro before the hook.** Frame 1 is the most striking REAL shot (gross gunk close-up, or a before/after flash).
- **Bold 3-6 word on-screen hook in the first frame** (e.g. "Your dishwasher is hiding THIS"), last/key word on an amber chip, centred, big (Fredoka ~120px).
- **Motion hit at 0s:** punch zoom (1.5 -> 1.0 spring) + whoosh (`swish`) + sparkle hit (`sparkle` + Reveal ring) in the first 3 frames.
- VO starts by 0.2s. If the VO opening is slow, trim/shift it (props offset) rather than buying new audio; only regenerate the first line if trimming can't work.
- Header/logo appear only after the hook (~1.7s); the brand sign-off stays in the CTA.
- Footage style (v2, `HiddenCleanV2` composition): real 9:16 stock cuts every 1-2s (Pexels/Pixabay, free licence, list in credits.txt), mint brand frame, navy gradients for legibility, brand illustrations only for parts no stock shows (e.g. the filter twist). Stock pre-cut to `public/stock/*.mp4` (1080x1920, 30fps).

## v2 pipeline (all videos, 2026-10-23)
- Config per video in `v2/config.json`: `hook` (3-6 words, `*KEY*` = amber chip), optional `hookSay` + `vo` (spliced VO when the first line was regenerated), `clips` per beat (`hook`, `do`, `s1..s4`, `safety`, `result`), entries `<pexelsId>@<startSec>` or `gfx:reveal|twist|lift`.
- Stock: download the Pexels file, pre-cut to `public/stock/<id>.mp4` (9s, 1080x1920, 30fps, no audio; gitignored, re-download from credits.txt URLs). Run ffmpeg pre-cuts max 3 in parallel (54 at once got OOM-killed).
- `node v2/build.mjs <slug>` -> whisper re-timing, shots auto-split to <=1.8s per piece, renders `video-out/v2-<slug minus how-to->.mp4`. `--dry` prints timings.
- Hook line regen: generate only the first line in Mira/eleven_v4 (`generations_count: 1`, ~50 credits), trim its tail silence, concat with the original VO from the second piece onwards.
