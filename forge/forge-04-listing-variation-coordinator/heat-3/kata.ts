// [heat-3] ギャラリー同期とカート同期を1入口に束ねる（entry の核）
//
// 実務での使われ方:
//   バリエーション変更時に「画像ギャラリーの差し替え」と「カート用ブロックの
//   同期」を、必ず同じ順序・同じタイミングで走らせたいときの単一エントリ。
//   片方だけ先に走るとチラつきや不整合になるため、applyGallery → applyCart の順を固定する。
//
// createVariationNavigateCoordinator を実装せよ。
//
// 返却された navigate(listingCode) は:
//   - listingCode が空文字（""）のときだけスキップする（空白のみの文字列は空文字とみなさない）。
//   - その場合 applyGallery / applyCart をいずれも呼ばない。
//   - それ以外のとき、deps.applyGallery が関数なら先に1回、続けて deps.applyCart が関数なら1回呼ぶ。
//   - 省略された側（undefined）は呼ばない。両方省略でも例外を投げない。
//   - どちらか一方だけでも、指定された順序を守る（ギャラリー → カート）。
//
// 行き詰まったら kata.solution.ts を参照。

export function createVariationNavigateCoordinator(_deps: {
  applyGallery?: (listingCode: string) => void;
  applyCart?: (listingCode: string) => void;
}): (listingCode: string) => void {
  throw new Error("not implemented");
}
