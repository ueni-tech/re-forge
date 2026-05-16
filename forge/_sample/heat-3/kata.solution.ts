// [heat-3] 解答(閲覧・比較用)

export type Storage = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

export function fakeFetch(
  key: string,
  delay: number,
  cb: (result: string) => void,
): void {
  setTimeout(() => cb(`fetched:${key}`), delay);
}

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
