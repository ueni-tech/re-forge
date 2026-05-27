// [refactor/heat-2] solution: リファクタ後の inventory.ts
//
// 変化:
// - InventoryItem の中で stock + stockLimit を保持するだけだった状態から、
//   「変換層 (stockOf) で Stock インスタンスを取り出して操作」する形に
// - canXxx + Xxx の冗長な二段呼び出しが、Stock のメソッド呼び出しに集約
// - 「stock と stockLimit を別々に持ち回る」必要がなくなった

import { Stock } from "./Stock";

export type InventoryItem = {
  id: string;
  stock: number;
  stockLimit: number;
};

/**
 * InventoryItem から Stock インスタンスを作る変換層。
 */
function stockOf(item: InventoryItem): Stock {
  return new Stock(item.stock, item.stockLimit);
}

/**
 * Stock を InventoryItem に書き戻す変換層。
 */
function applyStockTo(item: InventoryItem, stock: Stock): InventoryItem {
  return { ...item, stock: stock.toQuantity() };
}

export function reserveOne(item: InventoryItem): InventoryItem {
  const stock = stockOf(item);
  if (!stock.canReserve(1)) {
    throw new Error(`out of stock: ${item.id}`);
  }
  return applyStockTo(item, stock.reserve(1));
}

export function restock(item: InventoryItem, amount: number): InventoryItem {
  const stock = stockOf(item);
  if (!stock.canAdd(amount)) {
    throw new Error(`cannot restock ${item.id}: would exceed limit`);
  }
  return applyStockTo(item, stock.add(amount));
}

export function describeStockStatus(item: InventoryItem): string {
  const stock = stockOf(item);
  if (stock.isEmpty()) {
    return "在庫切れ";
  }
  if (stock.isFull()) {
    return "在庫満杯";
  }
  return `在庫: ${stock.toQuantity()}/${stock.toLimit()}`;
}

export function remainingCapacity(item: InventoryItem): number {
  return stockOf(item).remainingCapacity();
}
