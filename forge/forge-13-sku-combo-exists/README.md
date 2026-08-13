# forge-13-sku-combo-exists — SKU テーブル上の組み合わせ存在判定

hankoya の `listing-variation-combo-logic.ts` / `listing-variation-combo-entry.ts` から、**「この組み合わせは商品として存在するか」** を判定するロジックを切り出した forge。

多軸ピッカーでは、存在しない径・行数のボタンを **非表示（hidden）** にするために、SKU テーブルを走査する必要がある。

## 練習の進め方

`problem.md` は **仕様書・チケット** として読む。JSDoc の書き方はチケットに書かない。チケットから、コードの隣に残す最小限を自分で蒸留する。

```bash
npx vitest forge-13-sku-combo-exists
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `hasDiameterForStateColor` | 色 × 径の存在判定（`.some`） |
| heat-2 | `hasLinesForStateColorDiameter` | 色 × 径 × 行数（optional 径） |
| heat-3 | `collectDiametersForLabel` / `collectLinesForLabelDiameter` | テーブルから軸候補値を収集 |

## 実務との対応

- `syncDiameterButtons`: `hasDiameterForStateColor` で `btn.hidden = !hasCombo`
- `syncLinesButtons`: `hasLinesForStateColorDiameter` で同様
- `applyAxisFallbacks`: 候補値収集関数でフォールバック先を決める

**ロジック実装力の鍛え方**: 「配列の中に条件を満たす行があるか」と「条件に合う値を集める」の2パターンを、**同じ SKU テーブルに対して軸の組み合わせを増やしながら**練習する。
