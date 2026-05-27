// [refactor/heat-1] solution: リファクタ後の checkout.ts
//
// Price クラスを使うことで、以下が変化した:
// - 「数値が価格かどうか」が型レベルで保証されるようになった
// - 妥当性チェックが Price のコンストラクタに集約された (重複が消えた)
// - メソッドチェーンで処理の流れが読みやすくなった
// - 「税込→割引→表示」という順序の意味が、業務語彙のメソッド名で表現された

import { Price } from "./Price";

export type Product = {
  id: string;
  name: string;
  price: number; // 税抜
};

/**
 * Product の price から Price インスタンスを作る。
 * 不正な値ならコンストラクタが例外を投げる。
 */
function priceOf(product: Product): Price {
  try {
    return new Price(product.price);
  } catch (e) {
    throw new Error(
      `invalid price for product ${product.id}: ${(e as Error).message}`,
    );
  }
}

export function getProductDisplayPrice(
  product: Product,
  taxRate: number,
  discountRate: number,
): string {
  return priceOf(product).withTax(taxRate).discount(discountRate).toDisplay();
}

export function calcTotalAmount(
  products: Product[],
  taxRate: number,
  discountRate: number,
): number {
  return products
    .map((p) =>
      priceOf(p).withTax(taxRate).discount(discountRate).toNumber(),
    )
    .reduce((sum, n) => sum + n, 0);
}

export function formatOriginalPrice(product: Product): string {
  return priceOf(product).toDisplay();
}
