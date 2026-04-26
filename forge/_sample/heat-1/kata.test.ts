import { describe, it, expect, vi } from "vitest";
import { createCache } from "./kata";

describe("[heat-1] createCache", () => {
  it("同じキーは factory を1度しか呼ばない", () => {
    const cache = createCache<string>();
    const factory = vi.fn(() => "value");
    cache.get("k", factory);
    cache.get("k", factory);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(cache.get("k", factory)).toBe("value");
  });

  it("delete 後は factory が再実行される", () => {
    const cache = createCache<number>();
    let n = 0;
    cache.get("k", () => ++n);
    cache.delete("k");
    const result = cache.get("k", () => ++n);
    expect(result).toBe(2);
  });

  it("別キーはそれぞれ独立して計算される", () => {
    const cache = createCache<number>();
    let n = 0;
    const a = cache.get("a", () => ++n);
    const b = cache.get("b", () => ++n);
    expect(a).toBe(1);
    expect(b).toBe(2);
  });

  it("別インスタンスのキャッシュは独立している", () => {
    const c1 = createCache<string>();
    const c2 = createCache<string>();
    c1.get("k", () => "from-c1");
    expect(c2.get("k", () => "from-c2")).toBe("from-c2");
  });
});
