// [heat-3] 模範解答 — 閲覧用。練習では kata.ts を編集すること。
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

export function applyVariationDispatch(
  dispatch: (a: Action) => void,
  next: { base: string; mains: string[] },
): void {
  dispatch({ type: "setPreview", index: 0 });
  dispatch({ type: "setSlider", index: 0 });
  dispatch({ type: "setImages", base: next.base, mains: next.mains });
}
