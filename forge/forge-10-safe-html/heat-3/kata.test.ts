import { describe, it, expect } from "vitest";
import { renderProductList } from "./kata";

describe("renderProductList", () => {
  it("1商品を li/a で囲み、name と url をエスケープする", () => {
    expect(renderProductList([{ name: "Tea & Co", url: "/p?id=1&c=2" }])).toBe(
      '<ul><li><a href="/p?id=1&amp;c=2">Tea &amp; Co</a></li></ul>',
    );
  });

  it("複数商品を挿入順に区切りなしで連結する", () => {
    expect(
      renderProductList([
        { name: "A", url: "/a" },
        { name: "B", url: "/b" },
      ]),
    ).toBe('<ul><li><a href="/a">A</a></li><li><a href="/b">B</a></li></ul>');
  });

  it("name に含まれるタグを無害化する", () => {
    expect(
      renderProductList([{ name: "<script>alert(1)</script>", url: "/x" }]),
    ).toBe(
      '<ul><li><a href="/x">&lt;script&gt;alert(1)&lt;/script&gt;</a></li></ul>',
    );
  });

  it("0件なら空の ul を返す", () => {
    expect(renderProductList([])).toBe("<ul></ul>");
  });

  it("url の \" による属性ブレイクアウトを防ぐ", () => {
    expect(
      renderProductList([{ name: "x", url: '"><img src=x onerror=alert(1)>' }]),
    ).toBe(
      '<ul><li><a href="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;">x</a></li></ul>',
    );
  });
});
