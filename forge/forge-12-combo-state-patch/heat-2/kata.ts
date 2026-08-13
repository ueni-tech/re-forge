// [heat-2] 部分更新パッチで軸状態を更新する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type ComboState = {
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
};

/**
 * ピッカーの選択状態を、変えた軸だけ上書きする。
 *
 * 渡したオブジェクトをその場で書き換える。値が `undefined` のキーは触らず、空文字は書き込む。
 *
 *
 * @param state 更新対象（このオブジェクトを書き換える）
 * @param patch 触りたい軸だけの部分更新
 */
export function patchState(state: ComboState, patch: Partial<ComboState>): void {
  if (patch.label !== undefined) state.label = patch.label;
  if (patch.ballDiameter !== undefined) state.ballDiameter = patch.ballDiameter;
  if (patch.engravingLines !== undefined) state.engravingLines = patch.engravingLines;
  if (patch.wrapping !== undefined) state.wrapping = patch.wrapping;
}
