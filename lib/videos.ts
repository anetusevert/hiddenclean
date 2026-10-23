// v2 real-footage shorts. Stock clips: Pexels License (free commercial use), see docs/media-credits.txt.
export type Short = { id: string; hook: string; tipSlug: string; label: string };
export const SHORTS: Short[] = [
  { id: "dishwasher-filter", hook: "Your dishwasher is hiding *THIS*", tipSlug: "how-to-clean-a-dishwasher-filter", label: "Dishwasher filter" },
  { id: "microwave-lemon", hook: "*STOP* scrubbing your microwave", tipSlug: "how-to-clean-a-microwave-with-lemon", label: "Microwave + lemon" },
  { id: "washer-filter", hook: "Nobody opens *THIS* door", tipSlug: "how-to-clean-a-washing-machine-filter", label: "Washer filter" },
  { id: "oven-steam", hook: "Your oven's *SECRET* setting", tipSlug: "how-to-use-the-steam-clean-function-on-an-oven", label: "Oven steam clean" },
  { id: "kettle-descale", hook: "Flakes in your *TEA?*", tipSlug: "how-to-descale-a-kettle", label: "Kettle descale" },
  { id: "fridge-holiday", hook: "Your fridge's *SECRET* holiday mode", tipSlug: "how-to-use-the-vacation-mode-on-a-fridge", label: "Fridge holiday mode" },
  { id: "nespresso-descale", hook: "Your Nespresso's *SECRET* combo", tipSlug: "how-to-use-the-descale-mode-on-a-nespresso-machine", label: "Nespresso descale" },
];
export const SOCIAL = { tiktok: "https://www.tiktok.com/@hiddenclean.tips", instagram: "https://www.instagram.com/hiddenclean.hacks" };
