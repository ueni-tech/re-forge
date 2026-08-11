import { describe, it, expect } from "vitest";
import { filterMatchedSkus, VariationSku } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 1 },
  { code: "C", label: "赤", ballDiameter: "1.0", engravingLines: "1", saleStatus: 2 },
  { code: "D", label: "青", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
];

describe("[heat-1] filterMatchedSkus", () => {
  it("label のみ指定で絞る", () => {
    expect(filterMatchedSkus(SKUS, "赤", null, null).map((r) => r.code)).toEqual([
      "A",
      "B",
      "C",
    ]);
  });

  it("3軸すべて指定", () => {
    expect(filterMatchedSkus(SKUS, "赤", "0.7", "2")).toEqual([SKUS[1]]);
  });

  it("全 null は全行", () => {
    expect(filterMatchedSkus(SKUS, null, null, null)).toEqual(SKUS);
  });

  it("variationSkus が falsy なら空配列", () => {
    expect(filterMatchedSkus(null, "赤", null, null)).toEqual([]);
  });
});
