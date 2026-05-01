# forge-04-listing-variation-coordinator — 出品バリエーション: JSON マップ・初期コード・ギャラリー/カート同期の束ね方

業務リポジトリ（hankoya）の **`listing-variation-goods-image.ts` / `listing-variation-cart.ts` / `listing-variation-entry.ts`** から、**`data-goods-image-variations` の解釈**・**初期表示コードの決定**・**クリック時にギャラリー同期とカートブロック同期を順に呼ぶ** 3 層を切り出した forge です（DOM の `closest` や `goodsImageSetVariation` 本体は含めません）。

## 実務との対応（読み返し用）

| heat | エッセンス | hankoya でのイメージ |
|------|------------|----------------------|
| heat-1 | **`data-goods-image-variations` の JSON を安全に読む** — 不正・配列・パース失敗は `null` | `readVariationsMap` の `JSON.parse` とガード |
| heat-2 | **初期 listing code の決定** — 属性があれば優先、なければマップの先頭キー。マップにコードがあるかの判定 | `resolveInitialListingCode` と `hasVariationListingCode` |
| heat-3 | **ナビゲート 1 入口** — 空コードは何もしない。ギャラリー用・カート用のコールバックを **常にその順** で呼ぶ（未設定はスキップ） | `initListingVariationPicker` 内で `syncGallery` → `syncCart` を呼ぶ流れ |

## 練習の進め方

1. `heat-N/kata.ts` は **未実装スタブ**（`throw new Error("not implemented")`）から始まる。`kata.test.ts` と README の表を頼りに **kata.ts だけを実装**する。
2. 行き詰まったときだけ **`heat-N/kata.solution.ts`** を開き、仕様との対応を読む（写経より意図の理解を優先）。
3. `npx vitest forge-04-listing-variation-coordinator` がすべてグリーンになるまで繰り返す。

```bash
npx vitest forge-04-listing-variation-coordinator
```

## あえて入れていないもの

- 実 DOM（`document.querySelector`）、`HTMLElement`、`goodsImageSetVariation` の実装 — heat-3 は **コールバックの順序と有無**だけを検証する。
- `createGalleryVariationSync` 内部の「setter が関数か」「マップにコードがあるか」による early return — ギャラリー側のガードは **呼び出し元**で行う前提にし、本 forge の heat-3 は **束ね**だけを扱う。
