import { describe, it, expect } from "vitest";
import { rowLabelToFilterTags } from "./kata";

describe("rowLabelToFilterTags", () => {
  it("TEL＆FAX は TEL と FAX の2タグを返す", () => {
    expect(rowLabelToFilterTags("TEL＆FAX")).toEqual(["TEL", "FAX"]);
  });

  it("住所 → 住所", () => {
    expect(rowLabelToFilterTags("住所")).toEqual(["住所"]);
  });

  it("郵便番号＆住所 → 住所（郵便番号はフィルタ対象外）", () => {
    expect(rowLabelToFilterTags("郵便番号＆住所")).toEqual(["住所"]);
  });

  it("社名or店名 → 会社名・店名", () => {
    expect(rowLabelToFilterTags("社名or店名")).toEqual(["会社名・店名"]);
  });

  it("部署or支店名 → 支社・支店・部署名", () => {
    expect(rowLabelToFilterTags("部署or支店名")).toEqual(["支社・支店・部署名"]);
  });

  it("氏名 → 氏名", () => {
    expect(rowLabelToFilterTags("氏名")).toEqual(["氏名"]);
  });

  it("役職＆氏名 → 氏名（役職はフィルタ対象外）", () => {
    expect(rowLabelToFilterTags("役職＆氏名")).toEqual(["氏名"]);
  });

  it("TEL → TEL", () => {
    expect(rowLabelToFilterTags("TEL")).toEqual(["TEL"]);
  });

  it("FAX → FAX", () => {
    expect(rowLabelToFilterTags("FAX")).toEqual(["FAX"]);
  });

  it("メールアドレス → メールアドレス", () => {
    expect(rowLabelToFilterTags("メールアドレス")).toEqual(["メールアドレス"]);
  });

  it("URL → ホームページ", () => {
    expect(rowLabelToFilterTags("URL")).toEqual(["ホームページ"]);
  });

  it("登録番号 → インボイス番号", () => {
    expect(rowLabelToFilterTags("登録番号")).toEqual(["インボイス番号"]);
  });

  it("キャッチコピー → キャッチコピー", () => {
    expect(rowLabelToFilterTags("キャッチコピー")).toEqual(["キャッチコピー"]);
  });

  it("未知のラベルは空配列を返す", () => {
    expect(rowLabelToFilterTags("未知のラベル")).toEqual([]);
  });

  it("空文字は空配列を返す", () => {
    expect(rowLabelToFilterTags("")).toEqual([]);
  });
});
