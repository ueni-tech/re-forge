import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { syncLabels, scheduleSoon, type LabelState, type LabelTargets } from "./kata";

describe("[heat-2] syncLabels", () => {
  it("color / font / layout それぞれに textContent を書き込む", () => {
    const color: { textContent: string | null } = { textContent: null };
    const font: { textContent: string | null } = { textContent: null };
    const layout: { textContent: string | null } = { textContent: null };
    const state: LabelState = { color: "赤", font: "ゴシック体", layout: "横" };
    syncLabels(state, { color, font, layout });
    expect(color.textContent).toBe("赤");
    expect(font.textContent).toBe("ゴシック体");
    expect(layout.textContent).toBe("横");
  });

  it("存在しない target キーは無視して他を書き込む", () => {
    const color: { textContent: string | null } = { textContent: null };
    const state: LabelState = { color: "黒", font: "明朝体", layout: "縦" };
    syncLabels(state, { color }); // font / layout target なし
    expect(color.textContent).toBe("黒");
    // font / layout の target がなくてもエラーにならない
  });

  it("target が null のキーも無視して他を書き込む", () => {
    const font: { textContent: string | null } = { textContent: null };
    const state: LabelState = { color: "赤", font: "楷書体", layout: "横" };
    syncLabels(state, { color: null, font });
    expect(font.textContent).toBe("楷書体");
  });
});

describe("[heat-2] scheduleSoon", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("options.raf が渡されていれば、そちらを使って fn を実行する", () => {
    const fn = vi.fn();
    const raf = vi.fn((cb: () => void) => cb());
    scheduleSoon(fn, { raf });
    expect(raf).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledOnce();
  });

  it("options.raf がない場合は setTimeout(fn, 0) フォールバックで fn を実行する", () => {
    const fn = vi.fn();
    scheduleSoon(fn);
    expect(fn).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledOnce();
  });
});
