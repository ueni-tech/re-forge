# [refactor/heat-1] spec.md — 答え合わせ用

**注意: kata/ で実際にリファクタしてから開くこと。**

## 想定の抽出範囲

- `calcTaxIncluded` → `Price.withTax(rate): Price`
- `applyDiscount` → `Price.discount(rate): Price`
- `formatYen` → `Price.toDisplay(): string`
- `isValidPrice` → **コンストラクタに吸収** (関数として残さない)

## 想定の Price API

forge-mino-01/heat-1 と同じ:

```ts
class Price {
  constructor(amount: number);
  withTax(rate: number): Price;
  discount(rate: number): Price;
  toDisplay(): string;
  toNumber(): number;
}
```

API が同じである必要はないが、もし違う設計を選んだなら、**なぜ違う設計を選んだか言語化する**。

## 自分の判断と比較する観点

### 「isValidPrice を関数として残すか」の判断

選択肢:
- (a) **コンストラクタに吸収して関数を削除**
- (b) `Price.isValid(amount)` という static method として残す
- (c) 関数のまま残す

想定解答は (a)。理由:

- `new Price(...)` が「存在すれば妥当」を保証するなら、外部で `isValidPrice` を呼ぶ必要がない
- 残すと「呼び忘れる箇所」と「呼んだ後に Price を作る冗長な箇所」が共存する
- ただし「Price を作る前に妥当性を確認したい場面」(例えばフォーム入力チェック) があるなら (b) も合理的

選択は文脈次第。**「自分の現場ならどちらか」を考えてみる**のが大事。

### 「priceOf ヘルパー関数を作るか」の判断

`getProductDisplayPrice` の中で何度も `new Price(product.price)` を書くと、エラーメッセージを揃えるためのコードが重複する。

```ts
function priceOf(product: Product): Price {
  try {
    return new Price(product.price);
  } catch (e) {
    throw new Error(`invalid price for product ${product.id}: ${(e as Error).message}`);
  }
}
```

これは「**変換層**」と呼ばれるパターン。`Product → Price` の変換と、それに伴うエラーメッセージの統一を1箇所に集約する。

別の選択肢として「`Product` 自体を `price: Price` 型に変える」もあるが、これは:
- API レイヤー(JSON で受け取る部分)で変換が必要になる
- DB から取得した時点で `Price` にする層が必要になる
- **影響範囲が大きい**ので、現時点ではやらない

「**抽出は小さく始める**」が refactor の鉄則。後で広げられる。

### 「price-utils.ts はどうなったか」

想定解答では、リファクタ後に `kata/price-utils.ts` の関数群は **使われなくなる**。

選択肢:
- (a) ファイルごと削除
- (b) 関数を `Price` への薄いラッパーとして残す (deprecated コメント付き)
- (c) そのまま残す (削除は別 PR)

業務コードでは (b) がよく使われる:

```ts
/** @deprecated Price クラスを使ってください */
export function calcTaxIncluded(price: number, rate: number): number {
  return new Price(price).withTax(rate).toNumber();
}
```

これは **「呼び出し箇所が大量にあって、一気に変えられないとき」** のテクニック。今回は呼び出し箇所が少ないので不要。

## 呼び出し側の before/after diff

### `getProductDisplayPrice` の変化

**before:**
```ts
export function getProductDisplayPrice(product, taxRate, discountRate): string {
  if (!isValidPrice(product.price)) {
    throw new Error(`invalid price for product ${product.id}`);
  }
  const taxIncluded = calcTaxIncluded(product.price, taxRate);
  const discounted = applyDiscount(taxIncluded, discountRate);
  return formatYen(discounted);
}
```

**after:**
```ts
export function getProductDisplayPrice(product, taxRate, discountRate): string {
  return priceOf(product).withTax(taxRate).discount(discountRate).toDisplay();
}
```

変化したもの:
- 行数: 6行 → 1行
- 中間変数: 2個 → 0個
- 妥当性チェック: 明示的に書く → 不要 (Price コンストラクタが保証)
- 順序: 名前から読む → メソッドチェーンで自然に表現

これが **「読み手が業務語彙だけで読める」状態**。`withTax → discount → toDisplay` という流れは、コードを読まなくても何が起きているか分かる。

### `calcTotalAmount` の変化

before の `for` ループが、after では `map().reduce()` のチェーンになっている。これは refactor の副産物ではなく、**Price クラスが値を返すようになったことで関数型スタイルが書きやすくなった**結果。

ただし `for` ループのまま残してもよい。**機械的に置き換えるのが refactor**。スタイルは別の判断。

## 観察ポイント: 「リファクタリングは移動である」

problem.md で書いた原則の確認:

| 元の場所 | 移動先 | 移動後 |
|---------|-------|--------|
| `calcTaxIncluded` の中身 | `Price.withTax` | ロジック自体は同じ。引数が `this.amount` になっただけ |
| `isValidPrice` の中身 | `Price` コンストラクタ | チェック自体は同じ。**書く場所が変わっただけ** |
| `formatYen` の中身 | `Price.toDisplay` | フォーマット処理は同じ |

リファクタは「**コードを書き換える**」のではなく「**コードを別の場所に移動する**」作業。これが安全網 (テスト) を保ったままできる理由。

新しいロジックを書くわけではないから、振る舞いは変わりようがない。

## 観察ポイント: refactor 系と forge 系の違い

forge-mino-01/heat-1 では「Price クラスをゼロから書く」だった。今回は「Price クラスに移動させる」だった。

| 観点 | forge 系 | refactor 系 |
|------|---------|------------|
| 開始状態 | 白紙 | 動くコード |
| 必要な思考 | 設計 | 抽出と移動 |
| 終了の判定 | テスト緑 | **テストが緑のまま変わらない** |
| 主な難しさ | 不変条件の設計 | 抽出範囲の判断、呼び出し側の書き換え範囲 |

両方を経験すると、「**設計とは何か**」が立体化する。

- forge 系: 「正しい設計」を**理想形として体に染み込ませる**
- refactor 系: 「散らかった現実」から「理想形」**へ橋を架ける作法**を学ぶ

実務では大半が refactor 系の状況。だが forge 系で「理想形」を知らないと、何に向かってリファクタすればいいか分からない。**両方が必要**。

## 観察ポイント: rule of three の判断

problem.md で「**rule of three**」に触れた。「3回現れたら抽出を考える」というルール。

このheatでは、`isValidPrice → calcTaxIncluded → applyDiscount → formatYen` のパターンが **`getProductDisplayPrice` と `calcTotalAmount` の 2箇所**に出ていた。厳密には2回なので rule of three には達していない。

それでも抽出した理由:

- パターンが**長い**(4関数の連鎖)
- `formatOriginalPrice` も `isValidPrice + formatYen` の2関数連鎖を持つ。広く見れば3箇所と数えられる
- ロジックの**重要度が高い**(価格計算はバグると業務影響が大きい)

rule of three は**機械的なルールではない**。「**繰り返しの数 × 重複の大きさ × バグった時の影響**」で判断する。

## 次のステップ

refactor/heat-1 を解き終えたら:

1. **forge-mino-01/heat-1 をまだ解いていなければ、ここで解く**。「ゼロから書く」体験と「抽出する」体験を両方持つことで学びが深まる
2. **現場のコードで同じ症状を探す**。csk が前回見せた変額選択コードにも、規模は違うが類似パターンがある
3. **refactor/heat-2 (Stock 抽出) に進む**
