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
 *  許可されたキーだけ取得し、保存済みなら同期で返し、なければ取得して
 *  キャッシュへ反映する一貫したデータ取得の入口。
 *
 * 【契約】
 *  - validKeys に含まれない key: 何もしない（callback / storage / fetcher
 *    のいずれも触らない、例外も投げない）
 *  - キャッシュヒット: fetcher を呼ばず callback(value) を同期で 1 回
 *  - キャッシュミス: fetcher を呼び、完了時に storage.set してから
 *    callback(result) を 1 回（順序が逆だと再 load 時に二重 fetch する）
 *
 * 【設計の読解】
 *  - storage を DI している。テストでは Map ラッパ、本番では LocalStorage
 *    などを渡せる。load 自体は保存先の実装を知らない。
 *  - _fetcher も差し替え可能だが既定値 fakeFetch を持たせている。
 *    テスト時の差し替えと本番の代替実装が同じ API で扱える。
 *  - validKeys をファクトリ引数に固定。許可ポリシーを load 呼び出しごとに
 *    渡させず、ローダー単位で固定する。
 *
 * 【実装上の選択】
 *  - 許可キー判定に Array.prototype.includes を採用。validKeys は通常
 *    少数で、Set 化のコストに見合わないため。
 *
 * @param storage - 取得結果の保存先（get / set）
 * @param validKeys - 取得を許可するキーの一覧
 * @param _fetcher - 非同期取得処理の差し替え口（既定は fakeFetch）
 * @returns load(key, delay, callback) 関数
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