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
 * 連続する非同期読み込みのうち、「解決時点で最新の呼び出し」にだけ結果を渡し、
 * それより古い呼び出しは `null` で解決するファクトリ。
 *
 * **責務**
 * - `request` が呼ばれるたびに内部の世代（シーケンス）を進める。
 * - 各呼び出しで `_load(key)` を await し、完了時にその世代がまだ最新なら `T`、
 *   すでに新しい `request` があれば `null` を返す。
 *
 * **ここで切る理由**
 * - `_load`（外部 I/O）と「最新だけ採用する」ポリシーを分離し、
 *   ローダー側に世代管理を混ぜない（再利用・テストがしやすい）。
 *
 * **仕様上の注意**
 * - 古い世代の Promise は reject せず、必ず `null` で解決する。
 *
 * @template T `_load` が解決する値の型
 * @param _load キーを受け取り `Promise<T>` を返す非同期処理（スタブ・API 呼び出し等）
 * @returns `request` 関数。`request(key)` は `Promise<T | null>` を返し、
 *          解決時にその呼び出しが最新世代なら `T`、そうでなければ `null`
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
