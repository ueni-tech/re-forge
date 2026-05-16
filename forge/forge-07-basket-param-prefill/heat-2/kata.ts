// [heat-2] 安全なパースと、構造的な name 解析
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
export type PrefillData = Record<string, Record<string, string>>;
export type ElementWithName = { name?: string };

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ失敗時に例外を投げず undefined を返すのか
 *  - なぜパースとキー解析を別関数に分けているのか
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param raw - sessionStorage から取り出した JSON 文字列(null / undefined の場合もある)
 */
export function parsePrefillData(raw: string | null | undefined): PrefillData | undefined {
  throw new Error("not implemented");
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ name の解析に split ではなく正規表現を使うのか
 *  - なぜ ElementWithName という最小インターフェース型で受けているか
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param el - name 属性を持つ要素(の最小インターフェース)
 * @param prefillData - parsePrefillData でパース済みのデータ
 */
export function getPrefillValue(
  el: ElementWithName | null | undefined,
  prefillData: PrefillData,
): string | undefined {
  throw new Error("not implemented");
}
