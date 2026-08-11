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
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問への答え(任意)
 *  -
 *
 * @param state - 更新対象（ミュートされる）
 * @param patch - 更新情報
 */
export function patchState(state: ComboState, patch: Partial<ComboState>): void {
  throw new Error("not implemented");
}
