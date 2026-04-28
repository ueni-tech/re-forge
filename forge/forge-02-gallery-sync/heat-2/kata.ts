// [heat-2] 非同期結果の世代ガード（previewLoadSeq の核）
// createLatestByGeneration(load) を実装せよ。
//
// load(key) は Promise<T> を返す外部 I/O のスタブ想定。
// 返却された関数 request(key) は Promise<T | null> を返す。
//
// 仕様:
//   - request を連続で呼ぶと、内部の「世代」が進む。
//   - ある request の load が解決したとき、それが「解決時点で最新の世代」なら T を返す。
//   - すでにより新しい request が走っていたら null を返す（古い応答を捨てる）。
//
// 目的: showPreview(0) と setImageList のあいだで二重に getImage が走るなど、
// 遅延完了が新しい状態を上書きしないようにする。
//
// 行き詰まったら kata.solution.ts を参照。

export function createLatestByGeneration<T>(
  _load: (key: string) => Promise<T>,
): (key: string) => Promise<T | null> {
  throw new Error("not implemented");
}
