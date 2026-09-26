// [002/01] 判定 — 01.md の受け入れ条件と同じ内容

import { describe, it, expect } from "vitest";
import { resolvePriceDisplay } from "./solution";

type Product = { price: number };
type PriceContext = { taxRate: number; taxDisplay: "included" | "excluded" };

function product(price: number): Readonly<Product> {
  return Object.freeze({ price });
}

function context(taxRate: number, taxDisplay: PriceContext["taxDisplay"]): Readonly<PriceContext> {
  return Object.freeze({ taxRate, taxDisplay });
}

const run = (p: Readonly<Product>, c: Readonly<PriceContext>) =>
  resolvePriceDisplay(p as Product, c as PriceContext);

describe("[002/01] resolvePriceDisplay", () => {
  it("税抜表示なら price をそのまま出し、taxLabel は excluded", () => {
    expect(run(product(1000), context(0.1, "excluded"))).toEqual({
      status: "ok",
      amount: 1000,
      taxLabel: "excluded",
    });
  });

  it("税込表示なら price * (1 + taxRate) を切り捨て、taxLabel は included", () => {
    expect(run(product(1000), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 1100,
      taxLabel: "included",
    });
  });

  it("税込表示の端数は切り捨て", () => {
    // 199 * 1.1 = 218.9
    expect(run(product(199), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 218,
      taxLabel: "included",
    });
  });

  it("price が 0 なら amount 0 を許可", () => {
    expect(run(product(0), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 0,
      taxLabel: "included",
    });
  });

  it("price が負なら invalid", () => {
    expect(run(product(-1), context(0.1, "included"))).toEqual({ status: "invalid" });
  });

  it("taxRate が負なら invalid", () => {
    expect(run(product(1000), context(-0.1, "excluded"))).toEqual({ status: "invalid" });
  });

  it("product と context を変更しない（freeze 済み）", () => {
    const p = product(1000);
    const c = context(0.1, "included");
    const snapshot = JSON.stringify({ p, c });
    expect(() => run(p, c)).not.toThrow();
    expect(JSON.stringify({ p, c })).toBe(snapshot);
  });
});
