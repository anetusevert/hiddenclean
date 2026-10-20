import type { ReactNode } from "react";
import { C, Star } from "./brand";
// Flat appliance drawings in the locked HiddenClean style (viewBox 0 0 800 780; same palette/strokes as Dishwasher.tsx).
// Every drawing is driven by one generic state S (computed from the spec's step scenes in HiddenCleanShort.tsx).
export type S = { open: number; remove: number; water: number; grime: number; pour: number; mode: number; press: number; steam: number; wait: number; wipe: number; close: number; stink: number; t: number };
export type Appliance = { Draw: (p: { s: S }) => ReactNode; part: [number, number]; button: [number, number]; Closeup: (p: { good: boolean; t: number }) => ReactNode };
const B = { body: "#eef4f8", panel: "#dce7ef", inner: "#c9dae7", line: "#8ea4b8", dark: "#7f95aa", glass: "#a9c8de" };

// shared bits
export const Grime = ({ pts, o, r = 16 }: { pts: number[][]; o: number; r?: number }) => <g opacity={o * 0.85}>{pts.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={r + (i % 3) * 5} ry={r * 0.65 + (i % 2) * 4} fill={C.grime} />)}</g>;
export const Steam = ({ x, y, o, t, n = 3, h = 90 }: { x: number; y: number; o: number; t: number; n?: number; h?: number }) => o <= 0 ? null : <g>{Array.from({ length: n }, (_, i) => {
  const ph = ((t * 1.4 + i * 17) % 40) / 40; return <path key={i} d={`M ${x + (i - (n - 1) / 2) * 34} ${y} q 16 ${-h / 4} 0 ${-h / 2} q -16 ${-h / 4} 0 ${-h / 2}`} fill="none" stroke="#ffffff" strokeWidth={9} strokeLinecap="round"
    opacity={o * 0.75 * Math.sin(Math.PI * ph)} transform={`translate(0 ${-ph * 40})`} />; })}</g>;
export const Stink = ({ x, y, o, t }: { x: number; y: number; o: number; t: number }) => o <= 0 ? null : <g>{[-50, 0, 50].map((dx, i) => <path key={i} d={`M ${x + dx} ${y} q 16 -26 0 -52 q -16 -26 0 -52`} fill="none" stroke="#9c8a4f" strokeWidth={8} strokeLinecap="round" opacity={o * (0.5 + 0.5 * Math.sin((t + i * 10) / 6))} transform={`translate(0 ${-((t * 1.2 + i * 12) % 26)})`} />)}</g>;
export const Drops = ({ x, y, o, t, w = 120 }: { x: number; y: number; o: number; t: number; w?: number }) => o <= 0 ? null : <g>{Array.from({ length: 9 }, (_, i) => { const yy = (t * 9 + i * 37) % 140;
  return <ellipse key={i} cx={x - w / 2 + ((i * 53) % w)} cy={y + yy} rx={6} ry={12} fill="#8fd3ff" opacity={o * (1 - yy / 150)} />; })}</g>;
export const Clock = ({ x, y, o, t }: { x: number; y: number; o: number; t: number }) => o <= 0 ? null : <g transform={`translate(${x} ${y})`} opacity={o}>
  <circle r={74} fill={C.navy} stroke="#fff" strokeWidth={8} /><circle r={6} fill={C.mint} />
  <line x1={0} y1={0} x2={0} y2={-50} stroke={C.mint} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 12})`} />
  <line x1={0} y1={0} x2={30} y2={0} stroke="#fff" strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 1})`} /></g>;
export const Cloth = ({ x, y, o, t, w = 160 }: { x: number; y: number; o: number; t: number; w?: number }) => o <= 0 ? null : <g transform={`translate(${x + Math.sin(t / 5) * w} ${y + Math.cos(t / 5) * 20})`} opacity={o}>
  <rect x={-60} y={-40} width={120} height={80} rx={22} fill={C.mint} /><rect x={-60} y={-40} width={120} height={26} rx={12} fill="#ffd36b" /></g>;
