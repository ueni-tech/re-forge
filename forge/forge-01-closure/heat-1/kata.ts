// [heat-1] カウンター付きロガー
//
// 実務での使われ方:
//   デバッグ・計測・モジュール境界をまたぐログで、呼び出しごとに連番やラベルを付けて
//   トレースしやすくしたいとき。外部に状態を持たせず、関数を閉じ込めて返す最小パターン。
//
// createLogger(label) を実装せよ。
// 返却された関数 log(message) を呼ぶたびに
// "[label #N] message" 形式の文字列を返す。

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createLogger(label)` で一度 `logger` を作っておけば、ログを書きたい側は `message` を渡すだけで、ラベルと通し番号が自動で付いた一行が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createLogger(label)` は `logger` を返す。
 * - `logger(message)` を呼ぶたび、戻り値は `[label #N] message` 形式の文字列で、N はその `logger` に固有の通し番号として 1 から順に増える。
 * - 別の `label` から作った `logger` どうしで番号は混ざらない（各 `logger` が独立した番号を持つ）。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 番号管理を `createLogger` を呼ぶ側に持たせると、ラベルごとに変数を作るコードが増えるので、ラベルとカウンタを `createLogger` 内に閉じる。
 * - 却下案: モジュールスコープに `count` を置く。複数 `logger` で番号が混ざるため不採用。
 *
 * @param label `logger` が保持するメッセージラベル
 * @returns `logger(message)` を返すクロージャ
 */
export function createLogger(label: string): (message: string) => string {
  let count = 0;
  return function (message) {
    count++;
    return `[${label} #${count}] ${message}`;
  };
}
