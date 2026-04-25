import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLatestFetcher } from "./kata";

describe("[heat-2] createLatestFetcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("最後のリクエスト結果だけ callback に渡す", () => {
    const fetcher = createLatestFetcher();
    const results: string[] = [];

    fetcher("red", 300, r => results.push(r));
    fetcher("blue", 100, r => results.push(r));

    vi.advanceTimersByTime(300);

    expect(results).toEqual(["response:blue"]);
    expect(results).not.toContain("response:red");
  });

  it("3連続呼び出しで最後だけ採用される", () => {
    const fetcher = createLatestFetcher();
    const results: string[] = [];

    fetcher("a", 200, r => results.push(r));
    fetcher("b", 50, r => results.push(r));
    fetcher("c", 150, r => results.push(r));

    vi.advanceTimersByTime(200);

    expect(results).toEqual(["response:c"]);
  });

  it("別インスタンスは独立している", () => {
    const f1 = createLatestFetcher();
    const f2 = createLatestFetcher();
    const r1: string[] = [];
    const r2: string[] = [];

    f1("x", 100, r => r1.push(r));
    f2("y", 100, r => r2.push(r));

    vi.advanceTimersByTime(100);

    expect(r1).toEqual(["response:x"]);
    expect(r2).toEqual(["response:y"]);
  });
});