const Twinkles = ({ pts, t }: { pts: number[][]; t: number }) => <g>{pts.map(([x, y], i) => <Star key={i} x={x} y={y} s={2 + Math.sin((t + i * 9) / 5)} color="#fff" o={0.9} />)}</g>;
const Btn = ({ x, y, on, press, r = 22 }: { x: number; y: number; on: number; press: number; r?: number }) => <g transform={`translate(${x} ${y}) scale(${1 - 0.15 * press})`}>
  <circle r={r} fill={C.navy} /><circle r={r * 0.55} fill={on > 0.5 ? C.mint : C.pale} /></g>;
const Display = ({ x, y, w, text, on }: { x: number; y: number; w: number; text: string; on: number }) => <g>
  <rect x={x - w / 2} y={y - 24} width={w} height={48} rx={12} fill={C.deep} />
  <text x={x} y={y + 11} textAnchor="middle" fontSize={30} fontWeight={700} fill={on ? C.mint : "#cfe6ff"} fontFamily="monospace">{text}</text></g>;
const card = (good: boolean, el: ReactNode) => <g>{el}</g>;

// ---------- Washing machine (front loader): hidden pump-filter flap bottom front ----------
const washer: Appliance = {
  part: [400, 700], button: [640, 70],
  Draw: ({ s }) => <g>
    <rect x={130} y={10} width={540} height={760} rx={40} fill={B.body} />
    <rect x={130} y={10} width={540} height={110} rx={40} fill={B.panel} /><rect x={130} y={80} width={540} height={40} fill={B.panel} />
    <rect x={170} y={40} width={150} height={50} rx={12} fill={B.line} opacity={0.5} />
    <Display x={460} y={66} w={150} text="40°" on={0} /><circle cx={610} cy={66} r={30} fill={B.dark} /><circle cx={610} cy={66} r={14} fill={B.panel} />
    <circle cx={400} cy={380} r={210} fill={B.panel} stroke={B.dark} strokeWidth={10} />
    <circle cx={400} cy={380} r={160} fill={B.glass} /><path d="M 300 330 a 120 120 0 0 1 90 -80" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.6} />
    <rect x={590} y={350} width={26} height={70} rx={10} fill={B.dark} />
    {/* tray */}
    <g opacity={Math.min(1, s.remove * 3)}><rect x={250} y={735} width={300} height={40} rx={10} fill={C.pale} /><Drops x={400} y={700} o={s.water * 0.4 + (s.remove > 0 && s.remove < 1 ? 0.6 : 0)} t={s.t} w={60} /></g>
    {/* flap + filter */}
    <rect x={315} y={655} width={170} height={80} rx={14} fill={B.panel} stroke={B.dark} strokeWidth={5} />
    <g transform={`translate(400 ${695 + 60 * s.remove}) rotate(${-90 * Math.min(1, s.remove * 1.5)})`} opacity={s.open > 0.05 ? 1 : 0}>
      <circle r={34} fill="#dfe8ef" stroke={B.dark} strokeWidth={6} /><rect x={-26} y={-6} width={52} height={12} rx={6} fill={C.navy} />
      <Grime pts={[[-14, -16], [16, 14], [-10, 18]]} o={s.grime} r={10} /><circle cx={20} cy={-18} r={9} fill="#e0b84c" opacity={s.grime} />
    </g>
    <g transform={`translate(315 735) scale(1 ${1 - 2 * s.open}) translate(-315 -735)`}><rect x={315} y={655} width={170} height={80} rx={14} fill={B.panel} stroke={B.dark} strokeWidth={5} /><rect x={370} y={668} width={60} height={12} rx={6} fill={B.dark} /></g>
    <Stink x={400} y={640} o={s.stink} t={s.t} />
  </g>,
  Closeup: ({ good, t }) => <g transform="scale(2.6)">
    <circle r={40} fill="#dfe8ef" stroke={B.dark} strokeWidth={6} /><rect x={-30} y={-7} width={60} height={14} rx={7} fill={C.navy} />
    {!good && <><Grime pts={[[-18, -20], [18, 16], [-12, 22], [20, -24]]} o={1} r={9} /><circle cx={-24} cy={2} r={8} fill="#e0b84c" /><path d="M -30 30 q 30 20 60 -6" stroke={C.grime} strokeWidth={5} fill="none" /></>}
    {good && <Twinkles pts={[[-34, -34], [36, 30]]} t={t} />}</g>,
};

