import { describe, it, expect } from "vitest";
import { patchState, ComboState } from "./kata";

describe("[heat-2] patchState", () => {
  it("指定キーだけ更新し、他キーは維持する", () => {
    const state: ComboState = { label: "赤", ballDiameter: "0.7" };
    patchState(state, { engravingLines: "2" });
    expect(state).toEqual({
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
    });
  });

  it("undefined のパッチ値はスキップする", () => {
    const state: ComboState = { label: "赤", ballDiameter: "0.7" };
    patchState(state, { ballDiameter: undefined, label: "青" });
    expect(state).toEqual({ label: "青", ballDiameter: "0.7" });
  });

  it("空文字は有効な更新値として書き込む", () => {
    const state: ComboState = { label: "赤", ballDiameter: "0.7" };
    patchState(state, { ballDiameter: "" });
    expect(state.ballDiameter).toBe("");
  });

  it("空パッチでは state を変えない", () => {
    const state: ComboState = { label: "赤" };
    const before = { ...state };
    patchState(state, {});
    expect(state).toEqual(before);
  });
});
