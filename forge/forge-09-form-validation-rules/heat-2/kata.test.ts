import { describe, it, expect, vi } from "vitest";
import { composeValidators, collectErrors, Validator } from "./kata";

const ng = (message: string): Validator => () => ({ ok: false, message });
const ok = (): Validator => () => ({ ok: true });

describe("[heat-2] composeValidators", () => {
  it("すべて OK なら ok: true を返す", () => {
    const validate = composeValidators([ok(), ok()]);
    expect(validate("値")).toEqual({ ok: true });
  });

  it("最初に NG になったバリデータの message を返す", () => {
    const validate = composeValidators([ok(), ng("1つ目のエラー"), ng("2つ目のエラー")]);
    expect(validate("値")).toEqual({ ok: false, message: "1つ目のエラー" });
  });

  it("NG が出たら後続のバリデータを実行しない（打ち切り）", () => {
    const after = vi.fn<Validator>(() => ({ ok: true }));
    const validate = composeValidators([ng("先にNG"), after]);
    validate("値");
    expect(after).not.toHaveBeenCalled();
  });

  it("各バリデータには同じ value が渡される", () => {
    const v1 = vi.fn<Validator>(() => ({ ok: true }));
    const v2 = vi.fn<Validator>(() => ({ ok: true }));
    const validate = composeValidators([v1, v2]);
    validate("検証対象");
    expect(v1).toHaveBeenCalledWith("検証対象");
    expect(v2).toHaveBeenCalledWith("検証対象");
  });

  it("空配列なら常に OK のバリデータになる", () => {
    const validate = composeValidators([]);
    expect(validate("")).toEqual({ ok: true });
    expect(validate("anything")).toEqual({ ok: true });
  });

  it("合成結果は Validator 型なので、さらに合成の材料にできる", () => {
    const base = composeValidators([ok()]);
    const extended = composeValidators([base, ng("追加ルールでNG")]);
    expect(extended("値")).toEqual({ ok: false, message: "追加ルールでNG" });
  });

  it("渡した配列を変更しない", () => {
    const validators = [ok(), ng("NG")];
    const snapshot = [...validators];
    composeValidators(validators)("値");
    expect(validators).toEqual(snapshot);
  });
});

describe("[heat-2] collectErrors", () => {
  it("すべて OK なら空配列を返す", () => {
    expect(collectErrors("値", [ok(), ok()])).toEqual([]);
  });

  it("NG のメッセージを配列の順番どおりに全部集める", () => {
    const errors = collectErrors("値", [
      ng("1つ目のエラー"),
      ok(),
      ng("2つ目のエラー"),
    ]);
    expect(errors).toEqual(["1つ目のエラー", "2つ目のエラー"]);
  });

  it("NG が出ても後続のバリデータを実行する（全収集）", () => {
    const after = vi.fn<Validator>(() => ({ ok: true }));
    collectErrors("値", [ng("先にNG"), after]);
    expect(after).toHaveBeenCalledTimes(1);
  });

  it("空配列なら空配列を返す", () => {
    expect(collectErrors("値", [])).toEqual([]);
  });
});
