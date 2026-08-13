// [heat-1] キー・バリューキャッシュ
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 *
 * @template V キャッシュする値の型
 */
export function createCache<V>(): {
  get: (key: string, factory: () => V) => V;
  delete: (key: string) => void;
} {
  throw new Error("not implemented");
}
