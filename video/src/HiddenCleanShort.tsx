import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fDisplay, fSans } from "./fonts";
import { C, Mark, Reveal, HaloDef, Pointer, Star, clamp } from "./brand";
import { Dishwasher, Filter, FILTER } from "./Dishwasher";
import { APPLIANCES, type S } from "./appliances";
import type { Beat, Piece, Props, Word } from "./types";

/** One spring for every entrance ("soft pop"). */
const pop = (f: number, fps: number, d = 0, damping = 11) => spring({ frame: f - d, fps, config: { stiffness: 170, mass: 0.7, damping } });
const LABEL: Partial<Record<Beat, string>> = { do: "★ HIDDEN SPOT", safety: "SAFETY FIRST", result: "BEFORE → AFTER" };
const ILL = { x: 140, y: 600 }; // illustration origin on the page (viewBox 800x780)

function Pill({ text, color, f }: { text: string; color: string; f: number }) {
  const { fps } = useVideoConfig(); const s = pop(f, fps);
  return <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 28px", borderRadius: 999, background: color, color: C.navy,
    fontFamily: fSans, fontWeight: 900, fontSize: 36, letterSpacing: 2, transform: `scale(${s})`, transformOrigin: "left center" }}>{text}</div>;
}

function Headline({ p, f, dur }: { p: Piece; f: number; dur: number }) {
  const { fps } = useVideoConfig();
  const out = interpolate(f, [dur - 5, dur], [1, 0], clamp);
  const isHook = p.beat === "hook";
  const words = p.text.split(" "); const per = isHook ? Math.min(6, (dur * 0.6) / words.length) : 0;
  const label = isHook ? p.label ?? "HIDDEN SETTING" : p.beat === "steps" ? `STEP ${p.step}` : LABEL[p.beat];
  const lc = isHook ? C.warn : p.beat === "safety" ? C.warn : C.mint;
  return <div style={{ position: "absolute", top: 210, left: 80, right: 80, opacity: out }}>
    {label && <div style={{ marginBottom: 26 }}><Pill text={label} color={lc} f={f} /></div>}
    <div style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: isHook ? 82 : 84, lineHeight: 1.04, color: C.ink, letterSpacing: -1 }}>
      {words.map((w, i) => { const s = pop(f, fps, 2 + i * per); const hi = isHook ? i === words.length - 1 : false;
        return <span key={i} style={{ display: "inline-block", marginRight: 22, transform: `translateY(${(1 - s) * 30}px) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.3), color: hi ? C.warn : C.ink }}>{w}</span>; })}
    </div>
  </div>;
}

/** Bold word-by-word captions (whisper-timed script words). Chunks of <=3 words, active word on a mint chip. */
function Captions({ words, f }: { words: Word[]; f: number }) {
  const ws: Word[] = [];
  for (const w of words) { const l = ws.at(-1); // merge "hiddenclean dot com." into one word
    if (l && /^dot$/i.test(w.w) && /hiddenclean$/i.test(l.w)) { l.w += "."; l.e = w.e; continue; }
    if (l && /^com\.?$/i.test(w.w) && /\.$/.test(l.w)) { l.w += "com"; l.e = w.e; continue; } ws.push({ ...w }); }
  const chunks: Word[][] = [];
  for (const w of ws) { const c = chunks.at(-1); const l = c?.at(-1);
    if (!c || c.length >= 3 || l!.p !== w.p || /[.,!?]$/.test(l!.w)) chunks.push([w]); else c.push(w); }
  const ci = chunks.findIndex((c, i) => f >= c[0].s - 2 && f < (chunks[i + 1]?.[0].s ?? c.at(-1)!.e + 12) - 2);
  if (ci < 0) return null; const c = chunks[ci]; const { fps } = useVideoConfig(); const s = pop(f, fps, c[0].s - 2, 13);
  return <div style={{ position: "absolute", top: 1440, left: 50, right: 50, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 18px", transform: `scale(${0.85 + 0.15 * s})` }}>
    {c.map((w, i) => { const on = f >= w.s - 1 && f < (c[i + 1]?.s ?? w.e + 8);
      return <span key={i} style={{ fontFamily: fSans, fontWeight: 900, fontSize: 82, lineHeight: 1.15, textTransform: "uppercase", padding: "0 18px", borderRadius: 22,
        background: on ? C.mint : "transparent", color: on ? C.navy : C.ink, textShadow: on ? "none" : "0 6px 0 rgba(0,0,0,.35)", transform: on ? "scale(1.06) rotate(-1.5deg)" : "none" }}>{w.w.replace(/[,]$/, "")}</span>; })}
  </div>;
}

function SafetyCard({ text, f }: { text: string; f: number }) {
  const { fps } = useVideoConfig(); const s = pop(f, fps, 0, 10);
  return <div style={{ position: "absolute", left: 110, right: 110, top: 760, padding: "50px 50px", borderRadius: 40, background: C.card, border: `8px solid ${C.warn}`,
    display: "flex", alignItems: "center", gap: 36, transform: `scale(${0.6 + 0.4 * s})`, opacity: s, boxShadow: "0 30px 80px rgba(0,0,0,.35)" }}>
    <svg width={150} height={170} viewBox="0 0 100 115"><path d="M50 4 L92 20 V55 C92 82 72 102 50 111 C28 102 8 82 8 55 V20Z" fill={C.navy} /><path d="M30 57 L45 72 L72 42" fill="none" stroke={C.mint} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /></svg>
    <div style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: C.navy }}>{text}</div>
  </div>;
}

function BeforeAfter({ r, f, app }: { r: NonNullable<Piece["result"]>; f: number; app?: string }) {
  const Cl = app && APPLIANCES[app] ? APPLIANCES[app].Closeup : null;
  const { fps } = useVideoConfig(); const a = pop(f, fps, 0), b = pop(f, fps, 10);
  const panel = (s: number, good: boolean) => <div style={{ width: 430, height: 640, borderRadius: 36, background: good ? "rgba(77,187,159,.16)" : "rgba(255,184,92,.10)",
    border: `6px solid ${good ? C.mint : C.warn}`, transform: `scale(${s})`, opacity: s, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 30 }}>
    <div style={{ fontFamily: fSans, fontWeight: 900, fontSize: 40, letterSpacing: 3, color: good ? C.mint : C.warn }}>{good ? "AFTER" : "BEFORE"}</div>
    <svg width={400} height={440} viewBox="-200 -230 400 440" style={{ overflow: "visible" }}><HaloDef />
      {good && <Reveal cx={0} cy={-20} r={150} t={f - 14} />}
      {Cl ? <Cl good={good} t={f} /> : <Filter grime={good ? 0 : 1} scale={1.55} t={f} />}
      {!good && !Cl && [-50, 10, 60].map((dx, i) => <path key={i} d={`M ${dx} -170 q 14 -25 0 -50`} fill="none" stroke="#9c8a4f" strokeWidth={7} strokeLinecap="round" opacity={0.7} />)}
    </svg>
    <div style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: 50, color: C.ink, marginTop: 10 }}>{good ? r.after : r.before}</div>
  </div>;
  return <div style={{ position: "absolute", top: 660, left: 70, right: 70, display: "flex", justifyContent: "space-between" }}>{panel(a, false)}{panel(b, true)}</div>;
}

function Cta({ f }: { f: number }) {
  const { fps } = useVideoConfig(); const s = pop(f, fps, 0, 10); const press = interpolate(f, [4, 8, 14], [0, 1, 0], clamp); const glow = interpolate(f, [8, 20], [0, 1], clamp);
  const u = pop(f, fps, 16); const pulse = 1 + 0.03 * Math.sin(f / 6);
  return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 300 }}>
    <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: "absolute", top: 260 }}><HaloDef /><Reveal cx={450} cy={420} r={300} t={f - 8} /></svg>
    <div style={{ transform: `scale(${(0.6 + 0.4 * s) * pulse})` }}><Mark size={380} glow={glow} press={press} /></div>
    <div style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: 124, color: C.ink, marginTop: 40, opacity: s }}>Hidden<span style={{ color: C.mint }}>Clean</span></div>
    <div style={{ fontFamily: fSans, fontWeight: 800, fontSize: 52, color: C.pale, marginTop: 10, opacity: u }}>Daily hidden cleaning hacks</div>
    <div style={{ fontFamily: fSans, fontWeight: 900, fontSize: 58, color: C.navy, background: C.mint, padding: "18px 44px", borderRadius: 999, marginTop: 44, transform: `scale(${u})` }}>hiddenclean.com</div>
  </AbsoluteFill>;
}

function Sfx({ name, at, volume = 0.5 }: { name: string; at: number; volume?: number }) {
  return <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none"><Audio src={staticFile(`audio/${name}.wav`)} volume={volume} /></Sequence>;
}

export function HiddenCleanShort(p: Props) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const ps = p.pieces;
  const end = (i: number) => ps[i + 1]?.start ?? p.total;
  const ci = Math.max(0, ps.findLastIndex((x) => x.start <= f)); const cur = ps[ci];
  const at = (beat: Beat, scene?: string) => ps.find((x) => x.beat === beat && (!scene || x.scene === scene));
  const doP = at("do")!, rack = at("steps", "rack-out"), tw = at("steps", "twist"), rin = at("steps", "rinse");
  const safety = at("safety"), result = at("result")!, cta = at("cta")!;
  const rinEnd = rin ? end(ps.indexOf(rin)) : 0;
  const generic = !!p.appliance && p.appliance !== "dishwasher" && !!APPLIANCES[p.appliance]; const A = generic ? APPLIANCES[p.appliance!] : null;
  const steps = ps.map((x, i) => ({ x, st: x.start, en: end(i) })).filter((o) => o.x.beat === "steps");
  const sc = (n: string) => steps.filter((o) => o.x.scene === n);
  const rise = (n: string, a = 4, b = 26) => Math.max(0, ...sc(n).map((o) => interpolate(f, [o.st + a, o.st + b], [0, 1], clamp)));
  const during = (n: string) => Math.max(0, ...sc(n).map((o) => interpolate(f, [o.st, o.st + 6, o.en - 6, o.en], [0, 1, 1, 0], clamp)));
  const cleanSc = steps.filter((o) => ["rinse", "wipe"].includes(o.x.scene ?? ""));
  const lastClean = steps.filter((o) => ["rinse", "wipe", "refit"].includes(o.x.scene ?? "")).at(-1);
  const steamFrom = sc("steam")[0]?.st ?? (p.appliance === "oven" ? (sc("press")[0]?.st ?? 1e9) + 16 : 1e9);
  const steamTo = (cleanSc[0]?.st ?? 1e9);
  const GS: S = { t: f,
    open: Math.max(rise("open"), sc("open").length ? 0 : rise("remove")), remove: Math.max(0, rise("remove") - rise("refit", 4, 24)),
    water: Math.max(during("rinse"), 0), grime: cleanSc.length ? 1 - Math.max(...cleanSc.map((o) => interpolate(f, [o.st + 8, o.en - 12], [0, 1], clamp))) : 1,
    pour: rise("pour"), mode: rise("press", 13, 15), press: Math.max(0, ...sc("press").map((o) => interpolate(f, [o.st + 10, o.st + 14, o.st + 20], [0, 1, 0], clamp))),
    steam: steamFrom > 1e8 ? 0 : interpolate(f, [steamFrom, steamFrom + 8, Math.max(steamFrom + 9, Math.min(steamTo, p.total) - 4), Math.max(steamFrom + 10, Math.min(steamTo, p.total))], [0, 1, 1, 0], clamp), wait: during("wait"),
    wipe: Math.max(0, ...sc("wipe").map((o) => interpolate(f, [o.st + 4, o.en - 8], [0, 1], clamp))) || (sc("wipe").length && f > sc("wipe")[0].en ? 1 : 0),
    close: rise("close"), stink: interpolate(f, [doP.start - 4, doP.start + 8], [1, 0], clamp) };
  const revealPt = A ? (p.revealAt === "button" ? A.button : A.part) : [0, 0];
  // dishwasher state, driven by step scenes
  const rackOut = rack ? interpolate(f, [rack.start + 4, rack.start + 22], [0, 1], clamp) : 0;
  const twist = tw ? interpolate(f, [tw.start + 4, tw.start + 22], [0, -90], clamp) : 0;
  const lift = tw ? interpolate(f, [tw.start + 24, tw.start + 42, rinEnd - 22, rinEnd - 10], [0, 170, 170, 0], clamp) : 0;
  const grime = rin ? interpolate(f, [rin.start + 10, rinEnd - 26], [1, 0], clamp) : 1;
  const water = rin ? interpolate(f, [rin.start, rin.start + 6, rinEnd - 26, rinEnd - 20], [0, 1, 1, 0], clamp) : 0;
  const stink = interpolate(f, [doP.start - 4, doP.start + 8], [1, 0], clamp);
  const illIn = pop(f, fps, ps[0].start); const illOut = interpolate(f, [result.start - 6, result.start], [1, 0], clamp);
  const dim = safety ? interpolate(f, [safety.start, safety.start + 6, result.start], [1, 0.3, 0.3], clamp) : 1;
  const shake = f < doP.start ? Math.sin(f * 1.7) * 4 * interpolate(f, [ps[0].start + 20, ps[0].start + 30, doP.start], [0, 1, 1], clamp) : 0;
  // pointer targets (svg coords)
  const tgt: [number, number] | null = cur.beat === "do" ? [FILTER.x + 90, FILTER.y - 40] : cur.scene === "rack-out" ? [560, 500 + rackOut * 300] : cur.scene === "twist" ? [FILTER.x + 70, FILTER.y - 110 - lift] : cur.scene === "rinse" ? [FILTER.x + 90, FILTER.y - lift - 30] : null;
  const ptIn = tgt ? pop(f, fps, cur.start + 6, 13) : 0; const tap = tgt ? interpolate(f, [cur.start + 14, cur.start + 30], [0, 1], clamp) : 0;
  const bed = interpolate(f, [0, p.voStart, p.voStart + 8, p.voEnd, p.voEnd + 10, p.total - 20, p.total], [0.45, 0.45, 0.1, 0.1, 0.28, 0.28, 0], clamp);
  const beatOrder: Beat[] = ["hook", "do", "steps", "result", "cta"]; const bi = beatOrder.indexOf(cur.beat === "safety" ? "steps" : cur.beat);
  const introEnd = ps[0].start; const totalSteps = ps.filter((x) => x.beat === "steps").length;
  return <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
    {/* backdrop: faint tile grid + mint glow behind the appliance */}
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.045) 2px, transparent 2px)", backgroundSize: "135px 135px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, rgba(77,187,159,.22) 0%, transparent 46%), linear-gradient(180deg, ${C.deep} 0%, transparent 18%, transparent 75%, ${C.deep} 100%)` }} />
    {/* header */}
    {f < cta.start && <div style={{ position: "absolute", top: 70, left: 70, right: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Mark size={84} glow={cur.beat === "do" ? 0.6 : 0} />
        <span style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: 56, color: C.ink }}>Hidden<span style={{ color: C.mint }}>Clean</span></span></div>
      <span style={{ fontFamily: fSans, fontWeight: 900, fontSize: 34, color: C.pale, letterSpacing: 2, border: `3px solid ${C.pale}55`, padding: "8px 20px", borderRadius: 999 }}>HACK #{String(p.n).padStart(2, "0")}</span>
    </div>}
    {/* appliance */}
    {generic && A && f < result.start && <svg width={800} height={780} viewBox="0 0 800 780" style={{ position: "absolute", left: ILL.x, top: ILL.y, overflow: "visible", opacity: illIn * illOut * dim,
      transform: `translateX(${shake}px) translateY(${(1 - illIn) * 80}px)` }}>
      <HaloDef />
      <A.Draw s={GS} />
      <Reveal cx={revealPt[0]} cy={revealPt[1]} r={p.revealAt === "button" ? 110 : 140} t={f - doP.start - 4} />
      {lastClean && <Reveal cx={A.part[0]} cy={A.part[1]} r={130} t={f - (lastClean.en - 10)} />}
      {cur.beat === "steps" && f < (safety?.start ?? result.start) && (() => { const tg = cur.scene === "press" ? A.button : A.part; const pi = pop(f, fps, cur.start + 6, 13); const tp = interpolate(f, [cur.start + 14, cur.start + 30], [0, 1], clamp);
        return <g opacity={pi} transform={`translate(0 ${(1 - pi) * 60})`}><Pointer x={tg[0] + 70} y={tg[1] - 60} tap={tp} /></g>; })()}
      {cur.beat === "do" && <g opacity={pop(f, fps, cur.start + 6, 13)}><Pointer x={revealPt[0] + 80} y={revealPt[1] - 70} tap={interpolate(f, [cur.start + 14, cur.start + 30], [0, 1], clamp)} /></g>}
    </svg>}
    {!generic && f < result.start && <svg width={800} height={780} viewBox="0 0 800 780" style={{ position: "absolute", left: ILL.x, top: ILL.y, overflow: "visible", opacity: illIn * illOut * dim,
      transform: `translateX(${shake}px) translateY(${(1 - illIn) * 80}px)` }}>
      <HaloDef />
      <Dishwasher s={{ rackOut, twist, lift, grime, stink, water, t: f }} />
      <Reveal cx={FILTER.x} cy={FILTER.y - 10} r={150} t={f - doP.start - 4} />
      {rin && <Reveal cx={FILTER.x} cy={FILTER.y - 10} r={130} t={f - (rinEnd - 10)} />}
      {tgt && f < (safety?.start ?? result.start) && <g opacity={ptIn} transform={`translate(0 ${(1 - ptIn) * 60})`}><Pointer x={tgt[0]} y={tgt[1]} tap={tap} /></g>}
      {cur.scene === "twist" && f < tw!.start + 24 && <path d={`M ${FILTER.x - 90} ${FILTER.y - 60} A 95 40 0 0 0 ${FILTER.x + 90} ${FILTER.y - 60}`} fill="none" stroke={C.mint} strokeWidth={10} strokeLinecap="round" markerEnd="" />}
    </svg>}
    {/* headline per piece */}
    {cur.beat !== "cta" && cur.beat !== "safety" && f >= introEnd && <Sequence from={cur.start} durationInFrames={end(ci) - cur.start} layout="none"><HeadlineAt p={cur} dur={end(ci) - cur.start} /></Sequence>}
    {cur.beat === "safety" && safety && <><Sequence from={safety.start} layout="none"><HeadlineAt p={{ ...safety, text: "Keep it safe" }} dur={end(ci) - safety.start} /></Sequence><SafetyCard text={safety.text} f={f - safety.start} /></>}
    {cur.beat === "result" && result.result && <BeforeAfter r={result.result} f={f - result.start} app={generic ? p.appliance : undefined} />}
    {f >= cta.start && <Cta f={f - cta.start} />}
    {f >= introEnd && <Captions words={p.words} f={f} />}
    {/* beat dots */}
    {f >= introEnd && f < cta.start && <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
      {beatOrder.slice(0, 4).map((b, i) => <div key={b} style={{ width: i === bi ? 70 : 22, height: 22, borderRadius: 11, background: i <= bi ? C.mint : "rgba(255,255,255,.2)" }} />)}
      <span style={{ display: "none" }}>{totalSteps}</span></div>}
    {/* intro: the secret button is pressed and sparkles (sting) */}
    {f < introEnd + 6 && <AbsoluteFill style={{ background: C.navy, alignItems: "center", justifyContent: "center", opacity: interpolate(f, [introEnd - 2, introEnd + 6], [1, 0], clamp) }}>
      <svg width={900} height={900} viewBox="0 0 900 900" style={{ position: "absolute" }}><HaloDef /><Reveal cx={450} cy={450} r={260} t={f - 4} /></svg>
      <Mark size={340} press={interpolate(f, [0, 3, 8], [0, 1, 0], clamp)} glow={interpolate(f, [3, 12], [0, 1], clamp)} />
    </AbsoluteFill>}
    {/* audio */}
    <Audio src={staticFile("audio/bed.wav")} loop volume={bed} />
    <Sfx name="sting" at={0} volume={0.7} />
    {p.voFile && <Sequence from={p.voStart} layout="none"><Audio src={staticFile(p.voFile)} volume={1} /></Sequence>}
    <Sfx name="sparkle" at={doP.start + 4} volume={0.55} />
    {ps.slice(1).map((x, i) => x.beat !== ps[i].beat ? <Sfx key={`s${i}`} name="swish" at={x.start - 3} volume={0.3} /> : null)}
    {ps.filter((x) => x.beat === "steps").map((x, i) => <Sfx key={`p${i}`} name="pop" at={x.start + 14} volume={0.5} />)}
    {!generic && rin && <Sfx name="sparkle" at={rinEnd - 10} volume={0.5} />}
    {generic && lastClean && <Sfx name="sparkle" at={lastClean.en - 10} volume={0.5} />}
    <Sfx name="sparkle" at={result.start + 14} volume={0.55} />
    <Sfx name="sting" at={cta.start + 6} volume={0.6} />
  </AbsoluteFill>;
}
function HeadlineAt({ p, dur }: { p: Piece; dur: number }) { const f = useCurrentFrame(); return <Headline p={p} f={f} dur={dur} />; }
export { Star };
