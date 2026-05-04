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

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `imageSetSignature(base, files)` を呼べば、ベース URL と画像配列の組から、同一画像セットかどうかを deep equal なしで安く比較できる短い文字列が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `base` が `null` / `undefined` / 空文字、または `files.length === 0` のとき、戻り値は `''`。
 * - それ以外は `${base}|${body}` を返す。`body` は各要素を `${main ?? ''}:${thumb ?? ''}` に変換し、`;` で連結したもの。
 * - 連結順は `files` のインデックス昇順。並び替えはしない。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - オブジェクト全体の deep equal は要素数が増えるほど遅くなるので、表示同一性に効く部分だけを文字列に圧縮する。
 * - 区切り文字（`|` と `;` と `:`）を固定し、URL に含まれにくい文字を選ぶことで衝突を避ける。
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _base - 画像 URL のベース（`null` / `undefined` / 空文字なら無効）
 * @param _files - 各画像の `main` / `thumb` を持つ配列
 * @returns 画像セットを表すシグネチャ文字列
 */
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
