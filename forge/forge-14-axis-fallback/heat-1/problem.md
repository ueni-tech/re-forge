# [heat-1] 軸値の配列から最小値を1つ選ぶ

## 実務での使われ方

`applyAxisFallbacks` は `collectDiametersForLabel` 等で得た **候補値の配列** から、フォールバック先として1つ選ぶ。実務では **数値として最小**（0.7 < 1.0）を採用。

## やりたいこと

`pickMinAxisValue(values: string[])` を実装する。

## 合意済み仕様（この heat で握る挙動）

1. **重複除去**: 同じ文字列は1回だけ残す（最初の出現順を維持）
2. **falsy 除外**: `""` など falsy な値は候補から除く
3. **ソート**: `parseFloat` で数値比較。`NaN` は **正の無限大** として扱い、末尾に回す
4. **返却**: ソート後の **先頭** 1件。候補0件なら `undefined`

## 入出力

```ts
function pickMinAxisValue(values: string[]): string | undefined;
```

## あなたが決めること

- 重複除去を `indexOf` で行うか `Set` で行うか
- ソートを **破壊的** `sort` か **非破壊** `[...unique].sort` か
- `"0.7mm"` のような非数値文字列は NaN → 末尾。実務データは `"0.7"` 形式

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: `["1.0", "0.7", "0.7"]` → `"0.7"`
- **困った入力**: `[]`, 全部 NaN, falsy 混在
- **しないこと**: 入力配列を変更する？（非破壊推奨だが破壊的 sort も許容）
- **暗黙の決め**: 同率最小の tie-break は出現順

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-14-axis-fallback/heat-1`
