# forge-16-carving-block-sync — SKU 切替時の名入れブロック同期

hankoya の A-1（名入れ書体・内容入力の連動）から、`listing-variation-carving-blocks.ts` の **「SKU 確定 → 名入れブロック表示切替 + 入力ドラフト保持」** を切り出した forge。

## 練習の進め方

`problem.md` は **仕様書・チケット** として読む。JSDoc の書き方はチケットに書かない。チケットから、コードの隣に残す最小限を自分で蒸留する。

```bash
npx vitest forge-16-carving-block-sync
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `syncCarvingBlocks` | `data-listing-codes` と `listingCode` で block 表示 + fieldset 有効化 |
| heat-2 | ドラフト capture / restore | 切替前の書体・テキストを退避し、表示 block に復元 |
| heat-3 | `applyCarvingSyncForListingCode` | capture → 表示切替 → restore → ラベル同期の順序 |

## 実務との対応（A-1）

| A-1 | 実務ファイル | この forge |
|-----|-------------|-----------|
| A-1-1 SKU 切替・draft | `listing-variation-carving-blocks.ts` | heat-1〜3 |
| A-1-2 書体 → プレビュー | `goods-order-options-sync.js`（`syncCarvingFontThumb` 等） | 範囲外（別 forge 候補） |
| A-1-3 combo 後の sync | `listing-variation-combo-entry.ts` が `applyCarvingSyncForListingCode` を呼ぶ | heat-3 完了後に実コードを読む |

**呼び出し関係**: `applyResolvedSelection` → `applyCarvingSyncForListingCode(sku.code)` → `#order-option-carving` 内の `.js-carving-*-block` が切り替わる。

## JSDoc の書き方

詳細はリポジトリ直下 [README.md](../../README.md) の「JSDoc の書き方」。
