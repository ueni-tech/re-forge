# [heat-1] listingCode で名入れブロックを表示切替する

## 背景

ボールペン PDP では SKU（出品コード）ごとに名入れ書体セットや入力欄の HTML が異なる。PHP が `.js-carving-font-block` / `.js-carving-text1-block` / `.js-carving-text2-block` を並べ、各 block に `data-listing-codes="ST-A1 ST-A2"` のように **その block を使う SKU 一覧** を持たせる。

combo で SKU が確定したとき、**一致する block だけ表示**し、それ以外は `hidden` にする。あわせて block 内の `fieldset` も無効化する（非表示 block の input を送信・validation 対象にしない）。

## やること

`syncCarvingBlocks` を実装する。

## 受け入れ条件

対象セレクタ: `.js-carving-font-block`, `.js-carving-text1-block`, `.js-carving-text2-block`（document 全体を走査してよい）

各 block について:

1. `data-listing-codes` を空白で split したトークン列に `listingCode` が含まれる → `block.hidden = false`
2. 含まれない → `block.hidden = true`
3. block 直下に `fieldset` があるとき、表示中 block では `fieldset.disabled = false`、非表示では `true`
4. `data-listing-codes` が空・属性なし → 非表示扱い

- 属性値の split は `/\s+/`、空トークンは除外
- 1 block に複数 SKU が書かれていても、いずれか一致で表示

## 型

```ts
function syncCarvingBlocks(listingCode: string): void
```

## 実装者が決めること

- `querySelectorAll` の走査順（DOM 順のままか）
- `fieldset` が無い block への扱い（スキップでよい）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-16-carving-block-sync/heat-1` でテストを通す
