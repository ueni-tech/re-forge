import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCategoryLoader, fakeLoad, type Store } from "./kata";

function makeStore(): Store & { itemsCalls: string[][], emptyCalls: number } {
  const store = {
    itemsCalls: [] as string[][],
    emptyCalls: 0,
    setItems(items: string[]) { this.itemsCalls.push(items); },
    setEmpty() { this.emptyCalls++; },
  };
  return store;
}

describe("[heat-3] createCategoryLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("存在しないカテゴリは何もしない", () => {
    const store = makeStore();
    const load = createCategoryLoader(store, { shoes: "/api/shoes" });
    load("hats");
    vi.advanceTimersByTime(500);
    expect(store.itemsCalls).toHaveLength(0);
    expect(store.emptyCalls).toBe(0);
  });

  it("最新リクエストのみ store.setItems に反映される", () => {
    const store = makeStore();
    const endpoints = { shoes: "/api/shoes", bags: "/api/bags" };

    const mockLoader = vi.fn((url, delay, _items, cb) => {
      const items = url.includes("shoes") ? ["nike"] : ["gucci"];
      setTimeout(() => cb(items), delay);
    });

    const load = createCategoryLoader(store, endpoints, mockLoader as typeof fakeLoad);
    load("shoes"); // delay 200
    load("bags");  // delay 50（最新）

    vi.advanceTimersByTime(200);

    expect(store.itemsCalls).toHaveLength(1);
    expect(store.itemsCalls[0]).toEqual(["gucci"]);
  });

  it("取得結果が空なら setEmpty が呼ばれる", () => {
    const store = makeStore();
    const endpoints = { empty: "/api/empty" };

    const mockLoader = vi.fn((_url, delay, _items, cb) => {
      setTimeout(() => cb([]), delay);
    });

    const load = createCategoryLoader(store, endpoints, mockLoader as typeof fakeLoad);
    load("empty");

    vi.advanceTimersByTime(100);

    expect(store.itemsCalls).toHaveLength(0);
    expect(store.emptyCalls).toBe(1);
  });
});
