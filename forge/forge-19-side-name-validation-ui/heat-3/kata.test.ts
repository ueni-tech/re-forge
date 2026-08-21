// @vitest-environment jsdom

import { describe, it, expect, afterEach, vi } from "vitest";
import { createSideNameValidation, buildValidationInput } from "./kata";
import { validateSideName } from "../fixtures/validation-ref";

function mountScope(options?: { inputValue?: string; hidden?: boolean }) {
  const inputValue = options?.inputValue ?? "山田";
  const hidden = options?.hidden ?? false;
  document.body.innerHTML = `
    <div class="js-validation-scope">
      <input type="radio" name="font" data-validation-part="engraving-font"
        data-basket-param="engraving_2font_12letter_na" data-basket-value="楷書体★" checked />
      <div class="js-carving-text1-block" ${hidden ? "hidden" : ""}>
        <fieldset ${hidden ? "disabled" : ""}>
          <p class="js-validation-display-max-length"></p>
          <div class="js-validation-field">
            <input type="text" data-validation-rule="engraving-text" value="${inputValue}" />
            <span class="js-validation-message"></span>
          </div>
        </fieldset>
      </div>
    </div>
  `;
  return document.querySelector<HTMLInputElement>('[data-validation-rule="engraving-text"]')!;
}

describe("[heat-3] buildValidationInput", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("scope 内の checked 書体から ValidationInput を返す", () => {
    const inputEl = mountScope();
    expect(buildValidationInput(inputEl)).toEqual({
      value: "山田",
      code: "engraving_2font_12letter_na",
      font: "楷書体★",
    });
  });

  it("書体未選択なら undefined", () => {
    mountScope();
    document.querySelector<HTMLInputElement>('[data-validation-part="engraving-font"]')!.checked = false;
    const inputEl = document.querySelector<HTMLInputElement>('[data-validation-rule="engraving-text"]')!;
    expect(buildValidationInput(inputEl)).toBeUndefined();
  });
});

describe("[heat-3] syncValidationState", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("inactive 化でメッセージクリア + onResultsChange(true)", () => {
    const inputEl = mountScope({ inputValue: "" });
    const messageEl = inputEl.closest(".js-validation-field")?.querySelector(".js-validation-message");
    const block = inputEl.closest<HTMLElement>(".js-carving-text1-block")!;
    const onResultsChange = vi.fn();

    const { init, syncValidationState } = createSideNameValidation({
      buildInput: buildValidationInput,
      hasFont: () => true,
      isActiveInput: (el) => {
        const b = el.closest(".js-carving-text1-block");
        if (!b || !(b instanceof HTMLElement)) return true;
        const fs = b.querySelector("fieldset");
        return !b.hidden && !(fs instanceof HTMLFieldSetElement && fs.disabled);
      },
      findFontRadios: (el) =>
        el.closest(".js-validation-scope")?.querySelectorAll('[data-validation-part="engraving-font"]') ??
        undefined,
      findMaxLengthDisplayEl: (el) =>
        el.closest(".js-carving-text1-block")?.querySelector(".js-validation-display-max-length"),
      onResultsChange,
    });

    init();
    expect(messageEl?.textContent).toBe("名入れ内容を入力してください");
    onResultsChange.mockClear();

    block.hidden = true;
    block.querySelector("fieldset")!.disabled = true;
    syncValidationState();

    expect(messageEl?.textContent).toBe("");
    expect(onResultsChange).toHaveBeenCalledWith(true);
  });

  it("buildInput + validateSideName 連携", () => {
    const inputEl = mountScope({ inputValue: "" });
    const built = buildValidationInput(inputEl);
    expect(built).toBeDefined();
    expect(validateSideName(built!)).toEqual({
      ok: false,
      ruleId: "empty",
      message: "名入れ内容を入力してください",
    });
  });
});
