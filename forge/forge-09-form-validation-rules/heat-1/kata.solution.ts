// [heat-1] 解答(閲覧・比較用)

export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

const OK: ValidationResult = { ok: true };

export function required(message: string): Validator {
  // trim は required の責務。空白だけの入力を「未入力」として扱う
  return (value) => (value.trim() === "" ? { ok: false, message } : OK);
}

export function maxLength(max: number, message: string): Validator {
  // 空文字は OK。「未入力かどうか」は required の責務なのでここでは見ない
  return (value) => (value.length > max ? { ok: false, message } : OK);
}

export function pattern(regex: RegExp, message: string): Validator {
  // 空文字は OK。任意項目に形式チェックだけを付けられるようにする
  return (value) =>
    value !== "" && !regex.test(value) ? { ok: false, message } : OK;
}
