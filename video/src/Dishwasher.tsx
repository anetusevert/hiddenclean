import { C, Star } from "./brand";
// Clean flat dishwasher (front, door open view). viewBox 0 0 800 780. Filter centre = (400, 650).
export type DwState = { rackOut: number; twist: number; lift: number; grime: number; stink: number; water: number; t: number };
export const FILTER = { x: 400, y: 650 };

export function Filter({ twist = 0, grime = 1, scale = 1, t = 0 }: { twist?: number; grime?: number; scale?: number; t?: number }) {
  const spots = [[-22, -60], [18, -30], [-10, 5], [25, 30], [-28, 40], [5, -78], [30, -70]];
  return <g transform={`scale(${scale})`}>
    <ellipse cx={0} cy={62} rx={118} ry={22} fill="#b9c9d6" stroke="#8ea4b8" strokeWidth={4} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-100 + i * 25} y1={50} x2={-100 + i * 25} y2={74} stroke="#8ea4b8" strokeWidth={2} />)}
    <g transform={`rotate(${twist * 0.08})`}>
      <rect x={-46} y={-95} width={92} height={160} rx={18} fill="#dfe8ef" stroke="#7f95aa" strokeWidth={5} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-46} y1={-70 + i * 24} x2={46} y2={-70 + i * 24} stroke="#9fb2c4" strokeWidth={3} />)}
      <rect x={-56} y={-112} width={112} height={30} rx={10} fill="#7f95aa" />
      <rect x={-8 + twist * 0.25} y={-118} width={16} height={42} rx={6} fill={C.navy} />
      {spots.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={14 + (i % 3) * 5} ry={9 + (i % 2) * 4} fill={C.grime} opacity={grime * 0.85} />)}
    </g>
    {grime < 0.2 && [[-70, -90], [70, -40], [-60, 30]].map(([x, y], i) => <Star key={i} x={x} y={y} s={2 + Math.sin((t + i * 9) / 5)} color="#ffffff" o={0.9} />)}
  </g>;
}

export function Dishwasher({ s }: { s: DwState }) {
  const { rackOut, twist, lift, grime, stink, water, t } = s;
  return <g>
    <rect x={40} y={10} width={720} height={760} rx={44} fill="#eef4f8" />
    <rect x={40} y={10} width={720} height={110} rx={44} fill="#dce7ef" />
    <rect x={40} y={80} width={720} height={40} fill="#dce7ef" />
    <rect x={120} y={45} width={170} height={44} rx={12} fill={C.deep} />
    <text x={205} y={77} textAnchor="middle" fontSize={28} fontWeight={700} fill={C.mint} fontFamily="monospace">ECO 55°</text>
    {[420, 500, 580].map((x) => <circle key={x} cx={x} cy={67} r={18} fill="#c3d2de" />)}
    <circle cx={672} cy={67} r={20} fill={C.navy} /><circle cx={672} cy={67} r={11} fill={C.pale} />
    <rect x={90} y={150} width={620} height={590} rx={26} fill="#c9dae7" />
    <rect x={90} y={150} width={620} height={590} rx={26} fill="none" stroke="#b2c6d6" strokeWidth={6} />
    {/* upper rack */}
    <g opacity={0.8}>
      <rect x={130} y={200} width={540} height={120} rx={14} fill="none" stroke="#8ea4b8" strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={160 + i * 42} y1={210} x2={160 + i * 42} y2={310} stroke="#8ea4b8" strokeWidth={4} />)}
    </g>
    {/* spray arm */}
    <rect x={210} y={548} width={380} height={26} rx={13} fill="#9fb2c4" />
    <circle cx={400} cy={561} r={24} fill="#8ea4b8" />
    {[250, 310, 490, 550].map((x) => <circle key={x} cx={x} cy={561} r={5} fill="#6f869c" />)}
    {/* filter */}
    <g transform={`translate(${FILTER.x} ${FILTER.y - lift})`}><Filter twist={twist} grime={grime} t={t} /></g>
    {/* water rinse */}
    {water > 0 && Array.from({ length: 10 }, (_, i) => { const yy = ((t * 9 + i * 37) % 160); return <ellipse key={i} cx={330 + (i * 53) % 140} cy={FILTER.y - lift - 170 + yy} rx={6} ry={12} fill="#8fd3ff" opacity={water * (1 - yy / 170)} />; })}
    {water > 0 && Array.from({ length: 6 }, (_, i) => <circle key={`b${i}`} cx={340 + i * 24} cy={FILTER.y - lift - 40 - ((t * 2 + i * 30) % 90)} r={8 + (i % 3) * 3} fill="none" stroke="#ffffff" strokeWidth={3} opacity={water * 0.8} />)}
    {/* stink lines */}
    {stink > 0 && [-60, 0, 60].map((dx, i) => <path key={i} d={`M ${400 + dx} ${590} q 18 -30 0 -60 q -18 -30 0 -60`} fill="none" stroke="#9c8a4f" strokeWidth={8} strokeLinecap="round"
      opacity={stink * (0.5 + 0.5 * Math.sin((t + i * 10) / 6))} transform={`translate(0 ${-((t * 1.2 + i * 12) % 30)})`} />)}
    {/* lower rack (slides out) */}
    <g transform={`translate(0 ${rackOut * 300})`} opacity={1 - 0.75 * rackOut}>
      <rect x={120} y={400} width={560} height={130} rx={14} fill="rgba(255,255,255,.25)" stroke="#7f95aa" strokeWidth={7} />
      {Array.from({ length: 13 }, (_, i) => <line key={i} x1={150 + i * 42} y1={410} x2={150 + i * 42} y2={480} stroke="#7f95aa" strokeWidth={5} strokeLinecap="round" />)}
      <circle cx={140} cy={540} r={14} fill="#7f95aa" /><circle cx={660} cy={540} r={14} fill="#7f95aa" />
    </g>
  </g>;
}
