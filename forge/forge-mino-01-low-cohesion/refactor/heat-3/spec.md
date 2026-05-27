# [refactor/heat-3] spec.md — 答え合わせ用

**注意: kata/ で実際にリファクタしてから開くこと。**

## 想定の抽出範囲

`order-utils.ts` の関数群 → `OrderItems` のメソッド:

| 元 | 移動先 |
|---|--------|
| `addOrderItem(items, item)` | `OrderItems.add(item)` |
| `calcOrderTotal(items)` | `OrderItems.totalAmount()` |
| `hasHighPriceItemInOrder(items)` | `OrderItems.hasHighPriceItem()` |
| `countOrderItems(items)` | `OrderItems.count()` |
| `MAX_ORDER_ITEMS` | `OrderItems.MAX_ITEMS` (static) |
| `HIGH_PRICE_THRESHOLD` | OrderItems.ts 内のファイル定数 |

加えて、`order-service.ts` の**配列直接操作**を吸収するメソッドを追加:

- `OrderItems.highPriceItemNames()` — `listHighPriceItemNames` の中身を吸収
- `OrderItems.remainingCapacity()` — `remainingItemSlots` の計算を吸収

これらは forge-mino-01/heat-3 にはなかった。**呼び出し側の要求から育てた API**。

## 自分の判断と比較する観点

### 「`Order.items: OrderItem[]` をそのままにする」の判断

想定解答は **(a) 構造を変えない** + 変換層 (`itemsOf`, `applyItemsTo`)。

```ts
function itemsOf(order: Order): OrderItems {
  return new OrderItems(order.items);
}

function applyItemsTo(order: Order, items: OrderItems): Order {
  return { ...order, items: [...items.toSnapshot()] };
}
```

heat-2 の `stockOf / applyStockTo` と同じ構造。これは **「外部 API は変えず、内部のリッチネスだけ手に入れる」** という戦略。

ただし注意: 毎回 `new OrderItems(...)` するのでパフォーマンスコストがある。コピーが入るから O(n)。明細数が 10 個未満ならまったく問題ない。明細が数千件あるならボトルネックになる可能性がある。**規模で判断する**。

### 「閾値をファイル定数にする」の判断

想定解答:

```ts
// OrderItems.ts
const HIGH_PRICE_THRESHOLD = 5000;
```

選択肢の比較:

| 選択肢 | 利点 | 欠点 |
|--------|------|------|
| ファイル定数 | シンプル、外に漏れない | OrderItems と一緒にしか変えられない |
| static フィールド | 外部からも `OrderItems.HIGH_PRICE_THRESHOLD` で参照可能 | 「設定」として誤解される可能性 |
| コンストラクタ引数 | テストで差し替え可能 | 全呼び出し箇所で `new OrderItems(items, opts)` が必要 |
| 別ファイル | 設定として明示的 | OrderItems の責任が分散する |

この heat では「閾値はビジネスロジックの一部であり、OrderItems の責任範囲」と判断。**ファイル定数が一番素直**。

将来「閾値を動的に変えたい」となったら、その時点でコンストラクタ引数に昇格すればよい。**先回りしない**。

### 「配列を外に出す方法」の判断

想定解答は **`toSnapshot(): readonly OrderItem[]`** を提供。

```ts
toSnapshot(): readonly OrderItem[] {
  return this.items;
}
```

そして `applyItemsTo` で `[...items.toSnapshot()]` と展開する。

ポイント:

- 内部の `items` は `readonly OrderItem[]` 型。**TypeScript レベルで変更を弾く**
- `toSnapshot` は同じ readonly 配列を返す。**コピーしないので軽い**
- 外側で `[...]` で展開するときに**コピーが発生**する。これは `Order.items` に書き戻すために必要

forge-mino-01/heat-3 で議論した「型レベルの保護をどこまで信頼するか」と同じ判断。

### 「order-utils.ts の運命」

想定解答は **削除** (`order-service.ts` の import が全て `./OrderItems` を向くようになる)。

ただし**注意点**: kata.test.ts は `./kata/order-service` から `OrderItem` を import している。これは `order-service.ts` が `OrderItem` を re-export していることに依存している。リファクタの過程で誤って re-export を消すと、テストが import エラーで壊れる。

**「振る舞いを変えない」とは「呼び出し側コードが import している型・関数・名前も維持する」を含む**。これも refactor の鉄則。

## 呼び出し側の before/after diff

### `shouldAwardHighPricePoints` の変化 (最重要)

**before:**
```ts
export function shouldAwardHighPricePoints(order: Order): boolean {
  return order.items.some((item) => item.price >= 5000);
}
```

**after:**
```ts
export function shouldAwardHighPricePoints(order: Order): boolean {
  return itemsOf(order).hasHighPriceItem();
}
```

