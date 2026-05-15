import { describe, it, expect } from "vitest";
import { collectPayload, CollectableElement } from "./kata";

describe("[heat-1] collectPayload", () => {
  it("radio が unchecked の場合はエントリがスキップされる", () => {
    const elements: CollectableElement[] = [
      {
        type: "radio",
        checked: false,
        value: "楷書体",
        dataset: { basketParam: "sha_name_2font2", basketValue: "楷書体" },
      },
    ];
    expect(collectPayload(elements)).toEqual({});
  });

  it("data-basket-param が空の場合はスキップされる", () => {
    const elements: CollectableElement[] = [
      { type: "radio", checked: true, value: "楷書体", dataset: { basketParam: "" } },
      { type: "text", checked: false, value: "テスト", dataset: {} },
    ];
    expect(collectPayload(elements)).toEqual({});
  });

  it("data-basket-value が空文字の場合は el.value にフォールバックする", () => {
    const elements: CollectableElement[] = [
      {
        type: "radio",
        checked: true,
        value: "楷書体",
        dataset: { basketParam: "sha_name_2font2", basketValue: "" },
      },
    ];
    expect(collectPayload(elements)).toEqual({ sha_name_2font2: "楷書体" });
  });

  it("複数要素が混在するとき有効なエントリだけ payload に含まれる", () => {
    const elements: CollectableElement[] = [
      // unchecked → スキップ
      {
        type: "radio",
        checked: false,
        value: "楷書体",
        dataset: { basketParam: "sha_name_2font2", basketValue: "楷書体" },
      },
      // checked + basketValue あり → 採用
      {
        type: "radio",
        checked: true,
        value: "ダミー",
        dataset: { basketParam: "sha_name_2font2", basketValue: "明朝体" },
      },
      // text → checked 無関係で有効（value フォールバック）
      {
        type: "text",
        checked: false,
        value: "テスト株式会社",
        dataset: { basketParam: "sha_name_line1" },
      },
    ];
    expect(collectPayload(elements)).toEqual({
      sha_name_2font2: "明朝体",
      sha_name_line1: "テスト株式会社",
    });
  });
});
