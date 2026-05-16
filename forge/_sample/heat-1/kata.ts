// [heat-1] キー・バリューキャッシュ
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @template V キャッシュする値の型
 */
export function createCache<V>(): {
  get: (key: string, factory: () => V) => V;
  delete: (key: string) => void;
} {
  throw new Error("not implemented");
}
