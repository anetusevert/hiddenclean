// Roundup guides (routines, checklists, lists) at /how-to/<id>. They link to existing tips only;
// a step whose tip isn't live yet renders as plain text (no future-tip leaks).
import { slugify } from "./seo";
import { ALL_TIPS, byNewest, SAFETY_RULE, type Tip } from "./tips";

export type GuideItem = { text: string; tip?: string; guide?: string };
export type GuideSection = { title: string; minutes?: number; items: GuideItem[] };
export type Guide = {
  id: string; title: string; displayName: string; kind: "routine" | "checklist" | "list";
  date: string; minutes: number; intro: string; answer: string; sections: GuideSection[];
  faq: { q: string; a: string }[]; supplies?: string[]; metaTitle: string;
};

const T = (p: string) => slugify(p);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const DEFS: Omit<Guide, "id" | "title">[] = [
  {
    displayName: "The 15-minute bathroom reset", metaTitle: "How to clean a bathroom in 15 minutes (step-by-step reset)", kind: "routine", date: "2026-10-30", minutes: 15,
    intro: "A timed, top-to-bottom bathroom clean for busy weeks: mirror, sink, toilet, shower and floor in 15 minutes, using one product at a time.",
    answer: "Work top to bottom and dry to wet: declutter and spray the shower (1 min), wipe the mirror dry (2 min), clean the sink and toothbrush holder (3 min), do the toilet including under the rim (4 min), rinse the shower walls (3 min), then sweep and mop out the door (2 min).",
    supplies: ["Microfibre cloths", "Bathroom cleaner (one product)", "Toilet cleaner and brush", "Bottle brush or old toothbrush", "Mop or floor cloth"],
    sections: [
      { title: "Clear and pre-spray", minutes: 1, items: [
        { text: "Take out bins, towels and bottles so every surface is bare." },
        { text: "Spray the shower walls or tiles with your bathroom cleaner and leave it to work while you do the rest.", tip: T("how to clean bathroom tiles") }] },
      { title: "Mirror", minutes: 2, items: [
        { text: "Wipe the mirror with a barely damp microfibre cloth, then buff with a dry one so it doesn't streak.", tip: T("how to clean a mirror without streaks") }] },
      { title: "Sink and counter", minutes: 3, items: [
        { text: "Scrub the toothbrush cup with hot soapy water and leave it upside down to dry.", tip: T("how to clean a toothbrush holder") },
        { text: "Wipe the basin, tap and counter; pull the stopper and clear any hair if it drains slowly.", tip: T("how to clean a bathroom sink drain") }] },
      { title: "Toilet", minutes: 4, items: [
        { text: "Squeeze toilet cleaner up under the rim, let it sit while you wipe the seat, lid and base.", tip: T("how to clean under the toilet rim") },
        { text: "Scrub upwards under the rim and around the bowl, then flush. Limescale ring? Treat it separately another day.", tip: T("how to remove limescale from a toilet") }] },
      { title: "Shower or bath", minutes: 3, items: [
        { text: "Wipe the pre-sprayed tiles and rinse them with warm water.", tip: T("how to clean bathroom tiles") },
        { text: "Squeegee or dry the glass door so hard-water spots don't form.", tip: T("how to clean a shower door") },
        { text: "Check the silicone for black spots and note it for a longer treatment.", tip: T("how to remove mould from silicone") }] },
      { title: "Floor and finish", minutes: 2, items: [
        { text: "Sweep or vacuum, then mop from the far corner towards the door with clean water.", tip: T("how to mop floors without streaks") },
        { text: "Put fresh towels out and switch the extractor fan on to dry the room.", tip: T("how to clean a bathroom exhaust fan") }] },
    ],
    faq: [
      { q: "Can you really clean a bathroom in 15 minutes?", a: "Yes, for a maintenance clean done weekly. Pre-spray the shower first so the cleaner works while you do the mirror, sink and toilet, and save deep jobs like grout or silicone mould for a separate session." },
      { q: "What order should you clean a bathroom in?", a: "Top to bottom and dry to wet: clear surfaces, mirror, sink, toilet, shower, then the floor last so you mop out of the room." },
      { q: "Can I use bleach and another cleaner to speed it up?", a: `No. Use one product at a time and rinse between them. ${SAFETY_RULE}` },
    ],
  },
  {
    displayName: "Printable weekly cleaning checklist", metaTitle: "Weekly cleaning checklist: free printable, 20 minutes a day", kind: "checklist", date: "2026-10-30", minutes: 20,
    intro: "A free, printable weekly cleaning checklist by room, with a 20-minute job for each day so the house never needs a full weekend blitz. Tick it off, then print a fresh one next week.",
    answer: "Split the week by room: Monday kitchen, Tuesday bathroom, Wednesday floors, Thursday laundry and cloths, Friday fridge and appliances, Saturday bedrooms and dusting, Sunday a quick reset. About 20 minutes a day covers the whole home.",
    sections: [
      { title: "Monday: kitchen", minutes: 20, items: [
        { text: "Wipe the hob once it's cool and clean the counters.", tip: T("how to clean a glass hob") },
        { text: "Rinse and dry the sink, clean the drain.", tip: T("how to clean a kitchen sink drain") },
        { text: "Wash or swap the kitchen sponge.", tip: T("how to clean a kitchen sponge") },
        { text: "Oil and dry the wooden cutting board.", tip: T("how to clean a wooden cutting board") }] },
      { title: "Tuesday: bathroom", minutes: 15, items: [
        { text: "Run the 15-minute bathroom reset.", guide: "clean-a-bathroom-in-15-minutes" },
        { text: "Clean under the toilet rim.", tip: T("how to clean under the toilet rim") },
        { text: "Scrub the toothbrush holder.", tip: T("how to clean a toothbrush holder") },
        { text: "Wipe the mirror streak-free.", tip: T("how to clean a mirror without streaks") }] },
      { title: "Wednesday: floors", minutes: 20, items: [
        { text: "Vacuum every room; untangle the brush roll if it's wrapped in hair.", tip: T("how to clean a vacuum brush roll") },
        { text: "Mop hard floors with clean water.", tip: T("how to mop floors without streaks") },
        { text: "Damp-mop wooden floors, no steam.", tip: T("how to clean hardwood floors") },
        { text: "Spot-treat any carpet stains.", tip: T("how to remove carpet stains") }] },
      { title: "Thursday: laundry and cloths", minutes: 15, items: [
        { text: "Wash microfibre cloths on their own, no softener.", tip: T("how to wash microfibre cloths") },
        { text: "Leave the washer door and drawer open to dry.", tip: T("how to clean a front load washer smell") },
        { text: "Wipe the washing machine door seal.", tip: T("how to clean a washing machine door seal") }] },
      { title: "Friday: fridge and appliances", minutes: 20, items: [
        { text: "Bin old food and wipe the fridge shelves.", tip: T("how to clean a refrigerator") },
        { text: "Empty the toaster crumb tray.", tip: T("how to clean a toaster") },
        { text: "Steam-clean the microwave with lemon.", tip: T("how to clean a microwave with lemon") },
        { text: "Rinse the dishwasher filter.", tip: T("how to clean a dishwasher filter") }] },
      { title: "Saturday: bedrooms and dusting", minutes: 20, items: [
        { text: "Change the bed and vacuum the mattress once a month.", tip: T("how to clean a mattress") },
        { text: "Dust surfaces and wipe the baseboards.", tip: T("how to clean baseboards") },
        { text: "Clean the hairbrush.", tip: T("how to clean a hairbrush") },
        { text: "Tap out and wipe the keyboard.", tip: T("how to clean a keyboard") }] },
      { title: "Sunday: 10-minute reset", minutes: 10, items: [
        { text: "Put things back where they live and empty all bins." },
        { text: "Wipe condensation off the windows and open them for 10 minutes.", tip: T("how to get rid of condensation on windows") },
        { text: "Print next week's checklist." }] },
    ],
    faq: [
      { q: "What should be on a weekly cleaning checklist?", a: "Kitchen surfaces and sink, bathroom (toilet, sink, mirror, shower), floors, laundry and cloths, the fridge, dusting and bedding. Give each its own day so no session runs over about 20 minutes." },
      { q: "How long should weekly cleaning take?", a: "About 15-20 minutes a day, or 2 to 2.5 hours across the week for a typical flat, if you keep up with it." },
      { q: "Is this checklist free to print?", a: "Yes. Print this page from your browser (Ctrl+P or Cmd+P); the header, footer and links drop away so you get a clean one-page list with tick boxes." },
    ],
  },
  {
    displayName: "Kitchen deep clean in 30 minutes", metaTitle: "How to deep clean a kitchen in 30 minutes (timed checklist)", kind: "routine", date: "2026-10-30", minutes: 30,
    intro: "A 30-minute kitchen deep clean that hits the spots a daily wipe misses: microwave, hob, cooker hood filters, sink, fridge, small appliances and the floor.",
    answer: "Start the slow jobs first, then work high to low: soak the cooker hood filters and steam the microwave with lemon (5 min), clean the hob and splashback (5 min), wipe the fridge (6 min), empty the toaster and rinse the dishwasher filter (5 min), clean the sink and drain (5 min), then mop (4 min).",
    supplies: ["Washing-up liquid", "A lemon", "Hob scraper", "Microfibre cloths", "Bicarbonate of soda", "Mop"],
    sections: [
      { title: "Start the slow jobs", minutes: 5, items: [
        { text: "Pop the metal cooker hood filters in a hot dishwasher cycle or a sink of hot soapy water.", tip: T("how to clean extractor fan filters") },
        { text: "Microwave a bowl of water with lemon for 3 minutes and leave the door shut to steam.", tip: T("how to clean a microwave with lemon") }] },
      { title: "Hob and hood", minutes: 5, items: [
        { text: "Once cool, scrape burnt marks off the glass hob at a low angle, then buff with hob cleaner.", tip: T("how to clean a glass hob") },
        { text: "Wipe the sticky hood with a drop of oil, then washing-up liquid.", tip: T("how to clean a cooker hood") },
        { text: "Wipe the microwave out and clean the turntable.", tip: T("how to clean a microwave turntable") }] },
      { title: "Fridge", minutes: 6, items: [
        { text: "Bin old food, wipe shelves and door bins with warm soapy water.", tip: T("how to clean a refrigerator") },
        { text: "Wipe the door seal and clear the drain hole at the back.", tip: T("how to clean a fridge door seal") },
        { text: "Leave an open box of bicarbonate of soda to absorb smells.", tip: T("how to deodorize a fridge") }] },
      { title: "Small appliances and dishwasher", minutes: 5, items: [
        { text: "Unplug the toaster and empty the crumb tray.", tip: T("how to clean a toaster") },
        { text: "Twist out and rinse the dishwasher filter.", tip: T("how to clean a dishwasher filter") },
        { text: "Check the dishwasher spray arm holes for blockages.", tip: T("how to clean dishwasher spray arms") }] },
      { title: "Sink", minutes: 5, items: [
        { text: "Freshen the drain without harsh chemicals.", tip: T("how to clean a kitchen sink drain") },
        { text: "Polish a stainless steel sink with flour, then rinse.", tip: T("how to clean a stainless steel sink") },
        { text: "Unscrew and soak the tap aerator if the flow is weak.", tip: T("how to clean a tap aerator") },
        { text: "Swap or sanitise the sponge.", tip: T("how to clean a kitchen sponge") }] },
      { title: "Floor", minutes: 4, items: [
        { text: "Refit the hood filters, sweep, and mop with clean water towards the door.", tip: T("how to mop floors without streaks") }] },
    ],
    faq: [
      { q: "How do you deep clean a kitchen fast?", a: "Start the jobs that need soaking or steaming first (hood filters, microwave), clean high surfaces before low ones, and finish with the floor. Thirty focused minutes covers the hob, fridge, sink, appliances and floor." },
      { q: "How often should you deep clean a kitchen?", a: "A 30-minute deep clean once a month works for most homes, with a quick daily wipe of the hob, counters and sink in between." },
      { q: "Is it safe to use oven cleaner and bleach in the same session?", a: `Only one product at a time, rinsed off before the next, with the window open. ${SAFETY_RULE}` },
    ],
  },
  {
    displayName: "Hidden appliance cleaning buttons you've never pressed", metaTitle: "Hidden appliance cleaning settings: self-clean buttons and secret modes", kind: "list", date: "2026-10-30", minutes: 10,
    intro: "Your appliances already have self-clean buttons, secret modes and hidden filters. Here is every hidden cleaning setting we've covered, what it does and how to use it safely.",
    answer: "Most homes have at least five: the drum clean program on the washing machine, the machine-care cycle on the dishwasher, steam clean or self clean on the oven, the descale mode on a coffee machine, the self-clean (calc-clean) button on a steam iron, and holiday mode on the fridge. Check your manual for the exact name.",
    sections: [
      { title: "Self-clean buttons and modes", items: [
        { text: "Washing machine: the drum clean or tub clean program.", tip: T("how to clean a washing machine drum") },
        { text: "Dishwasher: the machine care or clean cycle.", tip: T("how to use the dishwasher clean cycle") },
        { text: "Oven: the steam clean setting that loosens grease with water.", tip: T("how to use the steam clean function on an oven") },
        { text: "Oven: pyrolytic self clean, and how to run it safely.", tip: T("how to clean an oven with the self clean setting") },
        { text: "Steam iron: the self-clean or calc-clean button.", tip: T("how to use the self clean button on a steam iron") },
        { text: "Nespresso: the hidden button combo that starts descaling.", tip: T("how to use the descale mode on a nespresso machine") },
        { text: "Coffee maker: what the descale light wants you to do.", tip: T("how to descale a coffee maker") }] },
      { title: "Hidden settings that save energy or food", items: [
        { text: "Fridge: holiday (vacation) mode.", tip: T("how to use the vacation mode on a fridge") },
        { text: "Dishwasher: the half load button.", tip: T("how to use the half load setting on a dishwasher") },
        { text: "Dishwasher: the rinse aid dial that ends water spots.", tip: T("how to use rinse aid in a dishwasher") },
        { text: "Washing machine: eco mode and why it takes longer.", tip: T("how to use the eco mode on a washing machine") },
        { text: "Oven: the light-only mode.", tip: T("how to use the oven light bulb setting") }] },
      { title: "Hidden filters and doors", items: [
        { text: "Washing machine: the pump filter behind the little door at the bottom.", tip: T("how to clean a washing machine filter") },
        { text: "Dishwasher: the filter under the bottom spray arm.", tip: T("how to clean a dishwasher filter") },
        { text: "Condenser dryer: the second filter near the bottom.", tip: T("how to clean a condenser dryer filter") },
        { text: "Microwave: the grease filter under an over-the-range model.", tip: T("how to clean a microwave grease filter") },
        { text: "Air purifier: the washable pre-filter.", tip: T("how to clean an air purifier filter") }] },
    ],
    faq: [
      { q: "Do washing machines have a self-clean button?", a: "Most modern ones do, usually called drum clean, tub clean or machine clean. Run it empty, hot, about once a month, with a washing machine cleaner or nothing at all, never mixed with another product." },
      { q: "Does my iron have a self-clean button?", a: "Many steam irons have a self-clean, calc-clean or anti-calc button. Fill the tank, heat to max, unplug, hold it flat over the sink and press the button so hot water flushes the scale out." },
      { q: "Are appliance self-clean modes safe?", a: `Yes, if you follow the manual: unplug or switch off before you touch filters, ventilate during oven self clean, and use one product at a time. ${SAFETY_RULE}` },
    ],
  },
];

