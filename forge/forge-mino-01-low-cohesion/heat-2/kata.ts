// [heat-2] 在庫クラス
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
 *  - なぜ Stock が limit を持つのか
 *  - canAdd と add の責務の分け方
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 */
export class Stock {
  constructor(quantity: number, limit: number) {
    throw new Error("not implemented");
  }

  add(amount: number): Stock {
    throw new Error("not implemented");
  }

  reserve(amount: number): Stock {
    throw new Error("not implemented");
  }

  canAdd(amount: number): boolean {
    throw new Error("not implemented");
  }

  canReserve(amount: number): boolean {
    throw new Error("not implemented");
  }

  isEmpty(): boolean {
    throw new Error("not implemented");
  }

  toQuantity(): number {
    throw new Error("not implemented");
  }
}
