# 実務コード分析: なぜ `createGalleryVariationSync` はファクトリにしたのか

> このドキュメントは `listing-variation-goods-image.ts` / `listing-variation-cart.ts` / `listing-variation-entry.ts` の設計意図を、実務コードを読んで分析した記録。
> forge-08 の heat を始める前に読むと設計判断の文脈が分かる。

---

## 1. 最初の問い

```ts
// entry.ts
const syncGallery = createGalleryVariationSync();
const syncCart   = createCartVariationSync();
```

「なぜ `syncGallery(listingCode)` を直接 export せず、`createGalleryVariationSync()` というファクトリ経由にしたのか」

答えは1つではなく、**3つの設計意図が重なっている**。

---

## 2. 意図1: DOM 参照をクロージャに保持してキャッシュする

```ts
// listing-variation-goods-image.ts
export function createGalleryVariationSync() {
  const picker     = document.querySelector(".js-goods-variation_buttons"); // 1回だけ
  const viewerRoot = document.querySelector('[data-goods-image=""]');       // 1回だけ

  // ...内部関数群は picker と viewerRoot をクロージャ経由で参照する
  return applyGalleryForListingCode;
}
```

クリックのたびに `querySelector` を呼ばない。
`picker` と `viewerRoot` は初期化時に一度だけ確定し、以降はクロージャに閉じた参照を使い回す。

**なぜキャッシュが重要か:**

- `querySelector` は DOM ツリーを再帰的に走査するコスト（小さいが積み重なる）
- 「初期化時に DOM が存在するか確認する」という判定も一度で済む
- `picker` が確定した後に内部関数群が定義されるため、関数スコープが整然とする

**対照: `createCartVariationSync` はシンプル版**

```ts
export function createCartVariationSync() {
  const roots = document.querySelectorAll(".js-variant-listing-sync"); // 1回だけ
  if (!roots.length) return null;

  return function showBlockForListingCode(listingCode: string) {
    roots.forEach(...); // roots はクロージャ経由
  };
}
```

`roots`（NodeList）を閉じている。クリックのたびに `querySelectorAll` し直さない。

---

## 3. 意図2: 前提不在を `null` で表し、呼び出し側をシンプルにする

```ts
export function createGalleryVariationSync() {
  const picker = document.querySelector(".js-goods-variation_buttons");
  if (!picker) return null; // 前提不在 → null
  // ...
  return applyGalleryForListingCode; // 前提あり → 関数
}
```

```ts
// entry.ts — 呼び出し側
const syncGallery = createGalleryVariationSync(); // null or 関数
const syncCart    = createCartVariationSync();    // null or 関数

picker.addEventListener("click", function (e) {
  // ...
  if (syncGallery) syncGallery(listingCode); // null ガードだけ
  if (syncCart)    syncCart(listingCode);    // null ガードだけ
});
```

**`null` vs no-op の設計選択:**

| 戻り値 | 呼び出し側 | 「不在」の伝わり方 |
|--------|-----------|------------------|
| `null` | `if (syncGallery)` が必要 | 明示的。「この同期は使えない」 |
| no-op `() => {}` | 常に呼べる | 暗黙。バグが気づきにくい |

バリエーション UI がないページ（バリエーションなし商品）では `picker` が存在しない。
その場合に no-op を返すと「何も起きない」が「正常終了」と区別できなくなる。
`null` を返すことで entry.ts 側が「このページにギャラリー同期は不要」と判断できる。

---

## 4. 意図3: 初期化副作用をファクトリ呼び出し時に実行する

`createGalleryVariationSync` の中で、関数を `return` する**前**にこのコードが走る:

```ts
// listing-variation-goods-image.ts L131-L135
const initialCode = resolveInitialListingCode();
if (initialCode && hasVariationListingCode(initialCode)) {
  syncVariationUi(initialCode); // ← 副作用: DOM を書き換える
}

return applyGalleryForListingCode;
```

**この副作用が何をするか:**

- 現在選ばれている SKU のボタンを `is-selected` + `disabled` にする
- 品切れなら `.is-out-of-stock` を付与し、ステータスメッセージを表示する

**なぜファクトリの中でやるか:**

ページ読み込み時、サーバーが出力した HTML とJS が管理する UI 状態を一致させる必要がある。
これを「初期化が必要」として外に出すと、entry.ts 側がこうなる:

```ts
// もし副作用を外に出した場合（実際の設計ではない）
const syncGallery = createGalleryVariationSync();
if (syncGallery) {
  const viewer = document.querySelector('[data-goods-image=""]'); // 再取得が必要
  const initialCode = viewer?.getAttribute("data-goods-image-initial-listing-code");
  if (initialCode) syncGallery(initialCode); // 初期化を自分でやる
}
```

`viewer` の参照が entry.ts に漏れる。内部知識が外に出る。

**ファクトリに閉じることで:**

