import { describe, it, expect } from "vitest";
import { Price } from "./kata";

describe("[heat-1] Price", () => {
  describe("生成", () => {
    it("正の金額で生成できる", () => {
      const p = new Price(1000);
      expect(p.toNumber()).toBe(1000);
    });

    it("0 円も許容する", () => {
      const p = new Price(0);
      expect(p.toNumber()).toBe(0);
    });

    it("負の金額は拒否する", () => {
      expect(() => new Price(-100)).toThrow();
    });
  });

  describe("withTax", () => {
    it("税率 10% を適用すると 1000 → 1100 になる", () => {
      const p = new Price(1000).withTax(0.1);
      expect(p.toNumber()).toBe(1100);
    });

    it("元の Price は変更されない (不変性)", () => {
      const original = new Price(1000);
      original.withTax(0.1);
      expect(original.toNumber()).toBe(1000);
    });

    it("負の税率は拒否する", () => {
      expect(() => new Price(1000).withTax(-0.1)).toThrow();
    });
  });

  describe("discount", () => {
    it("20% 割引で 1000 → 800 になる", () => {
      const p = new Price(1000).discount(0.2);
      expect(p.toNumber()).toBe(800);
    });

    it("元の Price は変更されない", () => {
      const original = new Price(1000);
      original.discount(0.2);
      expect(original.toNumber()).toBe(1000);
    });

    it("割引率は [0, 1] の範囲", () => {
      expect(() => new Price(1000).discount(-0.1)).toThrow();
      expect(() => new Price(1000).discount(1.5)).toThrow();
    });
  });

  describe("toDisplay", () => {
    it("3桁区切りの円表記を返す", () => {
      expect(new Price(1200).toDisplay()).toBe("¥1,200");
      expect(new Price(1000000).toDisplay()).toBe("¥1,000,000");
    });
  });

  describe("メソッドチェーン", () => {
    it("税込→割引の順で適用できる", () => {
      const p = new Price(1000).withTax(0.1).discount(0.2);
      // 1000 → 1100 (税込) → 880 (20%引)
      expect(p.toNumber()).toBe(880);
    });
  });
});
