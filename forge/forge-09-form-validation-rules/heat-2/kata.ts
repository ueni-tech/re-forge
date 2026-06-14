// composeValidators / collectErrors — 難易度 ★★☆
//
// 問題は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（heat-1 と同じ・変更不要）
export type ValidationResult = { ok: true } | { ok: false; message: string };

export type Validator = (value: string) => ValidationResult;

// --- 実装 ---
// problem.md のシグネチャに従って、以下の関数を自分で宣言・実装する。
// 引数・戻り値の型を自分で設計するのが狙い（export 名はテストに合わせる）。
//   - composeValidators
//   - collectErrors

/**
 * 設計メモ（解く前に眺め、解いたら埋める）
 * どの kata でも使える汎用の問い。答えがある項目だけ1〜2行で書く。
 * Q1. 入力の境界（空・0件・想定外の値）で何を返すと決めたか?
 * → validators が空配列の場合、composer は常に OK を返す
 *
 * Q2. 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無）
 * → composer は配列順に処理し最初のNGで打ち切る（後続は処理しない）。例外は投げない。
 *
 * Q3. なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて）
 * → 入出力が同じ validator なので、再度合成できる
 *
 * Q4. 前後の処理との役割分担は適切か?（この関数が担うこと・担わないこと）
 * → 適切
 *
 * メモ（Q1〜Q4 に当てはまらない気づき・判断根拠。空欄可）
 * → validators が配列かどうかのガードは不要。コンパイル時に止まる。
 * - ではいつガードが必要なのか？
 * - JSON や外部API、DOM　から来るデータを扱う場合。この場合はコンパイル時に止められない。
 * - 仕様の境界とランタイムガードを分けて考える。
 * - 想定外の引数が渡ってきそうなときにランタイムガードが必要
 */
export function composeValidators(validators: Validator[]): Validator {
  return function (value: string): ValidationResult {
    if (!validators.length) return { ok: true };
    for (const validator of validators) {
      const validatedResult = validator(value);
      if (!validatedResult.ok) {
        return validatedResult;
      }
    }
    return { ok: true };
  };
}

/**
 * 設計メモ（解く前に眺め、解いたら埋める）
 * どの kata でも使える汎用の問い。答えがある項目だけ1〜2行で書く。
 * Q1. 入力の境界（空・0件・想定外の値）で何を返すと決めたか?
 * → validators が空配列の場合は空配列を返す
 *
 * Q2. 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無）
 * → 常に配列を返す。中身はエラーメッセージの配列（エラーメッセージがない場合は空配列）。
 *
 * Q3. なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて）
 * → 表示用にエラーメッセージを集める。
 * 
 * Q4. 前後の処理との役割分担は適切か?（この関数が担うこと・担わないこと）
 * → 適切
 *
 * メモ（Q1〜Q4 に当てはまらない気づき・判断根拠。空欄可）
 * →
 */
export function collectErrors(
  value: string,
  validators: Validator[],
): string[] {
  const errorMessages: string[] = [];
  if (!validators.length) return errorMessages;
  for (const validator of validators) {
    const validatedResult = validator(value);
    if (!validatedResult.ok) {
      errorMessages.push(validatedResult.message);
    }
  }
  return errorMessages;
}
