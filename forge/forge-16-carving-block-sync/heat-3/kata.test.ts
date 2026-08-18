// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { applyCarvingSyncForListingCode, syncCarvingFontLabel } from "./kata";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("[heat-3] applyCarvingSyncForListingCode", () => {
  it("listingCode に一致するブロックだけ表示する", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-font-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="radio" class="js-carving-font-input" name="carving-font" value="楷書体" checked>
          </fieldset>
        </div>
        <div class="js-carving-font-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="radio" class="js-carving-font-input" name="carving-font" value="ゴシック体" checked>
          </fieldset>
        </div>
      </section>
    `;

    applyCarvingSyncForListingCode("ST-A1");

    const blocks = document.querySelectorAll<HTMLElement>(".js-carving-font-block");
    expect(blocks[0].hidden).toBe(false);
    expect(blocks[1].hidden).toBe(true);
  });

  it("text1 入力後の SKU 切替で値が残る", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-text1-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="text" value="" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
        <div class="js-carving-text1-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="text" value="hogehoge" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
      </section>
    `;

    applyCarvingSyncForListingCode("ST-A1");

    const blocks = document.querySelectorAll<HTMLElement>(".js-carving-text1-block");
    expect((blocks[0].querySelector("input") as HTMLInputElement).value).toBe("hogehoge");
    expect(blocks[0].hidden).toBe(false);
    expect(blocks[1].hidden).toBe(true);
  });

  it("2行→1行→2行で text2 が復元", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-text1-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="text" value="" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
        <div class="js-carving-text1-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="text" value="hogehoge" data-basket-param="engraving_text1_na">
          </fieldset>
        </div>
        <div class="js-carving-text2-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="text" value="pugepuge" data-basket-param="engraving_text2_na">
          </fieldset>
        </div>
      </section>
    `;

    const text2Blocks = document.querySelectorAll<HTMLElement>(".js-carving-text2-block");

    applyCarvingSyncForListingCode("ST-A1");
    expect(text2Blocks[0].hidden).toBe(true);

    applyCarvingSyncForListingCode("ST-A2");
    expect((text2Blocks[0].querySelector("input") as HTMLInputElement).value).toBe("pugepuge");
    expect(text2Blocks[0].hidden).toBe(false);
  });

  it("書体テンプレ切替で draft の value が checked", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-font-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="radio" name="carving-font" value="楷書体" class="js-carving-font-input">
            <input type="radio" name="carving-font" value="ゴシック体" class="js-carving-font-input">
          </fieldset>
        </div>
        <div class="js-carving-font-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="radio" name="carving-font" value="楷書体" class="js-carving-font-input">
            <input type="radio" name="carving-font" value="ゴシック体" class="js-carving-font-input" checked>
          </fieldset>
        </div>
      </section>
    `;

    applyCarvingSyncForListingCode("ST-A1");

    const blocks = document.querySelectorAll(".js-carving-font-block");
    expect((blocks[0].querySelector('input[value="ゴシック体"]') as HTMLInputElement).checked).toBe(
      true,
    );
    expect((blocks[0] as HTMLElement).hidden).toBe(false);
  });
});

describe("[heat-3] syncCarvingFontLabel", () => {
  it("表示中 checked 書体を document 内の全 .js-carving-font-label へ反映", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <p>選んでいる書体：<strong class="js-carving-font-label">未設定</strong></p>
        <div class="js-carving-font-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="radio" class="js-carving-font-input" name="carving-font" value="楷書体">
            <input type="radio" class="js-carving-font-input" name="carving-font" value="ゴシック体" checked>
          </fieldset>
        </div>
        <dd><span class="js-carving-font-label">未設定</span></dd>
      </section>
    `;

    syncCarvingFontLabel();

    document.querySelectorAll(".js-carving-font-label").forEach((label) => {
      expect(label.textContent).toBe("ゴシック体");
    });
  });

  it("applyCarvingSyncForListingCode 後もラベルが draft 復元書体と一致", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <p><strong class="js-carving-font-label">未設定</strong></p>
        <div class="js-carving-font-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="radio" class="js-carving-font-input" name="carving-font" value="楷書体">
            <input type="radio" class="js-carving-font-input" name="carving-font" value="ゴシック体">
          </fieldset>
        </div>
        <div class="js-carving-font-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="radio" class="js-carving-font-input" name="carving-font" value="楷書体">
            <input type="radio" class="js-carving-font-input" name="carving-font" value="ゴシック体" checked>
          </fieldset>
        </div>
        <dd><span class="js-carving-font-label">未設定</span></dd>
      </section>
    `;

    applyCarvingSyncForListingCode("ST-A1");

    document.querySelectorAll(".js-carving-font-label").forEach((label) => {
      expect(label.textContent).toBe("ゴシック体");
    });
  });
});
