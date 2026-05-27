// [refactor/heat-3] before: 配列を直接操作するコード
//
// このファイルは「現場でよく見る低凝集コード」のサンプル。
// このファイル自体は触らない (リファクタは kata/ で行う)。

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export const MAX_ORDER_ITEMS = 10;
const HIGH_PRICE_THRESHOLD = 5000;

/**
 * 注文に明細を追加する。上限を超えると例外。
 */
export function addOrderItem(
  items: OrderItem[],
  newItem: OrderItem,
): OrderItem[] {
  if (items.length >= MAX_ORDER_ITEMS) {
    throw new Error(`cannot add: already at max (${MAX_ORDER_ITEMS})`);
  }
  return [...items, newItem];
}

/**
 * 注文の合計金額を計算する。
 */
export function calcOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * 注文に高額商品が含まれるかを判定する。
 */
export function hasHighPriceItemInOrder(items: OrderItem[]): boolean {
  return items.some((item) => item.price >= HIGH_PRICE_THRESHOLD);
}

/**
 * 注文の明細数を返す。
 */
export function countOrderItems(items: OrderItem[]): number {
  return items.length;
}