**消えたもの:**
- `order.items` への直接 `some` 呼び出し
- マジックナンバー `5000`
- 「価格に対する不等号判定」というロジック

**現れたもの:**
- `hasHighPriceItem()` という業務語彙
- ロジックが OrderItems の責任範囲に集約された

これが **「Tell, Don't Ask」** の実例。「`order.items` を `Ask` して自分で判定する」のではなく、「OrderItems に `Tell` する (=判定してもらう)」。

### `listHighPriceItemNames` の変化

**before:**
```ts
return order.items
  .filter((item) => item.price >= 5000)
  .map((item) => item.name);
```

**after:**
```ts
return itemsOf(order).highPriceItemNames();
```

before は **`5000` の閾値判定** と **「名前を抽出する」というロジック** の両方が `order-service.ts` に存在していた。after はその両方が `OrderItems` の中に隠れる。

将来、閾値が変わったときの **修正箇所は OrderItems.ts の1箇所だけ** になる。これが「ビジネスルールの散らばり」の収束。

### `describeOrder` の変化

**before:**
```ts
const count = countOrderItems(order.items);
const total = calcOrderTotal(order.items);
const hasHigh = hasHighPriceItemInOrder(order.items);
const highPriceMark = hasHigh ? "★" : "";
return `${highPriceMark}${count}件 ¥${total.toLocaleString("ja-JP")}`;
```

**after:**
```ts
const items = itemsOf(order);
const highPriceMark = items.hasHighPriceItem() ? "★" : "";
return `${highPriceMark}${items.count()}件 ¥${items.totalAmount().toLocaleString("ja-JP")}`;
```

3つの関数呼び出し (`countOrderItems`, `calcOrderTotal`, `hasHighPriceItemInOrder`) が、1つの `items` 値オブジェクトに対する3つのメソッド呼び出しになる。**「同じ対象に対する操作」であることが構造的に見える**。

## 観察ポイント: 「ビジネスルールの集約」が refactor の真の価値

before のコードでは、`5000` という閾値が:

- `order-utils.ts` の `HIGH_PRICE_THRESHOLD` 定数
- `order-service.ts` の `shouldAwardHighPricePoints` のリテラル
- `order-service.ts` の `listHighPriceItemNames` のリテラル

の **3箇所** に書かれていた (うち2箇所はマジックナンバー)。

after では、`OrderItems.ts` の `HIGH_PRICE_THRESHOLD` の **1箇所** だけ。

これがファーストクラスコレクションの最大の価値:

- **ビジネスルールが1箇所に集まる**
- **ルールが変わったときの修正箇所が予測可能**
- **「同じ判定」が複数箇所で偶然分岐するリスクが消える**

これはミノ駆動本の言葉で言えば **「同じロジックの分散」(Shotgun Surgery アンチパターン) の解消**。

## 観察ポイント: 「呼び出し側の要求から API が育つ」(再掲)

forge-mino-01/heat-3 にはなかった `highPriceItemNames` と `remainingCapacity` が、refactor 版では追加された。

理由: `order-service.ts` の `listHighPriceItemNames` と `remainingItemSlots` がそれを必要としていたから。

これが **「実需要から API を導く」** という設計姿勢。教科書的に「`OrderItems` クラスにあるべきメソッド」を想像して先に作るのではなく、**呼び出し側が必要としているものを発掘する**。

これは **YAGNI (You Aren't Gonna Need It)** という原則の実践。使われない API を作らない。後で必要になったら追加する。

## 観察ポイント: refactor 系3 heat を貫いて見えたこと

| heat | 抽出したもの | 主な学び |
|------|------------|---------|
| heat-1 (Price) | データ + 操作 | 「リファクタは移動である」 |
| heat-2 (Stock) | 複数プロパティの束ね | プリミティブ型執着の解消の効き目 |
| heat-3 (OrderItems) | コレクション + ルール | ビジネスルールの散らばりの収束 |

3 heat 共通の構造:

1. **変換層** (`xxxOf`, `applyXxxTo`) を作って、既存型を変えずに新しいクラスを使う
2. **小さなステップ** で書き換え、各ステップでテストを走らせる
3. **API は呼び出し側の要求から育てる**
4. **rule of three** で抽出のタイミングを判断する

これらは forge-mino-01 (白紙実装) では学べなかった、**refactor 特有の作法**。

## 次のステップ

refactor 系3 heat を解き終えた csk は、次のいずれかに進める:

1. **forge-mino-01 (白紙実装) をまだ解いていなければ、ここで解く**。同じ題材を2つの角度から経験することで学びが立体化する
2. **現場のコードに同じ症状を探す**。csk が前回見せた変額選択コードに当てはめてみる
3. **forge-mino-02 を作る** (コマンド・クエリ分離など、別テーマで refactor 系 forge を追加)
4. **journal を書く**。「今回の refactor 系 forge で学んだことを、現場のどのコードに当てはめたいか」を言語化する
