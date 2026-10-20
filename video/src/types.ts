export type Beat = "hook" | "do" | "steps" | "safety" | "result" | "cta";
export type Piece = { beat: Beat; say: string; text: string; step?: number; label?: string | null; scene?: string;
  result?: { say: string; headline: string; before: string; after: string }; start: number };
export type Word = { w: string; p: number; s: number; e: number };
export type Props = { appliance?: string; revealAt?: "part" | "button"; n: number; title: string; url: string; pieces: Piece[]; words: Word[]; voStart: number; voEnd: number; total: number; voFile: string | null };
