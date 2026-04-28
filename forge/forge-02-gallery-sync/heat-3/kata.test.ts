import { describe, it, expect } from "vitest";
import {
  reduce,
  isValidState,
  applyVariationDispatch,
  type State,
  type Action,
} from "./kata";

function runWithRecorder(
  initial: State,
  runner: (dispatch: (a: Action) => void) => void,
): { final: State; validityAfterEachStep: boolean[] } {
  let state = initial;
  const validity: boolean[] = [];
  const dispatch = (a: Action) => {
    state = reduce(state, a);
    validity.push(isValidState(state));
  };
  runner(dispatch);
  return { final: state, validityAfterEachStep: validity };
}

describe("[heat-3] applyVariationDispatch と順序", () => {
  const beforeSwitch: State = {
    base: "https://wood",
    mains: ["w1.jpg", "w2.jpg", "w3.jpg"],
    preview: 2,
    slider: 2,
  };

  it("applyVariationDispatch は各ステップで常に valid", () => {
    const { final, validityAfterEachStep } = runWithRecorder(beforeSwitch, (d) => {
      applyVariationDispatch(d, { base: "https://black", mains: ["b1.jpg"] });
    });
    expect(validityAfterEachStep.every(Boolean)).toBe(true);
    expect(final.base).toBe("https://black");
    expect(final.mains).toEqual(["b1.jpg"]);
    expect(final.preview).toBe(0);
    expect(final.slider).toBe(0);
  });

  it("先に setImages だけすると中間で invalid になる", () => {
    const { validityAfterEachStep } = runWithRecorder(beforeSwitch, (d) => {
      d({ type: "setImages", base: "https://black", mains: ["b1.jpg"] });
      d({ type: "setPreview", index: 0 });
      d({ type: "setSlider", index: 0 });
    });
    expect(validityAfterEachStep[0]).toBe(false);
    expect(validityAfterEachStep.every(Boolean)).toBe(false);
  });

  it("空の mains に切り替えるときも preview/slider を先に 0 にしないと invalid", () => {
    const { validityBad, validityGood } = (() => {
      const bad = runWithRecorder(beforeSwitch, (d) => {
        d({ type: "setImages", base: "https://x", mains: [] });
        d({ type: "setPreview", index: 0 });
        d({ type: "setSlider", index: 0 });
      });
      const good = runWithRecorder(beforeSwitch, (d) => {
        applyVariationDispatch(d, { base: "https://x", mains: [] });
      });
      return { validityBad: bad.validityAfterEachStep, validityGood: good.validityAfterEachStep };
    })();
    expect(validityBad[0]).toBe(false);
    expect(validityGood.every(Boolean)).toBe(true);
  });
});
