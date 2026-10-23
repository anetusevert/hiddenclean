// v2 "real footage" style: fast 1-2s cuts of free stock footage (Pexels), brand graphics as overlays.
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fDisplay, fSans } from "./fonts";
import { C, Mark, Reveal, HaloDef, clamp } from "./brand";
import { Filter } from "./Dishwasher";
import { Captions, SafetyCard, Cta, Sfx, HeadlineAt } from "./HiddenCleanShort";
import type { Beat, Props } from "./types";

type Shot = { from: number; to: number; clip?: string; ss?: number; gfx?: "reveal" | "twist" | "lift"; sparkle?: boolean };

function Gfx({ kind, f, dur }: { kind: "reveal" | "twist" | "lift"; f: number; dur: number }) {
  const { fps } = useVideoConfig(); const s = spring({ frame: f, fps, config: { stiffness: 170, mass: 0.7, damping: 11 } });
  const twist = 0; const spin = kind === "twist" ? interpolate(f, [4, 30], [0, 90], clamp) : 0; const lift = kind === "lift" ? interpolate(f, [2, 20], [0, 260], clamp) : 0;
  return <AbsoluteFill style={{ background: C.navy }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)", backgroundSize: "135px 135px" }} />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, rgba(77,187,159,.35) 0%, transparent 45%)` }} />
    <svg width={1080} height={1920} viewBox="-540 -1000 1080 1920" style={{ position: "absolute", overflow: "visible" }}><HaloDef />
      <Reveal cx={0} cy={0} r={260} t={f - 4} />
      <g transform={`translate(0 ${-lift}) scale(${0.6 + 0.4 * s})`}><Filter twist={twist} grime={1} scale={2.6} t={f} /></g>
      {kind === "twist" && <g transform="translate(0 -170)"><path d="M -200 0 A 200 70 0 0 0 200 0" fill="none" stroke={C.mint} strokeWidth={20} strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700 - 700 * spin / 90} />{spin > 85 && <path d="M 214 -6 l -50 -4 l 34 40 z" fill={C.mint} stroke={C.mint} strokeWidth={10} strokeLinejoin="round" />}</g>}
      {kind === "lift" && <path d={`M 0 ${-420 - lift} l -50 70 h 100 z`} fill={C.mint} opacity={0.9} />}
    </svg>
    <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", fontFamily: fSans, fontWeight: 900, fontSize: 46, letterSpacing: 3, color: C.pale, opacity: s }}>
      {kind === "reveal" ? "UNDER THE BOTTOM SPRAY ARM" : kind === "twist" ? "¼ TURN  ↺" : "LIFT IT OUT  ↑"}</div>
  </AbsoluteFill>;
}

function ShotView({ sh, f, dur }: { sh: Shot; f: number; dur: number }) {
  const punch = interpolate(f, [0, 7], [1.14, 1.04], clamp) + interpolate(f, [7, dur], [0, 0.05], clamp); // punch-in then slow push
  const flash = interpolate(f, [0, 3], [0.55, 0], clamp);
  return <AbsoluteFill>
    {sh.gfx ? <Gfx kind={sh.gfx} f={f} dur={dur} /> :
      <AbsoluteFill style={{ transform: `scale(${punch})` }}><OffthreadVideo src={staticFile(`stock/${sh.clip}.mp4`)} startFrom={sh.ss ?? 0} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} /></AbsoluteFill>}
    {sh.sparkle && <svg width={1080} height={1920} style={{ position: "absolute" }}><HaloDef /><Reveal cx={560} cy={900} r={300} t={f - 3} /></svg>}
    <AbsoluteFill style={{ background: C.pale, opacity: flash, mixBlendMode: "screen" }} />
  </AbsoluteFill>;
}

