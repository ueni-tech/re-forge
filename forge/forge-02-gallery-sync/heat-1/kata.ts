// [heat-1] 画像一覧シグネチャ（image set signature）
//
// 実務での使われ方:
//   商品 PDP のギャラリーで、ベース URL と main/thumb の一覧が変わったかを
//   オブジェクト全体の deep equal なしで判定したいとき。Grid・ページャ・
//   サムネ同期など「同一画像セットか」を安く比較する前提処理。
//
// imageSetSignature(base, files) を実装せよ。
//
// 仕様:
//   - base が null / undefined / 空文字、または files.length === 0 のとき、'' を返す。
//   - それ以外は `${base}|${body}` を返す。
//     body は各要素を `${main}:${thumb}` にし（欠けている側は空文字）、';' で連結。
//     連結順は files 配列のインデックス昇順とする。
//     main / thumb は `??` で nullish を空文字に落とす（実務 hankoya は TS3.6 で三項だったが、ここでは現代 TS でよい）。
//
// 行き詰まったら kata.solution.ts を参照（写経より仕様との対応を読むこと）。

export type FileRef = { main?: string; thumb?: string };

export function imageSetSignature(
  _base: string | null | undefined,
  _files: FileRef[],
): string {
  // ここに実装
  if (_base === null || _base === "" || _files.length === 0) {
    return "";
  }

  const body = _files
    .map((file) => `${file.main ?? ""}:${file.thumb ?? ""}`)
    .join(";");

  return `${_base ?? ""}|${body}`;
}
