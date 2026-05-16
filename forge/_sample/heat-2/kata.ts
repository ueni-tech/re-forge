// [heat-2] TTL 付きキャッシュ
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
 *  - なぜ ttl を get の引数ではなく createTTLCache の引数にしているか
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @template V キャッシュする値の型
 * @param ttl エントリの有効期限(ミリ秒)
 */
export function createTTLCache<V>(ttl: number): {
  get: (key: string, factory: () => V) => V;
} {
  throw new Error("not implemented");
}
