// [heat-2] 祖先チェーン上の最初の listing code（closest に相当）
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

export function firstListingCodeOnPath(
  _path: readonly PathNode[],
): string | null {
  throw new Error("not implemented");
}
