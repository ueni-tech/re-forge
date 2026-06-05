// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { createButtonSwitcher } from "./kata";

type MountOptions = {
  codes: string[];
  initialCode?: string;
  withPicker?: boolean;
};

function mountPicker(options: MountOptions): void {
  const { codes, initialCode, withPicker = true } = options;

  if (!withPicker) {
    document.body.innerHTML = "";
    return;
  }

  const buttons = codes
    .map(
      (code) =>
        `<button class="js-variant-btn" type="button" data-code="${code}">${code}</button>`,
    )
    .join("");

  const initialAttr =
    initialCode !== undefined ? ` data-initial-code="${initialCode}"` : "";
  document.body.innerHTML = `<div class="js-variant-picker"${initialAttr}>${buttons}</div>`;
}

function btnByCode(code: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    `.js-variant-btn[data-code="${code}"]`,
  );
}

function expectSelected(code: string, selected: boolean): void {
  const btn = btnByCode(code);
  expect(btn).not.toBeNull();
  expect(btn!.disabled).toBe(selected);
  expect(btn!.classList.contains("is-selected")).toBe(selected);
}

describe("[heat-2] createButtonSwitcher", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it(".js-variant-picker が存在しないとき null を返す", () => {
    mountPicker({ codes: [], withPicker: false });
    expect(createButtonSwitcher()).toBeNull();
  });

  it(".js-variant-picker が存在するとき関数を返す", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2"] });
    expect(typeof createButtonSwitcher()).toBe("function");
  });

  it("data-initial-code が有効なとき、ファクトリ呼び出し直後に初期ボタンが選択状態になる", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2"], initialCode: "ST-A1" });

    createButtonSwitcher();

    expectSelected("ST-A1", true);
    expectSelected("ST-A2", false);
  });

  it("data-initial-code が空文字のとき、初期化副作用は実行されない", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2"], initialCode: "" });

    createButtonSwitcher();

    expectSelected("ST-A1", false);
    expectSelected("ST-A2", false);
  });

  it("data-initial-code 属性がないとき、初期化副作用は実行されない", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2"] });

    createButtonSwitcher();

    expectSelected("ST-A1", false);
    expectSelected("ST-A2", false);
  });

  it("selectButton(code) で対応ボタンのみ selected になり、他は解除される", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2", "ST-A3"], initialCode: "ST-A1" });
    const selectButton = createButtonSwitcher();

    selectButton!("ST-A2");

    expectSelected("ST-A1", false);
    expectSelected("ST-A2", true);
    expectSelected("ST-A3", false);
  });

  it("selectButton を連続呼び出しすると毎回正しく切り替わる", () => {
    mountPicker({ codes: ["ST-A1", "ST-A2"], initialCode: "ST-A1" });
    const selectButton = createButtonSwitcher();

    selectButton!("ST-A2");
    expectSelected("ST-A1", false);
    expectSelected("ST-A2", true);

    selectButton!("ST-A1");
    expectSelected("ST-A1", true);
    expectSelected("ST-A2", false);
  });
});
