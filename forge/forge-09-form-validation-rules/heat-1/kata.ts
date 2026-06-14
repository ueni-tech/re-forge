// required / maxLength / pattern — 難易度 ★☆☆
//
// 問題は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 設計メモ（解く前に眺め、解いたら埋める）
 * どの kata でも使える汎用の問い。答えがある項目だけ1〜2行で書く。
 * Q1. 入力の境界（空・0件・想定外の値）で何を返すと決めたか?
 * → require は空文字、空白のときNG。maxLength,pattern はそのまま処理する。
 * 空文字、空白の判定は require が担うため。
 * 
 * Q2. 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無）
 * → 不正値の場合でも例外は投げず、ValidationResult を返す。
 * 
 * Q3. なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて）
 * → 例外を投げずに ValidationResult を返すことで結果の判断を呼び出し側に委ねる。
 * 
 * Q4. 前後の処理との役割分担は適切か?（この関数が担うこと・担わないこと）
 * → これで適切
 *
 * メモ（Q1〜Q4 に当てはまらない気づき・判断根拠。空欄可）
 * →
 */

// 型定義（変更不要）
export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

/** @param message NG のときに返すエラーメッセージ */
export function required(message: string): Validator {
  return function (value: string): ValidationResult {
    if (!value.trim()) return { ok: false, message };
    return { ok: true };
  };
}

/**
 * @param max 許容する最大文字数
 * @param message NG のときに返すエラーメッセージ
 */
export function maxLength(max: number, message: string): Validator {
  return function (value: string): ValidationResult {
    if (value.length > max) return { ok: false, message };
    return { ok: true };
  };
}

/**
 * @param regex 値が満たすべき形式
 * @param message NG のときに返すエラーメッセージ
 */
export function pattern(regex: RegExp, message: string): Validator {
  return function (value: string): ValidationResult {
    if (value === "") return { ok: true };
    if (!regex.test(value)) return { ok: false, message };
    return { ok: true };
  };
}
