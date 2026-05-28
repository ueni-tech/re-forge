// [refactor/heat-1] before: 散らばった価格計算ユーティリティ
//
// このファイルは「現場でよく見る低凝集コード」のサンプル。
// このファイル自体は触らない (リファクタは kata/ で行う)。

/**
 * 税込価格を計算する。
 * @param price 税抜価格
 * @param taxRate 税率 (0.1 = 10%)
 */
export function calcTaxIncluded(price: number, taxRate: number): number {
  return Math.floor(price * (1 + taxRate));
}

/**
 * 割引を適用した価格を返す。
 * @param price 元の価格
 * @param discountRate 割引率 (0.2 = 20%off)
 */
export function applyDiscount(price: number, discountRate: number): number {
  return Math.floor(price * (1 - discountRate));
}

/**
 * 価格を日本円表記でフォーマットする。
 */
export function formatYen(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

/**
 * 価格が妥当(0以上)かチェックする。
 */
export function isValidPrice(price: number): boolean {
  return price >= 0 && Number.isFinite(price);
}
