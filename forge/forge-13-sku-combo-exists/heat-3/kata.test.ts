import { describe, it, expect } from "vitest";
import {
  collectDiametersForLabel,
  collectLinesForLabelDiameter,
  VariationSku,
} from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "1.0", engravingLines: "1", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 1 },
  { code: "C", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
  { code: "D", label: "青", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
];

describe("[heat-3] collectDiametersForLabel", () => {
  it("指定色の ballDiameter を出現順に集める（重複可）", () => {
    expect(collectDiametersForLabel(SKUS, "赤")).toEqual(["1.0", "0.7", "0.7"]);
  });

  it("該当なしは空配列", () => {
    expect(collectDiametersForLabel(SKUS, "緑")).toEqual([]);
  });
});

describe("[heat-3] collectLinesForLabelDiameter", () => {
  it("色×径で engravingLines を集める", () => {
    expect(collectLinesForLabelDiameter(SKUS, "赤", "0.7")).toEqual(["2", "1"]);
  });

  it("ballDiameter が undefined のとき、SKU 側も径未設定の行だけ集める", () => {
    const skus: VariationSku[] = [
      { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
      { code: "B", label: "赤", engravingLines: "2", saleStatus: 1 },
    ];
    expect(collectLinesForLabelDiameter(skus, "赤", undefined)).toEqual(["2"]);
  });
});
