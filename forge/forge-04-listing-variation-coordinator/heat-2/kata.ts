// [heat-2] 初期 listing code とマップ内の有無（goods-image 同期の前提）
//
// 実務での使われ方:
//   ページロード時に「属性で指定されたコード」と「JSON に実在するキー」を揃え、
//   ギャラリーとカートブロックの初期表示を一貫させるとき。マップに無いコードや
//   空のときのフォールバック（先頭キー等）を決める前提関数。
//
// variationMapHasCode と resolveInitialListingCode を実装せよ。
//
// variationMapHasCode(map, code):
//   - code が空文字のとき false。
//   - map が null のとき false。
//   - それ以外は Object.prototype.hasOwnProperty.call(map, code) と同じ真偽。
//
// resolveInitialListingCode(attr, orderedKeys):
//   - attr が null でなく、かつ trim 後が空でない文字列なら、その trim 後の文字列を返す。
//   - そうでなければ orderedKeys の先頭要素を返す（orderedKeys が空なら null）。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _map - （記述）
 * @param _code - （記述）
 * @returns マップがコードを持つか
 */
export function variationMapHasCode(
  _map: Record<string, unknown> | null,
  _code: string,
): boolean {
  throw new Error("not implemented");
}

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _attr - （記述）
 * @param _orderedKeys - （記述）
 * @returns 初期 listing code、決められなければ null
 */
export function resolveInitialListingCode(
  _attr: string | null,
  _orderedKeys: readonly string[],
): string | null {
  throw new Error("not implemented");
}
