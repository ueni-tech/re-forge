import { describe, it, expect } from "vitest";
import { applyAxisFallbacks, ComboState, VariationSku } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 1 },
  { code: "C", label: "赤", ballDiameter: "1.0", engravingLines: "1", saleStatus: 3 },
  { code: "D", label: "青", ballDiameter: "0.5", engravingLines: "1", saleStatus: 3 },
];

describe("[heat-2] applyAxisFallbacks", () => {
  it("有効な選択は変更しない", () => {
    const state: ComboState = {
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
    };
    applyAxisFallbacks(state, SKUS);
    expect(state).toEqual({
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
    });
  });

  it("無効な径は同色の最小径にフォールバック", () => {
    const state: ComboState = {
      label: "赤",
      ballDiameter: "0.5",
      engravingLines: "1",
    };
    applyAxisFallbacks(state, SKUS);
    expect(state.ballDiameter).toBe("0.7");
  });

  it("色変更後、径と行数を順にフォールバック", () => {
    const state: ComboState = {
      label: "青",
      ballDiameter: "1.0",
      engravingLines: "2",
    };
    applyAxisFallbacks(state, SKUS);
    expect(state).toEqual({
      label: "青",
      ballDiameter: "0.5",
      engravingLines: "1",
    });
  });

  it("候補が無い軸は据え置き", () => {
    const state: ComboState = {
      label: "存在しない色",
      ballDiameter: "9.9",
    };
    applyAxisFallbacks(state, SKUS);
    expect(state.ballDiameter).toBe("9.9");
  });
});
