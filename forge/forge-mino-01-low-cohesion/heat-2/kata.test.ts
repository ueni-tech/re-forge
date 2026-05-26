import { describe, it, expect } from "vitest";
import { Stock } from "./kata";

describe("[heat-2] Stock", () => {
  describe("生成", () => {
    it("quantity <= limit なら生成できる", () => {
      const s = new Stock(50, 100);
      expect(s.toQuantity()).toBe(50);
    });

    it("quantity === limit も許容", () => {
      const s = new Stock(100, 100);
      expect(s.toQuantity()).toBe(100);
    });

    it("quantity > limit は拒否", () => {
      expect(() => new Stock(100, 50)).toThrow();
    });

    it("負の quantity は拒否", () => {
      expect(() => new Stock(-1, 100)).toThrow();
    });

    it("負の limit は拒否", () => {
      expect(() => new Stock(0, -1)).toThrow();
    });
  });

  describe("add", () => {
    it("上限内なら追加できる", () => {
      const s = new Stock(50, 100).add(30);
      expect(s.toQuantity()).toBe(80);
    });

    it("元の Stock は変更されない", () => {
      const original = new Stock(50, 100);
      original.add(30);
      expect(original.toQuantity()).toBe(50);
    });

    it("上限超えは例外", () => {
      expect(() => new Stock(50, 100).add(60)).toThrow();
    });

    it("ちょうど上限まで追加可能", () => {
      const s = new Stock(50, 100).add(50);
      expect(s.toQuantity()).toBe(100);
    });

    it("負の量は拒否", () => {
      expect(() => new Stock(50, 100).add(-10)).toThrow();
    });
  });

  describe("reserve", () => {
    it("在庫があれば引き当てできる", () => {
      const s = new Stock(50, 100).reserve(20);
      expect(s.toQuantity()).toBe(30);
    });

    it("元の Stock は変更されない", () => {
      const original = new Stock(50, 100);
      original.reserve(20);
      expect(original.toQuantity()).toBe(50);
    });

    it("在庫不足は例外", () => {
      expect(() => new Stock(50, 100).reserve(60)).toThrow();
    });

    it("ちょうど在庫数まで引き当て可能", () => {
      const s = new Stock(50, 100).reserve(50);
      expect(s.toQuantity()).toBe(0);
    });
  });

  describe("canAdd / canReserve", () => {
    it("canAdd: 上限内なら true", () => {
      const s = new Stock(50, 100);
      expect(s.canAdd(50)).toBe(true);
      expect(s.canAdd(51)).toBe(false);
    });

    it("canReserve: 在庫範囲内なら true", () => {
      const s = new Stock(50, 100);
      expect(s.canReserve(50)).toBe(true);
      expect(s.canReserve(51)).toBe(false);
    });
  });

  describe("isEmpty", () => {
    it("quantity が 0 のとき true", () => {
      expect(new Stock(0, 100).isEmpty()).toBe(true);
      expect(new Stock(1, 100).isEmpty()).toBe(false);
    });
  });

  describe("メソッドチェーン", () => {
    it("追加→引当が自然に書ける", () => {
      const s = new Stock(50, 100).add(30).reserve(10);
      expect(s.toQuantity()).toBe(70);
    });
  });
});
