// [heat-3] 非同期キャッシュローダー
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type Storage = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

// スタブ(変更不要)
export function fakeFetch(
  key: string,
  delay: number,
  cb: (result: string) => void,
): void {
  setTimeout(() => cb(`fetched:${key}`), delay);
}

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 *
 * @param storage - 取得結果の保存先(get / set)
 * @param validKeys - 取得を許可するキーの一覧
 * @param _fetcher - 非同期取得処理の差し替え口(既定は fakeFetch)
 */
export function createAsyncCacheLoader(
  storage: Storage,
  validKeys: string[],
  _fetcher: typeof fakeFetch = fakeFetch,
): (key: string, delay: number, callback: (result: string) => void) => void {
  throw new Error("not implemented");
}
