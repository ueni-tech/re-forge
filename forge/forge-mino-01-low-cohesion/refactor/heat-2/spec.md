# [refactor/heat-2] spec.md — 答え合わせ用

**注意: kata/ で実際にリファクタしてから開くこと。**

## 想定の抽出範囲

すべての `stock-utils.ts` 関数が `Stock` クラスに移動:

| 元 | 移動先 |
|---|--------|
| `isOutOfStock(q)` | `Stock.isEmpty()` |
| `isStockFull(q, l)` | `Stock.isFull()` |
| `canAddStock(q, l, a)` | `Stock.canAdd(a)` |
| `canReserveStock(q, a)` | `Stock.canReserve(a)` |
| `addStock(q, l, a)` | `Stock.add(a)` |
| `reserveStock(q, a)` | `Stock.reserve(a)` |

加えて、forge-mino-01/heat-2 にはなかった2つのメソッドを追加:
- `Stock.remainingCapacity()` — 上限と現在の差を返す
- `Stock.toLimit()` — 上限を取り出す (表示用)

これらは `inventory.ts` で **`describeStockStatus` と `remainingCapacity` が必要としている**から追加した。クラスの API は **呼び出し側の要求** から決まる。これが重要。

## 想定解答の構造

```ts
// solution/Stock.ts
class Stock {
  constructor(quantity, limit);
  add(amount): Stock;
  reserve(amount): Stock;
  canAdd(amount): boolean;
  canReserve(amount): boolean;
  isEmpty(): boolean;
  isFull(): boolean;
  remainingCapacity(): number;
  toQuantity(): number;
  toLimit(): number;
}
```

```ts
// solution/inventory.ts
function stockOf(item): Stock { ... }
function applyStockTo(item, stock): InventoryItem { ... }
```

## 自分の判断と比較する観点

### 「`InventoryItem` の構造を変えるか」の判断

想定解答は **(a) 構造を変えない** + 変換層 (`stockOf`, `applyStockTo`)。

理由:

- このリファクタの目的は **`inventory.ts` の読みやすさ向上** であり、外部 API の変更ではない
- `InventoryItem` を `stock: Stock` に変えると、API レイヤー (JSON 受け取り)、DB レイヤー (永続化) すべてに影響が及ぶ
- **「抽出は小さく始める」** が rule。後で大きくできる

将来 `Stock` の概念がもっと使われるようになったら、その時点で `InventoryItem.stock: Stock` への昇格を検討すればよい。**先回りした抽象化は害**。

### 「変換層を作るか」の判断

想定解答は変換層を作る:

```ts
function stockOf(item: InventoryItem): Stock {
  return new Stock(item.stock, item.stockLimit);
}

function applyStockTo(item: InventoryItem, stock: Stock): InventoryItem {
  return { ...item, stock: stock.toQuantity() };
}
```

理由:

- `new Stock(item.stock, item.stockLimit)` を4箇所で書くと、その都度引数の順番に気を遣う必要がある
- **変換のロジックを1箇所に集約**することで、もし `Stock` のコンストラクタが変わっても1箇所だけ直せばよい
- ファイル内ローカルな関数なので、抽象化のコストは低い

ただし「変換層を作るのが過剰」とも言える。**メソッド数が少ない** (ここでは reserve/restock/describe/remaining の4つだけ) なら、直接書いてもよい。

### 「`stock-utils.ts` の運命」の判断

想定解答は **削除** (kata/ に残っていてもよいが、import されないようになる)。

理由:
- 呼び出し箇所が `inventory.ts` のみで、その全てを書き換えたら不要
- 外部 export されていないので、削除が安全

業務コードで**ファイルを残す判断**をする場合は:
- 公開 API として外部パッケージに export している
- 呼び出し箇所が大量にあって一度に書き換えられない
- 段階的に移行する PR を分ける戦略

### 「canXxx と Xxx を両方持つ」の判断

想定解答は **両方持つ**:

```ts
canReserve(amount): boolean;
reserve(amount): Stock;  // 不可なら例外
```

理由は forge-mino-01/heat-2 と同じ:

- `canReserve` は **UI でボタンを有効化するか判定** のような **判定だけしたい場面** で使う
- `reserve` は **実行の意思表明**。失敗は異常事態として例外を投げる
- **問い合わせ (query) と実行 (command) を分ける** という設計姿勢

