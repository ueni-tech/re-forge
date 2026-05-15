import { describe, it, expect } from "vitest";
import { parsePrefillData, getPrefillValue, PrefillData } from "./kata";

describe("[heat-2] parsePrefillData", () => {
  it("null / undefined / 空文字 の場合 undefined を返す", () => {
    expect(parsePrefillData(null)).toBeUndefined();
    expect(parsePrefillData(undefined)).toBeUndefined();
    expect(parsePrefillData("")).toBeUndefined();
  });

  it("不正な JSON 文字列の場合 undefined を返す（例外は外に出さない）", () => {
    expect(parsePrefillData("not json")).toBeUndefined();
    expect(parsePrefillData('{"key": "value"')).toBeUndefined();
  });

  it("有効な JSON 文字列の場合パース済みオブジェクトを返す", () => {
    const input = JSON.stringify({ "ST-TKV-A2": { sha_name_2font2: "楷書体" } });
    expect(parsePrefillData(input)).toEqual({
      "ST-TKV-A2": { sha_name_2font2: "楷書体" },
    });
  });
});

describe("[heat-2] getPrefillValue", () => {
  const prefillData: PrefillData = { "ST-TKV-A2": { sha_name_2font2: "楷書体" } };

  it("el が null の場合 undefined を返す", () => {
    expect(getPrefillValue(null, prefillData)).toBeUndefined();
  });

  it("el.name が正規表現パターンにマッチしない場合 undefined を返す", () => {
    expect(getPrefillValue({ name: "param[a][b][c]" }, prefillData)).toBeUndefined();
  });

  it("prefillData に listingCode が存在しない場合 undefined を返す", () => {
    expect(
      getPrefillValue({ name: "param[OTHER][b][c][sha_name_2font2]" }, prefillData),
    ).toBeUndefined();
  });

  it("name と prefillData が一致する場合 prefill 値を返す", () => {
    expect(
      getPrefillValue({ name: "param[ST-TKV-A2][dummy][1][sha_name_2font2]" }, prefillData),
    ).toBe("楷書体");
  });
});
