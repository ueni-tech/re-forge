import { describe, it, expect } from "vitest";
import { getCheckedValue, getActiveLabel, type InputLike, type ButtonLike } from "./kata";

describe("[heat-1] getCheckedValue", () => {
  it("空配列のとき '' を返す", () => {
    expect(getCheckedValue([], "style")).toBe("");
  });

  it("name が一致し checked な要素の value を trim して返す", () => {
    const inputs: InputLike[] = [
      { name: "style", checked: false, value: "明朝体" },
      { name: "style", checked: true, value: "  ゴシック体  " },
    ];
    expect(getCheckedValue(inputs, "style")).toBe("ゴシック体");
  });

  it("checked な要素が unchecked のみのとき '' を返す", () => {
    const inputs: InputLike[] = [
      { name: "style", checked: false, value: "明朝体" },
    ];
    expect(getCheckedValue(inputs, "style")).toBe("");
  });

  it("name が一致しない要素しかないとき '' を返す", () => {
    const inputs: InputLike[] = [
      { name: "layout", checked: true, value: "横" },
    ];
    expect(getCheckedValue(inputs, "style")).toBe("");
  });
});

describe("[heat-1] getActiveLabel", () => {
  it("null / undefined のとき '' を返す", () => {
    expect(getActiveLabel(null)).toBe("");
    expect(getActiveLabel(undefined)).toBe("");
  });

  it("disabled な最初のボタンの textContent を trim して返す", () => {
    const buttons: ButtonLike[] = [
      { disabled: false, textContent: "黒" },
      { disabled: true, textContent: "  赤  " },
    ];
    expect(getActiveLabel(buttons)).toBe("赤");
  });

  it("disabled なボタンがなければ '' を返す", () => {
    const buttons: ButtonLike[] = [
      { disabled: false, textContent: "黒" },
      { disabled: false, textContent: "赤" },
    ];
    expect(getActiveLabel(buttons)).toBe("");
  });

  it("空配列のとき '' を返す", () => {
    expect(getActiveLabel([])).toBe("");
  });
});
