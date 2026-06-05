// [heat-1] DOM をキャプチャしてハンドラを生成する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した構造の意図(任意・自明なら省略)
 *  - なぜ querySelector をファクトリ内でやり、showBlock の中では呼ばないか
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 */
export function createBlockSwitcher(): ((code: string) => void) | null {
  throw new Error("not implemented");
}
