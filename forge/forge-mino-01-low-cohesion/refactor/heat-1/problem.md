# [refactor/heat-1] 価格: 散らばった関数群から Price クラスを抽出する

## 現状の症状

`before/price-utils.ts` には、価格に関するユーティリティ関数群が並んでいる:

```ts
calcTaxIncluded(price, taxRate)
applyDiscount(price, discountRate)
formatYen(price)
isValidPrice(price)
```

そして `before/checkout.ts` で、これらが**毎回同じパターンで組み合わされている**。

- `isValidPrice` チェックが3つの関数で重複
- `calcTaxIncluded → applyDiscount → formatYen` の順序が `getProductDisplayPrice` と `calcTotalAmount` で重複
- 引数の `price: number` が「税込なのか割引後なのか」**型では区別できない**
- 同じ妥当性チェックを将来追加するたびに、書き忘れの事故が起きうる

これは forge-mino-01/heat-1 の「実務での使われ方」セクションに書いた状態そのもの。今回はそれを**実際にリファクタする**。

## やりたいこと

`Price` クラスを抽出して、価格データに振る舞いと不変条件を持たせる。`checkout.ts` の呼び出し側を新しいクラスを使うように書き換える。

**ただし、`kata.test.ts` を緑のまま保ち続けること**。これが refactor の鉄則。

## あなたが決めること(refactor 系では特に重要)

### 抽出範囲

- どの関数を「Price クラスのメソッド」にする?
- 抽出**しない**関数があるとしたら、どれ? それはなぜ?
- forge-mino-01 で見た API (`withTax`, `discount`, `toDisplay`, `toNumber`) と同じ形にする? それとも別の API を設計する?

### Price インスタンスを作る場所

- `new Price(product.price)` をどこで呼ぶ?
  - 呼び出し側 (`getProductDisplayPrice` の内側) で都度作る?
  - Product 型自体を `price: Price` に変える?
  - ヘルパー関数 (`priceOf(product)`) を作る?
- それぞれのトレードオフは?

### `isValidPrice` の運命

- 現状 `isValidPrice(price)` が3箇所で呼ばれている
- Price クラスを作ったら、これはどうなる?
  - クラス化すると **「不正な値で生成できない」** が保証される
  - 既存の関数は残す? 削除する? `Price` の static method にする?

### 呼び出し側の変更範囲

- リファクタは「最小限の変更で済ます」のが原則
- どこまで書き換える? 全関数? 一部だけ?
- 「ここは触らない」と決める箇所はある?

### 例外メッセージの互換性

- `before/checkout.ts` は `Error("invalid price for product p1")` を投げている
- リファクタ後も同じメッセージにする必要はないが、**振る舞いが変わらない**ことを保証する必要がある
- テストは「例外が投げられるか」だけ見ている。それでよしとする? メッセージも揃える?

## JSDoc【契約】を書く考え方

抽出する `Price` クラスにも、forge-mino-01 と同じく JSDoc を書く。

| # | 質問 |
|---|------|
| 1 | **正常時** — 各メソッドは何を返す? 元の Price はどうなる? |
| 2 | **困った入力** — 負の金額、負の税率、100% を超える割引率は? |
| 3 | **しないこと** — 例外を投げる? 元のインスタンスを変更する? |
| 4 | **暗黙の決め** — 端数処理、表示フォーマット |

加えて、refactor 系では**呼び出し側にも** JSDoc を加える価値がある:

```ts
/**
 * 【意図】商品の表示価格を「税込→割引→フォーマット」の順で返す
 *
 * 【設計の読解】Price クラスがコンストラクタで妥当性を保証するため、
 *   isValidPrice チェックは不要になった
 */
```

## 設計の問い(refactor 前に考える)

このheatの本質は **「リファクタリングは『書き換え』ではなく『移動』である」** ということ。

- 既存のロジック (calcTaxIncluded の実装) を**消すのではなく、Price.withTax に移動する**
- 既存の検証 (isValidPrice) を**消すのではなく、コンストラクタに移動する**
- 既存の表示処理 (formatYen) を**消すのではなく、toDisplay に移動する**

リファクタ後、`price-utils.ts` の関数群は **消えるか、Price への薄いラッパーになる**。これは「使用箇所の急な書き換えを避けるための一時的なブリッジ」として残すこともある。

実装が終わったら spec.md で答え合わせをする。

## 進め方

リファクタは「一気にやらない」のが鉄則。以下の段階を **テストを毎回走らせながら** 進める:

1. **Step 1**: `kata/Price.ts` を新規作成 (forge-mino-01/heat-1 と同じものでよい)
2. **Step 2**: `kata/checkout.ts` の `getProductDisplayPrice` だけを Price 使用に書き換える。テストを走らせて緑を確認
3. **Step 3**: `kata/checkout.ts` の `calcTotalAmount` を書き換える。テスト緑を確認
4. **Step 4**: `kata/checkout.ts` の `formatOriginalPrice` を書き換える。テスト緑を確認
5. **Step 5**: `kata/price-utils.ts` のうち、もう使われていない関数を削除 or 整理
6. **Step 6**: `kata.test.ts` を走らせて全テスト緑を最終確認

```bash
npx vitest forge-mino-01-low-cohesion/refactor/heat-1
```

**各 Step の後にテストを走らせる**。これが Fowler の Refactoring の作法。
