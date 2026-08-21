import { describe, it, expect } from "vitest";
import { hasDeniedCharacter, hasDisallowedCharacter } from "./kata";

describe("[heat-3] hasDeniedCharacter", () => {
  it("卍・卐で true", () => {
    expect(hasDeniedCharacter("卍")).toBe(true);
    expect(hasDeniedCharacter("卐")).toBe(true);
  });
  it("通常文字では false", () => {
    expect(hasDeniedCharacter("山田")).toBe(false);
  });
});

describe("[heat-3] hasDisallowedCharacter", () => {
  it("許可外記号・絵文字で true", () => {
    expect(hasDisallowedCharacter("〒123")).toBe(true);
    expect(hasDisallowedCharacter("foo 😊")).toBe(true);
  });
  it("許可文字のみなら false", () => {
    expect(hasDisallowedCharacter("山田明子")).toBe(false);
    expect(hasDisallowedCharacter("Yamada&Akiko")).toBe(false);
    expect(hasDisallowedCharacter("「山田」")).toBe(false);
    expect(hasDisallowedCharacter("、。")).toBe(false);
    expect(hasDisallowedCharacter("｢山田｣")).toBe(false);
  });
  it("全角中点（・）は許可外として true", () => {
    expect(hasDisallowedCharacter("・")).toBe(true);
  });
});
