import { describe, it, expect } from "vitest";
import { parseGoodsImageVariationsJson } from "./kata";

describe("[heat-1] parseGoodsImageVariationsJson", () => {
  it("null / undefined / 空文字は null", () => {
    expect(parseGoodsImageVariationsJson(null)).toBeNull();
    expect(parseGoodsImageVariationsJson(undefined)).toBeNull();
    expect(parseGoodsImageVariationsJson("")).toBeNull();
  });

  it("不正な JSON は null", () => {
    expect(parseGoodsImageVariationsJson("{")).toBeNull();
  });

  it("配列やプリミティブは null", () => {
    expect(parseGoodsImageVariationsJson("[]")).toBeNull();
    expect(parseGoodsImageVariationsJson('"x"')).toBeNull();
    expect(parseGoodsImageVariationsJson("42")).toBeNull();
  });

  it("オブジェクトは Record として返す", () => {
    const map = parseGoodsImageVariationsJson('{"a":1,"b":{"x":true}}');
    expect(map).toEqual({ a: 1, b: { x: true } });
  });
});
