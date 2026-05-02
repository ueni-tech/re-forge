// [heat-1] カウンター付きロガー
//
// 実務での使われ方:
//   デバッグ・計測・モジュール境界をまたぐログで、呼び出しごとに連番やラベルを付けて
//   トレースしやすくしたいとき。外部に状態を持たせず、関数を閉じ込めて返す最小パターン。
//
// createLogger(label) を実装せよ。
// 返却された関数 log(message) を呼ぶたびに
// "[label #N] message" 形式の文字列を返す。

export function createLogger(label: string): (message: string) => string {
  let count = 0;
  return function (message) {
    count++;
    return `[${label} #${count}] ${message}`;
  };
}
