import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createAsyncCacheLoader, fakeFetch, type Storage } from "./kata";

function makeStorage(): Storage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    get(key) { return data.get(key); },
    set(key, value) { data.set(key, value); },
  };
}

describe("[heat-3] createAsyncCacheLoader", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("validKeys に含まれないキーは何もしない", () => {
    const storage = makeStorage();
    const load = createAsyncCacheLoader(storage, ["user"]);
    const cb = vi.fn();
    load("unknown", 100, cb);
    vi.advanceTimersByTime(200);
    expect(cb).not.toHaveBeenCalled();
  });

  it("キャッシュ済みなら即座に callback が呼ばれる", () => {
    const storage = makeStorage();
    storage.set("user", "cached-value");
    const load = createAsyncCacheLoader(storage, ["user"]);
    const results: string[] = [];
    load("user", 100, (r) => results.push(r));
    expect(results).toEqual(["cached-value"]);
  });

  it("未キャッシュなら fetcher が呼ばれ storage に保存される", () => {
    const storage = makeStorage();
    const mockFetcher = vi.fn((_key: string, delay: number, cb: (r: string) => void) => {
      setTimeout(() => cb("fetched:user"), delay);
    });
    const load = createAsyncCacheLoader(storage, ["user"], mockFetcher as typeof fakeFetch);
    const results: string[] = [];
    load("user", 100, (r) => results.push(r));
    vi.advanceTimersByTime(100);
    expect(results).toEqual(["fetched:user"]);
    expect(storage.data.get("user")).toBe("fetched:user");
  });

  it("2回目以降はキャッシュから返し fetcher を呼ばない", () => {
    const storage = makeStorage();
    const mockFetcher = vi.fn((_key: string, delay: number, cb: (r: string) => void) => {
      setTimeout(() => cb("fetched:product"), delay);
    });
    const load = createAsyncCacheLoader(storage, ["product"], mockFetcher as typeof fakeFetch);
    const results: string[] = [];
    load("product", 50, (r) => results.push(r));
    vi.advanceTimersByTime(50);
    load("product", 50, (r) => results.push(r));
    expect(mockFetcher).toHaveBeenCalledTimes(1);
    expect(results).toEqual(["fetched:product", "fetched:product"]);
  });
});
