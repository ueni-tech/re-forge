// [heat-2] 祖先チェーン上の最初の listing code（closest に相当）
//
// 実務での使われ方:
//   クリックやキーボード操作で得た DOM の経路（composedPath 等）から、
//   ルート（例: .js-goods-variation）までの間で「最初に意味のある出品コード」を
//   拾うとき。イベント委譲で子要素をクリックしても親の variation 文脈を解決する。
//
// firstListingCodeOnPath を実装せよ。
//
// path[0] はクリック対象（ターゲット）、path[path.length - 1] は `.js-goods-variation` 相当のルート。
// ルートより外側のノードは path に含めない前提とする。
//
// 仕様:
//   - path を先頭から順に見て、listingCode が null / undefined / 空文字でない最初の要素の値を返す。
//   - 該当がなければ null。
//
// 行き詰まったら kata.solution.ts を参照。

export type PathNode = { listingCode: string | null | undefined };

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _path - （記述）
 * @returns 最初に見つかった listing code、なければ null
 */
export function firstListingCodeOnPath(
  _path: readonly PathNode[],
): string | null {
  throw new Error("not implemented");
}
