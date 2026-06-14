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
