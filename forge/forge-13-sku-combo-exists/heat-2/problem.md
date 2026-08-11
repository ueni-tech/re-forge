# [heat-2] 色 × 径 × 行数の組み合わせが存在するか判定する

## 実務での使われ方

`syncLinesButtons` は行数ボタンごとに `hasLinesForStateColorDiameter` を呼び、存在しない行数を非表示にする。

## やりたいこと

`hasLinesForStateColorDiameter(state, variationSkus, engravingLines)` を実装する。

## 合意済み仕様（この heat で握る挙動）

- 次を **すべて** 満たす行が1件でもあれば `true`:
  - `sku.label === state.label`
  - **径の条件**:
    - `state.ballDiameter === undefined` のとき → 径は問わない
    - それ以外 → `sku.ballDiameter === state.ballDiameter`（厳密等価）
  - `sku.engravingLines === engravingLines`（第3引数、厳密等価、`null` 可）
- 0件なら `false`

## 入出力

```ts
function hasLinesForStateColorDiameter(
  state: ComboState,
  variationSkus: VariationSku[],
  engravingLines: string | null,
): boolean;
```

## あなたが決めること

- 径条件を **if 分岐** で書くか **1つの boolean 式** にまとめるか
- `state.ballDiameter` と第3引数 `engravingLines` の役割の違い（heat-1 と同型の API）

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: 赤 × 0.7 × 2行 が存在
- **困った入力**: state に径無し、径付きで不一致
- **しないこと**: engravingLines を state から読む？
- **暗黙の決め**: `sku.ballDiameter === undefined` の行

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-2`
