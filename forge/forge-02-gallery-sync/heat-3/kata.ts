// [heat-3] バリエーション切替時の dispatch 順（applyImageStateAndResetIndex の核）
//
// 実務での使われ方:
//   色・サイズなどバリエーション変更で画像枚数が変わるとき、先に index を戻さず
//   一覧だけ差し替えると、一瞬「存在しないスライド番号」の中間状態になる。
//   Redux 等で「インデックスリセット → 画像セット更新」の順を守るための reducer／
//   dispatch 順のモデル化。
//
// 次の型と関数を実装せよ:
//   - State, Action, reduce
//   - isValidState(s): mains が空なら preview===0 && slider===0。
//     mains が非空なら 0 <= preview,slider < mains.length
//   - applyVariationDispatch(dispatch, next): 正しい順で 3 回 dispatch する
//       1) preview を 0
//       2) slider を 0
//       3) base / mains を next で更新
//
// reduce（純粋関数）の意味:
//   - setPreview: state.preview を action.index に置き換える（他フィールドはそのまま）。
//   - setSlider: state.slider を action.index に置き換える（他フィールドはそのまま）。
//   - setImages: state.base / state.mains を action の値で置き換える（preview / slider はその dispatch では変更しない）。
//
// 行き詰まったら kata.solution.ts を参照。

export type State = {
  base: string;
  mains: string[];
  preview: number;
  slider: number;
};

export type Action =
  | { type: "setPreview"; index: number }
  | { type: "setSlider"; index: number }
  | { type: "setImages"; base: string; mains: string[] };

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _state - （記述）
 * @param _action - （記述）
 * @returns 次の状態
 */
export function reduce(_state: State, _action: Action): State {
  throw new Error("not implemented");
}

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _s - （記述）
 * @returns 状態が仕様どおりか
 */
export function isValidState(_s: State): boolean {
  throw new Error("not implemented");
}

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @param _dispatch - （記述）
 * @param _next - （記述）
 */
export function applyVariationDispatch(
  _dispatch: (a: Action) => void,
  _next: { base: string; mains: string[] },
): void {
  throw new Error("not implemented");
}
