// [002/02] 判定 — 追加分。01.test.ts も緑のままであること。

import { describe, it, expect } from "vitest";
import { resolvePriceDisplay } from "./solution";

type Product = { price: number; salePrice?: number };
type PriceContext = { taxRate: number; taxDisplay: "included" | "excluded" };

function product(price: number, salePrice?: number): Readonly<Product> {
  const p: Product = salePrice === undefined ? { price } : { price, salePrice };
  return Object.freeze(p);
}

function context(taxRate: number, taxDisplay: PriceContext["taxDisplay"]): Readonly<PriceContext> {
  return Object.freeze({ taxRate, taxDisplay });
}

const run = (p: Readonly<Product>, c: Readonly<PriceContext>) =>
  resolvePriceDisplay(p as Product, c as PriceContext);

describe("[002/02] セール価格の反映", () => {
  it("salePrice があれば税込表示の基準にする", () => {
    expect(run(product(1000, 800), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 880,
      taxLabel: "included",
    });
  });

  it("salePrice があれば税抜表示の基準にする", () => {
    expect(run(product(1000, 800), context(0.1, "excluded"))).toEqual({
      status: "ok",
      amount: 800,
      taxLabel: "excluded",
    });
  });

  it("salePrice 未設定は通常価格のまま（01 と同じ）", () => {
    expect(run(product(1000), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 1100,
      taxLabel: "included",
    });
  });

  it("salePrice が 0 なら amount 0 を許可", () => {
    expect(run(product(1000, 0), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 0,
      taxLabel: "included",
    });
  });

  it("salePrice が負なら invalid", () => {
    expect(run(product(1000, -10), context(0.1, "included"))).toEqual({ status: "invalid" });
  });

  it("通常価格が負なら、salePrice が正しくても invalid", () => {
    expect(run(product(-1, 800), context(0.1, "included"))).toEqual({ status: "invalid" });
  });

  it("salePrice 基準でも端数は切り捨て", () => {
    // 150 * 1.1 = 165
    expect(run(product(199, 150), context(0.1, "included"))).toEqual({
      status: "ok",
      amount: 165,
      taxLabel: "included",
    });
  });
});
