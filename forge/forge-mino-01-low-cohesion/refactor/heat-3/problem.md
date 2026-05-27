# [refactor/heat-3] 注文明細: 配列直接操作から OrderItems コレクションを抽出する

## 現状の症状

`before/order-utils.ts` には注文明細を扱う関数が並ぶ:

```ts
addOrderItem(items, newItem)
calcOrderTotal(items)
hasHighPriceItemInOrder(items)
countOrderItems(items)
```

これらは外部で `items: OrderItem[]` を引き回している。

そして `before/order-service.ts` には、より深刻な症状がある:

```ts
// shouldAwardHighPricePoints の中身
return order.items.some((item) => item.price >= 5000);

// listHighPriceItemNames の中身
return order.items.filter((item) => item.price >= 5000).map((item) => item.name);
```

これらは `order-utils.ts` の関数を**経由せず**、`order.items` を**直接 some / filter / map している**。さらに **`5000` という閾値がコピーされている** (order-utils.ts の `HIGH_PRICE_THRESHOLD` と一致しているが、別の場所に書かれている)。

これが「配列を外に晒したクラス」の典型症状:

- ビジネスルール (5000円という閾値) が**コードベースに散らばる**
- 同じ判定が**複数箇所に書かれて**、変更時に1箇所しか直し忘れる
- `order.items` への直接操作が**好き放題できる** (push / splice / 並べ替え)

## やりたいこと

`OrderItems` ファーストクラスコレクションを抽出して、配列を内部に隠す。
`order-service.ts` の呼び出し側を書き換える。`kata.test.ts` を緑のまま保つ。

## あなたが決めること

### `Order.items` の型をどうするか

これが heat-3 で一番大きな判断:

- (a) **`Order.items` は `OrderItem[]` のまま**。変換層で OrderItems インスタンスに変換
- (b) **`Order.items` を `OrderItems` 型に変える**。永続化レイヤーで変換
- (c) **新しい型 `RichOrder` を導入** (Order と並列に存在)

heat-2 の `InventoryItem.stock: number` をどうするかの判断と同じ構造。**今回も「抽出は小さく始める」の原則を適用するかどうか**。

### ビジネスルールをどこに置くか

`5000` という閾値の置き場所:

- (a) `OrderItems` クラス内のファイル定数 (`const HIGH_PRICE_THRESHOLD = 5000`)
- (b) `OrderItems` の static フィールド (`static readonly HIGH_PRICE_THRESHOLD = 5000`)
- (c) コンストラクタ引数として渡す (`new OrderItems(items, { highPriceThreshold: 5000 })`)
- (d) どこか別ファイル (`config/order.ts`)

**「変わりやすさ」と「使われる範囲」**で判断する。

### `OrderItems` の API として何を公開するか

`order-service.ts` を読んで、必要な公開メソッドを洗い出す。**呼び出し側の要求から API を導く**。

- `add(item)` - addItemToOrder で使う
- `totalAmount()` - getOrderTotal / describeOrder で使う
- `count()` - describeOrder / remainingItemSlots で使う
- `hasHighPriceItem()` - shouldAwardHighPricePoints / describeOrder で使う
- `highPriceItemNames()` - listHighPriceItemNames で使う
- `remainingCapacity()` - remainingItemSlots で使う

これらの一部は forge-mino-01/heat-3 にはなかったメソッド。**呼び出し側の要求から育てる**。

### 配列を外に出す方法

`order-service.ts` のリファクタ後、最終的に `Order` 型に書き戻すために `OrderItems → OrderItem[]` への変換が必要になる場面がある。3つの選択肢:

- (a) `OrderItems.toSnapshot(): readonly OrderItem[]` を提供し、`[...items.toSnapshot()]` で外に出す
- (b) `OrderItems.toArray(): OrderItem[]` (毎回コピーを返す)
- (c) `OrderItems.forEach(callback)` のように、外に出さずに反復だけ許す

**どこまで配列を晒すか**の判断。

### `order-service.ts` の `Order` 型の変更を含めるか

`order-service.ts` には `Order = { id, items: OrderItem[] }` という型がある。これを `items: OrderItems` に変える選択もある。ただしこれは外部 API を変える可能性がある (`Order` を import している箇所すべてに影響)。

今回は「`Order` 型は触らない」前提でリファクタするのが安全。

## JSDoc【契約】を書く考え方

forge-mino-01/heat-3 と同じ4問テンプレ。

加えて、refactor 系では:

- 「**変換層** (itemsOf, applyItemsTo) の責務」を JSDoc で明示
- 「**配列の防衛コピー** (`[...this.items]`) の意図」を【設計の読解】に書く

## 設計の問い(refactor 前に考える)

このheatの本質は **「ビジネスルールがコードベースに散らばる症状」** をどう収束させるか。

`5000` という閾値が `order-utils.ts` と `order-service.ts` の両方に書かれている。**これが将来 6000 に変わったら何が起きるか**?

- 片方だけ修正すると、判定がバグる
- grep で全箇所を見つけられるかは、命名次第
- テストで漏れを見つけられる保証はない

リファクタの目的の一つは、**こういう「変更の波及」をクラス内に閉じ込める**こと。これがファーストクラスコレクションの最大の価値の一つ。

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. **Step 1**: `kata/OrderItems.ts` を新規作成 (forge-mino-01/heat-3 と同等 + `highPriceItemNames` / `remainingCapacity` メソッドの追加)
2. **Step 2**: `kata/order-service.ts` の `addItemToOrder` を OrderItems 使用に書き換え。テスト緑を確認
3. **Step 3**: `getOrderTotal` を書き換え。テスト緑を確認
4. **Step 4**: `describeOrder` を書き換え。テスト緑を確認
5. **Step 5**: `shouldAwardHighPricePoints` と `listHighPriceItemNames` を書き換え (**配列直接操作を消す**)
6. **Step 6**: `remainingItemSlots` を書き換え
7. **Step 7**: `kata/order-utils.ts` を整理 (削除 or ラッパー化)
8. **Step 8**: 全テスト緑を最終確認

```bash
npx vitest forge-mino-01-low-cohesion/refactor/heat-3
```

**Step 5 が一番大事**。`order.items.some(...)` のような配列直接操作を、`items.hasHighPriceItem()` のような業務語彙の呼び出しに置き換える。これが OrderItems 抽出の真の効果。
