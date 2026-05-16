// [heat-1] DOM 要素から payload を組み立てる
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 最小インターフェース型（変更不要）
export type CollectableElement = {
  type: string;
  checked: boolean;
  value: string;
  dataset: { basketParam?: string; basketValue?: string };
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ HTMLElement ではなく最小インターフェース型 CollectableElement で受けているか
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param elements - [data-basket-param] を持つ要素の配列(の最小インターフェース表現)
 */
export function collectPayload(elements: CollectableElement[]): Record<string, string> {
  throw new Error("not implemented");
}
