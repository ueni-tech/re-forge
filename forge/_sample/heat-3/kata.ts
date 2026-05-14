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
  cb: (result: string) => void,
): void {
  setTimeout(() => cb(`fetched:${key}`), delay);
}

/**
 * 【意図】
 * `createAsyncCacheLoader(storage, validKeys[, _fetcher])` で一度 `load` を作っておけば、許可されたキーのときだけ取得し、保存済みなら同期で返し、なければ取得してからキャッシュへ反映する一貫したデータ取得の入口が手に入る。
 *
 * 【契約】
 * - 後条件: `createAsyncCacheLoader(storage, validKeys[, _fetcher])` は `load(key, delay, callback)` を返す。
 * - 許可外: `validKeys` に含まれない `key` で `load` を呼んでも何もしない（`callback` / `storage` / `_fetcher` のいずれも呼ばない）。例外も投げない。
 * - キャッシュヒット: `validKeys` に含まれ、かつ `storage.get(key)` が `undefined` でなければ、`_fetcher` を呼ばずに `callback(value)` を **同期で 1 回** 呼ぶ。
 * - キャッシュミス: `validKeys` に含まれ、かつ `storage.get(key)` が `undefined` のときだけ `_fetcher(key, delay, innerCb)` を呼ぶ。完了時に **`storage.set(key, result)` してから `callback(result)`** を 1 回呼ぶ（順序が逆だと、callback 内で同じキーを再度 `load` した場合にもう一度 fetch が走ってしまう）。
 *
 * 【設計の読解】
 * - `storage` を外から注入する形（DI）にしている。テストでは `Map` を包んだ仮の storage を渡し、本番では LocalStorage や IndexedDB のラッパを渡せる。`load` 自体は保存先の実装を知らない。
 * - `_fetcher` も差し替え可能だが、既定値 `fakeFetch` を持たせている。これにより「テスト時だけ差し替える」運用と、「本番でも別 fetcher を注入する」運用の両方が同じ API で扱える。
 * - `validKeys` を引数で受けるのは、許可キーのリストを `load` の呼び出しごとに渡させないため。「このローダーは何を許可するか」というポリシーをファクトリ境界で固定する。
 *
 * 【実装上の選択】
 * - 許可キー判定に `Array.prototype.includes` を採用。`validKeys` は通常少数（タブ/フィルタの数）であり、`Set` 化のコストに見合わないため。`validKeys` が大きい運用が想定されるなら `Set` に切り替える余地がある。
 * - キャッシュ判定に `cached !== undefined` を使い、`storage.get` の戻り値型 `string | undefined` の `undefined` を「未キャッシュ」のシグナルとしている。空文字 `""` は「キャッシュ済みの空値」として正しく扱われる。
 *
 * @param storage - 取得結果の保存先（`get` / `set`）
 * @param validKeys - 取得を許可するキーの一覧
 * @param _fetcher - 非同期取得処理の差し替え口（既定は `fakeFetch`）
 * @returns `load(key, delay, callback)` 関数
 */
export function createAsyncCacheLoader(
  storage: Storage,
  validKeys: string[],
  _fetcher: typeof fakeFetch = fakeFetch,
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
