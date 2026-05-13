// [heat-2] ラベル同期と遅延実行（scheduleSoon）
//
// 実務での使われ方:
//   バリエーション切り替えボタンをクリックすると listing-variation.js が
//   ボタンの disabled 状態を書き換える。その直後に同期しようとすると
//   DOM 変更がまだ終わっていない場合があるため、
//   `requestAnimationFrame`（または `setTimeout(..., 0)` フォールバック）で
//   1 フレーム遅らせてからラベルを更新する。
//   `options.raf` を DI として受け取ることで、テスト環境でも制御できる。
//
// syncLabels(state, targets) と scheduleSoon(fn, options?) を実装せよ。
//
// syncLabels は:
//   ① targets.color が存在すれば targets.color.textContent = state.color を実行する
//   ② targets.font / targets.layout も同様に代入する
//   ③ 対応する target が null または undefined のキーは何もしない
//
// scheduleSoon は:
//   ① options.raf が渡されていればそれを使う（DI: テスト用差し替え口）
//   ② なければ typeof requestAnimationFrame === 'function' のとき requestAnimationFrame(fn)
//   ③ どちらでもなければ setTimeout(fn, 0)

export type LabelState = {
  color: string;
  font: string;
  layout: string;
};

export type LabelLike = { textContent: string | null };

export type LabelTargets = {
  color?: LabelLike | null;
  font?: LabelLike | null;
  layout?: LabelLike | null;
};

export type ScheduleSoonOptions = {
  raf?: (fn: () => void) => void;
};

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param state - （記述）
 * @param targets - （記述）
 */
export function syncLabels(state: LabelState, targets: LabelTargets): void {
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
 * @param fn - （記述）
 * @param options - （記述）
 */
export function scheduleSoon(fn: () => void, options?: ScheduleSoonOptions): void {
  // ここに実装する
  throw new Error("not implemented");
}