これがミノ駆動本7章で扱う **「コマンド・クエリ分離 (CQS)」** の最初の入口。次の forge-mino-02 で深掘りする予定のテーマ。

## 呼び出し側の before/after diff

### `reserveOne` の変化

**before:**
```ts
export function reserveOne(item) {
  if (!canReserveStock(item.stock, 1)) {
    throw new Error(`out of stock: ${item.id}`);
  }
  const newStock = reserveStock(item.stock, 1);
  return { ...item, stock: newStock };
}
```

**after:**
```ts
export function reserveOne(item) {
  const stock = stockOf(item);
  if (!stock.canReserve(1)) {
    throw new Error(`out of stock: ${item.id}`);
  }
  return applyStockTo(item, stock.reserve(1));
}
```

before は `item.stock` を裸で関数に渡している。after は `stock` という値オブジェクトに対する操作になっている。**「在庫に対して引き当てる」という業務的な意図**が、コードの構造から読める。

### `describeStockStatus` の変化

before は **`item.stock` と `item.stockLimit` を別々に持ち回って**判定:

```ts
if (isOutOfStock(item.stock)) return "在庫切れ";
if (isStockFull(item.stock, item.stockLimit)) return "在庫満杯";
return `在庫: ${item.stock}/${item.stockLimit}`;
```

after は **stock という単一の値オブジェクトに問い合わせる**:

```ts
const stock = stockOf(item);
if (stock.isEmpty()) return "在庫切れ";
if (stock.isFull()) return "在庫満杯";
return `在庫: ${stock.toQuantity()}/${stock.toLimit()}`;
```

「`item.stock` と `item.stockLimit` を別々に渡す」必要がなくなる。これが **プリミティブ型執着の解消** の直接的な効果。

## 観察ポイント: 型システムが守ってくれるもの

before の `canAddStock(quantity, limit, amount)` を、`canAddStock(limit, quantity, amount)` のように呼ぶことを TypeScript は止められない。全部 `number` だから。

after の `stock.canAdd(amount)` を `(amount: Stock)` で呼ぶことはありえない。**型が違うから**。

これが値オブジェクトの **静的な安全性**:
- 「**意味の違うデータを混同しない**」を、コンパイラに守らせる
- 「**渡し忘れ・順番ミス**」が構造的に起きない

ただし注意: TypeScript の `quantity: number, limit: number` で「両方 `number`」だと、ランタイムでは区別できない。**型を分けることで初めて区別される**。これが [プリミティブ型執着] からの脱却の核心。

## 観察ポイント: 「クラスの API は呼び出し側の要求から決まる」

forge-mino-01/heat-2 では `Stock` に `remainingCapacity` や `toLimit` はなかった。今回のリファクタで追加された。

なぜか? **`inventory.ts` がそれらを必要としていたから**。

これは設計の重要な原則:

- クラスの API を「**先に**」設計しすぎると、使われないメソッドを抱えることになる
- リファクタを通じて API を発掘するのは、**呼び出し側の実需要から API を導く** という健全なやり方
- 「使わない可能性のあるメソッド」を最初に作らないことで、**YAGNI 原則** (You Aren't Gonna Need It) を実践できる

forge-mino-01 では「教材として API を先に決めた」。実務では「リファクタを通じて API が育つ」のが普通。

## 観察ポイント: refactor の段階性

problem.md で **「Step 1 → Step 6」** を提示した。これは Fowler の Refactoring の作法そのもの:

1. 新しい構造 (Stock クラス) を**追加する** ← この時点で既存コードは動く
2. 呼び出し側を **1箇所ずつ** 新構造に向ける ← 各ステップでテスト緑を確認
3. 古い構造 (stock-utils) を**削除する** ← 全箇所が新構造を使うようになってから

各ステップが**独立してコミットできる**。途中で中断しても、コードは動く状態を保つ。

これが **「途中で電車を降りられる」リファクタの作法**。一気に変えて壊すのは、リファクタではなく**書き直し**。

## 次のステップ

refactor/heat-2 を解き終えたら refactor/heat-3 (OrderItems 抽出) に進む。
heat-3 は **「コレクションを内側に閉じる」** という別種の難しさが入ってくる。
