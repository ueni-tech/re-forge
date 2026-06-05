# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 仕様の一次ソース

この heat の「合意済み仕様（握る挙動）」は `problem.md` に明記されている。
`spec.md` は設計の観察ポイント・判断の背景・代替案の比較を担う。

## 自分の契約と比較する観点

heat-3 はオーケストレーター。【契約】は「この関数だけが決めること」に絞れていたか確認する。

### ファクトリ呼び出しはイベントの外でやる

```ts
// ✅ 正しい
const showBlock = createBlock();     // 初期化時1回
const selectButton = createButton(); // 初期化時1回

picker.addEventListener("click", function (e) {
  // ...
  if (showBlock) showBlock(code);
  if (selectButton) selectButton(code);
});

// ❌ 誤り
picker.addEventListener("click", function (e) {
  const showBlock = createBlock();     // クリックのたびに DOM 再取得
  const selectButton = createButton(); // クリックのたびに副作用実行
  // ...
});
```

クリックのたびに呼ぶと:

1. DOM を毎回 `querySelector` するコストが発生する
2. `createButtonSwitcher` には初期化副作用がある。クリックのたびに「初期同期」が走ってしまう
3. テストで「ファクトリが1回だけ呼ばれる」という保証が崩れる

**「初期化はイベント登録前に1回」はこのパターンの核心ルール**。

### DI（依存性注入）にする理由

実務コード（`initListingVariationPicker`）は `createGalleryVariationSync` / `createCartVariationSync` を直接 import して呼ぶ。この forge では引数（DI）で受ける形にしている:

```ts
// 実務コード（直接 import）
import { createGalleryVariationSync } from "./listing-variation-goods-image";
const syncGallery = createGalleryVariationSync(); // テストでは DOM が必要

// forge（DI）
export function initVariantPicker(createBlock: FactoryFn, createButton: FactoryFn) {
  const showBlock = createBlock(); // テストではスタブを渡せる
```

DI にすることで:
- テストで `vi.fn()` を渡せる → DOM のセットアップが不要
- 「ファクトリが何回呼ばれたか」「どの code で sync 関数が呼ばれたか」を `toHaveBeenCalledWith` で検証できる

実務でも、DOM 依存の関数をテストする最も一般的なアプローチがこの DI パターン。「直接 import を引数に変える」だけでテスタビリティが劇的に変わる。

### null ガードが `if` で十分な理由

```ts
if (showBlock) showBlock(code);
if (selectButton) selectButton(code);
```

これは `showBlock?.(code)` とも書ける（optional call）。違いは:

- `if (showBlock)`: 明示的。`showBlock` が falsy な理由が「意図的な null」か「undefined」か読み取れる
- `showBlock?.(code)`: 簡潔。`showBlock` が `undefined` でも `null` でも動く

どちらでも挙動は同じ。可読性の好みによる。実務コード（`listing-variation-entry.ts`）は `if` を使っている。

### `closest("[data-code]")` でイベント委譲する

```ts
const btn = target.closest<HTMLElement>("[data-code]");
```

`e.target` は実際にクリックされた要素（button の中の span など）かもしれない。`closest` で「自身または祖先に `[data-code]` を持つ最も近い要素」を探す。

これを**イベント委譲（Event Delegation）**と呼ぶ。`.js-variant-picker` 全体にリスナーを1つ貼り、内側の各 button に個別にリスナーを貼らない。

利点:
- DOM に後から追加された button にも自動で効く
- リスナー数が1つで済む

### ページ構成を「知らない」設計

このコーディネーターは:

- `.js-variant-blocks` があるかどうか → 知らない（`createBlock()` が null を返せばそれだけ）
- `.js-variant-picker` の `data-initial-code` → 知らない（`createButton()` が内部で処理する）
- バリエーション SKU 一覧 → 知らない

**知っているのは「picker がある」「クリック時に code を取り出す」「2つの sync 関数に渡す」だけ**。

これが heat-1・heat-2 で「ファクトリに責務を閉じる」設計にした効果。各ファクトリが責務を完結させているので、コーディネーターは配線役に徹できる。

## 観察ポイント: 3つの heat がつながる全体像

```
initVariantPicker() の呼び出し時:
  ↓ createBlock() → showBlock または null
  ↓ createButton() → selectButton または null（初期化副作用も実行）
  ↓ picker に click リスナーを登録

click イベント発生時:
  ↓ closest で [data-code] を探す
  ↓ code を取り出す
  ↓ if (showBlock) → showBlock(code)    ← heat-1 の担当
  ↓ if (selectButton) → selectButton(code) ← heat-2 の担当
```

各 heat の責務:

| heat | 担当 | 「知っていること」 |
|------|------|------------------|
| heat-1 | `.js-variant-blocks` の表示切り替え | コンテナの存在・data-code の一致 |
| heat-2 | `.js-variant-picker` のボタン状態管理 + 初期同期 | picker の存在・initial-code・ボタン一覧 |
| heat-3 | 配線とイベント委譲 | picker の存在・クリック時の code 取り出し・両 sync への委譲 |

これが実務コードの設計意図。`listing-variation-goods-image.ts` が 139 行あっても読みやすいのは、「各内部関数がそれぞれ1つのことだけをやっている」から。
