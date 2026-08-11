# [heat-2] マッチ行から代表販売ステータスを選ぶ

## 実務での使われ方

フィルタ後の複数 SKU 行に対し、ピッカーボタンに付ける **1つの saleStatus** を決める。**在庫あり(3)が1件でもあれば "3"** を優先。

## やりたいこと

`pickSaleStatusFromMatches(matched)` を実装する。

## 合意済み仕様（この heat で握る挙動）

- `matched.length === 0` → `undefined`
- `matched` のいずれか1行でも `saleStatus === 3` → **`"3"`** を返す（即 return）
- それ以外 → **先頭行** の `saleStatus` を文字列化して返す
  - `saleStatus` が falsy（0 含む）→ **`"0"`**
- 入力配列は変更しない

## 入出力

```ts
function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined;
```

## あなたが決めること

- 在庫優先を **for ループ** で書くか `some` + 別処理か
- 戻り値を **string** に統一する理由（`dataset.saleStatus` は文字列）

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: 在庫行あり / なし
- **困った入力**: 空配列、先頭が saleStatus 0
- **しないこと**: フィルタ、最大値を取る
- **暗黙の決め**: 3 優先、 tie-break は先頭行

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-2`
