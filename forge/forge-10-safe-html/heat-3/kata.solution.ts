// renderProductList — 解答

export type Product = { name: string; url: string };

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => ENTITIES[ch]);
}

export function renderProductList(products: Product[]): string {
  const items = products
    .map(
      (p) =>
        `<li><a href="${escapeHtml(p.url)}">${escapeHtml(p.name)}</a></li>`,
    )
    .join("");
  return `<ul>${items}</ul>`;
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: 0件は <ul></ul>。name/url が空でも構造は崩さない。
// A2. 保証/しないこと: name と url を必ず HTML エスケープする。URLエンコード
//     はしない（値が埋まる文脈は「HTML属性」だから）。整形もしない（1行）。
// A3. なぜこの書き方: map + join で区切りなし連結。テンプレートリテラルで
//     出力 HTML の構造を一目で読めるようにした。
// A4. 役割分担: 常に同じ <ul> 構造を返せば呼び出し側は el.innerHTML で差し込む
//     だけで済む。'' を返すと空表示の分岐が呼び出し側に漏れる。
// ──────────────────────────────────────────────
