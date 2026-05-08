import { describe, it, expect } from "vitest";
import { loadPageVariation } from "./kata";

const sampleData = [
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
  {
    nokey: {
      defaultCode: "",
      variationSkus: [
        { code: "PR-MUG-001", label: "S" },
        { code: "PR-MUG-002", label: "M" },
      ],
    },
  },
  {
    puge: {
      defaultCode: "AC-PEN-RD",
      variationSkus: [
        { code: "AC-PEN-RD", label: "赤" },
        { code: "AC-PEN-BK", label: "黒" },
      ],
    },
  },
];

describe("[heat-1] loadPageVariation", () => {
  it("ページキーが一致するエントリの variationSkus と defaultCode を返す", () => {
    const result = loadPageVariation(sampleData, "sample");
    expect(result.variationSkus).toEqual([
      { code: "ST-TKV-A1", label: "白" },
      { code: "ST-TKV-A2", label: "黒" },
      { code: "ST-TKV-A3", label: "茶" },
    ]);
    expect(result.defaultCode).toBe("ST-TKV-A2");
  });

  it("defaultCode が空文字のとき variationSkus 先頭の code を defaultCode に使う", () => {
    const result = loadPageVariation(sampleData, "nokey");
    expect(result.defaultCode).toBe("PR-MUG-001");
    expect(result.variationSkus).toHaveLength(2);
  });

  it("ページキーが存在しない場合、空の variationSkus と空文字の defaultCode を返す", () => {
    const result = loadPageVariation(sampleData, "nonexistent");
    expect(result.variationSkus).toEqual([]);
    expect(result.defaultCode).toBe("");
  });

  it("data が配列でない場合（null・オブジェクト）、空値を返す", () => {
    expect(loadPageVariation(null, "sample")).toEqual({
      variationSkus: [],
      defaultCode: "",
    });
    expect(loadPageVariation({ sample: {} }, "sample")).toEqual({
      variationSkus: [],
      defaultCode: "",
    });
  });
});
