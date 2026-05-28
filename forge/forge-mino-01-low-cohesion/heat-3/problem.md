# [heat-3] 注文明細: コレクション操作を内側に閉じる

## 実務での使われ方

「注文明細の配列」を扱うコードが、どこからでも `filter`, `map`, `reduce`, `push` で直接操作できてしまう状態を、専用のクラスにラップして操作を制限する。

レガシー環境では以下のように書かれていることが多い:

```ts
type OrderItem = { name: string; price: number; quantity: number };

class Order {
  items: OrderItem[];  // public で外に晒している
}

// 呼び出し側
const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const hasDiscount = order.items.some(item => item.price >= 5000);
order.items.push(newItem);  // 上限チェックなしで追加できてしまう
order.items.splice(0, 1);  // 任意の削除も可能
```

各呼び出し側が **同じような集計ロジックを書く**。さらに、配列そのものを外に出しているため、**ビジネスルール(上限チェックなど)を回避して**操作できてしまう。

heat-1 では「単一のデータ」、heat-2 では「複数の関連プロパティ」、heat-3 では「**コレクション**」を束ねる。

## やりたいこと

注文明細のコレクションを表す `OrderItems` クラスを作る。配列を内部に隠し、業務ルールを守った操作だけを公開する。

## 入出力

```ts
type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

class OrderItems {
  static readonly MAX_ITEMS = 10;

  constructor(items?: OrderItem[]);

  /** 明細を1件追加した新しい OrderItems を返す。上限超過は例外 */
  add(item: OrderItem): OrderItems;

  /** 合計金額 */
  totalAmount(): number;

  /** 明細数 */
  count(): number;

  /** 高額(5000円以上の単価)が含まれるか */
  hasHighPriceItem(): boolean;

  /** 表示用に明細のスナップショットを返す(変更しても内部に影響しない) */
  toSnapshot(): readonly OrderItem[];
}
```

## 合意済み仕様（この heat で握る挙動）

- `new OrderItems(items?)`: 初期配列を **防衛コピー** して保持する
- `add(item)`: 上限到達は例外。元のインスタンスは変更せず新しいインスタンスを返す
- `totalAmount()`: 空のとき 0。`price * quantity` の合計を返す
- `count()`: 内部配列の長さを返す
- `hasHighPriceItem()`: 5000円以上の単価が含まれるか。空のときは false
- `toSnapshot()`: `readonly OrderItem[]` 型で返す（型レベルでの保護）

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】と【設計の読解】に書く:

### 配列の外への出し方

- `toSnapshot()` は配列をそのまま返す? コピーを返す? readonly をつけるだけ?
- 「そのまま返す」を選んだ場合、呼び出し側が `push` したら何が起こる?
- 「コピー」と「readonly」のトレードオフは?

### コンストラクタの引数

- `new OrderItems(items)` で渡された配列を、そのまま内部に持つ? コピーする?
- そのまま持つと、外から元の配列を書き換えられたら内部状態が変わってしまう

### 「高額判定」の閾値

- `hasHighPriceItem` の 5000 円という閾値を、どこに置く?
- メソッド内のマジックナンバー? 定数? コンストラクタ引数?
- それぞれのトレードオフ。

### イテレーションをどう許すか

- 外から `for (const item of orderItems)` のように回したい需要が来たとき、どうする?
- `Symbol.iterator` を実装する? `toSnapshot()` 経由にする?
- 公開するということは「配列であること」を約束することになる。何を約束したいか。

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。詳細は [_sample/README.md](../_sample/README.md)。

| # | 質問 |
|---|------|
| 1 | **正常時** — add, totalAmount, count, hasHighPriceItem は何を返す? |
| 2 | **困った入力** — 上限到達後の add、空のコレクションへの totalAmount |
| 3 | **しないこと** — 内部配列を外に晒す? 元のインスタンスを変更する? |
| 4 | **暗黙の決め** — toSnapshot の防衛コピー方針、上限の所在 |

## 設計の問い(実装前に考える)

このheatの本質は **「便利さを捨てて何を得るか」** というトレードオフにある。

`array.filter().map().reduce()` で済むことを、わざわざクラスにラップする。これは **書きやすさを犠牲にしている**。何のために?

- 何を得るか?
- 何を失うか?
- 「失うものより得るものが大きい」のはどういう状況か?

ヒント: 「今すぐ書くコード」と「半年後に読むコード」では、評価軸が違う。

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-mino-01-low-cohesion/heat-3` でテストを通す