// ---------- Oven: hidden Steam Clean setting on the panel ----------
const oven: Appliance = {
  part: [400, 470], button: [620, 70],
  Draw: ({ s }) => <g>
    <rect x={60} y={10} width={680} height={760} rx={40} fill={B.body} />
    <rect x={60} y={10} width={680} height={120} rx={40} fill={B.panel} /><rect x={60} y={90} width={680} height={40} fill={B.panel} />
    {[130, 210].map((x) => <g key={x}><circle cx={x} cy={70} r={30} fill={B.dark} /><rect x={x - 5} y={44} width={10} height={26} rx={4} fill={B.panel} /></g>)}
    <Display x={400} y={70} w={190} text={s.mode > 0.5 ? "STEAM" : "180°C"} on={s.mode} />
    <Btn x={620} y={70} on={s.mode} press={s.press} r={26} />
    <rect x={100} y={170} width={600} height={30} rx={14} fill={B.line} />
    <rect x={100} y={230} width={600} height={500} rx={30} fill={B.panel} stroke={B.dark} strokeWidth={8} />
    <rect x={150} y={280} width={500} height={380} rx={20} fill="#2a3f5c" />
    <rect x={150} y={280} width={500} height={380} rx={20} fill="#ff9a3c" opacity={s.steam * 0.35} />
    {[360, 470].map((y) => <line key={y} x1={170} y1={y} x2={630} y2={y} stroke="#6f869c" strokeWidth={6} />)}
    <ellipse cx={400} cy={630} rx={200 * s.pour} ry={18 * s.pour} fill="#8fd3ff" opacity={0.8 * (1 - s.wipe)} />
    <Grime pts={[[220, 320], [560, 330], [300, 420], [520, 520], [240, 600], [450, 400], [600, 600]]} o={s.grime} r={20} />
    <Steam x={400} y={600} o={s.steam} t={s.t} n={4} h={140} />
    <Cloth x={400} y={470} o={s.wipe > 0 && s.wipe < 1 ? 1 : 0} t={s.t} />
    <path d="M 180 300 l 120 0" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.25} />
    <Clock x={400} y={470} o={s.wait} t={s.t} />
    <Stink x={400} y={260} o={s.stink} t={s.t} />
  </g>,
  Closeup: ({ good, t }) => <g><rect x={-170} y={-150} width={340} height={300} rx={22} fill="#2a3f5c" stroke={B.dark} strokeWidth={8} />
    {!good && <Grime pts={[[-110, -90], [90, -80], [-40, 0], [100, 60], [-120, 90], [20, -110], [40, 100]]} o={1} r={22} />}
    {good && <><path d="M -140 -120 l 90 0" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.4} /><Twinkles pts={[[-100, -60], [110, 40], [0, 100]]} t={t} /></>}</g>,
};

