// [heat-3] バリエーション切替時の dispatch 順（applyImageStateAndResetIndex の核）
//
// 商品画像スライダーでは、一覧を差し替える前に preview / slider の index を 0 に戻さないと、
// 短い一覧に対して古い index が残り、一瞬でも不正な中間状態になる。
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

export function reduce(_state: State, _action: Action): State {
  throw new Error("not implemented");
}

export function isValidState(_s: State): boolean {
  throw new Error("not implemented");
}

export function applyVariationDispatch(
  _dispatch: (a: Action) => void,
  _next: { base: string; mains: string[] },
): void {
  throw new Error("not implemented");
}
