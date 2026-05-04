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

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createLatestFetcher()` で一度 `fetcher` を作っておけば、UI 側のどこから何度呼ばれても、古い応答で画面が上書きされない取得の入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createLatestFetcher()` は `fetcher`（型 `(url, delay, callback) => void`）を返す。
 * - `fetcher` は内部でこのファイルの `fakeRequest` を使って非同期に取得する。
 * - 完了時、その時点で「最後に開始した `fetcher` 呼び出し」に対応する完了に限り、`callback(result)` を 1 回呼ぶ。
 * - 採用されなかった `fetcher` 呼び出しでは、渡した `callback` は一度も呼ばれない。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - `createLatestFetcher` を使わず、画面側で `fakeRequest` を直接呼んで「最新だけ採用」の分岐を書くと、同じバグが各所に散るため、世代管理をこの関数に閉じる。
 * - 却下案: 画面側で前回リクエストを `AbortController` で都度キャンセルする。`fakeRequest` がキャンセル非対応で、本 kata の契約（採用されない呼び出しでは `callback` を呼ばない）はラッパー側で実現する方が単純なので不採用。
 *
 * @returns 最後に開始した `fetcher` 呼び出しの完了時だけ `callback(result)` を呼ぶ関数
 */
export function createLatestFetcher(): (
  url: string,
  delay: number,
  callback: (result: string) => void,
) => void {
  let latestRequestNumber = 0;
  return function (url, delay, callback) {
    const selfRequestNumber = ++latestRequestNumber;
    fakeRequest(url, delay, function (result) {
      if (selfRequestNumber !== latestRequestNumber) {
        return;
      }
      callback(result);
    });
  };
}