// ---------- Fridge: hidden Holiday mode on the door panel ----------
const fridge: Appliance = {
  part: [400, 380], button: [470, 120],
  Draw: ({ s }) => { const open = s.open * (1 - Math.max(s.close, s.mode, s.press)); return <g>
    <rect x={190} y={0} width={420} height={780} rx={36} fill={B.body} />
    <line x1={190} y1={540} x2={610} y2={540} stroke={B.dark} strokeWidth={6} />
    {/* interior (visible when open) */}
    <g opacity={open}><rect x={215} y={30} width={370} height={490} rx={20} fill="#e4f3fb" />
      {[170, 300, 420].map((y) => <rect key={y} x={225} y={y} width={350} height={10} rx={5} fill="#b9cfdf" />)}
      <g opacity={1 - s.remove}>{[[260, 130, "#ff8f8f"], [340, 120, "#ffd36b"], [460, 140, C.mint], [280, 260, "#9fd0ff"], [420, 250, "#ffb85c"], [520, 390, "#ff8f8f"], [300, 390, C.pale]].map(([x, y, c], i) =>
        <rect key={i} x={(x as number) - 34} y={(y as number) - 44 - s.remove * 80} width={68} height={88} rx={14} fill={c as string} />)}</g></g>
    {/* door (closed) */}
    <g opacity={1 - open}><rect x={190} y={0} width={420} height={538} rx={36} fill={B.body} /><rect x={560} y={150} width={20} height={240} rx={10} fill={B.dark} />
      <rect x={250} y={70} width={300} height={110} rx={20} fill={B.panel} />
      <Display x={350} y={120} w={150} text={s.mode > 0.5 ? "15°" : "4°C"} on={s.mode} />
      <Btn x={470} y={120} on={s.mode} press={s.press} />
      {s.mode > 0.5 && <text x={400} y={220} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.mint} fontFamily="sans-serif">HOLIDAY</text>}</g>
    <rect x={560} y={600} width={20} height={130} rx={10} fill={B.dark} />
    <text x={300} y={680} fontSize={30} fill={B.dark} fontFamily="sans-serif" fontWeight={700}>❄ -18°</text>
    <Clock x={400} y={380} o={s.wait} t={s.t} />
  </g>; },
  Closeup: ({ good }) => <g><rect x={-160} y={-120} width={320} height={240} rx={30} fill={B.panel} />
    <rect x={-120} y={-80} width={240} height={90} rx={16} fill={C.deep} />
    <text x={0} y={-18} textAnchor="middle" fontSize={64} fontWeight={700} fill={good ? C.mint : "#cfe6ff"} fontFamily="monospace">{good ? "15°" : "4°C"}</text>
    <text x={0} y={80} textAnchor="middle" fontSize={40} fontWeight={800} fill={good ? C.mint : B.dark} fontFamily="sans-serif">{good ? "HOLIDAY ON" : "FULL POWER"}</text></g>,
};

// ---------- Microwave: lemon steam trick ----------
const microwave: Appliance = {
  part: [320, 520], button: [660, 550],
  Draw: ({ s }) => { const on = s.steam > 0 && s.wait === 0 ? 1 : 0; return <g transform="translate(0 120)">
    <rect x={40} y={60} width={720} height={480} rx={36} fill={B.body} />
    <rect x={80} y={100} width={480} height={400} rx={22} fill={B.panel} stroke={B.dark} strokeWidth={8} />
    <rect x={110} y={130} width={420} height={340} rx={14} fill="#2a3f5c" />
    <rect x={110} y={130} width={420} height={340} rx={14} fill="#ffe08a" opacity={on * 0.35} />
    <Grime pts={[[160, 170], [480, 180], [220, 260], [460, 300], [170, 400], [330, 160], [500, 420]]} o={s.grime} r={16} />
    <ellipse cx={320} cy={440} rx={160} ry={18} fill="#6f869c" />
    <g opacity={s.pour} transform={`translate(0 ${(1 - s.pour) * -40})`}><path d="M 250 380 h 140 l -16 56 h -108z" fill="#f4fbf8" stroke={B.dark} strokeWidth={5} />
      <circle cx={295} cy={384} r={22} fill="#ffe04d" stroke="#e8b800" strokeWidth={4} /><circle cx={345} cy={384} r={22} fill="#ffe04d" stroke="#e8b800" strokeWidth={4} /></g>
    <Steam x={320} y={370} o={s.steam} t={s.t} n={3} h={150} />
    <Cloth x={320} y={260} o={s.wipe > 0 && s.wipe < 1 ? 1 : 0} t={s.t} w={140} />
    <rect x={590} y={100} width={140} height={400} rx={18} fill={B.panel} />
    <Display x={660} y={150} w={110} text={s.steam > 0 && s.wait === 0 ? `${Math.max(0, 3 - Math.floor(s.t / 30) % 4)}:00` : "0:00"} on={on} />
    {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={612 + c * 52} y={200 + r * 52} width={42} height={40} rx={8} fill={B.line} />))}
    <Btn x={660} y={430} on={on} press={s.press} r={30} />
    <Clock x={320} y={300} o={s.wait} t={s.t} />
    <Stink x={320} y={250} o={s.stink} t={s.t} />
  </g>; },
  Closeup: oven.Closeup,
};

