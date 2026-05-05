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
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - 現在のstate とaction を渡すとaction のtype に応じてstate の内容が変更された新しいstate が返る
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - action.typeがsetPreview: state.preview を action.index に置き換える（他フィールドはそのまま）。
 * - action.typeがsetSlider: state.slider を action.index に置き換える（他フィールドはそのまま）。
 * - action.typeがsetImages: state.base / state.mains を action の値で置き換える（preview / slider はその dispatch では変更しない）。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 可読性を優先するためswitch...case を採用
 * - 却下案: if...else では可読性が下がるため不採用。
 *
 * @param state - 画像ギャラリーの現在の状態のオブジェクト
 * @param action - 処理名と各変更情報を組み合わせたオブジェクト
 * @returns 次の状態
 */
export function reduce(state: State, action: Action): State {
  switch (action.type) {
    case "setPreview":
      return { ...state, preview: action.index };
    case "setSlider":
      return { ...state, slider: action.index };
    case "setImages":
      return { ...state, base: action.base, mains: action.mains };
    default:
      return state;
  }
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - 渡したstate が条件通りの形になっていればtrue, なっていなければfalse が返ってくる
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - mains が空なら preview===0 && slider===0
 *   mains が非空なら 0 <= preview,slider < mains.length
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 呼び出す側がstateの正しい条件を知らなくても結果を受け取れるようにするため
 *
 * @param s - バリデーションチェックしたい状態
 * @returns 状態が仕様どおりか
 */
export function isValidState(s: State): boolean {
  if (s.mains.length === 0) {
    return s.preview === 0 && s.slider === 0;
  }

  return (
    s.preview >= 0 &&
    s.preview < s.mains.length &&
    s.slider >= 0 &&
    s.slider < s.mains.length
  );
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - applyVariationDispatch を呼ぶと3つのaction を正しい順番でdispatch する。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - コールバック（dispatch） に以下のアクションを順番に渡して実行する
 *   1) preview を 0
 *   2) slider を 0
 *   3) base / mains を next で更新
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - applyVariationDispatch はdispatch の内容を知らなくてよい
 * - applyVariationDispatch はaction の形とdispatchを実行する順にだけ責任を負う
 * - そうすることで本番用の dispatch もテスト用の偽物も、呼び出す側が差し替えやすい。
 * - 却下案: この関数の中にストアまわりの処理まで詰め込むと、同じようなコードが別の場所にも増えて、
 *   あとから直すときに全部なおす羽目になりやすい。
 *
 * @param dispatch - action を受け取って実行する関数
 * @param next - 次の状態
 */
export function applyVariationDispatch(
  dispatch: (a: Action) => void,
  next: { base: string; mains: string[] },
): void {
  dispatch({ type: "setPreview", index: 0 });
  dispatch({ type: "setSlider", index: 0 });
  dispatch({ type: "setImages", base: next.base, mains: next.mains });
}
