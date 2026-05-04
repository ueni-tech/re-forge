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

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createCategoryLoader(store, categoryEndpoints)` で一度 `load` を作っておけば、UI 側がカテゴリを連続で切り替えても、`store` に反映されるのは「最後に選んだカテゴリ」のデータだけで、未定義のカテゴリではそもそも何も起きないデータ取得の入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createCategoryLoader(store, categoryEndpoints[, _loader])` は `load(categoryId)` を返す。
 * - `categoryEndpoints[categoryId]` が無い `categoryId` で `load` を呼んでも何もしない（`_loader` も呼ばれず、`store` も触らない）。
 * - 有るときは `load` 内部で `_loader(url, delay, items, cb)` を 1 回呼ぶ。`url = categoryEndpoints[categoryId]`、`delay = categoryId.length * 20`、`items = []`。
 * - `load` を複数回呼んでも、`store` を更新するのは「最後に開始した取得」の完了時だけ。それ以前に始まった取得の完了では `store` を触らない。
 * - 採用された完了で受け取った `items` が空なら `store.setEmpty()`、そうでなければ `store.setItems(items)`。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 世代番号でレースを潰す形は heat-2 と同型。加えて「未定義カテゴリでは `_loader` まで行かない」を `load` の境界で保証し、`createCategoryLoader` を呼ぶ側にガードを書かせない。
 * - `_loader` を差し替え可能にして、テストと本番の取得経路を分ける。
 * - 却下案: `createCategoryLoader` を呼ぶ側で `categoryId` の存在チェックと「最新だけ反映」を毎回書く。同じ条件分岐がカテゴリ追加のたびに増え、書き忘れで `store` が古いカテゴリのデータに上書きされるため不採用。
 *
 * @param store - 反映先のストア（`setItems` / `setEmpty`）
 * @param categoryEndpoints - カテゴリ ID → URL のマップ
 * @param _loader - 取得処理の差し替え口（既定は `fakeLoad`）
 * @returns `load(categoryId)` 関数
 */
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
