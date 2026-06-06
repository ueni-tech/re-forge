// [heat-2] 安全なパースと、構造的な name 解析
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
export type PrefillData = Record<string, Record<string, string>>;
export type ElementWithName = { name?: string };

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - json 文字列のチェックをして成功ならオブジェクト、失敗なら undefined が手に入る
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - JSON文字列から PrefillData を返却する
 *  - JSON文字列が壊れていたり、null, undefined の場合は undefined を返す
 *  - 例外は undefined を返却する
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - パース失敗で全体をクラッシュさせるのではなく判断を呼び出し側に委ねる
 *  - パースの結果を呼び出し側に判断させるため
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  - JSONをパースしたものをそのまま返すと PrefillData と断定できていないまま返すことになる（ただしこれは合意済み仕様に「ランタイムの形状検証は行わない」とあるため今回はOK）
 *
 * @param raw - sessionStorage から取り出した JSON 文字列(null / undefined の場合もある)
 */
export function parsePrefillData(
  raw: string | null | undefined,
): PrefillData | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as PrefillData;
  } catch {
    return undefined;
  }
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - el に prefillDate と
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
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
