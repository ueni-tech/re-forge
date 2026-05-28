// [refactor/heat-3] solution: リファクタ後の order-service.ts
//
// 大きな変化:
// - 「order.items.some(...)」「order.items.filter(...)」などの配列直接操作が消えた
// - 5000 円の閾値が OrderItems の中に集約され、外に漏れない
// - 業務語彙のメソッド名 (hasHighPriceItem, highPriceItemNames) で読める

import { OrderItems, type OrderItem } from "./OrderItems";

export type { OrderItem };

export type Order = {
  id: string;
  items: OrderItem[];
};

/**
 * Order.items から OrderItems インスタンスを作る変換層。
 */
function itemsOf(order: Order): OrderItems {
  return new OrderItems(order.items);
}

/**
 * OrderItems を Order に書き戻す変換層。
 */
function applyItemsTo(order: Order, items: OrderItems): Order {
  return { ...order, items: [...items.toSnapshot()] };
}

export function addItemToOrder(order: Order, newItem: OrderItem): Order {
  const items = itemsOf(order);
  return applyItemsTo(order, items.add(newItem));
}

export function getOrderTotal(order: Order): number {
  return itemsOf(order).totalAmount();
}

export function describeOrder(order: Order): string {
  const items = itemsOf(order);
  const highPriceMark = items.hasHighPriceItem() ? "★" : "";
  return `${highPriceMark}${items.count()}件 ¥${items.totalAmount().toLocaleString("ja-JP")}`;
}

export function shouldAwardHighPricePoints(order: Order): boolean {
  return itemsOf(order).hasHighPriceItem();
}

export function listHighPriceItemNames(order: Order): string[] {
  return itemsOf(order).highPriceItemNames();
}

export function remainingItemSlots(order: Order): number {
  return itemsOf(order).remainingCapacity();
}
