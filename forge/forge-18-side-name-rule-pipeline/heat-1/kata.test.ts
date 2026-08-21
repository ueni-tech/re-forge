import { describe, it, expect } from "vitest";
import { resolveMaxLengthByScript, resolveEffectiveMaxLength } from "./kata";

describe("[heat-1] resolveMaxLengthByScript", () => {
  it("code + font から ja/en を返す", () => {
    expect(resolveMaxLengthByScript("engraving_2font_12letter_na", "楷書体★")).toEqual({
      ja: 6,
      en: 12,
    });
    expect(
      resolveMaxLengthByScript("engraving_2font_12letter_na", "英字【筆記体】(頭文字大文字)"),
    ).toEqual({ ja: 0, en: 12 });
  });

  it("不正な組み合わせは例外", () => {
    expect(() =>
      resolveMaxLengthByScript("engraving_6font_3letter_na", "英字【筆記体】(頭文字大文字)"),
    ).not.toThrow();
    expect(() =>
      resolveMaxLengthByScript("engraving_2font_12letter_na", "存在しない書体" as "楷書体★"),
    ).toThrow();
  });
});

describe("[heat-1] resolveEffectiveMaxLength", () => {
  const max = { ja: 6, en: 12 };

  it("日本語を含めば ja", () => {
    expect(resolveEffectiveMaxLength(max, "山田")).toBe(6);
  });
  it("英字のみなら en", () => {
    expect(resolveEffectiveMaxLength(max, "Yamada")).toBe(12);
  });
});
