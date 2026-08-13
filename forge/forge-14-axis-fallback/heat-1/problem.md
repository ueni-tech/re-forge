# [heat-1] 軸値の配列から最小値を1つ選ぶ

## 背景

`applyAxisFallbacks` は `collectDiametersForLabel` 等で得た候補値の配列から、フォールバック先を1つ選ぶ。実務では数値として最小（0.7 < 1.0）を採用する。

## やること

`pickMinAxisValue(values: string[])` を実装する。

## 受け入れ条件

1. 重複除去: 同じ文字列は1回だけ残す（最初の出現順を維持）
2. falsy 除外: `""` など falsy な値は候補から除く
3. ソート: `parseFloat` で数値比較。`NaN` は正の無限大として末尾に回す
4. 返却: ソート後の先頭 1件。候補 0件なら `undefined`

## 型

```ts
function pickMinAxisValue(values: string[]): string | undefined;
```

実務データは `"0.7"` 形式。`"0.7mm"` のような非数値は NaN → 末尾。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 重複除去を `indexOf` で行うか `Set` で行うか
- 入力配列を変更するか（非破壊が扱いやすいが、破壊的 `sort` でもテストは通る）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-14-axis-fallback/heat-1` でテストを通す
