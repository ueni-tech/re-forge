import { describe, it, expect } from "vitest";
import {
  hasJapaneseScript,
  hasHalfWidthKatakana,
  hasAllowedCharWithFullwidthInput,
} from "./kata";
import { ALLOWED_SYMBOLS, toFullWidthSymbol } from "../fixtures/constants";

describe("[heat-2] hasJapaneseScript", () => {
  it("ひらがな・全角カタカナ・漢字・々・〇で true", () => {
    expect(hasJapaneseScript("やまだ")).toBe(true);
    expect(hasJapaneseScript("ヤマダ")).toBe(true);
    expect(hasJapaneseScript("山田")).toBe(true);
    expect(hasJapaneseScript("佐々木")).toBe(true);
    expect(hasJapaneseScript("〇")).toBe(true);
  });
  it("英字・半角カナ・・「」、。では false", () => {
    expect(hasJapaneseScript("yamada")).toBe(false);
    expect(hasJapaneseScript("ﾔﾏﾀﾞ")).toBe(false);
    expect(hasJapaneseScript("・")).toBe(false);
    expect(hasJapaneseScript("「」")).toBe(false);
    expect(hasJapaneseScript("、。")).toBe(false);
  });
});

describe("[heat-2] hasHalfWidthKatakana", () => {
  it("半角カナで true", () => {
    expect(hasHalfWidthKatakana("ﾔﾏﾀﾞ")).toBe(true);
    expect(hasHalfWidthKatakana("yaﾏda")).toBe(true);
  });
  it("全角カナ・半角かぎ括弧句読点では false", () => {
    expect(hasHalfWidthKatakana("ヤマダ")).toBe(false);
    expect(hasHalfWidthKatakana("｢")).toBe(false);
    expect(hasHalfWidthKatakana("｡")).toBe(false);
  });
});

describe("[heat-2] hasAllowedCharWithFullwidthInput", () => {
  it("全角英数字・許可記号の全角版で true", () => {
    expect(hasAllowedCharWithFullwidthInput("ＡＢＣ")).toBe(true);
    expect(hasAllowedCharWithFullwidthInput("＠")).toBe(true);
    expect(hasAllowedCharWithFullwidthInput("・")).toBe(true);
  });

  it.each(
    [...new Set(ALLOWED_SYMBOLS)]
      .map((half) => ({ half, full: toFullWidthSymbol(half) }))
      .filter((pair): pair is { half: string; full: string } => pair.full !== null),
  )("ALLOWED_SYMBOLS 全角版 $half → $full", ({ full }) => {
    expect(hasAllowedCharWithFullwidthInput(full)).toBe(true);
  });

  it("半角英数字・「」、。では false", () => {
    expect(hasAllowedCharWithFullwidthInput("ABC")).toBe(false);
    expect(hasAllowedCharWithFullwidthInput("「")).toBe(false);
    expect(hasAllowedCharWithFullwidthInput("、")).toBe(false);
  });
});
