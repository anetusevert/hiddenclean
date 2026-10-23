import { Composition } from "remotion";
import { HiddenCleanShort } from "./HiddenCleanShort";
import { HiddenCleanV2 } from "./HiddenCleanV2";
import type { Props } from "./types";
const def: Props = { n: 1, title: "Sample", url: "", voStart: 21, voEnd: 600, total: 700, voFile: null, words: [],
  pieces: [{ beat: "hook", say: "", text: "You've been cleaning your dishwasher wrong.", start: 21 }, { beat: "do", say: "", text: "The hidden filter", start: 100 },
    { beat: "steps", say: "", text: "Rack out", step: 1, scene: "rack-out", start: 200 }, { beat: "result", say: "", text: "Clean", result: { say: "", headline: "No more smell", before: "Gunky", after: "Clean" }, start: 400 }, { beat: "cta", say: "", text: "", start: 560 }] };
export function RemotionRoot() {
  return <><Composition id="HiddenCleanShort" component={HiddenCleanShort} durationInFrames={def.total} fps={30} width={1080} height={1920} defaultProps={def}
    calculateMetadata={({ props }) => ({ durationInFrames: props.total })} />
    <Composition id="HiddenCleanV2" component={HiddenCleanV2} durationInFrames={def.total} fps={30} width={1080} height={1920} defaultProps={def}
    calculateMetadata={({ props }) => ({ durationInFrames: props.total })} /></>;
}
