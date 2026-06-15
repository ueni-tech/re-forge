// renderProductList — 難易度 ★★★
//
// 問題は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 設計メモ（解く前に眺め、解いたら埋める）
 * どの kata でも使える汎用の問い。答えがある項目だけ1〜2行で書く。
 * Q1. 入力の境界（空・0件・想定外の値）で何を返すと決めたか?
 * →
 * Q2. 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無）
 * →
 * Q3. なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて）
 * →
 * Q4. 前後の処理との役割分担は適切か?（この関数が担うこと・担わないこと）
 * →
 *
 * メモ（Q1〜Q4 に当てはまらない気づき・判断根拠。空欄可）
 * →
 */

// 型定義（与えられた契約・変更不要）
export type Product = { name: string; url: string };

// --- 実装 ---
// problem.md のシグネチャに従って renderProductList を自分で宣言・実装する。
// 引数・戻り値の型を自分で設計するのが狙い（export 名はテストに合わせる）。

export function renderProductList(products: Product[]): string{
  // 外側のulは固定
  // liのビルダーを作る
  //  name, url をエスケープして同名の変数に格納
  //  テンプレートリテラルに埋め込み
  //  ulにappendChild
  // li ビルダーを products の要素分ループする
  // html を返却する
  const regex = /[&<>"']/g;
  const escapeMap: Record<string, string> =  {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  const outerHTML = document.createElement("ul");

  function escapeHTML(html: string){
    html.replace(regex, function(match) {
      return escapeMap[match];
    });
  }
  
  function listBuilder(product: Product) {
    const escapedName = escapeHTML(product.name);
  }
}