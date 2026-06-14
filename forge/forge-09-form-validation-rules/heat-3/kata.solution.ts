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
