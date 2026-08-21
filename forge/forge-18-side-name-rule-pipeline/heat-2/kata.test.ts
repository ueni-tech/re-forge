import { describe, it, expect } from "vitest";
import { buildContext, runRules } from "./kata";
import type { RuleStep, ValidationContext, ValidationInput } from "../fixtures/types";

describe("[heat-2] buildContext", () => {
  it("日本語可能書体×日本語入力", () => {
    const input: ValidationInput = {
      value: "山田",
      code: "engraving_2font_12letter_na",
      font: "楷書体★",
    };
    expect(buildContext(input)).toEqual({
      value: "山田",
      code: "engraving_2font_12letter_na",
      font: "楷書体★",
      effectiveMaxLength: 6,
      allowJapanese: true,
      hasJapaneseCapableFont: true,
    });
  });

  it("英字専用書体", () => {
    const input: ValidationInput = {
      value: "Yamada",
      code: "engraving_2font_12letter_na",
      font: "英字【筆記体】(頭文字大文字)",
    };
    const ctx = buildContext(input);
    expect(ctx.effectiveMaxLength).toBe(12);
    expect(ctx.allowJapanese).toBe(false);
    expect(ctx.hasJapaneseCapableFont).toBe(true);
  });

  it("商品全体に日本語可能書体なし", () => {
    const input: ValidationInput = {
      value: "ABC",
      code: "engraving_6font_3letter_na",
      font: "楷書体★",
    };
    expect(buildContext(input).hasJapaneseCapableFont).toBe(false);
  });
});

describe("[heat-2] runRules", () => {
  const ctx: ValidationContext = {
    value: "x",
    code: "engraving_2font_12letter_na",
    font: "楷書体★",
    effectiveMaxLength: 6,
    allowJapanese: true,
    hasJapaneseCapableFont: true,
  };

  const rules: RuleStep[] = [
    { id: "empty", fails: (c) => c.value === "", message: "empty msg" },
    { id: "overMaxLength", fails: () => true, message: "second" },
  ];

  it("最初に fails したルールを返す", () => {
    expect(runRules({ ...ctx, value: "" }, rules)).toEqual({
      ok: false,
      ruleId: "empty",
      message: "empty msg",
    });
  });

  it("動的 message を Context で解決", () => {
    const dynamic: RuleStep[] = [
      {
        id: "overMaxLength",
        fails: () => true,
        message: (c) => `${c.effectiveMaxLength}文字以内`,
      },
    ];
    expect(runRules(ctx, dynamic)).toEqual({
      ok: false,
      ruleId: "overMaxLength",
      message: "6文字以内",
    });
  });

  it("全通過なら ok: true", () => {
    expect(runRules(ctx, [{ id: "empty", fails: () => false, message: "x" }])).toEqual({
      ok: true,
    });
  });
});
