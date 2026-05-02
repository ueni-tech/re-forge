// [heat-2] 最新リクエストのみ採用する fetch ラッパー
//
// 実務での使われ方:
//   検索・オートコンプリート・タブ切替などでリクエストが重なると、遅い古い応答が
//   新しい入力結果を上書きする（レース）のを防ぐとき。UI の「いま見ている状態」に
//   だけ結果を反映させるための世代／シーケンスの原型。
//
// createLatestFetcher() を実装せよ。
// 返却された関数は非同期で結果を取得し、
// 最後に呼ばれたリクエストの結果だけ callback に渡す。
//
// 実装・スタブとの契約:
//   · 内部ではこのファイルの fakeRequest を使うこと（完了時に渡る文字列は常に `response:${url}`）。
//   · 「採用されなかった」リクエストについては、呼び出し側が渡した callback は一度も呼ばないこと。

export function fakeRequest(
  url: string,
  delay: number,
  cb: (result: string) => void,
): void {
  setTimeout(() => cb(`response:${url}`), delay);
}

export function createLatestFetcher(): (
  url: string,
  delay: number,
  callback: (result: string) => void,
) => void {
  let latestRequestNumber = 0;
  return function (url, delay, callback) {
    const selfRequestNunber = ++latestRequestNumber;
    fakeRequest(url, delay, function (result) {
      if (selfRequestNunber !== latestRequestNumber) {
        return;
      }
      callback(result);
    });
  };
}
