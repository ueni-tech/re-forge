// [refactor/heat-2] before: プリミティブ2-3個渡しの在庫管理関数群
//
// このファイルは「現場でよく見る低凝集コード」のサンプル。
// このファイル自体は触らない (リファクタは kata/ で行う)。

/**
 * 在庫が空かどうかを判定する。
 */
export function isOutOfStock(quantity: number): boolean {
  return quantity === 0;
}

/**
 * 在庫が上限に達しているかどうかを判定する。
 */
export function isStockFull(quantity: number, limit: number): boolean {
  return quantity >= limit;
}

/**
 * 指定数を追加できるか判定する。
 */
export function canAddStock(
  quantity: number,
  limit: number,
  amount: number,
): boolean {
  return amount >= 0 && quantity + amount <= limit;
}

/**
 * 指定数を引き当てられるか判定する。
 */
export function canReserveStock(quantity: number, amount: number): boolean {
  return amount >= 0 && quantity - amount >= 0;
}

/**
 * 在庫を追加した結果の数量を返す。
 * 上限超過なら例外。
 */
export function addStock(
  quantity: number,
  limit: number,
  amount: number,
): number {
  if (amount < 0) {
    throw new Error(`amount must be non-negative: ${amount}`);
  }
  if (quantity + amount > limit) {
    throw new Error(`would exceed limit ${limit}`);
  }
  return quantity + amount;
}

/**
 * 在庫を引き当てた結果の数量を返す。
 * 在庫不足なら例外。
 */
export function reserveStock(quantity: number, amount: number): number {
  if (amount < 0) {
    throw new Error(`amount must be non-negative: ${amount}`);
  }
  if (quantity - amount < 0) {
    throw new Error(`only ${quantity} available`);
  }
  return quantity - amount;
}
