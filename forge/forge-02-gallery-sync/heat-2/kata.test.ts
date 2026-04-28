import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLatestByGeneration } from "./kata";

describe("[heat-2] createLatestByGeneration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("後から開始したリクエストだけが非 null で解決する", async () => {
    const load = vi.fn(
      (key: string) =>
        new Promise<string>((resolve) => {
          const delay = key === "slow" ? 100 : 20;
          setTimeout(() => resolve(`result:${key}`), delay);
        }),
    );

    const request = createLatestByGeneration(load);
    const pSlow = request("slow");
    const pFast = request("fast");

    await vi.advanceTimersByTimeAsync(100);

    expect(await pSlow).toBeNull();
    expect(await pFast).toBe("result:fast");
  });

  it("単発呼び出しは null にならない", async () => {
    const load = vi.fn(
      (key: string) =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve(`ok:${key}`), 10);
        }),
    );
    const request = createLatestByGeneration(load);
    const p = request("only");
    await vi.advanceTimersByTimeAsync(10);
    expect(await p).toBe("ok:only");
  });

  it("インスタンスごとに世代が独立している", async () => {
    const load = (key: string) =>
      new Promise<string>((resolve) => {
        setTimeout(() => resolve(key), 5);
      });
    const r1 = createLatestByGeneration(load);
    const r2 = createLatestByGeneration(load);
    const a = r1("a");
    const b = r2("b");
    await vi.advanceTimersByTimeAsync(5);
    expect(await a).toBe("a");
    expect(await b).toBe("b");
  });
});
