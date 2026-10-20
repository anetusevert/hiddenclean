import { interpolate } from "remotion";
// HiddenClean palette (locked): navy + mint, mint-pale glow, warm ink for grime.
export const C = { navy: "#14325f", deep: "#0c2245", mint: "#4dbb9f", pale: "#9fd9c8", ink: "#ffffff", mut: "#a9bbd6", card: "#f4fbf8", grime: "#8a6a3f", warn: "#ffb85c" };
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The secret-button-with-sparkle mark (same geometry as public/mark.svg). glow 0..1 lights it up. */
export function Mark({ size = 120, glow = 0, onDark = true, press = 0 }: { size?: number; glow?: number; onDark?: boolean; press?: number }) {
  const ring = onDark ? "#ffffff" : C.navy;
  return <svg width={size} height={size} viewBox="0 0 64 64" style={{ overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${8 + 22 * glow}px rgba(77,187,159,${0.4 + 0.5 * glow}))` : undefined }}>
    <g transform={`translate(27 35) scale(${1 - 0.08 * press}) translate(-27 -35)`}>
      <circle cx="27" cy="35" r="20" fill="none" stroke={ring} strokeWidth="6" />
      <circle cx="27" cy="35" r="13" fill={glow > 0.05 ? `rgb(${159 + 96 * glow},${217 + 38 * glow},${200 + 55 * glow})` : C.pale} />
      <path d="M19 30a10 10 0 0 0 14 14" fill="none" stroke={C.mint} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M38 51l6 4" stroke={ring} strokeWidth="6" strokeLinecap="round" />
    </g>
    <g style={{ transformOrigin: "52px 13px", transform: `scale(${0.85 + 0.3 * glow})` }}><path d="M52 4l2.2 6.8L61 13l-6.8 2.2L52 22l-2.2-6.8L43 13l6.8-2.2z" fill={C.mint} /></g>
    <path d="M58 23l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill={C.mint} opacity={0.6 + 0.4 * glow} />
  </svg>;
}

/** 4-point sparkle star. */
export function Star({ x, y, s, o = 1, color = "#ffffff" }: { x: number; y: number; s: number; o?: number; color?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4Z" fill={color} opacity={o} />;
}

/** THE REVEAL (signature motif): a mint glow ring expands from a hidden part, then sparkles burst and twinkle.
 * t = frames since the reveal started. Draw inside an <svg>. */
export function Reveal({ cx, cy, r, t }: { cx: number; cy: number; r: number; t: number }) {
  if (t < 0) return null;
  const ring = interpolate(t, [0, 18], [0.4, 1.35], clamp), ro = interpolate(t, [0, 6, 22], [0, 0.9, 0], clamp);
  const halo = interpolate(t, [0, 10], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(t / 5));
  const stars = [[-1.1, -0.9, 1.6], [1.15, -0.7, 1.2], [1.0, 0.95, 1.4], [-1.2, 0.6, 1.0], [0.1, -1.35, 1.1], [-0.3, 1.3, 0.8]];
  return <g>
    <circle cx={cx} cy={cy} r={r * 1.15} fill="url(#hcHalo)" opacity={halo} />
    <circle cx={cx} cy={cy} r={r * ring} fill="none" stroke={C.mint} strokeWidth={10} opacity={ro} />
    {stars.map(([dx, dy, k], i) => { const d = 4 + i * 3; const tw = interpolate(t, [d, d + 8], [0, 1], clamp) * (0.55 + 0.45 * Math.abs(Math.sin((t + i * 7) / 6)));
      return <Star key={i} x={cx + dx * r} y={cy + dy * r} s={k * 2.4 * tw} o={tw} color={i % 2 ? C.pale : "#ffffff"} />; })}
  </g>;
}
export const HaloDef = () => <defs><radialGradient id="hcHalo"><stop offset="0" stopColor={C.mint} stopOpacity="0.7" /><stop offset="0.6" stopColor={C.mint} stopOpacity="0.18" /><stop offset="1" stopColor={C.mint} stopOpacity="0" /></radialGradient></defs>;

/** Brand pointer: a mint secret-button cursor (circle + navy ring + sparkle), tap pulse on arrival. */
export function Pointer({ x, y, tap }: { x: number; y: number; tap: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r={46 + 30 * tap} fill="none" stroke={C.mint} strokeWidth={6} opacity={tap > 0 ? 1 - tap : 0} />
    <circle r={34} fill={C.navy} stroke="#fff" strokeWidth={7} />
    <circle r={19 * (1 - 0.15 * Math.sin(Math.PI * tap))} fill={C.mint} />
    <Star x={36} y={-36} s={1.8} color={C.mint} />
  </g>;
}
