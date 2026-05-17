import { describe, it, expect } from "vitest";
import { loadPageVariation } from "./kata";

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
  {
    another: {
      defaultCode: "AN-001",
      variationSkus: [{ code: "AN-001", label: "赤" }],
    },
  },
];

describe("[heat-1] loadPageVariation", () => {
  describe("正常系", () => {
    it("pageKey に対応するエントリの variationSkus と defaultCode を返す", () => {
      expect(loadPageVariation(rawData, "sample")).toEqual({
        variationSkus: [
          { code: "ST-TKV-A1", label: "白" },
          { code: "ST-TKV-A2", label: "黒" },
          { code: "ST-TKV-A3", label: "茶" },
        ],
        defaultCode: "ST-TKV-A2",
      });
    });

    it("配列の2番目以降の要素もページキー検索の対象になる", () => {
      expect(loadPageVariation(rawData, "another")).toEqual({
        variationSkus: [{ code: "AN-001", label: "赤" }],
        defaultCode: "AN-001",
      });
    });
  });

  describe("① data が配列でないとき { variationSkus: [], defaultCode: '' } を返す", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["プレーンオブジェクト", { sample: { defaultCode: "X", variationSkus: [] } }],
      ["文字列", "sample"],
      ["数値", 123],
      ["真偽値", true],
    ])("%s の場合", (_label, input) => {
      expect(loadPageVariation(input, "sample")).toEqual({
        variationSkus: [],
        defaultCode: "",
      });
    });
  });

  describe("② pageKey の検索", () => {
    it("配列の中に pageKey をプロパティに持つ要素が無いとき空の PageVariation を返す", () => {
      expect(loadPageVariation(rawData, "missing")).toEqual({
        variationSkus: [],
        defaultCode: "",
      });
    });

    it("配列にオブジェクトでない要素が混ざっていても無視して検索する", () => {
      const data = [
        null,
        "broken",
        42,
        {
          sample: {
            defaultCode: "ST-TKV-A2",
            variationSkus: [{ code: "ST-TKV-A2", label: "黒" }],
          },
        },
      ];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [{ code: "ST-TKV-A2", label: "黒" }],
        defaultCode: "ST-TKV-A2",
      });
    });
  });

  describe("③ variationSkus が配列でないときは [] にフォールバックする", () => {
    it("variationSkus が文字列でも例外を投げず [] を返す", () => {
      const data = [
        {
          sample: { defaultCode: "ST-TKV-A1", variationSkus: "broken" },
        },
      ];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [],
        defaultCode: "ST-TKV-A1",
      });
    });

    it("variationSkus が未定義でも [] を返す", () => {
      const data = [{ sample: { defaultCode: "ST-TKV-A1" } }];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [],
        defaultCode: "ST-TKV-A1",
      });
    });
  });

  describe("④ defaultCode のフォールバック", () => {
    it("defaultCode が空文字のとき variationSkus[0].code で補完する", () => {
      const data = [
        {
          sample: {
            defaultCode: "",
            variationSkus: [
              { code: "ST-TKV-A1", label: "白" },
              { code: "ST-TKV-A2", label: "黒" },
            ],
          },
        },
      ];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [
          { code: "ST-TKV-A1", label: "白" },
          { code: "ST-TKV-A2", label: "黒" },
        ],
        defaultCode: "ST-TKV-A1",
      });
    });

    it("defaultCode が未定義のとき variationSkus[0].code で補完する", () => {
      const data = [
        {
          sample: {
            variationSkus: [{ code: "ST-TKV-A1", label: "白" }],
          },
        },
      ];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [{ code: "ST-TKV-A1", label: "白" }],
        defaultCode: "ST-TKV-A1",
      });
    });

    it("defaultCode が文字列でない値のとき variationSkus[0].code で補完する", () => {
      const data = [
        {
          sample: {
            defaultCode: 123,
            variationSkus: [{ code: "ST-TKV-A1" }],
          },
        },
      ];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [{ code: "ST-TKV-A1" }],
        defaultCode: "ST-TKV-A1",
      });
    });

    it("defaultCode も variationSkus も無いとき defaultCode は '' を返す", () => {
      const data = [{ sample: { variationSkus: [] } }];
      expect(loadPageVariation(data, "sample")).toEqual({
        variationSkus: [],
        defaultCode: "",
      });
    });
  });

  describe("⑤ 例外を投げない契約", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["壊れたオブジェクト", { sample: null }],
      ["数値配列", [1, 2, 3]],
    ])("%s が渡されても例外を投げない", (_label, input) => {
      expect(() => loadPageVariation(input, "sample")).not.toThrow();
    });
  });
});
