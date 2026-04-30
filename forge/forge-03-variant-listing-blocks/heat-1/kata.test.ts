import { describe, it, expect } from "vitest";
import { hiddenFlagsForSelection } from "./kata";

describe("[heat-1] hiddenFlagsForSelection", () => {
  it("選択と一致する行だけ hidden=false（表示）", () => {
    const rows = ["A", "B", "C"];
    expect(hiddenFlagsForSelection(rows, "B")).toEqual([true, false, true]);
  });

  it("選択が一覧に無いときはすべて hidden=true", () => {
    const rows = ["A", "B"];
    expect(hiddenFlagsForSelection(rows, "Z")).toEqual([true, true]);
  });

  it("空配列なら空配列を返す", () => {
    expect(hiddenFlagsForSelection([], "A")).toEqual([]);
  });

  it("同一出品コードが複数行あるときはすべて表示扱いにする", () => {
    const rows = ["X", "X", "Y"];
    expect(hiddenFlagsForSelection(rows, "X")).toEqual([false, false, true]);
  });
});
