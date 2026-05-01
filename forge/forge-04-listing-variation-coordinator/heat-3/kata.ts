// [heat-3] ギャラリー同期とカート同期を1入口に束ねる（entry の核）
// createVariationNavigateCoordinator を実装せよ。
//
// 返却された navigate(listingCode) は:
//   - listingCode が空文字のとき、applyGallery / applyCart をいずれも呼ばない。
//   - それ以外のとき、applyGallery があれば先に1回、続けて applyCart があれば1回呼ぶ。
//   - どちらか一方だけでも、指定された順序を守る（ギャラリー → カート）。
//
// 行き詰まったら kata.solution.ts を参照。

export function createVariationNavigateCoordinator(_deps: {
  applyGallery?: (listingCode: string) => void;
  applyCart?: (listingCode: string) => void;
}): (listingCode: string) => void {
  throw new Error("not implemented");
}
