import { describe, it, expect } from "vitest";
import { pickSaleStatusFromMatches, VariationSku } from "./kata";

describe("[heat-2] pickSaleStatusFromMatches", () => {
  it("在庫(3)が1件でもあれば \"3\"", () => {
    const matched: VariationSku[] = [
      { code: "A", label: "赤", saleStatus: 1 },
      { code: "B", label: "赤", saleStatus: 3 },
    ];
    expect(pickSaleStatusFromMatches(matched)).toBe("3");
  });

  it("在庫なしは先頭行のステータス", () => {
    const matched: VariationSku[] = [
      { code: "A", label: "赤", saleStatus: 1 },
      { code: "B", label: "赤", saleStatus: 2 },
    ];
    expect(pickSaleStatusFromMatches(matched)).toBe("1");
  });

  it("空配列は undefined", () => {
    expect(pickSaleStatusFromMatches([])).toBeUndefined();
  });

  it("先頭が saleStatus 0 なら \"0\"", () => {
    const matched: VariationSku[] = [{ code: "A", label: "赤", saleStatus: 0 }];
    expect(pickSaleStatusFromMatches(matched)).toBe("0");
  });
});
