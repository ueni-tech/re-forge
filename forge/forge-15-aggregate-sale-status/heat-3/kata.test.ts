import { describe, it, expect } from "vitest";
import { aggregateSaleStatus, VariationSku } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 1 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 3 },
  { code: "C", label: "青", ballDiameter: "0.7", engravingLines: "1", saleStatus: 2 },
];

describe("[heat-3] aggregateSaleStatus", () => {
  it("色だけ指定 — 在庫行があれば \"3\"", () => {
    expect(aggregateSaleStatus(SKUS, "赤")).toBe("3");
  });

  it("色×径×行数を指定", () => {
    expect(aggregateSaleStatus(SKUS, "赤", "0.7", "1")).toBe("1");
  });

  it("マッチ0件は undefined", () => {
    expect(aggregateSaleStatus(SKUS, "緑")).toBeUndefined();
  });

  it("variationSkus が falsy なら undefined", () => {
    expect(aggregateSaleStatus(null as unknown as VariationSku[], "赤")).toBeUndefined();
  });
});
