import { describe, it, expect, vi } from "vitest";
import { validateForm, FieldSchema, Validator } from "./kata";

// heat-1 相当の最小バリデータ（この heat の検証対象は validateForm 本体）
const required =
  (message: string): Validator =>
  (value) =>
    value.trim() === "" ? { ok: false, message } : { ok: true };

const maxLength =
  (max: number, message: string): Validator =>
  (value) =>
    value.length > max ? { ok: false, message } : { ok: true };

const pattern =
  (regex: RegExp, message: string): Validator =>
  (value) =>
    value !== "" && !regex.test(value) ? { ok: false, message } : { ok: true };

const orderFormSchema: FieldSchema[] = [
  {
    name: "customerName",
    rules: [
      required("お名前を入力してください"),
      maxLength(50, "お名前は50文字以内で入力してください"),
    ],
  },
  {
    name: "tel",
    rules: [pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません")],
  },
  {
    name: "shippingAddress",
    rules: [required("お届け先住所を入力してください")],
    when: (values) => values.shippingType === "other",
  },
];

describe("[heat-3] validateForm", () => {
  it("全フィールド OK なら空オブジェクトを返す", () => {
    const errors = validateForm(
      { customerName: "山田太郎", tel: "03-1234-5678", shippingType: "same" },
      orderFormSchema,
    );
    expect(errors).toEqual({});
  });

  it("NG のフィールドだけが FormErrors に載る", () => {
    const errors = validateForm(
      { customerName: "", tel: "03-1234-5678", shippingType: "same" },
      orderFormSchema,
    );
    expect(errors).toEqual({ customerName: "お名前を入力してください" });
  });

  it("フィールド内は最初の NG で打ち切り、後続ルールを実行しない", () => {
    const second = vi.fn<Validator>(() => ({ ok: true }));
    const schema: FieldSchema[] = [
      { name: "f", rules: [required("必須です"), second] },
    ];
    const errors = validateForm({ f: "" }, schema);
    expect(errors).toEqual({ f: "必須です" });
    expect(second).not.toHaveBeenCalled();
  });

  it("あるフィールドが NG でも、残りのフィールドは検証される（全フィールド分のエラーが揃う）", () => {
    const errors = validateForm(
      { customerName: "", tel: "abc", shippingType: "same" },
      orderFormSchema,
    );
    expect(errors).toEqual({
      customerName: "お名前を入力してください",
      tel: "電話番号の形式が正しくありません",
    });
  });

  it("when が false のフィールドは検証されず、エラーにも含まれない", () => {
    const errors = validateForm(
      { customerName: "山田太郎", tel: "", shippingType: "same", shippingAddress: "" },
      orderFormSchema,
    );
    expect(errors).toEqual({});
  });

  it("when が true になったら、そのフィールドも検証される", () => {
    const errors = validateForm(
      { customerName: "山田太郎", tel: "", shippingType: "other", shippingAddress: "" },
      orderFormSchema,
    );
    expect(errors).toEqual({
      shippingAddress: "お届け先住所を入力してください",
    });
  });

  it("when が false のとき、そのフィールドのルールは1つも実行されない", () => {
    const rule = vi.fn<Validator>(() => ({ ok: true }));
    const schema: FieldSchema[] = [
      { name: "f", rules: [rule], when: () => false },
    ];
    validateForm({ f: "値" }, schema);
    expect(rule).not.toHaveBeenCalled();
  });

  it("values にキーが無いフィールドは空文字として検証される", () => {
    // shippingType: "other" だが shippingAddress のキー自体が無い
    const errors = validateForm(
      { customerName: "山田太郎", shippingType: "other" },
      orderFormSchema,
    );
    expect(errors).toEqual({
      shippingAddress: "お届け先住所を入力してください",
    });
  });

  it("schema が空配列なら常に空オブジェクトを返す", () => {
    expect(validateForm({ anything: "値" }, [])).toEqual({});
  });

  it("values と schema を変更しない", () => {
    const values = { customerName: "", shippingType: "same" };
    const valuesSnapshot = { ...values };
    const schemaSnapshot = [...orderFormSchema];
    validateForm(values, orderFormSchema);
    expect(values).toEqual(valuesSnapshot);
    expect(orderFormSchema).toEqual(schemaSnapshot);
  });
});
