// [001/02] 判定 — 追加分。01.test.ts も緑のままであること。

import { describe, it, expect } from "vitest";
import { findSku } from "./solution";

type Item = { sku: string; color: string; diameter: number; row: string; stock?: number };

function master(items: Item[]): readonly Item[] {
  return Object.freeze(items.map((i) => Object.freeze({ ...i })));
}

const INVENTORY = master([
  { sku: "R6A", color: "red", diameter: 6, row: "row-A", stock: 3 },
  { sku: "R8A", color: "red", diameter: 8, row: "row-A", stock: 0 },
  { sku: "R10A", color: "red", diameter: 10, row: "row-A", stock: 0 },
  { sku: "R12A", color: "red", diameter: 12, row: "row-A", stock: 5 },
  { sku: "R20A", color: "red", diameter: 20, row: "row-A" },
  { sku: "R10B", color: "red", diameter: 10, row: "row-B", stock: 2 },
  { sku: "G10A", color: "green", diameter: 10, row: "row-A", stock: 1 },
]);

function q(color: string, diameter: number, row: string) {
  return Object.freeze({ color, diameter, row });
}

const run = (query: ReturnType<typeof q>, inv: readonly Item[]) =>
  findSku(query, inv as Item[]);

describe("[001/02] 在庫切れの扱い", () => {
  it("完全一致が在庫0なら exact にせず候補を返す。候補からも在庫0を除く", () => {
    // 差: R12A=2, R6A=4, R20A=10（R8A, R10A は在庫0で除外）
    expect(run(q("red", 10, "row-A"), INVENTORY)).toEqual({
      status: "suggestions",
      candidates: ["R12A", "R6A", "R20A"],
    });
  });

  it("在庫ありの完全一致は exact", () => {
    expect(run(q("red", 10, "row-B"), INVENTORY)).toEqual({ status: "exact", sku: "R10B" });
  });

  it("stock 未設定は在庫ありとみなす", () => {
    const legacy = master([{ sku: "R10A", color: "red", diameter: 10, row: "row-A" }]);
    expect(run(q("red", 10, "row-A"), legacy)).toEqual({ status: "exact", sku: "R10A" });
  });

  it("在庫0のレコードも色・行の存在確認には数える（invalid にしない）", () => {
    const allOut = master(INVENTORY.map((i) => ({ ...i, stock: 0 })));
    expect(run(q("red", 10, "row-A"), allOut)).toEqual({ status: "suggestions", candidates: [] });
  });

  it("色が一度も登場しなければ引き続き invalid", () => {
    expect(run(q("blue", 10, "row-A"), INVENTORY)).toEqual({ status: "invalid" });
  });

  it("在庫0を除いたうえで、差の小さい順・同差は直径の小さい順・最大3件", () => {
    const inv = master([
      { sku: "R7A", color: "red", diameter: 7, row: "row-A", stock: 1 },
      { sku: "R13A", color: "red", diameter: 13, row: "row-A", stock: 1 },
      { sku: "R9A", color: "red", diameter: 9, row: "row-A", stock: 0 },
      { sku: "R11A", color: "red", diameter: 11, row: "row-A", stock: 4 },
      { sku: "R30A", color: "red", diameter: 30, row: "row-A", stock: 4 },
      { sku: "R5A", color: "red", diameter: 5, row: "row-A" },
    ]);
    // 差: R11A=1, R9A=1(在庫0除外), R7A=3, R13A=3, R5A=5, R30A=20 → R11A, R7A, R13A
    expect(run(q("red", 10, "row-A"), inv)).toEqual({
      status: "suggestions",
      candidates: ["R11A", "R7A", "R13A"],
    });
  });
});