// ---------- Kettle: limescale descale ----------
const kettle: Appliance = {
  part: [400, 560], button: [560, 705],
  Draw: ({ s }) => { const lvl = 0.25 + 0.5 * s.pour * (1 - 0.8 * s.water); return <g>
    <rect x={180} y={690} width={440} height={60} rx={26} fill={B.dark} /><rect x={530} y={700} width={60} height={20} rx={8} fill={s.steam > 0 && s.wait === 0 ? "#ff9a3c" : C.pale} />
    <path d="M 250 680 L 280 200 Q 400 150 520 200 L 550 680 Z" fill={B.body} stroke={B.dark} strokeWidth={8} />
    <path d="M 520 250 q 110 20 100 180 q -10 120 -80 160" fill="none" stroke={B.dark} strokeWidth={40} strokeLinecap="round" />
    <path d="M 285 260 L 180 180 L 200 170 L 295 230" fill={B.body} stroke={B.dark} strokeWidth={8} />
    <rect x={330} y={150} width={140} height={34} rx={14} fill={C.navy} />
    {/* water window (cutaway) */}
    <clipPath id="kw"><path d="M 300 640 L 318 280 L 482 280 L 500 640 Z" /></clipPath>
    <path d="M 300 640 L 318 280 L 482 280 L 500 640 Z" fill="#dfeaf2" stroke={B.line} strokeWidth={6} />
    <g clipPath="url(#kw)"><rect x={290} y={640 - 360 * lvl} width={220} height={400} fill={s.pour > 0.5 && s.water < 0.5 ? "#c9e7d9" : "#9fd0ff"} opacity={0.85} />
      <Grime pts={[[330, 620], [380, 630], [440, 615], [480, 628], [350, 560], [460, 500], [410, 590]]} o={s.grime} r={14} />
      {s.grime > 0.1 && [[340, 600], [420, 600], [470, 560]].map(([x, y], i) => <rect key={i} x={x} y={y - ((s.t * 2 + i * 20) % 120) * s.steam} width={16} height={8} rx={3} fill="#fff" opacity={0.8 * s.grime} />)}</g>
    <Steam x={190} y={170} o={s.steam * (1 - s.wait)} t={s.t} n={2} h={120} />
    <Clock x={400} y={420} o={s.wait} t={s.t} />
    <Stink x={400} y={130} o={0} t={s.t} />
  </g>; },
  Closeup: ({ good, t }) => <g><path d="M -150 140 L -120 -120 L 120 -120 L 150 140 Z" fill="#dfeaf2" stroke={B.dark} strokeWidth={8} />
    <rect x={-130} y={-40} width={260} height={170} fill="#9fd0ff" opacity={0.8} />
    {!good && <Grime pts={[[-90, 110], [-30, 120], [40, 108], [100, 118], [-60, 60], [70, 40], [0, 80]]} o={1} r={18} />}
    {!good && [[-70, 10], [30, -10], [80, 60]].map(([x, y], i) => <rect key={i} x={x} y={y} width={24} height={12} rx={4} fill="#fff" />)}
    {good && <Twinkles pts={[[-90, -80], [100, -20], [0, 90]]} t={t} />}</g>,
};

