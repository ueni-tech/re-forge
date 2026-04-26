// [heat-3] 非同期キャッシュローダー
// createAsyncCacheLoader(storage, validKeys) を実装せよ。
// 返却された load(key, delay, callback) は:
//   ① validKeys に含まれないキーは何もしない
//   ② storage.get(key) が undefined でなければ即座に callback(value) を呼ぶ
//   ③ undefined なら fetcher を呼び、結果を storage.set して callback に渡す

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
