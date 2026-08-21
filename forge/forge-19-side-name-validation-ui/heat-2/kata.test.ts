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
  return {
    ...createSideNameValidation({
      buildInput,
      hasFont: () => true,
      isActiveInput: (el) => {
        const block = el.closest(".js-carving-text1-block");
        if (!block || !(block instanceof HTMLElement)) return true;
        const fieldset = block.querySelector("fieldset");
        return !block.hidden && !(fieldset instanceof HTMLFieldSetElement && fieldset.disabled);
      },
      findFontRadios: (el) =>
        el.closest(".js-validation-scope")?.querySelectorAll('[data-validation-part="engraving-font"]') ??
        undefined,
      findMaxLengthDisplayEl: (el) =>
        el.closest(".js-carving-text1-block")?.querySelector(".js-validation-display-max-length"),
    }),
    buildInput,
  };
}

describe("[heat-2] input / IME / debounce", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("inactive でもリスナーは付き active 化後に validate 走る", () => {
    vi.useFakeTimers();
    mountBallpenFixture();
    const { init, buildInput } = createController();
    const hiddenInput = document.querySelector<HTMLInputElement>(
      ".js-carving-text1-block[hidden] [data-validation-rule='engraving-text']",
    )!;
    const messageEl = hiddenInput.closest(".js-validation-field")?.querySelector(".js-validation-message");

    init();
    buildInput.mockClear();

    hiddenInput.value = "";
    hiddenInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    vi.advanceTimersByTime(300);
    expect(buildInput).not.toHaveBeenCalled();

    const block = hiddenInput.closest<HTMLElement>(".js-carving-text1-block")!;
    block.hidden = false;
    block.querySelector("fieldset")!.disabled = false;

    hiddenInput.dispatchEvent(new InputEvent("input", { bubbles: true }));
    vi.advanceTimersByTime(300);

    expect(buildInput).toHaveBeenCalled();
    expect(messageEl?.textContent).toBe("名入れ内容を入力してください");
  });
});
