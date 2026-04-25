// [heat-3] データソース切替ファクトリ
// createCategoryLoader(store, categoryEndpoints) を実装せよ。
// 返却された load(categoryId) は:
//   ① categoryEndpoints[categoryId] が存在しなければ何もしない
//   ② 存在すればデータを非同期取得し、最新リクエストのみ store.setItems(items) に反映
//   ③ 取得結果が空なら store.setEmpty() を呼ぶ

export type Store = {
  setItems: (items: string[]) => void;
  setEmpty: () => void;
};

export type EndpointMap = Record<string, string>;

// スタブ（変更不要）
export function fakeLoad(
  _url: string,
  delay: number,
  items: string[],
  cb: (items: string[]) => void
): void {
  setTimeout(() => cb(items), delay);
}

export function createCategoryLoader(
  store: Store,
  categoryEndpoints: EndpointMap,
  _loader: typeof fakeLoad = fakeLoad
): (categoryId: string) => void {
  // ここに実装する
  throw new Error("not implemented");
}
