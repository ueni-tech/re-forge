import { describe, it, expect } from "vitest";
import { imageSetSignature, type FileRef } from "./kata";

describe("[heat-1] imageSetSignature", () => {
  it("base または一覧が空なら空文字", () => {
    expect(imageSetSignature("", [])).toBe("");
    expect(imageSetSignature(null, [])).toBe("");
    expect(imageSetSignature("https://x", [])).toBe("");
    expect(imageSetSignature("", [{ main: "1.jpg" }])).toBe("");
  });

  it("base と各 main:thumb を | と ; で連結する", () => {
    const files: FileRef[] = [
      { main: "a.jpg", thumb: "a_t.jpg" },
      { main: "b.jpg" },
    ];
    expect(imageSetSignature("https://cdn/x", files)).toBe(
      "https://cdn/x|a.jpg:a_t.jpg;b.jpg:",
    );
  });

  it("同一内容なら同じ文字列（再 render スキップ判定に使える）", () => {
    const a: FileRef[] = [{ main: "1.jpg", thumb: "1t.jpg" }];
    const b: FileRef[] = [{ main: "1.jpg", thumb: "1t.jpg" }];
    expect(imageSetSignature("B", a)).toBe(imageSetSignature("B", b));
  });

  it("base か main のどちらかが違えば文字列も変わる", () => {
    const files: FileRef[] = [{ main: "1.jpg" }];
    expect(imageSetSignature("A", files)).not.toBe(imageSetSignature("B", files));
    expect(imageSetSignature("B", [{ main: "1.jpg" }])).not.toBe(
      imageSetSignature("B", [{ main: "2.jpg" }]),
    );
  });
});
