// [heat-1] 出品コードごとの hidden フラグ（可視判定の核）
// hiddenFlagsForSelection を実装せよ。
//
// 仕様:
//   - rows[i] は i 番目のブロックに対応する出品コード（listing code）。
//   - selected が rows のいずれかと一致するインデックスだけ「表示」、それ以外は非表示。
//   - 戻り値の i 要素が true なら、そのブロックは hidden（非表示）に相当する。
//   - selected が rows に1度も出現しない場合、すべて true（すべて非表示）を返す。
//
// 行き詰まったら kata.solution.ts を参照。

export function hiddenFlagsForSelection(
  _rows: readonly string[],
  _selected: string,
): boolean[] {
  throw new Error("not implemented");
}
