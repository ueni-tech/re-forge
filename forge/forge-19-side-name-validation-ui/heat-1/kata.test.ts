// @vitest-environment jsdom

import { describe, it, expect, afterEach, vi } from "vitest";
import { createSideNameValidation } from "./kata";
import type { ValidationInput } from "../../forge-18-side-name-rule-pipeline/fixtures/types";

const STUB: ValidationInput = {
  value: "山田",
  code: "engraving_2font_12letter_na",
  font: "楷書体★",
};

function mountBallpenFixture() {
  document.body.innerHTML = `
    <div class="js-validation-scope">
      <div class="js-carving-font-block" hidden>
        <fieldset disabled>
          <input type="radio" data-validation-part="engraving-font"
            data-basket-param="engraving_6font_12letter_na" data-basket-value="楷書体★" checked />
        </fieldset>
      </div>
      <div class="js-carving-font-block">
        <fieldset>
          <input type="radio" data-validation-part="engraving-font"
            data-basket-param="engraving_2font_22letter_na2" data-basket-value="ゴシック体★" checked />
        </fieldset>
      </div>
      <div class="js-carving-text1-block" hidden>
        <fieldset disabled>
          <p class="js-validation-display-max-length"></p>
          <div class="js-validation-field">
            <input type="text" data-validation-rule="engraving-text" value="山田" />
            <span class="js-validation-message"></span>
          </div>
        </fieldset>
      </div>
      <div class="js-carving-text1-block">
        <fieldset>
          <p class="js-validation-display-max-length"></p>
          <div class="js-validation-field">
            <input type="text" data-validation-rule="engraving-text" value="山田" />
            <span class="js-validation-message"></span>
          </div>
        </fieldset>
      </div>
    </div>
  `;
}

function createController() {
  const buildInput = vi.fn(
    (inputEl: HTMLInputElement): ValidationInput => ({
      ...STUB,
      value: inputEl.value,
    }),
  );
  const onResultsChange = vi.fn();
  const controller = createSideNameValidation({
    buildInput,
    hasFont: () => true,
    isActiveInput: (el) => {
      const block = el.closest(".js-carving-text1-block");
      if (!block || !(block instanceof HTMLElement)) return true;
      const fieldset = block.querySelector("fieldset");
      return !block.hidden && !(fieldset instanceof HTMLFieldSetElement && fieldset.disabled);
    },
    findFontRadios: (el) =>
      el.closest(".js-validation-scope")?.querySelectorAll('[data-validation-part="engraving-font"]') ?? undefined,
    findMaxLengthDisplayEl: (el) =>
      el.closest(".js-carving-text1-block")?.querySelector(".js-validation-display-max-length"),
    onResultsChange,
  });
  return { ...controller, buildInput, onResultsChange };
}

describe("[heat-1] createSideNameValidation init", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("active input のみ validate + 上限表示", () => {
    mountBallpenFixture();
    const { init } = createController();
    init();

    const activeDisplay = document.querySelector(
      ".js-carving-text1-block:not([hidden]) .js-validation-display-max-length",
    );
    expect(activeDisplay?.textContent).toBe("英数字のみ:12文字まで/日本語含む:6文字まで");

    const hiddenDisplay = document.querySelector(
      ".js-carving-text1-block[hidden] .js-validation-display-max-length",
    );
    expect(hiddenDisplay?.textContent).toBe("");

    const activeInput = document.querySelector<HTMLInputElement>(
      ".js-carving-text1-block:not([hidden]) [data-validation-rule='engraving-text']",
    )!;
    const messageEl = activeInput.closest(".js-validation-field")?.querySelector(".js-validation-message");
    expect(messageEl?.textContent).toBe("");
  });
});
