# [heat-2] 在庫: 複数の値を1つの概念にする

## 実務での使われ方

EC で「在庫数」と「在庫上限」が **常にペアで現れる** にもかかわらず、別々のプリミティブとして引き回されている状態を、ひとつの値オブジェクトに束ねる。

レガシー環境では以下のような関数が散らばっていることが多い:

```ts
function canAdd(stock: number, stockLimit: number, amount: number): boolean { ... }
function isOutOfStock(stock: number): boolean { ... }
function addStock(stock: number, stockLimit: number, amount: number): number { ... }

// 呼び出し側
if (canAdd(item.stock, item.stockLimit, 10)) {
  item.stock = addStock(item.stock, item.stockLimit, 10);
}
```

`stock` と `stockLimit` が**毎回ペアで引数に出てくる**。これは「2つの値が実は1つの概念である」というシグナル。

heat-1 では「データ + 操作」を束ねた。heat-2 では「**複数の関連プロパティ**」を束ねる。

## やりたいこと

在庫を表す `Stock` クラスを作る。「在庫数」と「在庫上限」をペアで保持し、追加・引当・判定の操作をクラス内に持たせる。

## 入出力

```ts
class Stock {
  constructor(quantity: number, limit: number);

  /** 指定数を追加した新しい Stock を返す。上限を超える場合は例外。 */
  add(amount: number): Stock;

  /** 指定数を引き当てた新しい Stock を返す。在庫不足なら例外。 */
  reserve(amount: number): Stock;

  /** 指定数を追加できるか */
  canAdd(amount: number): boolean;

  /** 指定数を引き当てられるか */
  canReserve(amount: number): boolean;

  /** 在庫切れか */
  isEmpty(): boolean;

  /** 現在の在庫数 */
  toQuantity(): number;
}
```

## 合意済み仕様（この heat で握る挙動）

- `new Stock(quantity, limit)`:
  - 負の値は例外
  - `quantity > limit` は例外（不正な組み合わせを許さない）
- `add(amount)`: 上限を超える追加は例外。元の `Stock` は変更せず新しい `Stock` を返す
- `reserve(amount)`: 在庫不足は例外。元の `Stock` は変更せず新しい `Stock` を返す
- `canAdd` / `canReserve`: 例外を投げず boolean を返す（事前判定用）
- `isEmpty`: `quantity === 0` のとき true
- `add` / `reserve` への負の amount は例外（`canAdd` / `canReserve` は単に false を返す）

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】と【設計の読解】に書く:

### 不正な組み合わせの扱い

- `new Stock(100, 50)` のように quantity > limit な状態を許す? 拒否?
- 「拒否する」を選んだとき、何が保証されるか?

### 「できるか判定」と「実行」の関係

- `canAdd` と `add` の関係は?
- `canAdd` が `false` のとき `add` を呼んだら、例外? それとも何もしない?
- 呼び出し側にどういう書き方を期待しているか:

```ts
// パターン A: 事前チェック
if (stock.canAdd(10)) {
  stock = stock.add(10);
}

// パターン B: 直接実行して失敗を例外で
try {
  stock = stock.add(10);
} catch (e) { ... }
```

### 不変性

- `add`, `reserve` は新しい Stock を返す? 元のインスタンスを変更する?
- heat-1 で考えたのと同じ問い。同じ答えになるか?

### 「在庫上限」をどこに持つか

- なぜ `Stock` が `limit` を持っている?
- もし「商品マスタが limit を持ち、Stock は quantity だけ」にしたら、どこで上限チェックをすることになるか?

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。詳細は [_sample/README.md](../_sample/README.md)。

| # | 質問 |
|---|------|
| 1 | **正常時** — add / reserve / canAdd / canReserve / isEmpty はそれぞれ何を返す? |
| 2 | **困った入力** — 負の数、上限超え、在庫不足、quantity > limit な初期化 |
| 3 | **しないこと** — 元のインスタンスを変える? 不正状態の Stock を作れる? |
| 4 | **暗黙の決め** — canAdd 後に add で失敗することはあるか(レースコンディションは考慮するか) |

## 設計の問い(実装前に考える)

このheatの本質は **「プリミティブを2個渡すこと」と「値オブジェクトを1個渡すこと」の差** にある。

- 関数のシグネチャが `(stock: number, limit: number, amount: number)` と `(stock: Stock, amount: number)` で何が違うか?
- 前者では呼び出し側が **間違える余地** がある。どう間違えうるか考えてみる。

ヒント: 引数の順番。同じ `number` 型が並んでいると、IDE は警告できない。

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-mino-01-low-cohesion/heat-2` でテストを通す
