// [heat-3] 複数ファクトリを合成するコーディネーター
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
export type SyncFn = (code: string) => void;
export type FactoryFn = () => SyncFn | null;

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した構造の意図(任意・自明なら省略)
 *  - なぜ createBlockSwitcher / createButtonSwitcher を引数で受ける（DI する）か
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param createBlock - ブロック切り替えファクトリ（デフォルト: createBlockSwitcher）
 * @param createButton - ボタン選択ファクトリ（デフォルト: createButtonSwitcher）
 */
export function initVariantPicker(
  createBlock: FactoryFn,
  createButton: FactoryFn,
): void {
  throw new Error("not implemented");
}
