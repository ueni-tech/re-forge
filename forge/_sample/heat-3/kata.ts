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
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - DI の理由は【設計の読解】へ。内部の呼び順だけは【実装メモ】へ
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - storage / fetcher / validKeys、それぞれが引数で渡される理由を考える
 *  - fetcher だけデフォルト値を持つ理由は?
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
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
