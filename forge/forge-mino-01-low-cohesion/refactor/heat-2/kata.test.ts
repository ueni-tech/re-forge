// [refactor/heat-2] テスト: 振る舞いを保証する
//
// このテストは before/ , kata/ , solution/ のいずれでも pass する必要がある。

import { describe, it, expect } from "vitest";
import {
  reserveOne,
  restock,
  describeStockStatus,
  remainingCapacity,
  type InventoryItem,
} from "./kata/inventory";

const sampleItem = (overrides: Partial<InventoryItem> = {}): InventoryItem => ({
  id: "i1",
  stock: 5,
  stockLimit: 10,
  ...overrides,
});

describe("[refactor/heat-2] reserveOne", () => {
  it("在庫があれば1つ引き当てて新しい InventoryItem を返す", () => {
    const item = sampleItem({ stock: 5 });
    const result = reserveOne(item);
    expect(result.stock).toBe(4);
    expect(result.id).toBe("i1");
  });

  it("元の item は変更しない", () => {
    const item = sampleItem({ stock: 5 });
    reserveOne(item);
    expect(item.stock).toBe(5);
  });

  it("在庫切れなら例外", () => {
    const item = sampleItem({ stock: 0 });
    expect(() => reserveOne(item)).toThrow();
  });
});

describe("[refactor/heat-2] restock", () => {
  it("上限内なら追加した新しい item を返す", () => {
    const item = sampleItem({ stock: 5, stockLimit: 10 });
    const result = restock(item, 3);
    expect(result.stock).toBe(8);
  });

  it("ちょうど上限まで追加可能", () => {
    const item = sampleItem({ stock: 5, stockLimit: 10 });
    const result = restock(item, 5);
    expect(result.stock).toBe(10);
  });

  it("上限超過は例外", () => {
    const item = sampleItem({ stock: 5, stockLimit: 10 });
    expect(() => restock(item, 6)).toThrow();
  });

  it("元の item は変更しない", () => {
    const item = sampleItem({ stock: 5 });
    restock(item, 3);
    expect(item.stock).toBe(5);
  });
});

describe("[refactor/heat-2] describeStockStatus", () => {
  it("在庫0なら '在庫切れ'", () => {
    expect(describeStockStatus(sampleItem({ stock: 0 }))).toBe("在庫切れ");
  });

  it("在庫が上限に達したら '在庫満杯'", () => {
    expect(
      describeStockStatus(sampleItem({ stock: 10, stockLimit: 10 })),
    ).toBe("在庫満杯");
  });

  it("中間状態は '在庫: N/M' 形式", () => {
    expect(
      describeStockStatus(sampleItem({ stock: 3, stockLimit: 10 })),
    ).toBe("在庫: 3/10");
  });
});

describe("[refactor/heat-2] remainingCapacity", () => {
  it("上限と在庫の差を返す", () => {
    expect(remainingCapacity(sampleItem({ stock: 3, stockLimit: 10 }))).toBe(7);
  });

  it("満杯なら 0", () => {
    expect(remainingCapacity(sampleItem({ stock: 10, stockLimit: 10 }))).toBe(
      0,
    );
  });
});
