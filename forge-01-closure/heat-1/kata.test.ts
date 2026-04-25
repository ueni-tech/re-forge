import { describe, it, expect } from "vitest";
import { createLogger } from "./kata";

describe("[heat-1] createLogger", () => {
  it("呼び出し回数をカウントしてフォーマット済み文字列を返す", () => {
    const log = createLogger("API");
    expect(log("start")).toBe("[API #1] start");
    expect(log("retry")).toBe("[API #2] retry");
    expect(log("done")).toBe("[API #3] done");
  });

  it("別インスタンスのカウンターは独立している", () => {
    const log = createLogger("API");
    const log2 = createLogger("DB");
    log("a");
    log("b");
    expect(log2("query")).toBe("[DB #1] query");
    expect(log("check")).toBe("[API #3] check");
  });
});
