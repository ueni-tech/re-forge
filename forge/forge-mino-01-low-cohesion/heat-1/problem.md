# [heat-1] 価格: データとロジックを束ねる

## 実務での使われ方

EC サイトでありがちな「価格に関するユーティリティ関数」がプロジェクトのあちこちに散らばっている状態を、データに振る舞いを持たせる形に整える。

レガシー環境では以下のように書かれていることが多い:

```ts
// utils/price.ts
export function calcTax(price: number, rate: number): number { ... }
export function applyDiscount(price: number, rate: number): number { ... }
export function formatYen(price: number): string { ... }

// 呼び出し側
const taxIncluded = calcTax(item.price, 0.1);
const discounted = applyDiscount(taxIncluded, 0.2);
const display = formatYen(discounted);
```

price という値が、関数の引数として **何度も外を経由する**。これを「価格が自分でやる」形に変える。

## やりたいこと

価格を表す `Price` クラスを作る。価格データそのものに、税込計算・割引適用・表示用フォーマットの責務を持たせる。

## 入出力

```ts
class Price {
  constructor(amount: number);

  /** 税率を加算した新しい Price を返す */
  withTax(rate: number): Price;

  /** 割引率を適用した新しい Price を返す */
  discount(rate: number): Price;

  /** 表示用文字列 (例: "¥1,200") */
  toDisplay(): string;

  /** 数値として取り出したいとき */
  toNumber(): number;
}
```

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】と【設計の読解】に書く:

### 不正な値の扱い

- `new Price(-100)` を許す? エラー?
- `withTax(-0.1)` を許す?
- 「数値であれば何でも受け入れる」と「ドメイン的に妥当な値だけ受け入れる」のどちらを選ぶか。

### 戻り値の型

- `withTax`, `discount` は `Price` を返す? `number` を返す?
- もし `number` を返したら、呼び出し側は何ができてしまうか?

### 端数処理

- `1000 * 0.1` のような税計算で、小数が出たらどうする?
- 切り上げ・切り捨て・四捨五入のどれを選ぶ? なぜそれを選んだ?

### 不変性

- `withTax` の呼び出しで、元の `Price` の `amount` を書き換える? 新しいインスタンスを返す?
- 「書き換える」を選んだ場合、何が便利で、何が壊れるか?

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。詳細は [_sample/README.md](../_sample/README.md)。

| # | 質問 |
|---|------|
| 1 | **正常時** — 各メソッドは何を返す? 元の Price はどうなる? |
| 2 | **困った入力** — 負の金額、負の税率、100% を超える割引率は? |
| 3 | **しないこと** — 例外を投げる? 元のインスタンスを変更する? |
| 4 | **暗黙の決め** — 端数処理の方針、表示フォーマットの仕様 |

## 設計の問い(実装前に考える)

このheatの本質は **「関数を集約して整理する」ことと「クラスにする」ことの違い**にある。

ただ関数をひとつのファイルに集めるだけでも、ある程度の整理にはなる:

```ts
// utils/price.ts に集約済み
export const priceUtils = {
  calcTax(price, rate) { ... },
  applyDiscount(price, rate) { ... },
  formatYen(price) { ... },
};
```

これでも一見「凝集度が上がった」ように見える。だが本質的な問題は解決していない。

- `priceUtils.calcTax(price, rate)` と `new Price(price).withTax(rate)` は、何が違うか?
- 関数集約だけでは解決しない問題は何か?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-mino-01-low-cohesion/heat-1` でテストを通す
