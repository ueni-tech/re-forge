// [001/01] 判定 — 01.md の受け入れ条件と同じ内容

import { describe, it, expect } from "vitest";
import { findSku } from "./solution";

type Item = { sku: string; color: string; diameter: number; row: string };

// 破壊的変更を検出するため、配列も要素も freeze する
function master(items: Item[]): readonly Item[] {
  return Object.freeze(items.map((i) => Object.freeze({ ...i })));
}

const INVENTORY = master([
  { sku: "R6A", color: "red", diameter: 6, row: "row-A" },
  { sku: "R8A", color: "red", diameter: 8, row: "row-A" },
  { sku: "R10A", color: "red", diameter: 10, row: "row-A" },
  { sku: "R12A", color: "red", diameter: 12, row: "row-A" },
  { sku: "R20A", color: "red", diameter: 20, row: "row-A" },
  { sku: "R10B", color: "red", diameter: 10, row: "row-B" },
  { sku: "G10A", color: "green", diameter: 10, row: "row-A" },
]);

const WITHOUT_R10A = master(INVENTORY.filter((i) => i.sku !== "R10A"));

function q(color: string, diameter: number, row: string) {
  return Object.freeze({ color, diameter, row });
}

// テスト側は境界の型を持たないので、渡す側で readonly を外す
const run = (query: ReturnType<typeof q>, inv: readonly Item[]) =>
  findSku(query, inv as Item[]);

describe("[001/01] findSku", () => {
  it("完全一致があれば exact", () => {
    expect(run(q("red", 10, "row-A"), INVENTORY)).toEqual({ status: "exact", sku: "R10A" });
  });

  it("完全一致が無ければ、直径の差が小さい順に最大3件。同差なら直径の小さい順", () => {
    expect(run(q("red", 10, "row-A"), WITHOUT_R10A)).toEqual({
      status: "suggestions",
      candidates: ["R8A", "R12A", "R6A"],
    });
  });

  it("候補が3件未満ならある分だけ", () => {
    const two = master(INVENTORY.filter((i) => ["R6A", "R20A", "G10A"].includes(i.sku)));
    expect(run(q("red", 10, "row-A"), two)).toEqual({
      status: "suggestions",
      candidates: ["R6A", "R20A"],
    });
  });

  it("色も行も存在するが、その組み合わせのレコードが無ければ candidates は空", () => {
    expect(run(q("green", 20, "row-B"), INVENTORY)).toEqual({
      status: "suggestions",
      candidates: [],
    });
  });

  it("色がマスタに一度も登場しなければ invalid", () => {
    expect(run(q("blue", 10, "row-A"), INVENTORY)).toEqual({ status: "invalid" });
  });

  it("行がマスタに一度も登場しなければ invalid", () => {
    expect(run(q("red", 10, "row-Z"), INVENTORY)).toEqual({ status: "invalid" });
  });

  it("マスタの並び順に結果が依存しない", () => {
    const reversed = master([...WITHOUT_R10A].reverse());
    expect(run(q("red", 10, "row-A"), reversed)).toEqual({
      status: "suggestions",
      candidates: ["R8A", "R12A", "R6A"],
    });
  });

  it("query と inventory を変更しない（freeze 済み。破壊的 sort 等は例外になる）", () => {
    const snapshot = JSON.stringify(WITHOUT_R10A);
    expect(() => run(q("red", 10, "row-A"), WITHOUT_R10A)).not.toThrow();
    expect(JSON.stringify(WITHOUT_R10A)).toBe(snapshot);
  });
});
