import { describe, it, expect } from "vitest";
import { isEmpty, hasLeadingOrTrailingSpace, hasConsecutiveSpaces, isOverMaxLength } from "./kata";

describe("[heat-1] isEmpty", () => {
  it("空文字なら true", () => {
    expect(isEmpty("")).toBe(true);
  });
  it("文字があれば false", () => {
    expect(isEmpty("foo")).toBe(false);
    expect(isEmpty(" ")).toBe(false);
  });
});

describe("[heat-1] hasLeadingOrTrailingSpace", () => {
  it("先頭スペース（半角・全角）で true", () => {
    expect(hasLeadingOrTrailingSpace(" foo")).toBe(true);
    expect(hasLeadingOrTrailingSpace("　foo")).toBe(true);
  });
  it("末尾スペース（半角・全角）で true", () => {
    expect(hasLeadingOrTrailingSpace("foo ")).toBe(true);
    expect(hasLeadingOrTrailingSpace("foo　")).toBe(true);
  });
  it("文中の単一スペースのみなら false", () => {
    expect(hasLeadingOrTrailingSpace("foo bar")).toBe(false);
    expect(hasLeadingOrTrailingSpace("foo　bar")).toBe(false);
  });
});

describe("[heat-1] hasConsecutiveSpaces", () => {
  it("連続スペース（半角・全角・混在）で true", () => {
    expect(hasConsecutiveSpaces("foo  bar")).toBe(true);
    expect(hasConsecutiveSpaces("foo　　bar")).toBe(true);
    expect(hasConsecutiveSpaces("foo 　bar")).toBe(true);
  });
  it("単一スペースのみなら false", () => {
    expect(hasConsecutiveSpaces("foo bar")).toBe(false);
  });
});

describe("[heat-1] isOverMaxLength", () => {
  it("上限を超えたら true", () => {
    expect(isOverMaxLength("abcd", 3)).toBe(true);
  });
  it("上限ちょうど・未満なら false", () => {
    expect(isOverMaxLength("abc", 3)).toBe(false);
    expect(isOverMaxLength("ab", 3)).toBe(false);
  });
});
