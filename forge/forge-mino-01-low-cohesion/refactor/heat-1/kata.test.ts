// [refactor/heat-1] テスト: 振る舞いを保証する
//
// このテストは before/ , kata/ , solution/ のいずれでも pass する必要がある。
// csk がリファクタ中に「赤になった」なら、それは振る舞いを変えてしまった証拠。

import { describe, it, expect } from "vitest";
import {
  getProductDisplayPrice,
  calcTotalAmount,
  formatOriginalPrice,
  type Product,
} from "./kata/checkout";

const sampleProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Sample",
  price: 1000,
  ...overrides,
});

describe("[refactor/heat-1] getProductDisplayPrice", () => {
  it("税込・割引適用後の価格を ¥ 表記で返す", () => {
    const product = sampleProduct({ price: 1000 });
    // 1000 → 1100 (税込10%) → 880 (20%off) → "¥880"
    expect(getProductDisplayPrice(product, 0.1, 0.2)).toBe("¥880");
  });

  it("割引なし(0)も正しく処理する", () => {
    const product = sampleProduct({ price: 1000 });
    expect(getProductDisplayPrice(product, 0.1, 0)).toBe("¥1,100");
  });

  it("不正な価格は例外", () => {
    const product = sampleProduct({ price: -100 });
    expect(() => getProductDisplayPrice(product, 0.1, 0)).toThrow();
  });
});

describe("[refactor/heat-1] calcTotalAmount", () => {
  it("複数商品の合計を返す", () => {
    const products = [
      sampleProduct({ id: "a", price: 1000 }),
      sampleProduct({ id: "b", price: 2000 }),
    ];
    // a: 1000 → 1100 → 880
    // b: 2000 → 2200 → 1760
    // total: 2640
    expect(calcTotalAmount(products, 0.1, 0.2)).toBe(2640);
  });

  it("空リストは 0", () => {
    expect(calcTotalAmount([], 0.1, 0.2)).toBe(0);
  });

  it("リスト内に不正な価格があれば例外", () => {
    const products = [
      sampleProduct({ id: "a", price: 1000 }),
      sampleProduct({ id: "b", price: -100 }),
    ];
    expect(() => calcTotalAmount(products, 0.1, 0.2)).toThrow();
  });
});

describe("[refactor/heat-1] formatOriginalPrice", () => {
  it("元の価格をそのまま ¥ 表記で返す", () => {
    const product = sampleProduct({ price: 1234567 });
    expect(formatOriginalPrice(product)).toBe("¥1,234,567");
  });

  it("不正な価格は例外", () => {
    const product = sampleProduct({ price: -1 });
    expect(() => formatOriginalPrice(product)).toThrow();
  });
});
