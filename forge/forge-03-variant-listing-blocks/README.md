# forge-03-variant-listing-blocks — 出品コードバリエーションとカートブロックの表示切替

業務リポジトリ（hankoya）の **`sample.html` で検討した方式**から、**`data-listing-code` で SKU を揃え、複数の `cartImageSp` ブロックを `hidden` で切り替える**ときの考え方を、DOM に依存しない形で切り出した forge です。

## 実務との対応（読み返し用）

| heat | エッセンス | hankoya でのイメージ |
|------|------------|----------------------|
| heat-1 | **可視フラグ** — 出品コードの並びと「選ばれた 1 つ」から、各行 `hidden` に相当する boolean 配列を決める | `.js-variant-cart-block` の `hidden` を一括で決めるロジックの核 |
| heat-2 | **祖先パス** — クリック起点から上へ辿った「ノード列」のうち、最初に `data-listing-code` を持つ値を取る | `closest('[data-listing-code]')` に相当（ルート内に限定する版） |
| heat-3 | **同期セッション** — ブロック配列の更新と `variationchange` 相当の通知を **1 エントリポイント**にまとめる | `selectListingCode` が hidden を直し `CustomEvent` を投げる一連の流れ |

## 練習の進め方

1. `heat-N/kata.ts` は **未実装スタブ**（`throw new Error("not implemented")`）から始まる。`kata.test.ts` と README の表を頼りに **kata.ts だけを実装**する。
2. 行き詰まったときだけ **`heat-N/kata.solution.ts`** を開き、仕様との対応を読む（写経より意図の理解を優先）。
3. `npx vitest forge-03-variant-listing-blocks` がすべてグリーンになるまで繰り返す。

```bash
npx vitest forge-03-variant-listing-blocks
```

## あえて入れていないもの

- 実 DOM / `HTMLElement` / `CustomEvent` のブラウザ実装 — ここでは **配列・コールバック・祖先チェーンのデータ**に圧縮している（re-forge 上でブラウザ API に依存しないため）。
- `cartImageSp` / `basket/index` / `followcart.js` — 本 forge は **「どのブロックを見せるか」の判断と通知の順序**だけを扱う。
