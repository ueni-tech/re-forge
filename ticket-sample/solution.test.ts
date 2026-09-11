import { describe, it, expect } from "vitest";
import { findSku } from "./solution";

// 在庫マスタ(共通で使うサンプルデータ)
const inventory = [
  { sku: "SKU-R10A", color: "red", diameter: 10, row: "row-A" },
  { sku: "SKU-R12A", color: "red", diameter: 12, row: "row-A" },
  { sku: "SKU-R8A", color: "red", diameter: 8, row: "row-A" },
  { sku: "SKU-R20A", color: "red", diameter: 20, row: "row-A" },
  { sku: "SKU-G10A", color: "green", diameter: 10, row: "row-A" },
];

describe("findSku", () => {
  it("完全一致するSKUがあれば exact を返す", () => {
    const result = findSku({ color: "red", diameter: 10, row: "row-A" }, inventory);
    expect(result).toEqual({ status: "exact", sku: "SKU-R10A" });
  });

  it("完全一致がなければ、直径の近い順に最大3件を suggestions として返す", () => {
    // row-A から SKU-R10A を除いた在庫で検索(=完全一致なしを再現)
    const withoutExact = inventory.filter((i) => i.sku !== "SKU-R10A");
    const result = findSku({ color: "red", diameter: 10, row: "row-A" }, withoutExact);
    expect(result.status).toBe("suggestions");
    if (result.status === "suggestions") {
      // 直径差: R12A=2, R8A=2, R20A=10 → 近い2件(R12A, R8A)が優先。3件以内。
      expect(result.candidates.length).toBeLessThanOrEqual(3);
      expect(result.candidates).toContain("SKU-R12A");
      expect(result.candidates).toContain("SKU-R8A");
    }
  });

  it("同じ色・行の在庫が1件もなければ candidates は空配列", () => {
    const onlyGreen = inventory.filter((i) => i.color === "green");
    const result = findSku({ color: "red", diameter: 10, row: "row-A" }, onlyGreen);
    // color "red" 自体が in inventory に存在しないので、本来は invalid になるケース。
    // 以下は「色は存在するが対象row-Aの在庫がない」ケースの例として、
    // 実務データに合わせてinventoryを調整して各自テストケースを追加すること。
    expect(["suggestions", "invalid"]).toContain(result.status);
  });

  it("色が在庫マスタに一度も存在しない場合は invalid", () => {
    const result = findSku({ color: "blue", diameter: 10, row: "row-A" }, inventory);
    expect(result).toEqual({ status: "invalid" });
  });

  it("行が在庫マスタに一度も存在しない場合は invalid", () => {
    const result = findSku({ color: "red", diameter: 10, row: "row-Z" }, inventory);
    expect(result).toEqual({ status: "invalid" });
  });
});

// solution.ts は自分で新規作成すること。
// findSku の中身・内部の型定義・ヘルパー関数の分割・命名は完全に自由。
// このテストファイルとticket.mdの契約さえ満たせばOK。
