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

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: required は空文字も空白のみも NG（trim して判定）。
//     maxLength と pattern は空文字を OK にし、未入力判定を required に集約。
// A2. 保証/しないこと: OK/NG を結果型で返すだけ。例外を投げず、alert・DOM・
//     ログなどの副作用は一切持たない（判定と通知を分離する）。
// A3. なぜこの書き方: message と設定をクロージャに閉じ、戻り値を同じ
//     Validator 型に揃えた。boolean ではなく結果型なのは、ルールと表示文言を
//     一体で持ち運び、判定と文言のズレを型で防ぐため。
// A4. 役割分担: 3つとも同じ Validator 型なので配列に並べられる（heat-2 で合成）。
// ──────────────────────────────────────────────
