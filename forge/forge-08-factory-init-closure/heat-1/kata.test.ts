// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { createBlockSwitcher } from "./kata";

function mountBlocks(codes: string[]): void {
  const blocks = codes
    .map((code) => `<div class="js-variant-block" data-code="${code}"></div>`)
    .join("");
  document.body.innerHTML = `<div class="js-variant-blocks">${blocks}</div>`;
}

function blockByCode(code: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `.js-variant-block[data-code="${code}"]`,
  );
}

describe("[heat-1] createBlockSwitcher", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it(".js-variant-blocks が存在しないとき null を返す", () => {
    expect(createBlockSwitcher()).toBeNull();
  });

  it(".js-variant-blocks が存在するとき関数を返す", () => {
    mountBlocks(["ST-A1", "ST-A2"]);
    expect(typeof createBlockSwitcher()).toBe("function");
  });

  it("showBlock(code) で一致するブロックのみ表示される", () => {
    mountBlocks(["ST-A1", "ST-A2", "ST-A3"]);
    const showBlock = createBlockSwitcher();

    showBlock!("ST-A2");

    expect(blockByCode("ST-A1")!.hidden).toBe(true);
    expect(blockByCode("ST-A2")!.hidden).toBe(false);
    expect(blockByCode("ST-A3")!.hidden).toBe(true);
  });

  it("showBlock を連続呼び出しすると毎回正しく切り替わる", () => {
    mountBlocks(["ST-A1", "ST-A2"]);
    const showBlock = createBlockSwitcher();

    showBlock!("ST-A1");
    expect(blockByCode("ST-A1")!.hidden).toBe(false);
    expect(blockByCode("ST-A2")!.hidden).toBe(true);

    showBlock!("ST-A2");
    expect(blockByCode("ST-A1")!.hidden).toBe(true);
    expect(blockByCode("ST-A2")!.hidden).toBe(false);
  });

  it("対応する data-code がないとき全件が非表示になる", () => {
    mountBlocks(["ST-A1", "ST-A2"]);
    const showBlock = createBlockSwitcher();

    showBlock!("UNKNOWN");

    expect(blockByCode("ST-A1")!.hidden).toBe(true);
    expect(blockByCode("ST-A2")!.hidden).toBe(true);
  });
});
