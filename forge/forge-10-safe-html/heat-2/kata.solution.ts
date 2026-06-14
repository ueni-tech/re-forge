// buildAttributes — 解答

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

export function buildAttributes(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join("");
}

// ── 設計メモ 参考回答（汎用4問 × この kata）──────────────
// A1. 境界: 空オブジェクトは ""。値が空文字でも name="" を出し、属性ごと
//     省略はしない。挿入順を保つ。
// A2. 保証/しないこと: 値は必ずエスケープする。属性名はそのまま（開発者が
//     書く信頼できる固定値で、エスケープすると正当な名前を壊しうる）。
// A3. なぜこの書き方: 先頭スペース込みで返すと `<div${...}>` にそのまま
//     埋め込め、呼び出し側の「属性があるかで空白を出し分ける」分岐が消える。
// A4. 役割分担: 属性組み立ては href/title/data-* など多数で要る。1関数に集約
//     してエスケープ漏れの穴を1箇所に閉じる。
// ──────────────────────────────────────────────
