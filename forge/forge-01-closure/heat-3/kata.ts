// [heat-3] データソース切替ファクトリ
//
// 実務での使われ方:
//   カテゴリやタブごとに API の URL が変わり、ユーザーが連続で切り替えたときに
//   「最後に選んだカテゴリ」のデータだけをストア（Redux やコンポーネント状態）へ
//   反映させたい場面。存在しないカテゴリは読まない、というガードも含む。
//
// createCategoryLoader(store, categoryEndpoints[, loader]) を実装せよ。
//
// 返却された load(categoryId) の振る舞い:
//   ① categoryEndpoints[categoryId] が存在しなければ何もしない（_loader も呼ばない）
//   ② 存在すれば _loader で非同期取得し、開始順に関係なく「最後に開始した」リクエストの結果だけを store に反映する
//      · コールバックで受け取った items の length が 0 なら store.setEmpty()
//      · それ以外は store.setItems(items)
//
// _loader への引数（fakeLoad と同一シグネチャ）:
//   · 第1引数: そのカテゴリの URL（categoryEndpoints[categoryId]）
//   · 第2引数 delay（ミリ秒）: categoryId.length * 20（固定の見積りルール）
//   · 第3引数: 空配列 []（スタブ fakeLoad はこれをそのまま cb に渡す。テスト用モックは URL 等から独自に応答を組み立て、第3引数は無視してよい）
//   · 第4引数: 上記②の分岐を行うコールバック

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
  cb: (items: string[]) => void,
): void {
  setTimeout(() => cb(items), delay);
}

export function createCategoryLoader(
  store: Store,
  categoryEndpoints: EndpointMap,
  _loader: typeof fakeLoad = fakeLoad,
): (categoryId: string) => void {
  // ここから実装
  let latestRequestNum = 0;
  return function (categoryId) {
    const selfRequestNum = ++latestRequestNum;
    if (!Object.hasOwn(categoryEndpoints, categoryId)) return;
    const url = categoryEndpoints[categoryId];
    const delay = categoryId.length * 20;
    const items = [];
    _loader(url, delay, items, function (items) {
      if (selfRequestNum !== latestRequestNum) return;
      items.length === 0 ? store.setEmpty() : store.setItems(items);
    });
  };
}