// ---------- Coffee capsule machine: hidden two-button descale mode ----------
const coffee: Appliance = {
  part: [610, 420], button: [400, 80],
  Draw: ({ s }) => { const blink = s.mode > 0.5 ? (Math.floor(s.t / 4) % 2) : 0; return <g>
    <rect x={540} y={160} width={150} height={520} rx={24} fill="#dfeaf2" stroke={B.line} strokeWidth={6} opacity={0.95} />
    <rect x={548} y={680 - 500 * (0.3 + 0.6 * s.pour * (1 - 0.7 * s.water))} width={134} height={500 * (0.3 + 0.6 * s.pour * (1 - 0.7 * s.water))} rx={18} fill={s.pour > 0.5 && s.water < 0.5 ? "#ffd59a" : "#9fd0ff"} opacity={0.8} />
    <Grime pts={[[580, 650], [640, 655], [610, 630]]} o={s.grime} r={14} />
    <path d="M 160 120 Q 160 40 260 40 L 540 40 Q 560 40 560 80 L 560 700 L 160 700 Z" fill={B.body} stroke={B.dark} strokeWidth={8} />
    <rect x={180} y={60} width={360} height={60} rx={20} fill={B.panel} />
    {[360, 440].map((x) => <g key={x} transform={`translate(${x} 90) scale(${1 - 0.15 * s.press})`}><circle r={24} fill={C.navy} /><circle r={13} fill={blink ? C.mint : s.mode > 0.5 ? C.navy : C.pale} /></g>)}
    <rect x={200} y={150} width={320} height={40} rx={18} fill={B.dark} />
    <rect x={330} y={200 - 120 * Math.min(1, s.remove * 2)} width={60} height={50} rx={10} fill={C.mint} opacity={s.remove < 0.9 ? 1 : 0} />
    <rect x={250} y={200} width={220} height={140} rx={26} fill={B.panel} />
    <rect x={340} y={340} width={40} height={40} rx={10} fill={B.dark} />
    {s.water > 0 && <rect x={352} y={380} width={16} height={180} rx={8} fill="#9fd0ff" opacity={s.water} />}
    <g transform={`translate(${s.remove > 0 ? -160 * Math.sin(Math.PI * Math.min(1, s.remove)) : 0} 0)`}>
      <rect x={180} y={600} width={360} height={60} rx={16} fill={B.line} /><g opacity={0.7}>{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={210 + i * 60} y1={610} x2={210 + i * 60} y2={650} stroke={B.panel} strokeWidth={6} />)}</g></g>
    <path d="M 300 480 h 120 l -10 110 h -100z" fill="#fff" stroke={B.dark} strokeWidth={6} />
    <Steam x={360} y={470} o={1 - s.grime} t={s.t} n={2} h={90} />
  </g>; },
  Closeup: ({ good, t }) => <g><path d="M -120 -40 h 240 l -24 190 h -192z" fill="#fff" stroke={B.dark} strokeWidth={8} />
    <ellipse cx={0} cy={-40} rx={120} ry={22} fill="#8a5a33" /><path d="M 120 0 q 60 0 50 60 q -10 40 -60 40" fill="none" stroke={B.dark} strokeWidth={14} />
    {good ? <Steam x={0} y={-70} o={1} t={t} n={3} h={130} /> : <path d="M -40 -80 q 10 -20 0 -40" stroke="#9fb2c4" strokeWidth={6} fill="none" opacity={0.6} />}</g>,
};

