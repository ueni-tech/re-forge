// [refactor/heat-3] テスト: 振る舞いを保証する

import { describe, it, expect } from "vitest";
import {
  addItemToOrder,
  getOrderTotal,
  describeOrder,
  shouldAwardHighPricePoints,
  listHighPriceItemNames,
  remainingItemSlots,
  type Order,
  type OrderItem,
} from "./kata/order-service";

const sampleItem = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  name: "apple",
  price: 100,
  quantity: 1,
  ...overrides,
});

const orderWith = (items: OrderItem[]): Order => ({ id: "o1", items });

describe("[refactor/heat-3] addItemToOrder", () => {
  it("明細を追加した新しい order を返す", () => {
    const order = orderWith([sampleItem({ name: "a" })]);
    const result = addItemToOrder(order, sampleItem({ name: "b" }));
    expect(result.items).toHaveLength(2);
    expect(result.items[1]?.name).toBe("b");
  });

  it("元の order は変更しない", () => {
    const order = orderWith([sampleItem()]);
    addItemToOrder(order, sampleItem());
    expect(order.items).toHaveLength(1);
  });

  it("上限到達後の追加は例外", () => {
    const items = Array.from({ length: 10 }, () => sampleItem());
    const order = orderWith(items);
    expect(() => addItemToOrder(order, sampleItem())).toThrow();
  });
});

describe("[refactor/heat-3] getOrderTotal", () => {
  it("price * quantity の合計", () => {
    const order = orderWith([
      sampleItem({ price: 100, quantity: 2 }),
      sampleItem({ price: 200, quantity: 3 }),
    ]);
    expect(getOrderTotal(order)).toBe(800);
  });

  it("空のときは 0", () => {
    expect(getOrderTotal(orderWith([]))).toBe(0);
  });
});

describe("[refactor/heat-3] describeOrder", () => {
  it("件数と合計を含む文字列", () => {
    const order = orderWith([
      sampleItem({ price: 100, quantity: 2 }),
      sampleItem({ price: 200, quantity: 1 }),
    ]);
    expect(describeOrder(order)).toBe("2件 ¥400");
  });

  it("高額商品があれば ★ が前につく", () => {
    const order = orderWith([
      sampleItem({ price: 100, quantity: 1 }),
      sampleItem({ price: 5000, quantity: 1 }),
    ]);
    expect(describeOrder(order)).toBe("★2件 ¥5,100");
  });
});

describe("[refactor/heat-3] shouldAwardHighPricePoints", () => {
  it("5000円以上の単価があれば true", () => {
    const order = orderWith([sampleItem({ price: 5000 })]);
    expect(shouldAwardHighPricePoints(order)).toBe(true);
  });

  it("4999 以下なら false", () => {
    const order = orderWith([sampleItem({ price: 4999 })]);
    expect(shouldAwardHighPricePoints(order)).toBe(false);
  });

  it("空なら false", () => {
    expect(shouldAwardHighPricePoints(orderWith([]))).toBe(false);
  });
});

describe("[refactor/heat-3] listHighPriceItemNames", () => {
  it("5000円以上の商品名のみを返す", () => {
    const order = orderWith([
      sampleItem({ name: "a", price: 1000 }),
      sampleItem({ name: "b", price: 5000 }),
      sampleItem({ name: "c", price: 10000 }),
    ]);
    expect(listHighPriceItemNames(order)).toEqual(["b", "c"]);
  });

  it("該当なしなら空配列", () => {
    const order = orderWith([sampleItem({ price: 100 })]);
    expect(listHighPriceItemNames(order)).toEqual([]);
  });
});

describe("[refactor/heat-3] remainingItemSlots", () => {
  it("MAX (10) - 現在数を返す", () => {
    const order = orderWith([sampleItem(), sampleItem(), sampleItem()]);
    expect(remainingItemSlots(order)).toBe(7);
  });

  it("空なら 10", () => {
    expect(remainingItemSlots(orderWith([]))).toBe(10);
  });
});
