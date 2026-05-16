// [heat-1] listing-variations.json からページキーのエントリを取得する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照(写経より意図の理解を優先)。

export type VariationSku = { code: string; label?: string };
export type PageVariation = {
  variationSkus: VariationSku[];
  defaultCode: string;
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  - 入力が想定外のときの挙動
 *  - エッジケース
 *  - 例外を投げるか投げないか
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param data - listing-variations.json をパースした値
 * @param pageKey - 探したいページキー
 */
export function loadPageVariation(
  data: unknown,
  pageKey: string,
): PageVariation {
  throw new Error("not implemented");
}
