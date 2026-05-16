import { describe, it, expect, vi } from "vitest";
import { prepareVariation } from "./kata";

const rawData = [
  {
    sample: {
      defaultCode: "ST-TKV-A2",
      variationSkus: [
        { code: "ST-TKV-A1", label: "白" },
        { code: "ST-TKV-A2", label: "黒" },
        { code: "ST-TKV-A3", label: "茶" },
      ],
    },
  },
];

const BASE_URL = "https://www.hankoya.com/shop/item/sample/";

describe("[heat-3] prepareVariation", () => {
  it("正常系: variationSkus / defaultCode / variationsMap を返す", () => {
    const result = prepareVariation(
      rawData,
      "sample",
      () => null,
      () => BASE_URL,
    );
    expect(result).not.toBeNull();
    expect(result!.variationSkus).toHaveLength(3);
    expect(result!.defaultCode).toBe("ST-TKV-A2");
    expect(result!.variationsMap["ST-TKV-A1"]).toEqual({
      path: `${BASE_URL}ST-TKV-A1.html`,
    });
  });

  it("有効な listing-code クエリがあるとき defaultCode が上書きされる", () => {
    const result = prepareVariation(
      rawData,
      "sample",
      (name) => (name === "listing-code" ? "ST-TKV-A3" : null),
      () => BASE_URL,
    );
    expect(result!.defaultCode).toBe("ST-TKV-A3");
  });

  it("無効な listing-code クエリのとき defaultCode は変わらない", () => {
    const result = prepareVariation(
      rawData,
      "sample",
      () => "INVALID",
      () => BASE_URL,
    );
    expect(result!.defaultCode).toBe("ST-TKV-A2");
  });

  it("variationSkus が空(キー不一致)のとき null を返す", () => {
    const result = prepareVariation(
      rawData,
      "nonexistent",
      () => null,
      () => BASE_URL,
    );
    expect(result).toBeNull();
  });

  it("getParam と getBaseUrl はそれぞれ適切な引数で呼ばれる", () => {
    const getParam = vi.fn(() => null);
    const getBaseUrl = vi.fn(() => BASE_URL);
    prepareVariation(rawData, "sample", getParam, getBaseUrl);
    expect(getParam).toHaveBeenCalledWith("listing-code");
    expect(getBaseUrl).toHaveBeenCalledTimes(1);
  });
});
