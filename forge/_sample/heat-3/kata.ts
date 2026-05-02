// [heat-3] 非同期キャッシュローダー
//
// 実務での使われ方:
//   タブやフィルタごとにデータを fetch しつつ、一度取れた結果はメモリに載せて
//   再訪問時は同期的に返す、といった「許可キーのみ fetch・それ以外は無視」の
//   データ取得ゲート。ストレージ差し替えでテストもしやすい。
//
// createAsyncCacheLoader(storage, validKeys[, fetcher]) を実装せよ。
// 返却された load(key, delay, callback) は:
//   ① validKeys に含まれないキーは何もしない（callback・storage・fetcher はすべて触らない）
//   ② storage.get(key) が undefined でなければ同期的に callback(value) を呼び、fetcher は使わない
//   ③ undefined なら fetcher(key, delay, innerCb) を呼ぶ。完了後に storage.set(key, result) してから callback(result) を呼ぶ
//
// デフォルト fetcher は fakeFetch で、完了時に innerCb(`fetched:${key}`) が渡る。

export type Storage = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

// スタブ（変更不要）
export function fakeFetch(
  key: string,
  delay: number,
  cb: (result: string) => void
): void {
  setTimeout(() => cb(`fetched:${key}`), delay);
}

export function createAsyncCacheLoader(
  storage: Storage,
  validKeys: string[],
  _fetcher: typeof fakeFetch = fakeFetch
): (key: string, delay: number, callback: (result: string) => void) => void {
  return function (key, delay, callback) {
    if (!validKeys.includes(key)) return;
    const cached = storage.get(key);
    if (cached !== undefined) {
      callback(cached);
      return;
    }
    _fetcher(key, delay, (result) => {
      storage.set(key, result);
      callback(result);
    });
  };
}
