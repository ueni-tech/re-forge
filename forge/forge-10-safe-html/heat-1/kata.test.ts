import { describe, it, expect } from "vitest";
import { escapeHtml } from "./kata";

describe("escapeHtml", () => {
  it("& をエスケープする", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("< と > をエスケープする", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("ダブルクォートをエスケープする", () => {
    expect(escapeHtml('say "hi"')).toBe("say &quot;hi&quot;");
  });

  it("シングルクォートを &#39; にエスケープする", () => {
    expect(escapeHtml("it's ok")).toBe("it&#39;s ok");
  });

  it("複数の特殊文字が混在しても全て変換する", () => {
    expect(escapeHtml("a < b && c > d")).toBe("a &lt; b &amp;&amp; c &gt; d");
  });

  it("& を二重変換しない（< の変換結果の & を再変換しない）", () => {
    expect(escapeHtml("<")).toBe("&lt;");
  });

  it("空文字はそのまま空文字を返す", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("特殊文字がなければ入力をそのまま返す", () => {
    expect(escapeHtml("no special chars")).toBe("no special chars");
  });
});
