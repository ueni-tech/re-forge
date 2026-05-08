import { describe, it, expect } from "vitest";
import { applyListingCodeParam, buildGoodsImageVariationsMap } from "./kata";

const skus = [
  { code: "ST-TKV-A1", label: "白" },
  { code: "ST-TKV-A2", label: "黒" },
  { code: "ST-TKV-A3", label: "茶" },
];

describe("[heat-2] applyListingCodeParam", () => {
  it("requestedCode が variationSkus に含まれるとき requestedCode を返す", () => {
    expect(applyListingCodeParam(skus, "ST-TKV-A2", "ST-TKV-A3")).toBe(
      "ST-TKV-A3",
    );
  });

  it("requestedCode が variationSkus に含まれないとき defaultCode を返す", () => {
    expect(applyListingCodeParam(skus, "ST-TKV-A2", "INVALID-CODE")).toBe(
      "ST-TKV-A2",
    );
  });

  it("requestedCode が null / undefined / 空文字のとき defaultCode を返す", () => {
    expect(applyListingCodeParam(skus, "ST-TKV-A2", null)).toBe("ST-TKV-A2");
    expect(applyListingCodeParam(skus, "ST-TKV-A2", undefined)).toBe(
      "ST-TKV-A2",
    );
    expect(applyListingCodeParam(skus, "ST-TKV-A2", "")).toBe("ST-TKV-A2");
  });

  it("コードは完全一致で判定する（前後スペースは一致しない）", () => {
    expect(applyListingCodeParam(skus, "ST-TKV-A2", " ST-TKV-A1")).toBe(
      "ST-TKV-A2",
    );
  });
});

describe("[heat-2] buildGoodsImageVariationsMap", () => {
  it("各 code をキーに baseUrl + code + '.html' の path を持つマップを返す", () => {
    const map = buildGoodsImageVariationsMap(
      skus,
      "https://www.hankoya.com/shop/item/sample/",
    );
    expect(map["ST-TKV-A1"]).toEqual({
      path: "https://www.hankoya.com/shop/item/sample/ST-TKV-A1.html",
    });
    expect(map["ST-TKV-A3"]).toEqual({
      path: "https://www.hankoya.com/shop/item/sample/ST-TKV-A3.html",
    });
    expect(Object.keys(map)).toHaveLength(3);
  });

  it("variationSkus が空なら空オブジェクトを返す", () => {
    expect(buildGoodsImageVariationsMap([], "https://example.com/")).toEqual(
      {},
    );
  });

  it("code が空文字のエントリはスキップする", () => {
    const withEmpty = [{ code: "" }, { code: "ST-TKV-A1" }];
    const map = buildGoodsImageVariationsMap(
      withEmpty,
      "https://example.com/",
    );
    expect(Object.keys(map)).toEqual(["ST-TKV-A1"]);
  });
});
