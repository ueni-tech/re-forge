// [refactor/heat-3] before: 注文を扱う上位コード
//
// 注目: ここでは「order-utils.ts の関数」と「items 配列への直接操作」が混在している。
// これが「配列を外に晒したクラス」の典型症状。

import {
  addOrderItem,
  calcOrderTotal,
  hasHighPriceItemInOrder,
  countOrderItems,
  MAX_ORDER_ITEMS,
  type OrderItem,
} from "./order-utils";

export type { OrderItem };

export type Order = {
  id: string;
  items: OrderItem[];
};

/**
 * 注文に商品を追加する。
 */
export function addItemToOrder(order: Order, newItem: OrderItem): Order {
  const newItems = addOrderItem(order.items, newItem);
  return { ...order, items: newItems };
}

/**
 * 注文の合計金額を返す。
 */
export function getOrderTotal(order: Order): number {
  return calcOrderTotal(order.items);
}

/**
 * 注文の概要文字列を返す。
 */
export function describeOrder(order: Order): string {
  const count = countOrderItems(order.items);
  const total = calcOrderTotal(order.items);
  const hasHigh = hasHighPriceItemInOrder(order.items);
  const highPriceMark = hasHigh ? "★" : "";
  return `${highPriceMark}${count}件 ¥${total.toLocaleString("ja-JP")}`;
}

/**
 * 高額商品ポイントを付与すべきかを判定する。
 * (現状: hasHighPriceItemInOrder を経由せず、配列を直接 some している)
 */
export function shouldAwardHighPricePoints(order: Order): boolean {
  return order.items.some((item) => item.price >= 5000);
}

/**
 * 5000円以上の単価の商品の名前一覧を返す (高額商品レポート用)。
 * (現状: 配列を直接 filter / map している)
 */
export function listHighPriceItemNames(order: Order): string[] {
  return order.items
    .filter((item) => item.price >= 5000)
    .map((item) => item.name);
}

/**
 * あと何個追加できるかを返す。
 */
export function remainingItemSlots(order: Order): number {
  return MAX_ORDER_ITEMS - order.items.length;
}
