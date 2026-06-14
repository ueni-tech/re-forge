// [heat-2] ルールの合成 — 打ち切りと全収集
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（heat-1 と同じ・変更不要）
export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @param validators 先頭から順に適用するバリデータの配列
 */
export function composeValidators(validators: Validator[]): Validator {
  throw new Error("not implemented");
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @param value 検証する値
 * @param validators 先頭から順に適用するバリデータの配列
 */
export function collectErrors(value: string, validators: Validator[]): string[] {
  throw new Error("not implemented");
}
