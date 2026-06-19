// parseLGomLayout — 解答

function extractRowLabel(line: string): string {
  return line
    .replace(/^\d+行目：/, "")
    .replace(/（[^）]*）/g, "")
    .trim();
}

function rowLabelToFilterTags(label: string): string[] {
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

export function parseLGomLayout(raw: string | null | undefined): string[] {
  if (!raw) return [];

  const normalized = raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&/g, "＆")
    .trim();

  const rows = normalized.split("\n").map(extractRowLabel).filter(Boolean);

  const tags: string[] = [];
  for (const label of rows) {
    for (const tag of rowLabelToFilterTags(label)) {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    }
  }
  return tags;
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: null / undefined / 空文字は [] を返す（ガードで早期 return）。
//     タグの順序は行の出現順を保つ（ソートしない）。重複は除去する。
// A2. 保証: 例外を投げない。戻り値は常に string[]。重複タグは除去済みを保証する。
// A3. パイプライン（normalize → split → map → filter → flatMap → deduplicate）。
//     重複除去は includes で行の出現順を保持した。Set を使うと順序は保証されるが、
//     「意図的に順序を保つ」姿勢を includes の方が明示しやすい。
//     商品1件あたり高々10行なので O(n²) コストは問題にならない。
// A4. 全体のパイプラインを組み立てる責務のみ担う。各変換の詳細はヘルパーに委ねる。
//     呼び出し側（block.list.php）は implode(',', ...) でCSV化するだけでよい。
// ──────────────────────────────────────────────
