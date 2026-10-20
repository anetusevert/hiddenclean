// HiddenClean type: Fredoka (rounded, friendly display) + Nunito (body/captions). Distinct from TechTipADay and OAAD.
import { loadFont as loadDisplay } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadSans } from "@remotion/google-fonts/Nunito";
export const fDisplay = loadDisplay("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;
export const fSans = loadSans("normal", { weights: ["700", "800", "900"], subsets: ["latin"] }).fontFamily;
