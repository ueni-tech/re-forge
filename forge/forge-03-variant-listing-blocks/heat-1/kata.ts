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
//   - 戻り値 result[i] は「そのブロックを hidden にするか」。true = 非表示、false = 表示（DOM の hidden と同じ向き）。
//   - rows[i] === selected の行はすべて result[i] === false（表示）。同一コードが複数行にあってもすべて。
//   - rows[i] !== selected の行は result[i] === true（非表示）。
//   - selected が rows に1度も出現しない場合、すべて result[i] === true（すべて非表示）。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * 行配列と選択済みのSKUを渡すと各行に対応した「非表示にするかどうか」の真偽値配列が返ってくる
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - 各行について row === selected なら result は false（表示）、そうでなければ true（hidden）
 * - selected が rows に無いときは、すべての行で result は true
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 契約を`row !== selected`に圧縮した
 * - `includes`による早期分岐は不要
 * - 却下案: 配列変換は`map`が読みやすいので今回`for`は不採用
 *
 * @param rows - 出品コードの配列
 * @param selected - 選択済みの出品コード
 * @returns 各行が hidden かどうかのフラグ配列
 */
export function hiddenFlagsForSelection(
  rows: readonly string[],
  selected: string,
): boolean[] {
  return rows.map((row) => row !== selected);
}
