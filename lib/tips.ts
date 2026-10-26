import { RAW, START } from "./data";
import { slugify } from "./seo";

export const SITE_NAME = "HiddenClean";
export const SITE_URL = "https://www.hiddenclean.com";
export const SITE_DESC = "One cleaning hack a day: bathrooms, floors, stains and the secret settings on appliances you already own. Every tip is safety-checked.";
export const SAFETY_RULE = "Never mix cleaning products. Bleach plus ammonia, vinegar or other acids releases toxic gases. Use one product at a time, rinse between them, ventilate, and unplug appliances before you clean them.";

export type Hub = { id: string; key: string; label: string; searchPhrase: string; title: string; intro: string };
const HUB_DEFS: [string, string, string, string][] = [
  ["dw", "Dishwasher", "how to clean a dishwasher", "Filters, spray arms, seals and the hidden clean cycle."],
  ["wm", "Washing machine", "how to clean a washing machine", "Drum clean programs, the pump filter, the seal and the drawer."],
  ["ov", "Oven & hob", "how to clean an oven", "Self clean, steam modes, door glass, racks, hobs and hoods."],
  ["mw", "Microwave", "how to clean a microwave", "Steam tricks, turntables, doors and grease filters."],
  ["fr", "Fridge & freezer", "how to clean a fridge", "Coils, drain holes, seals, smells and freezers."],
  ["dr", "Dryer", "how to clean a dryer", "Lint screens, vents, condenser filters and water tanks."],
  ["cf", "Coffee makers", "how to clean a coffee maker", "Descaling, secret descale modes, grinders and presses."],
  ["sm", "Small appliances", "how to clean small kitchen appliances", "Kettles, air fryers, toasters, blenders and pans."],
  ["sk", "Kitchen sink", "how to clean a kitchen sink", "Drains, disposals, overflows, taps and stainless steel."],
  ["bt", "Bathroom", "how to clean a bathroom", "Shower heads, grout, tiles, toilets, tubs and fans."],
  ["vc", "Vacuums", "how to clean a vacuum cleaner", "Filters, brush rolls and robot vacuums."],
  ["ls", "Laundry stains", "how to remove laundry stains", "Grass, wine, grease and sweat stains without ruining fabric."],
  ["fl", "Floors & home", "how to clean floors and home surfaces", "Floors, mattresses, pillows, mirrors, baseboards and air appliances."],
];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const HUBS: Hub[] = HUB_DEFS.map(([key, label, searchPhrase, intro]) => ({
  key, label, searchPhrase, intro, title: cap(searchPhrase), id: slugify(searchPhrase).replace(/^how-to-/, ""),
}));

export type Tip = {
  slug: string; title: string; displayName: string; date: string; hubs: Hub[];
  searchPhrase: string; answer: string; steps: string[]; safety: string; faq: { q: string; a: string }[];
};

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const ALL_TIPS: Tip[] = RAW.reduce<Tip[]>((acc, [searchPhrase, displayName, hubKeys, answer, steps, safety, maybeDate]) => {
  const hubs = hubKeys.split(",").map((k) => {
    const h = HUBS.find((x) => x.key === k);
    if (!h) throw new Error(`Unknown hub ${k} on "${searchPhrase}"`);
    return h;
  });
  const title = cap(searchPhrase);
  const date = maybeDate && /^\d{4}-\d{2}-\d{2}$/.test(maybeDate)
    ? maybeDate
    : acc.length ? addDays(acc[acc.length - 1].date, 1) : START;
  acc.push({
    slug: slugify(searchPhrase), title, displayName, date, hubs, searchPhrase, answer,
    steps: steps.split("|"), safety,
    faq: [
      { q: `Is it safe to ${searchPhrase.replace(/^how to /, "")} at home?`, a: `Yes, with care. ${safety} ${SAFETY_RULE}` },
      { q: "How often should I do this?", a: "As soon as you notice the mess, or on a weekly/monthly rhythm for upkeep. Your product label or appliance manual has the final word." },
    ],
  });
  return acc;
}, []);

// assertLibrary: slugs unique, phrase lowercase, slug = slugify(phrase), every tip has a safety note.
(function assertLibrary() {
  const seen = new Set<string>();
  for (const t of ALL_TIPS) {
    if (t.searchPhrase !== t.searchPhrase.toLowerCase()) throw new Error(`Phrase not lowercase: ${t.searchPhrase}`);
    if (seen.has(t.slug)) throw new Error(`Duplicate slug ${t.slug}`);
    if (!t.safety.trim()) throw new Error(`Missing safety check: ${t.slug}`);
    seen.add(t.slug);
  }
})();

export function todayBerlin() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
}
/** Live tips only (date on or before today in Berlin), newest first. Everything reads from this. */
export function byNewest(): Tip[] {
  const today = todayBerlin();
  return ALL_TIPS.filter((t) => t.date <= today).sort((a, b) => (a.date < b.date ? 1 : -1));
}
export const getTip = (slug: string) => byNewest().find((t) => t.slug === slug);
export const MIN_HUB_TIPS = 2;
export const hubTips = (hub: Hub) => byNewest().filter((t) => t.hubs.includes(hub));
export const liveHubs = () => HUBS.filter((h) => hubTips(h).length >= MIN_HUB_TIPS);
export const prettyDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "+01:00" or "+02:00": Europe/Berlin offset on that date (CET/CEST). */
export function berlinOffset(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  const part = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Berlin", timeZoneName: "shortOffset" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const h = Number(part.replace("GMT", "")) || 1;
  return `+${String(h).padStart(2, "0")}:00`;
}
