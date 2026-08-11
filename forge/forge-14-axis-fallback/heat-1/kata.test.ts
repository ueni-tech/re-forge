import { describe, it, expect } from "vitest";
import { pickMinAxisValue } from "./kata";

describe("[heat-1] pickMinAxisValue", () => {
  it("数値として最小の値を返す", () => {
    expect(pickMinAxisValue(["1.0", "0.7", "0.5"])).toBe("0.5");
  });

  it("重複を除去する", () => {
    expect(pickMinAxisValue(["0.7", "0.7", "1.0"])).toBe("0.7");
  });

  it("空配列は undefined", () => {
    expect(pickMinAxisValue([])).toBeUndefined();
  });

  it("falsy 値は除外する", () => {
    expect(pickMinAxisValue(["", "0.7", ""])).toBe("0.7");
  });

  it("非数値は末尾扱いで数値が優先される", () => {
    expect(pickMinAxisValue(["abc", "0.7"])).toBe("0.7");
  });
});
