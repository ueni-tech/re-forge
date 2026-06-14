// [heat-3] スキーマ駆動のフォーム検証
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

export type FormValues = Record<string, string>;

export type FieldSchema = {
  /** FormValues のキー */
  name: string;
  /** 先頭から順に適用するバリデータ */
  rules: Validator[];
  /** false を返すとこのフィールドを検証しない（未定義なら常に検証） */
  when?: (values: FormValues) => boolean;
};

export type FormErrors = Record<string, string>;

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
 * @param values フォームの入力値（フィールド名 → 値）
 * @param schema 検証ルールの宣言
 */
export function validateForm(
  values: FormValues,
  schema: FieldSchema[],
): FormErrors {
  throw new Error("not implemented");
}
