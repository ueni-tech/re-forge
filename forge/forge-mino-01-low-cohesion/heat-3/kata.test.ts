import { describe, it, expect } from "vitest";
import { OrderItems, type OrderItem } from "./kata";

const sampleItem = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  name: "apple",
  price: 100,
  quantity: 1,
  ...overrides,
});

describe("[heat-3] OrderItems", () => {
  describe("生成", () => {
    it("引数なしで空のコレクションを作れる", () => {
      const o = new OrderItems();
      expect(o.count()).toBe(0);
    });

    it("初期配列で作れる", () => {
      const o = new OrderItems([sampleItem(), sampleItem()]);
      expect(o.count()).toBe(2);
    });

    it("MAX_ITEMS を超える初期配列は例外", () => {
      const items = Array.from({ length: 11 }, () => sampleItem());
      expect(() => new OrderItems(items)).toThrow();
    });

    it("元の配列を後から変更しても内部は影響を受けない", () => {
      const items = [sampleItem({ name: "a" })];
      const o = new OrderItems(items);
      items.push(sampleItem({ name: "b" }));
      expect(o.count()).toBe(1);
    });
  });

  describe("add", () => {
    it("明細を追加した新しい OrderItems を返す", () => {
      const o = new OrderItems().add(sampleItem());
      expect(o.count()).toBe(1);
    });

    it("元のインスタンスは変更されない", () => {
      const original = new OrderItems();
      original.add(sampleItem());
      expect(original.count()).toBe(0);
    });

    it("MAX_ITEMS に達したら例外", () => {
      const items = Array.from({ length: 10 }, () => sampleItem());
      const o = new OrderItems(items);
      expect(() => o.add(sampleItem())).toThrow();
    });
  });

  describe("totalAmount", () => {
    it("空のときは 0", () => {
      expect(new OrderItems().totalAmount()).toBe(0);
    });

    it("price * quantity の合計を返す", () => {
      const o = new OrderItems([
        sampleItem({ price: 100, quantity: 2 }),
        sampleItem({ price: 200, quantity: 3 }),
      ]);
      expect(o.totalAmount()).toBe(800); // 200 + 600
    });
  });

  describe("hasHighPriceItem", () => {
    it("5000円以上が含まれていれば true", () => {
      const o = new OrderItems([
        sampleItem({ price: 1000 }),
        sampleItem({ price: 5000 }),
      ]);
      expect(o.hasHighPriceItem()).toBe(true);
    });

    it("含まれていなければ false", () => {
      const o = new OrderItems([
        sampleItem({ price: 100 }),
        sampleItem({ price: 4999 }),
      ]);
      expect(o.hasHighPriceItem()).toBe(false);
    });

    it("空のときは false", () => {
      expect(new OrderItems().hasHighPriceItem()).toBe(false);
    });
  });

  describe("toSnapshot", () => {
    it("内部のコピーを返す", () => {
      const o = new OrderItems([sampleItem({ name: "a" })]);
      const snapshot = o.toSnapshot();
      expect(snapshot).toHaveLength(1);
      expect(snapshot[0]?.name).toBe("a");
    });

    it("readonly 型で返すので型レベルでの変更を防げる(コンパイル時の保証)", () => {
      const o = new OrderItems([sampleItem()]);
      const snapshot = o.toSnapshot();
      // @ts-expect-error - readonly な配列に push はできない
      snapshot.push(sampleItem());
    });
  });
});
