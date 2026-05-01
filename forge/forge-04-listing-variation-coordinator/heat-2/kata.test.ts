import { describe, it, expect } from "vitest";
import { resolveInitialListingCode, variationMapHasCode } from "./kata";

describe("[heat-2] variationMapHasCode", () => {
  it("空の code は false", () => {
    expect(variationMapHasCode({ a: 1 }, "")).toBe(false);
  });

  it("map が null は false", () => {
    expect(variationMapHasCode(null, "a")).toBe(false);
  });

  it("自身のプロパティのみ true（プロトタイプ連鎖上のキーは false）", () => {
    const proto = { inherited: true };
    const map = Object.create(proto) as Record<string, unknown>;
    map.own = 1;
    expect(variationMapHasCode(map, "own")).toBe(true);
    expect(variationMapHasCode(map, "inherited")).toBe(false);
  });
});

describe("[heat-2] resolveInitialListingCode", () => {
  it("attr が優先される", () => {
    expect(resolveInitialListingCode("  SKU-2  ", ["SKU-1", "SKU-2"])).toBe("SKU-2");
  });

  it("attr が空なら orderedKeys の先頭", () => {
    expect(resolveInitialListingCode(null, ["first", "second"])).toBe("first");
    expect(resolveInitialListingCode("   ", ["only"])).toBe("only");
  });

  it("attr も keys も無ければ null", () => {
    expect(resolveInitialListingCode(null, [])).toBeNull();
    expect(resolveInitialListingCode("", [])).toBeNull();
  });
});
