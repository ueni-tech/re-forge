# [refactor/heat-2] 在庫: プリミティブ渡しの関数群から Stock クラスを抽出する

## 現状の症状

`before/stock-utils.ts` には、在庫に関する関数群が並んでいる:

```ts
isOutOfStock(quantity)
isStockFull(quantity, limit)
canAddStock(quantity, limit, amount)
canReserveStock(quantity, amount)
addStock(quantity, limit, amount)
reserveStock(quantity, amount)
```

そして `before/inventory.ts` で、これらが使われている。

特に目立つ症状:

- **`quantity` と `limit` が常にペアで関数の引数に並んでいる**
- 関数の引数に `number` が3つ並んでいる箇所がある (`canAddStock`, `addStock`)
- **引数の順番を間違える余地がある**: `canAddStock(quantity, limit, amount)` を `canAddStock(limit, quantity, amount)` と呼んでも型は通ってしまう
- `canXxx → Xxx` の二段呼び出しが繰り返されている
- `InventoryItem` 型は `stock` と `stockLimit` を別フィールドで持つ。**これは Stock 値オブジェクトに昇格すべき形**

forge-mino-01/heat-2 で扱った「プリミティブ型執着」の症状そのもの。

## やりたいこと

`Stock` クラスを抽出して、「在庫数と在庫上限」を1つの値オブジェクトに束ねる。
`inventory.ts` の呼び出し側を書き換える。`kata.test.ts` を緑のまま保つこと。

## あなたが決めること

### `InventoryItem` の構造を変えるか

最大の判断ポイント。3つの選択肢:

- (a) **`InventoryItem` はそのまま** (`stock: number, stockLimit: number`)。関数の中で `new Stock(...)` する
- (b) **`InventoryItem.stock` を `Stock` 型に変える** (`stock: Stock`, `stockLimit` フィールドは削除)
- (c) **新しい型を作る** (例: `InventoryItemWithStock`) を追加し、変換層を作る

それぞれの **トレードオフ** を考える:

| 選択肢 | 影響範囲 | 安全性 | 既存コードとの互換性 |
|--------|---------|--------|-------------------|
| (a) | 小さい | 中 | 高 (型シグネチャが変わらない) |
| (b) | 大きい | 高 | 低 (API レイヤーや DB レイヤーまで影響) |
| (c) | 中 | 高 | 中 (新旧並列) |

実際の現場では何が正解か。**自分の判断を JSDoc に書く**。

### 変換層を作るか

(a) を選んだ場合、関数の中で `new Stock(item.stock, item.stockLimit)` を毎回書くと、コードが冗長になる。

```ts
function stockOf(item: InventoryItem): Stock { ... }
function applyStockTo(item: InventoryItem, stock: Stock): InventoryItem { ... }
```

このような **変換層** を作るか、メソッドの中に直接書くか。トレードオフは:

- 変換層: 一箇所にまとまる。テストしやすい。**ただし「層」が増える**
- 直接書く: シンプル。ただし重複が出る

### `stock-utils.ts` の運命

抽出後、`stock-utils.ts` の関数群はどうする?
- 全削除?
- `Stock` クラスへの薄いラッパーとして残す?
- そのまま残して、`inventory.ts` だけリファクタ?

### 「canXxx → Xxx」の二段呼び出しをどうするか

before の `reserveOne` では:

```ts
if (!canReserveStock(item.stock, 1)) {
  throw new Error(...);
}
const newStock = reserveStock(item.stock, 1);
```

Stock クラスにすると、これは2通りの書き方が考えられる:

```ts
// パターン A: 既存の呼び出し側コードに近い
if (!stock.canReserve(1)) {
  throw new Error(`out of stock: ${item.id}`);
}
const newStock = stock.reserve(1);
```

```ts
// パターン B: Stock の例外をそのまま使う
try {
  const newStock = stock.reserve(1);
} catch {
  throw new Error(`out of stock: ${item.id}`);
}
```

`canReserve` で事前判定する意味は何か? `reserve` だけで済まないか? **意図的に冗長な API を提供する理由を言語化**する。

## JSDoc【契約】を書く考え方

forge-mino-01/heat-2 と同じ4問テンプレ。

| # | 質問 |
|---|------|
| 1 | **正常時** — add / reserve / canAdd / canReserve / isEmpty などはそれぞれ何を返す? |
| 2 | **困った入力** — 負の数、上限超え、在庫不足、quantity > limit な初期化 |
| 3 | **しないこと** — 元のインスタンスを変える? 不正状態を作れる? |
| 4 | **暗黙の決め** — canAdd 後に add が必ず成功するか? |

## 設計の問い(refactor 前に考える)

このheatの本質は **「プリミティブ型執着 (Primitive Obsession) の解消」** が、既存コードに対してどう効くか。

実装の前に考えてみる:

- `quantity, limit` を別々に持ち回ることで、**どんなバグが起きうるか**?
- 「`limit` を渡し忘れる」「`quantity` と `limit` を入れ替える」のような事故は、実際に起きうるか?
- Stock 型に束ねたとき、**型システムから受ける恩恵**は何か?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. **Step 1**: `kata/Stock.ts` を新規作成 (forge-mino-01/heat-2 と同等でよい)
2. **Step 2**: `kata/inventory.ts` で **`reserveOne` だけ** を Stock 使用に書き換える。テスト緑を確認
3. **Step 3**: `restock` を書き換える。テスト緑を確認
4. **Step 4**: `describeStockStatus` と `remainingCapacity` を書き換える
5. **Step 5**: `kata/stock-utils.ts` を整理 (削除 or ラッパー化)
6. **Step 6**: 全テスト緑を確認

```bash
npx vitest forge-mino-01-low-cohesion/refactor/heat-2
```
