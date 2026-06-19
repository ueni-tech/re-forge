import { describe, it, expect } from "vitest";
import { extractRowLabel } from "./kata";

describe("extractRowLabel", () => {
  it("行番号プレフィックスを除去する", () => {
    expect(extractRowLabel("3行目：TEL＆FAX")).toBe("TEL＆FAX");
  });

  it("1行目のプレフィックスも除去する", () => {
    expect(extractRowLabel("1行目：郵便番号＆住所")).toBe("郵便番号＆住所");
  });

  it("全角カッコとその中身を除去する", () => {
    expect(extractRowLabel("2行目：社名or店名（大）")).toBe("社名or店名");
  });

  it("全角カッコが複数あってもすべて除去する", () => {
    expect(extractRowLabel("3行目：氏名（大）（ふりがな）")).toBe("氏名");
  });

  it("行番号なし・カッコなしの行は trim のみ行う", () => {
    expect(extractRowLabel("  住所  ")).toBe("住所");
  });

  it("空文字はそのまま空文字を返す", () => {
    expect(extractRowLabel("")).toBe("");
  });
});
