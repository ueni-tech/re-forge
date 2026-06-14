// [heat-3] 解答(閲覧・比較用)

export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

export type FormValues = Record<string, string>;

export type FieldSchema = {
  name: string;
  rules: Validator[];
  when?: (values: FormValues) => boolean;
};

export type FormErrors = Record<string, string>;

export function validateForm(
  values: FormValues,
  schema: FieldSchema[],
): FormErrors {
  const errors: FormErrors = {};

  for (const field of schema) {
    // when が false のフィールドはルールを一切実行しない
    if (field.when && !field.when(values)) continue;

    // 欠損キーは空文字に正規化し、バリデータには常に string を渡す
    const value = values[field.name] ?? "";

    // フィールド内は最初の NG で打ち切り（heat-2 composeValidators と同じ戦略）
    for (const validate of field.rules) {
      const result = validate(value);
      if (!result.ok) {
        errors[field.name] = result.message;
        break;
      }
    }
  }

  return errors;
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: schema が空なら {}。values にキーが無いフィールドは "" 扱いで検証。
//     when が false のフィールドは検証もエラー登録もしない。
// A2. 保証/しないこと: 返すのは NG フィールドだけ。フィールド内は最初の NG で
//     打ち切り、フィールド間は全検証。values も schema も変更せず例外も投げない。
// A3. なぜこの書き方: ルールを if の羅列ではなく FieldSchema[] というデータに
//     降ろした。when は「フィールド横断の条件」専用の置き場として values 全体を
//     渡す。欠損キーの "" 正規化を境界で行い、内側のバリデータは string だけ扱う。
//     （name 重複時は後勝ち。素直に代入する実装の自然な帰結）
// A4. 再利用: validateForm はエンジン、schema は設定。フィールドが増えても
//     エンジンは変わらない（forge-07 heat-3 の Strategy テーブルと同じ発想）。
// ──────────────────────────────────────────────
