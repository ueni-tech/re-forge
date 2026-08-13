// [heat-2] TTL 付きキャッシュ
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 *
 * @template V キャッシュする値の型
 * @param ttl エントリの有効期限(ミリ秒)
 */
export function createTTLCache<V>(ttl: number): {
  get: (key: string, factory: () => V) => V;
} {
  throw new Error("not implemented");
}
