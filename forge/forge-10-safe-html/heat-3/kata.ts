// renderProductList — 難易度 ★★★
//
// 問題は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// ── 設計メモ（解く前に眺め、解いたら埋める）──────────────
// どの kata でも使える汎用の問い。答えがある項目だけ1〜2行で書く。
// Q1. 入力の境界（空・0件・想定外の値）で何を返すと決めたか?
//  →
// Q2. 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無）
//  →
// Q3. なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて）
//  →
// Q4. この処理は他でも要りそうか?（切り出す単位は適切か）
//  →
// ─────────────────────────────────────────────

export type Product = { name: string; url: string };

export function renderProductList(products: Product[]): string {
  throw new Error("not implemented");
}
