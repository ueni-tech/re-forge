// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { syncCarvingBlocks } from "./kata";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("[heat-1] syncCarvingBlocks", () => {
  it("listingCode に一致するブロックだけ表示し fieldset を有効化", () => {
    document.body.innerHTML = `
      <section id="order-option-carving">
        <div class="js-carving-font-block" data-listing-codes="ST-A1" hidden>
          <fieldset disabled>
            <input type="radio" class="js-carving-font-input" value="楷書体" checked>
          </fieldset>
        </div>
        <div class="js-carving-font-block" data-listing-codes="ST-A2">
          <fieldset>
            <input type="radio" class="js-carving-font-input" value="ゴシック体" checked>
          </fieldset>
        </div>
      </section>
    `;

    syncCarvingBlocks("ST-A1");

    const blocks = document.querySelectorAll<HTMLElement>(".js-carving-font-block");
    expect(blocks[0].hidden).toBe(false);
    expect(blocks[1].hidden).toBe(true);
    expect((blocks[0].querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(false);
    expect((blocks[1].querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
  });

  it("data-listing-codes に複数 SKU が書かれていればいずれか一致で表示", () => {
    document.body.innerHTML = `
      <div class="js-carving-text1-block" data-listing-codes="ST-A1 ST-A3" hidden>
        <fieldset disabled><input type="text" data-basket-param="t1"></fieldset>
      </div>
    `;

    syncCarvingBlocks("ST-A3");

    const block = document.querySelector<HTMLElement>(".js-carving-text1-block")!;
    expect(block.hidden).toBe(false);
    expect((block.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(false);
  });

  it("一致 block が無い listingCode なら全 block 非表示", () => {
    document.body.innerHTML = `
      <div class="js-carving-font-block" data-listing-codes="ST-A1">
        <fieldset><input type="radio"></fieldset>
      </div>
    `;

    syncCarvingBlocks("UNKNOWN");

    const block = document.querySelector<HTMLElement>(".js-carving-font-block")!;
    expect(block.hidden).toBe(true);
    expect((block.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
  });
});
