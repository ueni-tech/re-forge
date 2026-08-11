import { describe, it, expect } from "vitest";
import { resolveSku, VariationSku, ComboState } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 1 },
  { code: "C", label: "赤", ballDiameter: "1.0", engravingLines: "1", saleStatus: 3 },
  { code: "D", label: "青", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
];

describe("[heat-3] resolveSku", () => {
  it("全軸一致で1行を返す", () => {
    const state: ComboState = {
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
    };
    expect(resolveSku(state, SKUS)?.code).toBe("B");
  });

  it("state に無い軸はフィルタしない（label のみで先頭一致）", () => {
    const state: ComboState = { label: "赤" };
    expect(resolveSku(state, SKUS)?.code).toBe("A");
  });

  it("一致なしは undefined", () => {
    const state: ComboState = {
      label: "赤",
      ballDiameter: "0.5",
      engravingLines: "1",
    };
    expect(resolveSku(state, SKUS)).toBeUndefined();
  });

  it("wrapping 指定時は wrapping も一致必須", () => {
    const skus: VariationSku[] = [
      { code: "X", label: "赤", wrapping: "箱", saleStatus: 3 },
      { code: "Y", label: "赤", wrapping: "袋", saleStatus: 3 },
    ];
    expect(resolveSku({ label: "赤", wrapping: "袋" }, skus)?.code).toBe("Y");
  });
});
