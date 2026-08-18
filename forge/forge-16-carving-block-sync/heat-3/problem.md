# [heat-3] SKU 切替オーケストレーターと書体ラベル同期

## 背景

combo で SKU が確定するたびに、名入れ UI 全体を **1つの入口** から同期する。実務の `applyCarvingSyncForListingCode` は次の順序で呼ぶ:

1. 表示中 block から draft へ capture
2. listingCode で block 表示切替（heat-1）
3. draft から書体 checked を復元（heat-2）
4. draft からテキスト input を復元（heat-2）
5. 表示中 checked 書体を `.js-carving-font-label` へ反映

A-1-2 のプレビュー画像同期は別モジュール（`goods-order-options-sync.js`）の責務。

## やること

`applyCarvingSyncForListingCode` と `syncCarvingFontLabel` を実装する。

heat-1 / heat-2 のロジックを **このファイル内に持ってよい**（コピー・統合どちらでも可）。

## 受け入れ条件

### `applyCarvingSyncForListingCode(listingCode)`

上記 1〜5 を **この順** で実行する。途中で root `#order-option-carving` が無くても例外は投げない（該当処理をスキップ）。

### `syncCarvingFontLabel()`

- 表示中 `.js-carving-font-block` の checked `.js-carving-font-input` の `value` を読む
- document 内の **すべて** の `.js-carving-font-label` の `textContent` をその値にする
- 表示中 font block が無い、checked が無い → 何もしない

### 統合テストで期待する挙動

- SKU A2 で text1 に入力 → SKU A1 へ切替 → 非表示だった A1 block に **同じ text1** が入っている
- SKU A2（2行あり）→ A1（1行のみ）→ A2 に戻す → text2 の値が draft から復元される
- A2 で「ゴシック体」選択 → A1 block（6font テンプレ）へ切替 → draft の「ゴシック体」が checked（存在しなければ先頭）
- `applyCarvingSyncForListingCode` 実行後、複数箇所の `.js-carving-font-label` が checked 書体と一致

## 型

```ts
function applyCarvingSyncForListingCode(listingCode: string): void
function syncCarvingFontLabel(): void
```

## 実装者が決めること

- heat-1/2 の helper を private 関数に分けるか、ベタ書きか
- `syncCarvingFontLabel` を orchestrator の最後だけで呼ぶか（実務どおり最後でよい）

## 進め方

1. 必要なら heat-1 / heat-2 の solution を参照してから実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-16-carving-block-sync/heat-3` でテストを通す
