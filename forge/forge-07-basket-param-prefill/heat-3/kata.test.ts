import { describe, it, expect, vi } from "vitest";
import {
  getStrategyKey,
  initForm,
  PrefillableElement,
  PrefillableForm,
  PrefillData,
} from "./kata";

describe("[heat-3] getStrategyKey", () => {
  it('type が "radio" のとき "checked" を返す', () => {
    expect(getStrategyKey({ type: "radio" })).toBe("checked");
  });

  it('type が "checkbox" のとき "checked" を返す', () => {
    expect(getStrategyKey({ type: "checkbox" })).toBe("checked");
  });

  it('type が "text" のとき "default" を返す', () => {
    expect(getStrategyKey({ type: "text" })).toBe("default");
  });

  it('type が undefined のとき "default" を返す', () => {
    expect(getStrategyKey({ type: undefined as unknown as string })).toBe("default");
  });
});

describe("[heat-3] initForm", () => {
  function makeElement(
    overrides: Partial<PrefillableElement> = {},
  ): PrefillableElement & { click: ReturnType<typeof vi.fn> } {
    return {
      type: "text",
      name: "",
      value: "",
      click: vi.fn(),
      ...overrides,
    };
  }

  it("form が null の場合は例外なく終了する", () => {
    expect(() =>
      initForm(null, { "ST-TKV-A2": { sha_name_2font2: "楷書体" } }),
    ).not.toThrow();
  });

  it("prefillData が undefined の場合は例外なく終了する", () => {
    const form: PrefillableForm = {
      querySelectorAll: vi.fn().mockReturnValue([]),
    };
    expect(() => initForm(form, undefined)).not.toThrow();
  });

  it("value が一致する radio 要素に click が呼ばれ、不一致には呼ばれない", () => {
    const prefillData: PrefillData = { "ST-TKV-A2": { sha_name_2font2: "明朝体" } };
    const matched = makeElement({
      type: "radio",
      name: "param[ST-TKV-A2][dummy][1][sha_name_2font2]",
      value: "明朝体",
    });
    const unmatched = makeElement({
      type: "radio",
      name: "param[ST-TKV-A2][dummy][1][sha_name_2font2]",
      value: "楷書体",
    });
    const form: PrefillableForm = {
      querySelectorAll: vi.fn().mockReturnValue([matched, unmatched]),
    };

    initForm(form, prefillData);

    expect(matched.click).toHaveBeenCalledTimes(1);
    expect(unmatched.click).not.toHaveBeenCalled();
  });

  it("text 要素の value が prefill 値に上書きされる", () => {
    const prefillData: PrefillData = {
      "ST-TKV-A2": { sha_name_line1: "テスト株式会社" },
    };
    const el = makeElement({
      type: "text",
      name: "param[ST-TKV-A2][dummy][1][sha_name_line1]",
      value: "",
    });
    const form: PrefillableForm = {
      querySelectorAll: vi.fn().mockReturnValue([el]),
    };

    initForm(form, prefillData);

    expect(el.value).toBe("テスト株式会社");
  });
});
