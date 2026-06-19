// rowLabelToFilterTags — 解答

export function rowLabelToFilterTags(label: string): string[] {
  if (/^TEL＆FAX$/.test(label)) {
    return ["TEL", "FAX"];
  }

  const rules: { pattern: RegExp; tag: string }[] = [
    { pattern: /^(郵便番号＆)?住所$/, tag: "住所" },
    { pattern: /^社名or店名/, tag: "会社名・店名" },
    { pattern: /^部署or支店名$/, tag: "支社・支店・部署名" },
    { pattern: /^(役職＆)?氏名/, tag: "氏名" },
    { pattern: /^TEL$/, tag: "TEL" },
    { pattern: /^FAX$/, tag: "FAX" },
    { pattern: /^メールアドレス$/, tag: "メールアドレス" },
    { pattern: /^URL$/, tag: "ホームページ" },
    { pattern: /^登録番号$/, tag: "インボイス番号" },
    { pattern: /^キャッチコピー$/, tag: "キャッチコピー" },
  ];

  const rule = rules.find(({ pattern }) => pattern.test(label));
  return rule ? [rule.tag] : [];
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: 未知ラベル・空文字は [] を返す。呼び出し側（parseLGomLayout）で無視される。
//     戻り値は0件・1件・2件（TEL＆FAX のみ）のいずれか。
// A2. 保証: 例外を投げない。マッチしなくても [] を返すことを保証する。
// A3. ルールテーブル（配列 + find）を選んだ。if-else if の連鎖より追加・削除が1行で済む。
//     switch は文字列の完全一致にしか使えず正規表現を活かせない。
//     TEL＆FAX は2タグを返す唯一の特例なので、テーブルに含めずガードで先出しした。
//     テーブル内で ["TEL", "FAX"] を返そうとすると戻り値の型が
//     string[] | string[][] になり、呼び出し側の処理が複雑になる。
// A4. ラベル→タグのマッピングのみ担う。正規化（行番号・カッコ除去）は
//     extractRowLabel の仕事。重複除去は parseLGomLayout の仕事。
// ──────────────────────────────────────────────
