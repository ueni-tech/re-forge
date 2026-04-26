import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTTLCache } from "./kata";

describe("[heat-2] createTTLCache", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("TTL 内は factory を再実行しない", () => {
    const cache = createTTLCache<string>(1000);
    const factory = vi.fn(() => "v");
    cache.get("k", factory);
    vi.advanceTimersByTime(999);
    cache.get("k", factory);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("TTL 経過後は factory を再実行する", () => {
    const cache = createTTLCache<string>(1000);
    const factory = vi.fn(() => "v");
    cache.get("k", factory);
    vi.advanceTimersByTime(1000);
    cache.get("k", factory);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("別キーのTTLは独立している", () => {
    const cache = createTTLCache<string>(500);
    const f1 = vi.fn(() => "a");
    const f2 = vi.fn(() => "b");
    cache.get("k1", f1);
    vi.advanceTimersByTime(300);
    cache.get("k2", f2);
    vi.advanceTimersByTime(300); // k1: 計600ms（期限切れ）、k2: 計300ms（有効）
    cache.get("k1", f1);
    cache.get("k2", f2);
    expect(f1).toHaveBeenCalledTimes(2);
    expect(f2).toHaveBeenCalledTimes(1);
  });
});
