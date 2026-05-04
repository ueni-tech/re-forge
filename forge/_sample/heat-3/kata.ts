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

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createAsyncCacheLoader(storage, validKeys[, _fetcher])` で一度 `load` を作っておけば、許可されたキーのときだけ取得し、保存済みなら同期で返し、なければ取得してからキャッシュへ反映する一貫したデータ取得の入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createAsyncCacheLoader(storage, validKeys[, _fetcher])` は `load(key, delay, callback)` を返す。
 * - `validKeys` に含まれない `key` で `load` を呼んでも何もしない（`callback` / `storage` / `_fetcher` のいずれも呼ばない）。
 * - 含まれていて、かつ `storage.get(key)` が `undefined` でなければ、`_fetcher` を呼ばずに `callback(value)` を同期で 1 回呼ぶ。
 * - 含まれていて、かつ `storage.get(key)` が `undefined` のときだけ `_fetcher(key, delay, innerCb)` を呼び、完了時に `storage.set(key, result)` してから `callback(result)` を 1 回呼ぶ。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 「許可キー判定 → キャッシュ確認 → 取得 → 保存 → コールバック」の順序を `load` の境界に閉じ、`createAsyncCacheLoader` を呼ぶ側で順序や書き忘れが起きないようにする。
 * - `_fetcher` を差し替え可能にして、テストと本番の取得経路を分ける。
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param storage - 取得結果の保存先（`get` / `set`）
 * @param validKeys - 取得を許可するキーの一覧
 * @param _fetcher - 非同期取得処理の差し替え口（既定は `fakeFetch`）
 * @returns `load(key, delay, callback)` 関数
 */
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
