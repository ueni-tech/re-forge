# forge-15-aggregate-sale-status — 部分条件での販売ステータス集約

hankoya の `listing-variation-combo-logic.ts` の `aggregateSaleStatus` と、`listing-variation-combo-entry.ts` の各ピッカー同期から、**「一部の軸だけ指定して SKU を絞り、代表ステータスを返す」** ロジックを切り出した forge。

色ボタンだけ、色×径ボタンなど **粒度の異なるフィルタ** で `data-sale-status` を付ける。

## 練習の進め方

```bash
npx vitest forge-15-aggregate-sale-status
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `filterMatchedSkus` | `null` = その軸では絞らない |
| heat-2 | `pickSaleStatusFromMatches` | 在庫(3)優先ルール |
| heat-3 | `aggregateSaleStatus` | フィルタ + 集約の合成 |

## 実務との対応

- `syncColorButtons`: `aggregateSaleStatus(skus, btnLabel)` — 色だけ
- `syncDiameterButtons`: `aggregateSaleStatus(skus, label, btnBallDiameter)` — 色×径
- `syncLinesButtons`: 4引数すべて指定

**ロジック実装力の鍛え方**: 「可変個のフィルタ条件」と「集約ルール」を **分解してから合成** する練習。1関数にベタ書きすると迷子になりやすい箇所。
