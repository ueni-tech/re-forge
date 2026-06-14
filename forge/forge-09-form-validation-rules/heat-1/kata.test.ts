import { describe, it, expect } from "vitest";
import { required, maxLength, pattern } from "./kata";

describe("[heat-1] required", () => {
  it("値が入っていれば ok: true を返す", () => {
    const validate = required("お名前を入力してください");
    expect(validate("山田太郎")).toEqual({ ok: true });
  });

  it("空文字は NG で、ファクトリに渡した message を返す", () => {
    const validate = required("お名前を入力してください");
    expect(validate("")).toEqual({
      ok: false,
      message: "お名前を入力してください",
    });
  });

  it("空白文字のみの入力は未入力扱いで NG", () => {
    const validate = required("お名前を入力してください");
    expect(validate("   ").ok).toBe(false);
    expect(validate("\t \n").ok).toBe(false);
  });

  it("同じバリデータを複数の値に使い回しても結果が独立している", () => {
    const validate = required("必須です");
    expect(validate("").ok).toBe(false);
    expect(validate("値あり").ok).toBe(true);
    expect(validate("").ok).toBe(false);
  });
});

describe("[heat-1] maxLength", () => {
  it("max 以内の値は ok: true を返す", () => {
    const validate = maxLength(5, "5文字以内で入力してください");
    expect(validate("あいうえ")).toEqual({ ok: true });
  });

  it("max ちょうどは OK", () => {
    const validate = maxLength(5, "5文字以内で入力してください");
    expect(validate("あいうえお")).toEqual({ ok: true });
  });

  it("max を超えたら NG で message を返す", () => {
    const validate = maxLength(5, "5文字以内で入力してください");
    expect(validate("あいうえおか")).toEqual({
      ok: false,
      message: "5文字以内で入力してください",
    });
  });

  it("空文字は OK（未入力チェックは required の責務）", () => {
    const validate = maxLength(5, "5文字以内で入力してください");
    expect(validate("")).toEqual({ ok: true });
  });
});

describe("[heat-1] pattern", () => {
  it("形式に合う値は ok: true を返す", () => {
    const validate = pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません");
    expect(validate("03-1234-5678")).toEqual({ ok: true });
  });

  it("形式に合わない値は NG で message を返す", () => {
    const validate = pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません");
    expect(validate("０３−１２３４")).toEqual({
      ok: false,
      message: "電話番号の形式が正しくありません",
    });
  });

  it("空文字は OK（任意項目に形式チェックだけを付けられる）", () => {
    const validate = pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません");
    expect(validate("")).toEqual({ ok: true });
  });

  it("メッセージはバリデータごとに独立している", () => {
    const zip = pattern(/^\d{3}-\d{4}$/, "郵便番号の形式が正しくありません");
    const tel = pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません");
    const zipResult = zip("abc");
    const telResult = tel("abc");
    expect(zipResult).toEqual({
      ok: false,
      message: "郵便番号の形式が正しくありません",
    });
    expect(telResult).toEqual({
      ok: false,
      message: "電話番号の形式が正しくありません",
    });
  });
});
