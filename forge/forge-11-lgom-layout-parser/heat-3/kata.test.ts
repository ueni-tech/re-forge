import { describe, it, expect } from "vitest";
import { parseLGomLayout } from "./kata";

describe("parseLGomLayout", () => {
  it("基本: <br> 区切りの複数行をタグ配列に変換する", () => {
    expect(parseLGomLayout("1行目：社名or店名<br>2行目：役職＆氏名")).toEqual([
      "会社名・店名",
      "氏名",
    ]);
  });

  it("TEL＆FAX は TEL と FAX の2タグになる", () => {
    expect(
      parseLGomLayout(
        "1行目：郵便番号＆住所<br>2行目：社名or店名<br>3行目：TEL＆FAX"
      )
    ).toEqual(["住所", "会社名・店名", "TEL", "FAX"]);
  });

  it("TEL と FAX が別行でも同じタグを返す（重複なし）", () => {
    expect(
      parseLGomLayout(
        "1行目：郵便番号＆住所<br>2行目：社名or店名（大）<br>3行目：TEL<br>4行目：FAX"
      )
    ).toEqual(["住所", "会社名・店名", "TEL", "FAX"]);
  });

  it("<br/> 形式も正しく処理する", () => {
    expect(parseLGomLayout("1行目：住所<br/>2行目：氏名")).toEqual([
      "住所",
      "氏名",
    ]);
  });

  it("<br /> 形式（スペースあり）も正しく処理する", () => {
    expect(parseLGomLayout("1行目：住所<br />2行目：氏名")).toEqual([
      "住所",
      "氏名",
    ]);
  });

  it("同じラベルが複数行に出ても重複タグを除去する", () => {
    expect(parseLGomLayout("1行目：住所<br>2行目：住所")).toEqual(["住所"]);
  });

  it("全角カッコが含まれていても正しく処理する", () => {
    expect(
      parseLGomLayout("1行目：社名or店名（大）<br>2行目：役職＆氏名（大）")
    ).toEqual(["会社名・店名", "氏名"]);
  });

  it("空文字は空配列を返す", () => {
    expect(parseLGomLayout("")).toEqual([]);
  });

  it("null は空配列を返す", () => {
    expect(parseLGomLayout(null as unknown as string)).toEqual([]);
  });

  it("undefined は空配列を返す", () => {
    expect(parseLGomLayout(undefined as unknown as string)).toEqual([]);
  });

  it("未知のラベルのみの場合は空配列を返す", () => {
    expect(parseLGomLayout("1行目：未知のラベル")).toEqual([]);
  });
});