```ts
// 実際の設計
const syncGallery = createGalleryVariationSync(); // これだけで初期 UI が整う
```

「作るだけで初期状態が整う」モジュールになる。

---

## 5. 3つの意図の関係図

```
createGalleryVariationSync() 呼び出し時
  │
  ├─ [意図1] DOM をキャプチャ
  │    const picker     = querySelector(...)
  │    const viewerRoot = querySelector(...)
  │
  ├─ [意図2] 前提チェック
  │    if (!picker) return null; ← 呼び出し側に「不要」を伝える
  │
  ├─ 内部関数を定義（picker / viewerRoot をクロージャに閉じる）
  │    syncVariationButtonsState / syncOutOfStockClass / ...
  │
  ├─ [意図3] 初期化副作用を実行
  │    syncVariationUi(initialCode); ← 初期 UI を整える
  │
  └─ applyGalleryForListingCode を return
       ↓
       以降のクリックイベントで呼ばれる

applyGalleryForListingCode(listingCode) 呼び出し時
  │
  ├─ クロージャの viewerRoot.goodsImageSetVariation() を呼ぶ
  └─ syncVariationUi(listingCode) で UI を同期
```

---

## 6. クロージャに「閉じているもの」と「閉じていないもの」

```ts
// 閉じているもの（初期化時に確定する）
const picker     = document.querySelector(PICKER_SELECTOR);
const viewerRoot = document.querySelector('[data-goods-image=""]');

// 閉じていないもの（呼ぶたびに読み直す）
// ・data-goods-image-variations 属性 → readVariationsMap(viewerRoot) で毎回読む
// ・goodsImageSetVariation メソッド → 毎回 viewerRoot.goodsImageSetVariation を参照
//   （Web Component の初期化後に付くため、キャプチャ時点では存在しないことがある）
// ・listingCode → クリック時の引数として渡される
```

**「参照をキャッシュ」と「値のスナップショット」は別物。**
`viewerRoot` という DOM 要素への参照は閉じているが、その属性値は毎回読む。
これにより「要素が存在する DOM ノード」への参照は固定しつつ、「そのノードの現在の状態」は常に最新を得られる。

---

## 7. もし素の関数にしていたら

```ts
// 仮想の設計: ファクトリにしない場合
export function applyGalleryForListingCode(listingCode: string): void {
  const picker     = document.querySelector(PICKER_SELECTOR);     // 毎回
  const viewerRoot = document.querySelector('[data-goods-image=""]'); // 毎回
  if (!picker) return;
  // ...
}

// entry.ts
picker.addEventListener("click", function(e) {
  const listingCode = ...;
  applyGalleryForListingCode(listingCode); // picker 不在の判定が内側に隠れる
  // 初期化のためにもう一度呼ぶ?
  applyGalleryForListingCode(initialCode); // ← 呼ぶタイミングを entry.ts が知る必要がある
});
```

問題:

1. クリックのたびに DOM 再取得（コスト）
2. 「picker 不在ページでは何もしない」という情報が entry.ts 側から見えない
3. 初期化タイミングの責任が entry.ts に漏れる
4. テスト時に「ファクトリ呼び出しで初期 UI が整う」という単体テストが書けない

---

## 8. テスタビリティとの関係

`listing-variation-goods-image.test.ts`（Jest）はこのファクトリ設計のおかげでテストが書きやすい:

```ts
// テスト: 初期化副作用の確認
it("初期化: 有効な listingCode があるなら該当ボタンのみ selected", () => {
  mountGalleryFixture({ codes: ["ST-A1", "ST-A2"], initialListingCode: "ST-A1" });

  createGalleryVariationSync(); // ← 呼ぶだけで初期化副作用が走る

  expectVariationButtonSelected("ST-A1", true);
  expectVariationButtonSelected("ST-A2", false);
});
```

「ファクトリを呼ぶ = セットアップが完了する」という設計のおかげで、テストが「呼ぶだけ」で初期状態を検証できる。

---

## 9. まとめ: なぜファクトリにしたか

| 問い | 答え |
|------|------|
| クロージャで覚えておきたい設定値があったか? | 半分 Yes: 初期化時点の DOM 参照（`picker`, `viewerRoot`）を閉じている |
| 可変な設定を注入するためか? | No: 引数もなく、外から設定を渡すためのファクトリではない |
| 初期化副作用のためか? | Yes: ファクトリ呼び出し時に初期 UI 同期を実行するため |
| 前提不在を表現するためか? | Yes: picker がなければ `null` を返し、呼び出し側に「不要」を伝えるため |
| 命名の `create` の意味は? | 「同期コンテキストを構築し、初回同期まで済ませて、後続クリック用関数を返す」 |

**一言でいうと:**
「初期化の文脈（DOM 参照 + 初期同期）を確立し、その文脈に閉じたイベントハンドラを返すため」にファクトリにした。
