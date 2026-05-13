// [heat-1] DOM 状態の読み取りヘルパー（純粋関数）
//
// 実務での使われ方:
//   商品 PDP のバリエーション選択（書体・レイアウト・カラー）を
//   プレビュー横のラベルへ反映するとき、DOM の現在選択状態を
//   「文字列値として取り出す」部分。DOM ノードをインターフェースに
//   落としてから受け取ることで、jsdom 不要のユニットテストが書ける。
//
// getCheckedValue(inputs, name) と getActiveLabel(buttons) を実装せよ。
//
// getCheckedValue は:
//   ① inputs が空配列のとき '' を返す
//   ② name が一致し checked === true の最初の要素の value を trim して返す
//   ③ 一致する要素がなければ '' を返す
//
// getActiveLabel は:
//   ① buttons が null または undefined のとき '' を返す
//   ② disabled === true の最初の要素の textContent を trim して返す
//   ③ 該当する要素がなければ '' を返す

export type InputLike = { name: string; checked: boolean; value: string };
export type ButtonLike = { disabled: boolean; textContent: string };

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param inputs - （記述）
 * @param name - （記述）
 * @returns （記述）
 */
export function getCheckedValue(inputs: InputLike[], name: string): string {
  // ここに実装する
  throw new Error("not implemented");
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param buttons - （記述）
 * @returns （記述）
 */
export function getActiveLabel(buttons: ButtonLike[] | null | undefined): string {
  // ここに実装する
  throw new Error("not implemented");
}
