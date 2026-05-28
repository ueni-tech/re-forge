// [refactor/heat-1] before: 呼び出し側コード
//
// price-utils.ts の関数群を使って、商品の最終表示価格や合計を計算するコード。
// 「数値が裸で引き回されている」状態の典型例。

import {
  calcTaxIncluded,
  applyDiscount,
  formatYen,
  isValidPrice,
} from "./price-utils";

export type Product = {
  id: string;
  name: string;
  price: number; // 税抜
};

/**
 * 商品の税込・割引適用後の表示価格を返す。
 */
export function getProductDisplayPrice(
  product: Product,
  taxRate: number,
  discountRate: number,
): string {
  if (!isValidPrice(product.price)) {
    throw new Error(`invalid price for product ${product.id}`);
  }
  const taxIncluded = calcTaxIncluded(product.price, taxRate);
  const discounted = applyDiscount(taxIncluded, discountRate);
  return formatYen(discounted);
}

/**
 * 商品リストの合計金額(税込・割引適用後)を計算する。
 */
export function calcTotalAmount(
  products: Product[],
  taxRate: number,
  discountRate: number,
): number {
  let total = 0;
  for (const product of products) {
    if (!isValidPrice(product.price)) {
      throw new Error(`invalid price for product ${product.id}`);
    }
    const taxIncluded = calcTaxIncluded(product.price, taxRate);
    const discounted = applyDiscount(taxIncluded, discountRate);
    total = total + discounted;
  }
  return total;
}

/**
 * 商品の元の価格を表示用にフォーマットする(割引・税なし)。
 */
export function formatOriginalPrice(product: Product): string {
  if (!isValidPrice(product.price)) {
    throw new Error(`invalid price for product ${product.id}`);
  }
  return formatYen(product.price);
}
