// [heat-1] 価格クラス
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
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ withTax / discount は Price を返すのか
 *  - なぜ amount を public にせず toNumber() を経由させるのか
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 */
export class Price {
  constructor(amount: number) {
    throw new Error("not implemented");
  }

  withTax(rate: number): Price {
    throw new Error("not implemented");
  }

  discount(rate: number): Price {
    throw new Error("not implemented");
  }

  toDisplay(): string {
    throw new Error("not implemented");
  }

  toNumber(): number {
    throw new Error("not implemented");
  }
}
