// v2 real-footage shorts. Stock clips: Pexels License (free commercial use), see docs/media-credits.txt.
// Home only lists shorts whose tip is live (date-gated), so future videos can be added ahead.
// sec = real clip length (ffprobe on public/v/<id>.mp4, rounded). Used for VideoObject + video sitemap duration; falls back to 30.
export type Short = { id: string; hook: string; tipSlug: string; label: string; sec?: number };
export const SHORTS: Short[] = [
  { id: "limescale-taps", hook: "Your taps are *CRUSTY*", tipSlug: "how-to-remove-limescale-from-taps", label: "Limescale on taps", sec: 30 },
  { id: "washer-hygiene", hook: "Your washer's *GERM* setting", tipSlug: "how-to-use-the-hygiene-cycle-on-a-washing-machine", label: "Washer hygiene cycle", sec: 33 },
  { id: "fabric-sofa", hook: "Your sofa is *FILTHY*", tipSlug: "how-to-clean-a-fabric-sofa", label: "Clean a fabric sofa", sec: 34 },
  { id: "toilet-rim", hook: "Your toilet is hiding *THIS*", tipSlug: "how-to-clean-under-the-toilet-rim", label: "Under the toilet rim", sec: 31 },
  { id: "hairbrush", hook: "Your hairbrush is *GROSS*", tipSlug: "how-to-clean-a-hairbrush", label: "Clean a hairbrush", sec: 31 },
  { id: "microfibre", hook: "Softener is ruining your *CLOTHS*", tipSlug: "how-to-wash-microfibre-cloths", label: "Wash microfibre cloths", sec: 30 },
  { id: "toothbrush-holder", hook: "Your toothbrush cup is *GROSS*", tipSlug: "how-to-clean-a-toothbrush-holder", label: "Toothbrush holder", sec: 30 },
  { id: "kitchen-sponge", hook: "Stop leaving your sponge *WET*", tipSlug: "how-to-clean-a-kitchen-sponge", label: "Kitchen sponge", sec: 31 },
  { id: "keyboard", hook: "Flip your keyboard *OVER*", tipSlug: "how-to-clean-a-keyboard", label: "Clean a keyboard", sec: 30 },
  { id: "blot-stain", hook: "Stop rubbing that *STAIN*", tipSlug: "how-to-blot-a-stain-instead-of-rubbing", label: "Blot, don't rub", sec: 31 },
  { id: "mop-floors", hook: "Your mop water is the *PROBLEM*", tipSlug: "how-to-mop-floors-without-streaks", label: "Streak-free mopping", sec: 32 },
  { id: "bathroom-tiles", hook: "Soap scum tiles wipe *CLEAN*", tipSlug: "how-to-clean-bathroom-tiles", label: "Bathroom tiles", sec: 31 },
  { id: "cutting-board", hook: "Stop soaking your *BOARD*", tipSlug: "how-to-clean-a-wooden-cutting-board", label: "Wooden cutting board", sec: 33 },
  { id: "iron-self-clean", hook: "Your iron's *SECRET* button", tipSlug: "how-to-use-the-self-clean-button-on-a-steam-iron", label: "Iron self-clean", sec: 31 },
  { id: "dishwasher-filter", hook: "Your dishwasher is hiding *THIS*", tipSlug: "how-to-clean-a-dishwasher-filter", label: "Dishwasher filter", sec: 30 },
  { id: "microwave-lemon", hook: "*STOP* scrubbing your microwave", tipSlug: "how-to-clean-a-microwave-with-lemon", label: "Microwave + lemon", sec: 30 },
  { id: "washer-filter", hook: "Nobody opens *THIS* door", tipSlug: "how-to-clean-a-washing-machine-filter", label: "Washer filter", sec: 32 },
  { id: "oven-steam", hook: "Your oven's *SECRET* setting", tipSlug: "how-to-use-the-steam-clean-function-on-an-oven", label: "Oven steam clean", sec: 32 },
  { id: "kettle-descale", hook: "Flakes in your *TEA?*", tipSlug: "how-to-descale-a-kettle", label: "Kettle descale", sec: 32 },
  { id: "fridge-holiday", hook: "Your fridge's *SECRET* holiday mode", tipSlug: "how-to-use-the-vacation-mode-on-a-fridge", label: "Fridge holiday mode", sec: 30 },
  { id: "nespresso-descale", hook: "Your Nespresso's *SECRET* combo", tipSlug: "how-to-use-the-descale-mode-on-a-nespresso-machine", label: "Nespresso descale", sec: 32 },
];
export const SOCIAL = { tiktok: "https://www.tiktok.com/@hiddenclean.tips", instagram: "https://www.instagram.com/hiddenclean.hacks" };
export const isoDuration = (s: Short) => `PT${s.sec ?? 30}S`;
export const shortFor = (slug: string) => SHORTS.find((s) => s.tipSlug === slug);
