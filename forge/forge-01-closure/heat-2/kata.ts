// [heat-2] 最新リクエストのみ採用する fetch ラッパー
// createLatestFetcher() を実装せよ。
// 返却された関数は非同期で結果を取得し、
// 最後に呼ばれたリクエストの結果だけ callback に渡す。

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
