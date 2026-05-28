// [refactor/heat-2] before: 呼び出し側コード
//
// 在庫の関数群を使って、注文処理・補充・表示などを行うコード。
// プリミティブ(stock, limit)が常にペアで引数に出てくる。

import {
  isOutOfStock,
  isStockFull,
  canAddStock,
  canReserveStock,
  addStock,
  reserveStock,
} from "./stock-utils";

export type InventoryItem = {
  id: string;
  stock: number;
  stockLimit: number;
};

/**
 * 商品をカートに追加する。在庫があれば在庫を1つ引き当て、新しい在庫数を返す。
 */
export function reserveOne(item: InventoryItem): InventoryItem {
  if (!canReserveStock(item.stock, 1)) {
    throw new Error(`out of stock: ${item.id}`);
  }
  const newStock = reserveStock(item.stock, 1);
  return { ...item, stock: newStock };
}

/**
 * 商品の在庫を指定数追加する。上限超過なら例外。
 */
export function restock(item: InventoryItem, amount: number): InventoryItem {
  if (!canAddStock(item.stock, item.stockLimit, amount)) {
    throw new Error(`cannot restock ${item.id}: would exceed limit`);
  }
  const newStock = addStock(item.stock, item.stockLimit, amount);
  return { ...item, stock: newStock };
}

/**
 * 在庫状態を表す文字列を返す(UI 表示用)。
 */
export function describeStockStatus(item: InventoryItem): string {
  if (isOutOfStock(item.stock)) {
    return "在庫切れ";
  }
  if (isStockFull(item.stock, item.stockLimit)) {
    return "在庫満杯";
  }
  return `在庫: ${item.stock}/${item.stockLimit}`;
}

/**
 * 「あと何個追加できるか」を返す(補充計画用)。
 */
export function remainingCapacity(item: InventoryItem): number {
  return item.stockLimit - item.stock;
}
