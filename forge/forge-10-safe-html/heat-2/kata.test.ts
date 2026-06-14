import { describe, it, expect } from "vitest";
import { buildAttributes } from "./kata";

describe("buildAttributes", () => {
  it("複数属性を挿入順に連結し、先頭にスペースを付ける", () => {
    expect(buildAttributes({ class: "card", "data-id": "42" })).toBe(
      ' class="card" data-id="42"',
    );
  });

  it("値をエスケープする（ダブルクォート）", () => {
    expect(buildAttributes({ title: 'a "b"' })).toBe(' title="a &quot;b&quot;"');
  });

  it("値をエスケープする（アンパサンド）", () => {
    expect(buildAttributes({ href: "/p?id=1&c=2" })).toBe(
      ' href="/p?id=1&amp;c=2"',
    );
  });

  it("空オブジェクトは空文字を返す", () => {
    expect(buildAttributes({})).toBe("");
  });

  it("値が空文字でも属性を省略せず name=\"\" を出力する", () => {
    expect(buildAttributes({ disabled: "" })).toBe(' disabled=""');
  });

  it("単一属性でも先頭にスペースが付く", () => {
    expect(buildAttributes({ id: "main" })).toBe(' id="main"');
  });
});
