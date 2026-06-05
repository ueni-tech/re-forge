// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { initVariantPicker, SyncFn, FactoryFn } from "./kata";

function mountFull(options: { withPicker?: boolean } = {}): void {
  const { withPicker = true } = options;

  const pickerHtml = withPicker
    ? `<div class="js-variant-picker" data-initial-code="ST-A1">
         <button class="js-variant-btn" type="button" data-code="ST-A1">A1</button>
         <button class="js-variant-btn" type="button" data-code="ST-A2">A2</button>
       </div>`
    : "";

  document.body.innerHTML = `
    ${pickerHtml}
    <div class="js-variant-blocks">
      <div class="js-variant-block" data-code="ST-A1"></div>
      <div class="js-variant-block" data-code="ST-A2"></div>
    </div>
  `;
}

function clickBtn(code: string): void {
  const btn = document.querySelector<HTMLElement>(
    `.js-variant-btn[data-code="${code}"]`,
  );
  btn?.click();
}

describe("[heat-3] initVariantPicker", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it(".js-variant-picker がないとき、ファクトリを呼ばない", () => {
    mountFull({ withPicker: false });
    const createBlock = vi.fn<FactoryFn>().mockReturnValue(null);
    const createButton = vi.fn<FactoryFn>().mockReturnValue(null);

    initVariantPicker(createBlock, createButton);

    expect(createBlock).not.toHaveBeenCalled();
    expect(createButton).not.toHaveBeenCalled();
  });

  it("初期化時に createBlock と createButton を1回ずつ呼ぶ", () => {
    mountFull();
    const createBlock = vi.fn<FactoryFn>().mockReturnValue(null);
    const createButton = vi.fn<FactoryFn>().mockReturnValue(null);

    initVariantPicker(createBlock, createButton);

    expect(createBlock).toHaveBeenCalledTimes(1);
    expect(createButton).toHaveBeenCalledTimes(1);
  });

  it("ボタンクリックで showBlock と selectButton が対応する code で呼ばれる", () => {
    mountFull();
    const showBlock = vi.fn<SyncFn>();
    const selectButton = vi.fn<SyncFn>();
    const createBlock: FactoryFn = () => showBlock;
    const createButton: FactoryFn = () => selectButton;

    initVariantPicker(createBlock, createButton);
    clickBtn("ST-A2");

    expect(showBlock).toHaveBeenCalledTimes(1);
    expect(showBlock).toHaveBeenCalledWith("ST-A2");
    expect(selectButton).toHaveBeenCalledTimes(1);
    expect(selectButton).toHaveBeenCalledWith("ST-A2");
  });

  it("showBlock が null のとき、クリックしてもエラーにならず selectButton だけ呼ばれる", () => {
    mountFull();
    const selectButton = vi.fn<SyncFn>();
    const createBlock: FactoryFn = () => null;
    const createButton: FactoryFn = () => selectButton;

    initVariantPicker(createBlock, createButton);
    expect(() => clickBtn("ST-A1")).not.toThrow();
    expect(selectButton).toHaveBeenCalledWith("ST-A1");
  });

  it("selectButton が null のとき、クリックしてもエラーにならず showBlock だけ呼ばれる", () => {
    mountFull();
    const showBlock = vi.fn<SyncFn>();
    const createBlock: FactoryFn = () => showBlock;
    const createButton: FactoryFn = () => null;

    initVariantPicker(createBlock, createButton);
    expect(() => clickBtn("ST-A1")).not.toThrow();
    expect(showBlock).toHaveBeenCalledWith("ST-A1");
  });

  it("[data-code] を持たない要素をクリックしたとき sync 関数は呼ばれない", () => {
    mountFull();
    const showBlock = vi.fn<SyncFn>();
    const selectButton = vi.fn<SyncFn>();
    const createBlock: FactoryFn = () => showBlock;
    const createButton: FactoryFn = () => selectButton;

    initVariantPicker(createBlock, createButton);

    // picker 自体（data-code なし）をクリック
    const picker = document.querySelector<HTMLElement>(".js-variant-picker");
    picker?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(showBlock).not.toHaveBeenCalled();
    expect(selectButton).not.toHaveBeenCalled();
  });

  it("クリックのたびにファクトリを再呼び出ししない", () => {
    mountFull();
    const createBlock = vi.fn<FactoryFn>().mockReturnValue(vi.fn<SyncFn>());
    const createButton = vi.fn<FactoryFn>().mockReturnValue(vi.fn<SyncFn>());

    initVariantPicker(createBlock, createButton);
    clickBtn("ST-A1");
    clickBtn("ST-A2");

    // ファクトリは初期化時の1回だけ
    expect(createBlock).toHaveBeenCalledTimes(1);
    expect(createButton).toHaveBeenCalledTimes(1);
  });
});
