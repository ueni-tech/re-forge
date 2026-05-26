// [heat-3] 注文明細コレクション
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ items を private にし、toSnapshot 経由で出すのか
 *  - なぜ MAX_ITEMS を static にしているのか
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 */
export class OrderItems {
  static readonly MAX_ITEMS = 10;

  constructor(items?: OrderItem[]) {
    throw new Error("not implemented");
  }

  add(item: OrderItem): OrderItems {
    throw new Error("not implemented");
  }

  totalAmount(): number {
    throw new Error("not implemented");
  }

  count(): number {
    throw new Error("not implemented");
  }

  hasHighPriceItem(): boolean {
    throw new Error("not implemented");
  }

  toSnapshot(): readonly OrderItem[] {
    throw new Error("not implemented");
  }
}
