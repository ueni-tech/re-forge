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
 * - input フォームのチェック済みの要素のvalueが帰ってくる
 * 
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - input が空配列のとき '' を返す
 * - name が一致し checked === true の最初の要素の value を trim して返す
 * - 一致する要素がなければ '' を返す
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - for...of でループもできるが可読性と意図の伝わりやすさから find を採用
 *
 * @param inputs - input フォームのDOM要素
 * @param name - 欲しい選択項目
 * @returns - checked 属性がついた最初の要素のvalue
 */
export function getCheckedValue(inputs: InputLike[], name: string): string {
  const found = inputs.find( i => i.name === name && i.checked);
  return found ? found.value.trim() : '';
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * -  disabled === true の button 要素の textContent が返ってくる
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - buttons が null または undefined のとき '' を返す
 * - disabled === true の最初の要素の textContent を trim して返す
 * - 該当する要素がなければ '' を返す
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - for...of でループもできるが可読性と意図の伝わりやすさから find を採用
 *
 * @param buttons - button 要素の配列
 * @returns disabled === true の button 要素の textContent
 */
export function getActiveLabel(buttons: ButtonLike[] | null | undefined): string {
  if (!buttons) return '';
  const found = buttons.find( b => b.disabled);
  return found ? found.textContent.trim() : '';
}
