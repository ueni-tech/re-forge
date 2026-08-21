import { describe, it, expect } from "vitest";
import { validateSideName } from "./kata";
import type { ValidationInput } from "../fixtures/types";

const CODE = "engraving_2font_12letter_na" as const;
const FONT_JA = "楷書体★" as const;
const FONT_EN = "英字【筆記体】(頭文字大文字)" as const;

function input(value: string, font: ValidationInput["font"] = FONT_JA): ValidationInput {
  return { value, code: CODE, font };
}

describe("[heat-3] validateSideName 正常系", () => {
  it("日本語入力 OK", () => {
    expect(validateSideName(input("山田明子"))).toEqual({ ok: true });
  });
  it("英字入力 OK", () => {
    expect(validateSideName(input("Yamada Akiko"))).toEqual({ ok: true });
  });
  it("全角「」、。 OK", () => {
    expect(validateSideName(input("「山田」"))).toEqual({ ok: true });
  });
});

describe("[heat-3] validateSideName 失敗", () => {
  it("空文字", () => {
    expect(validateSideName(input(""))).toEqual({
      ok: false,
      ruleId: "empty",
      message: "名入れ内容を入力してください",
    });
  });
  it("先頭スペース", () => {
    expect(validateSideName(input("　山田"))).toEqual({
      ok: false,
      ruleId: "leadingOrTrailingSpace",
      message: "先頭または末尾にスペースは使用できません",
    });
  });
  it("英字専用書体で漢字", () => {
    expect(validateSideName(input("山田", FONT_EN))).toEqual({
      ok: false,
      ruleId: "japaneseNotAllowedForFont",
      message:
        "選択中の書体では英数字・記号のみご利用いただけます。日本語を入力する場合は書体を変更してください",
    });
  });
  it("日本語不可商品", () => {
    expect(
      validateSideName({
        value: "山田",
        code: "engraving_6font_3letter_na",
        font: "楷書体★",
      }),
    ).toEqual({
      ok: false,
      ruleId: "japaneseNotAllowedForFont",
      message: "英数字・記号のみご利用いただけます",
    });
  });
  it("半角カナ", () => {
    expect(validateSideName(input("ﾔﾏﾀﾞ"))).toEqual({
      ok: false,
      ruleId: "halfWidthKatakana",
      message: "半角カタカナは使用できません。全角カタカナでご入力ください",
    });
  });
  it("全角英字", () => {
    expect(validateSideName(input("ＹＡＭＡＤＡ"))).toEqual({
      ok: false,
      ruleId: "allowedCharWithFullwidthInput",
      message: "英数字・記号は半角でご入力ください",
    });
  });
  it("許可外記号", () => {
    expect(validateSideName(input("山田〒"))).toEqual({
      ok: false,
      ruleId: "disallowedCharacter",
      message: "使用できない文字が含まれています。使用可能な文字・記号をご確認ください",
    });
  });
  it("文字数超過", () => {
    expect(validateSideName(input("ヤマダ　アキコ"))).toEqual({
      ok: false,
      ruleId: "overMaxLength",
      message: "6文字以内でご入力ください",
    });
  });
});

describe("[heat-3] ルール優先順位", () => {
  it("先頭スペースが文字数超過より先", () => {
    expect(validateSideName(input("　ヤマダ　アキコ"))).toEqual({
      ok: false,
      ruleId: "leadingOrTrailingSpace",
      message: "先頭または末尾にスペースは使用できません",
    });
  });
});

describe("[heat-3] resolveRuleSet / validationRuleFieldSelector", () => {
  it("resolveRuleSet", async () => {
    const { resolveRuleSet, ENGRAVING_TEXT_RULE_SET, validationRuleFieldSelector } = await import(
      "./kata"
    );
    expect(resolveRuleSet("engraving-text")).toBe(ENGRAVING_TEXT_RULE_SET);
    expect(resolveRuleSet(undefined)).toBeUndefined();
    expect(validationRuleFieldSelector()).toBe('[data-validation-rule="engraving-text"]');
  });
});
