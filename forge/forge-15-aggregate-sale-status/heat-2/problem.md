# [heat-2] マッチ行から代表販売ステータスを選ぶ

## 背景

フィルタ後の複数 SKU 行に対し、ピッカーボタンに付ける saleStatus を1つ決める。在庫あり（3）が1件でもあれば `"3"` を優先する。`dataset.saleStatus` は文字列。

## やること

`pickSaleStatusFromMatches(matched)` を実装する。

## 受け入れ条件

- `matched.length === 0` → `undefined`
- いずれか1行でも `saleStatus === 3` → `"3"` を返す（即 return してよい）
- それ以外 → 先頭行の `saleStatus` を文字列化して返す
  - `saleStatus` が falsy（0 含む）→ `"0"`
- 入力配列は変更しない
- フィルタはしない。最大値を取るのでもない

## 型

```ts
function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined;
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 在庫優先を for ループで書くか、`some` と先頭行参照に分けるか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-2` でテストを通す
