// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import {
  captureDraftFromVisibleBlocks,
  syncCarvingFontChecked,
  applyDraftToVisibleBlocks,
  getEngravingDraft,
  resetEngravingDraft,
} from "./kata";

beforeEach(() => {
  document.body.innerHTML = "";
  resetEngravingDraft();
});

describe("[heat-2] engraving draft", () => {
  it("captureDraftFromVisibleBlocks が表示中 block から draft へ転写", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-text1-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="text" value="hello" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
      </section>
    `;

    captureDraftFromVisibleBlocks();
    expect(getEngravingDraft().textLine1).toBe("hello");
  });

  it("applyDraftToVisibleBlocks が draft を表示中 input へ復元", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-text1-block">
          <fieldset>
            <input type="text" value="" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
      </section>
    `;

    resetEngravingDraft();
    captureDraftFromVisibleBlocks();
    (document.querySelector("input") as HTMLInputElement).value = "stored";

    captureDraftFromVisibleBlocks();
    (document.querySelector("input") as HTMLInputElement).value = "";

    applyDraftToVisibleBlocks();
    expect((document.querySelector("input") as HTMLInputElement).value).toBe("stored");
  });

  it("syncCarvingFontChecked が draft の value を checked に反映", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-font-block">
          <fieldset>
            <input type="radio" name="carving-font" value="楷書体" class="js-carving-font-input">
            <input type="radio" name="carving-font" value="ゴシック体" class="js-carving-font-input" checked>
          </fieldset>
        </div>
      </section>
    `;

    captureDraftFromVisibleBlocks();

    (document.querySelector('input[value="楷書体"]') as HTMLInputElement).checked = true;
    (document.querySelector('input[value="ゴシック体"]') as HTMLInputElement).checked = false;

    syncCarvingFontChecked();

    expect((document.querySelector('input[value="ゴシック体"]') as HTMLInputElement).checked).toBe(
      true,
    );
  });

  it("2行 text2 も capture / apply 対象", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-text2-block">
          <fieldset>
            <input type="text" value="line2" data-basket-param="engraving_text2_na">
          </fieldset>
        </div>
      </section>
    `;

    captureDraftFromVisibleBlocks();
    expect(getEngravingDraft().textLine2).toBe("line2");
  });
});