// ---------- Dryer (condenser): hidden second filter bottom, water tank ----------
const dryer: Appliance = {
  part: [400, 700], button: [640, 70],
  Draw: (p) => washer.Draw(p),
  Closeup: ({ good, t }) => <g><rect x={-150} y={-110} width={300} height={220} rx={20} fill="#dfe8ef" stroke={B.dark} strokeWidth={8} />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-130 + i * 43} y1={-100} x2={-130 + i * 43} y2={100} stroke={B.line} strokeWidth={4} />)}
    {!good && <rect x={-140} y={-90} width={280} height={180} rx={30} fill="#b8b0a6" opacity={0.9} />}{good && <Twinkles pts={[[-100, -60], [110, 50]]} t={t} />}</g>,
};

// ---------- Vacuum (upright): brush roll + filter ----------
const vacuum: Appliance = {
  part: [400, 690], button: [400, 300],
  Draw: ({ s }) => <g>
    <rect x={370} y={20} width={60} height={300} rx={26} fill={B.dark} /><rect x={330} y={10} width={140} height={50} rx={24} fill={C.navy} />
    <rect x={310} y={260} width={180} height={320} rx={70} fill={B.body} stroke={B.dark} strokeWidth={8} />
    <rect x={345} y={300} width={110} height={180} rx={40} fill="#dfeaf2" /><Grime pts={[[380, 440], [420, 450], [400, 410]]} o={s.grime} r={16} />
    <rect x={200} y={600} width={400} height={130} rx={50} fill={B.body} stroke={B.dark} strokeWidth={8} />
    <rect x={240} y={660} width={320} height={50} rx={25} fill={B.line} />
    {s.grime > 0.05 && [0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${270 + i * 60} 660 q 20 25 0 50`} stroke={C.grime} strokeWidth={7} fill="none" opacity={s.grime} />)}
    <Cloth x={400} y={685} o={s.wipe > 0 && s.wipe < 1 ? 1 : 0} t={s.t} w={120} />
  </g>,
  Closeup: ({ good, t }) => <g><rect x={-170} y={-50} width={340} height={100} rx={50} fill={B.line} stroke={B.dark} strokeWidth={8} />
    {!good && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-140 + i * 56} -50 q 26 50 0 100`} stroke={C.grime} strokeWidth={8} fill="none" />)}{good && <Twinkles pts={[[-120, -80], [120, 70]]} t={t} />}</g>,
};

// ---------- Air fryer: basket + heating element ----------
const airfryer: Appliance = {
  part: [400, 540], button: [400, 150],
  Draw: ({ s }) => <g>
    <path d="M 200 700 L 220 120 Q 400 40 580 120 L 600 700 Z" fill={B.body} stroke={B.dark} strokeWidth={8} />
    <Display x={400} y={170} w={170} text={s.steam > 0 ? "200°" : "AIR"} on={s.steam > 0 ? 1 : 0} />
    <g transform={`translate(${-s.open * 120} ${s.open * 40})`}><rect x={215} y={420} width={370} height={240} rx={30} fill={B.panel} stroke={B.dark} strokeWidth={8} />
      <rect x={580} y={500} width={90} height={40} rx={18} fill={C.navy} />
      <Grime pts={[[280, 470], [480, 480], [360, 560], [520, 600]]} o={s.grime} r={20} /></g>
    <Drops x={300} y={420} o={s.water} t={s.t} w={160} />
  </g>,
  Closeup: ({ good, t }) => <g><rect x={-160} y={-110} width={320} height={220} rx={26} fill={B.panel} stroke={B.dark} strokeWidth={8} />
    {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-140} y1={-80 + i * 40} x2={140} y2={-80 + i * 40} stroke={B.line} strokeWidth={5} />)}
    {!good && <Grime pts={[[-100, -60], [80, -40], [-20, 30], [100, 70], [-110, 70]]} o={1} r={22} />}{good && <Twinkles pts={[[-100, -70], [110, 60]]} t={t} />}</g>,
};

export const APPLIANCES: Record<string, Appliance> = { washer, oven, fridge, microwave, kettle, coffee, dryer, vacuum, airfryer };
export { card };
