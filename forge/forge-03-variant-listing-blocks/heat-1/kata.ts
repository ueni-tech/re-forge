// [heat-1] 出品コードごとの hidden フラグ（可視判定の核）
//
// 実務での使われ方:
//   カートやブロック UI で、ユーザーが選んだ出品コード（SKU に相当）に合わせて
//   行ごとに表示・非表示を切り替えるとき。同一コードが複数行にあっても揃えて
//   表示する、といったルールをフラグ配列に落とす。
//
// hiddenFlagsForSelection を実装せよ。
//
// 仕様:
//   - rows[i] は i 番目のブロックに対応する出品コード（listing code）。
//   - rows[i] === selected であるすべての i を「表示」（同一コードが複数行にあってもすべて表示扱い）、それ以外は非表示。
//   - 戻り値の i 要素が true なら、そのブロックは hidden（非表示）に相当する。
//   - selected が rows に1度も出現しない場合、すべて true（すべて非表示）を返す。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _rows - （記述）
 * @param _selected - （記述）
 * @returns 各行が hidden かどうかのフラグ配列
 */
export function hiddenFlagsForSelection(
  _rows: readonly string[],
  _selected: string,
): boolean[] {
  throw new Error("not implemented");
}
