# [heat-3] 軸状態から SKU 行を確定する

## 実務での使われ方

`applyResolvedSelection` は state を更新したあと `resolveSku(state, variationSkus)` で **1行に確定**し、`sku.code` を listingCode として共有コアに渡す。

## やりたいこと

`ComboState` と SKU 一覧を受け取り、条件に一致する **最初の1行** を返す `resolveSku` を実装する。

## 合意済み仕様（この heat で握る挙動）

- **`sku.label` は常に `state.label` と一致** すること（必須マッチ）
- `state.ballDiameter` が **`undefined` でない** とき、`sku.ballDiameter` も一致すること
- `state.engravingLines` が **`undefined` でない** とき、`sku.engravingLines` も一致すること
- `state.wrapping` が **`undefined` でない** とき、`sku.wrapping` も一致すること
- 一致行が **0件** → `undefined`
- 一致行が **複数件** → **先頭**（配列順で最初の1行）

## 入出力

```ts
function resolveSku(
  state: ComboState,
  variationSkus: VariationSku[],
): VariationSku | undefined;
```

## あなたが決めること

### 「undefined = この軸では絞らない」

- state に `ballDiameter` が無いとき、径が異なる行もマッチ候補になる。意図と合うか?
- 初期化直後は SKU 行由来の state なので全軸が載っている。色だけ変えた直後は径が古い値のまま——フォールバックは別関数の責務

### find の早期 return パターン

- `some` / `find` + 条件を1行に書く vs 複数 `if (不一致) return false`
- どちらが **条件を追加しやすい** か?

### 空配列

- `variationSkus` が `[]` のとき `undefined` でよいか?

## JSDoc【契約】を書く考え方

| # | 質問 |
|---|------|
| 1 | **正常時** — 全軸一致時に返る行 |
| 2 | **困った入力** — 部分一致のみ、0件、複数件 |
| 3 | **しないこと** — 例外、配列の並び替え |
| 4 | **暗黙の決め** — undefined 軸はフィルタしない |

### この heat への当てはめ（問いのみ）

- **正常時**: label + 径 + 行数が揃った state
- **困った入力**: label だけの state、存在しない組み合わせ
- **しないこと**: フォールバックで state を書き換える？
- **暗黙の決め**: 複数マッチ時の選び方

## 進め方

1. `problem.md` だけで `kata.ts` を実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-12-combo-state-patch/heat-3` でテストを通す