export function HiddenCleanV2(p: Props & { hook?: string; shots?: Shot[] }) {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const ps = p.pieces;
  const end = (i: number) => ps[i + 1]?.start ?? p.total;
  const ci = Math.max(0, ps.findLastIndex((x) => x.start <= f)); const cur = ps[ci];
  const at = (b: Beat) => ps.find((x) => x.beat === b)!;
  const doP = at("do"), safety = at("safety"), result = at("result"), cta = at("cta"); const introEnd = ps[0].start;
  const shots = (p.shots ?? []).map((s) => ({ s, st: s.from, en: s.to }));
  const hookShake = f < doP.start ? Math.sin(f * 1.9) * 6 * interpolate(f, [introEnd + 15, introEnd + 25], [0, 1], clamp) : 0;
  const bed = interpolate(f, [0, p.voStart, p.voStart + 8, p.voEnd, p.voEnd + 10, p.total - 20, p.total], [0.45, 0.45, 0.1, 0.1, 0.28, 0.28, 0], clamp);
  const beatOrder: Beat[] = ["hook", "do", "steps", "result", "cta"]; const bi = beatOrder.indexOf(cur.beat === "safety" ? "steps" : cur.beat);
  const safetyDim = interpolate(f, [safety.start, safety.start + 5, result.start - 3, result.start], [0, 0.55, 0.55, 0], clamp);
  return <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `translateX(${hookShake}px)` }}>
      {shots.map(({ s, st, en }, i) => <Sequence key={i} from={st} durationInFrames={en - st} layout="none"><ShotAt sh={s} dur={en - st} /></Sequence>)}
    </AbsoluteFill>
    {/* readability: navy gradients top and bottom, mint brand frame */}
    {f < cta.start && <><AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.deep}f0 0%, ${C.deep}a0 22%, transparent 42%, transparent 66%, ${C.deep}c0 80%, ${C.deep}f0 100%)` }} />
      <AbsoluteFill style={{ background: C.deep, opacity: safetyDim }} />
      <AbsoluteFill style={{ border: `10px solid ${C.mint}`, borderRadius: 0, opacity: 0.9 }} /></>}
    {f < cta.start && f >= 50 && <div style={{ position: "absolute", top: 70, left: 70, right: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Mark size={84} glow={cur.beat === "do" ? 0.6 : 0} />
        <span style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: 56, color: C.ink, textShadow: "0 4px 12px rgba(0,0,0,.4)" }}>Hidden<span style={{ color: C.mint }}>Clean</span></span></div>
      <span style={{ fontFamily: fSans, fontWeight: 900, fontSize: 34, color: C.navy, background: C.pale, letterSpacing: 2, padding: "8px 20px", borderRadius: 999 }}>HACK #{String(p.n).padStart(2, "0")}</span>
    </div>}
    <div style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,.55))" }}>
      {cur.beat !== "cta" && cur.beat !== "safety" && cur.beat !== "result" && f >= 50 && <Sequence from={cur.start} durationInFrames={end(ci) - cur.start} layout="none"><HeadlineAt p={cur} dur={end(ci) - cur.start} /></Sequence>}
      {cur.beat === "result" && <Sequence from={result.start} durationInFrames={cta.start - result.start} layout="none"><HeadlineAt p={{ ...result, text: result.result?.headline ?? result.text }} dur={cta.start - result.start} /></Sequence>}
      {cur.beat === "safety" && <Sequence from={safety.start} layout="none"><HeadlineAt p={{ ...safety, text: "Keep it safe" }} dur={result.start - safety.start} /></Sequence>}
    </div>
    {cur.beat === "safety" && <SafetyCard text={safety.text} f={f - safety.start} />}
    {f >= cta.start && <AbsoluteFill style={{ background: C.navy }}><AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.045) 2px, transparent 2px)", backgroundSize: "135px 135px" }} /><Cta f={f - cta.start} /></AbsoluteFill>}
    {f >= introEnd && <Captions words={p.words} f={f} />}
    {f >= introEnd && f < cta.start && <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
      {beatOrder.slice(0, 4).map((b, i) => <div key={b} style={{ width: i === bi ? 70 : 22, height: 22, borderRadius: 11, background: i <= bi ? C.mint : "rgba(255,255,255,.35)" }} />)}</div>}
    {f < 54 && (() => { const hs = spring({ frame: f, fps, config: { stiffness: 260, mass: 0.6, damping: 12 } }); const o = interpolate(f, [44, 54], [1, 0], clamp);
      return <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
        <svg width={1080} height={1920} style={{ position: "absolute" }}><HaloDef /><Reveal cx={540} cy={1000} r={320} t={f} /></svg>
        <div style={{ transform: `scale(${1.5 - 0.5 * hs}) rotate(-3deg)`, textAlign: "center", padding: "0 60px", fontFamily: fDisplay, fontWeight: 700, fontSize: 124, lineHeight: 1.0, color: C.ink, textShadow: "0 8px 0 rgba(0,0,0,.45)", marginTop: -120 }}>
          {(p.hook ?? "").split(" ").map((w, i) => /^\*.*\*$/.test(w) ? <span key={i} style={{ background: C.warn, color: C.navy, padding: "0 24px", borderRadius: 24, display: "inline-block", margin: "6px 10px" }}>{w.slice(1, -1)}</span> : <span key={i} style={{ display: "inline-block", margin: "6px 14px" }}>{w}</span>)}</div></AbsoluteFill>; })()}
    <Audio src={staticFile("audio/bed.wav")} loop volume={bed} />
    <Sfx name="swish" at={0} volume={0.6} /><Sfx name="sparkle" at={1} volume={0.6} />
    {p.voFile && <Sequence from={p.voStart} layout="none"><Audio src={staticFile(p.voFile)} volume={1} /></Sequence>}
    {shots.slice(1).map(({ st }, i) => <Sfx key={`w${i}`} name="swish" at={st - 3} volume={0.22} />)}
    {shots.filter(({ s }) => s.gfx || s.sparkle).map(({ st }, i) => <Sfx key={`k${i}`} name="sparkle" at={st + 3} volume={0.5} />)}
    {ps.filter((x) => x.beat === "steps").map((x, i) => <Sfx key={`p${i}`} name="pop" at={x.start + 4} volume={0.45} />)}
    <Sfx name="sting" at={cta.start + 6} volume={0.6} />
  </AbsoluteFill>;
}
function ShotAt({ sh, dur }: { sh: Shot; dur: number }) { const f = useCurrentFrame(); return <ShotView sh={sh} f={f} dur={dur} />; }
