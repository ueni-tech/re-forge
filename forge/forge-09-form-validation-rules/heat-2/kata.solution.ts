// [heat-2] 解答(閲覧・比較用)

export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

export function composeValidators(validators: Validator[]): Validator {
  return (value) => {
    for (const validate of validators) {
      const result = validate(value);
      // 最初の NG で打ち切る。後続のバリデータは実行しない
      if (!result.ok) return result;
    }
    return { ok: true };
  };
}

export function collectErrors(
  value: string,
  validators: Validator[],
): string[] {
  const messages: string[] = [];
  for (const validate of validators) {
    const result = validate(value);
    if (!result.ok) messages.push(result.message);
  }
  return messages;
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: 空配列のとき composeValidators は「常に OK」、collectErrors は
//     []。ルールが無い＝制約が無い＝何でも通る、と解釈する。
// A2. 保証/しないこと: 適用順は配列順。composeValidators は最初の NG で打ち切り
//     後続を実行しない。どちらも入力配列を変更せず、例外も投げない。
// A3. なぜこの書き方: composeValidators の入出力を同じ Validator 型にして、
//     合成結果をさらに合成できるようにした。「全収集」は message が複数になり
//     ValidationResult(message 1つ)に載らないので戻り値を string[] に変えた。
// A4. 再利用: 「打ち切り」「全収集」を戦略として分離したので、表示要件が変わっても
//     heat-1 のバリデータは1行も変えずに済む。
// ──────────────────────────────────────────────