const PHRASES = [
  "how to clean a bathroom in 15 minutes",
  "weekly cleaning checklist",
  "how to deep clean a kitchen in 30 minutes",
  "hidden appliance cleaning settings",
];
export const GUIDES: Guide[] = DEFS.map((d, i) => ({ ...d, title: cap(PHRASES[i]), id: slugify(PHRASES[i]).replace(/^how-to-/, "") }));

/** Live guides (date on or before today in Berlin). */
export function liveGuides(): Guide[] {
  const live = new Set(byNewest().map((t) => t.slug));
  return GUIDES.filter((g) => g.date <= new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date())).filter((g) =>
    g.sections.flatMap((s) => s.items).filter((it) => it.tip && live.has(it.tip)).length >= 3);
}
export const getGuide = (id: string) => liveGuides().find((g) => g.id === id);
/** Live tips linked from a guide, in order, deduped. */
export function guideTips(g: Guide): Tip[] {
  const live = new Map(byNewest().map((t) => [t.slug, t]));
  const out = new Map<string, Tip>();
  for (const it of g.sections.flatMap((s) => s.items)) if (it.tip && live.has(it.tip)) out.set(it.tip, live.get(it.tip)!);
  return [...out.values()];
}
/** Guides that link to this tip. */
export const guidesForTip = (slug: string) => liveGuides().filter((g) => g.sections.some((s) => s.items.some((it) => it.tip === slug)));

// Fail the build if a guide points at a tip slug that doesn't exist at all (typo guard).
(function assertGuides() {
  const all = new Set(ALL_TIPS.map((t) => t.slug));
  for (const g of GUIDES) for (const it of g.sections.flatMap((s) => s.items)) if (it.tip && !all.has(it.tip)) throw new Error(`Guide ${g.id}: unknown tip ${it.tip}`);
})();
