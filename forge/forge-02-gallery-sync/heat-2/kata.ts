// [heat-2] 非同期結果の世代ガード（previewLoadSeq の核）
//
// 実務での使われ方:
//   プレビュー画像の取得や一覧取得が Promise で重なったとき、古い解決が
//   新しいバリエーションや一覧の表示を上書きしないようにする場面。
//   （showPreview と setImageList が短い間隔で走る等）
//
// createLatestByGeneration(load) を実装せよ。
//
// load(key) は Promise<T> を返す外部 I/O のスタブ想定。
// 返却された関数 request(key) は Promise<T | null> を返す。
//
// 仕様:
//   - request を連続で呼ぶと、内部の「世代」が進む。
//   - ある request の load が解決したとき、それが「解決時点で最新の世代」なら T を返す。
//   - すでにより新しい request が走っていたら null を返す（古い応答を捨てる）。
//   - 古い世代は Promise を reject せず、必ず null で解決すること。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createLatestByGeneration(_load)` で一度 `request` を作っておけば、UI 側のどこから連続して呼ばれても、画面に届くのは「解決時点で最新の呼び出し」の結果だけで、古い呼び出しは静かに `null` で解決される非同期取得の入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createLatestByGeneration(_load)` は `request(key) => Promise<T | null>` を返す。
 * - `request` を呼ぶたびに内部の世代が進む。各 `request` は `_load(key)` を await する。
 * - `_load` の解決時、その世代がまだ最新なら `T` で resolve、そうでなければ `null` で resolve する。
 * - 古い世代の Promise は reject しない。必ず `null` で resolve する（`createLatestByGeneration` を呼ぶ側に try/catch を強要しない）。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 「最新だけ採用する」分岐を `createLatestByGeneration` を呼ぶ側に書くと同じ条件分岐が各所に散るので、世代番号の管理をこのファクトリに閉じる。
 * - reject ではなく `null` で解決するのは、UI 側の例外ハンドリング負担を増やさないため。
 *
 * @template T `_load` が解決する値の型
 * @param _load キーを受け取り `Promise<T>` を返す非同期処理（スタブ・API 呼び出し等）
 * @returns `request(key) => Promise<T | null>`。最新世代の解決時のみ `T`、それ以外は `null`
 */
export function createLatestByGeneration<T>(
  _load: (key: string) => Promise<T>,
): (key: string) => Promise<T | null> {
  let latestSeq = 0;
  return async function (key) {
    const seq = ++latestSeq;
    const result = await _load(key);
    return seq === latestSeq ? result : null;
  };
}
