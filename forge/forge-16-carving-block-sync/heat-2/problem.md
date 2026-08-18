# [heat-2] 表示中 block からドラフトを退避・復元する

## 背景

SKU を切り替えると名入れ block ごと HTML が入れ替わる。切替 **前** にユーザーが入力した書体・1行目・2行目を失わないよう、モジュール内の draft オブジェクトへ退避し、切替 **後** の表示 block に復元する。

実務では `captureDraftFromVisibleBlocks` → block 切替 → `syncCarvingFontChecked` → `applyDraftToVisibleBlocks` の順。

## やること

次の3関数と、テスト用の `getEngravingDraft` / `resetEngravingDraft` を実装する。

## 受け入れ条件

### DOM 前提

- root: `#order-option-carving`
- 表示中 block: `hidden === false` の block のうち、各セレクタで **最初の1件**
- 書体: `.js-carving-font-block` 内の `.js-carving-font-input:checked` の `value`（無ければ `""`）
- テキスト: `.js-carving-text1-block` / `.js-carving-text2-block` 内の `input[data-basket-param]` の `value`（無ければ `""`）

### `captureDraftFromVisibleBlocks()`

- 表示中 block から draft の3フィールドを上書きする
- 該当 block が無い軸は draft のそのフィールドを変更しない

### `syncCarvingFontChecked()`

- `#order-option-carving` 内の **すべて** の `.js-carving-font-input` の `checked` を一度 `false` にする
- 表示中 `.js-carving-font-block` 内で、`draft.carvingFontValue` と `value` が一致する input を `checked = true`
- 一致が無いときは、その block 内の **先頭** input を `checked = true`

### `applyDraftToVisibleBlocks()`

- 表示中 text1 block の `input[data-basket-param]` に `draft.textLine1` を代入
- 表示中 text2 block 同様に `draft.textLine2`

### draft の寿命

- モジュール内に1つだけ保持（シングルトン）
- `resetEngravingDraft()` で3フィールドを `""` に戻す
- `getEngravingDraft()` は現在 draft の **浅いコピー** を返す（テスト用）

## 型

```ts
export type EngravingDraft = {
  carvingFontValue: string;
  textLine1: string;
  textLine2: string;
};

function captureDraftFromVisibleBlocks(): void
function syncCarvingFontChecked(): void
function applyDraftToVisibleBlocks(): void
function getEngravingDraft(): EngravingDraft
function resetEngravingDraft(): void
```

## 実装者が決めること

- `getVisibleBlock` を root 内 query するか、document 全体か（root 内推奨）
- draft コピーの返し方（スプレッドで十分）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-16-carving-block-sync/heat-2` でテストを通す
