# forge-12-combo-state-patch — 多軸バリエーションの状態管理

hankoya の `listing-variation-combo-logic.ts` から、**SKU 行 ↔ ピッカー選択状態（ComboState）** の変換ロジックを切り出した forge。

多軸バリエーションでは「1クリック = listingCode 確定」ではなく、**状態オブジェクトを更新 → SKU を resolve** する。ここではその土台となる3関数を段階的に身につける。

## 練習の進め方

この forge の `problem.md` は **仕様書・チケット** として読む。JSDoc の書き方はチケットに書かない。チケットから、コードの隣に残す最小限を自分で蒸留する。

各 heat は2段階構成。詳細はリポジトリ直下の README を参照。

1. **段階A**: `problem.md`（チケット）だけ読んで `kata.ts` を実装する
2. **段階B**: `spec.md` を開いて自分の判断と突き合わせ、テストを通す

```bash
npx vitest forge-12-combo-state-patch
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `stateFromSku` | SKU 行からピッカー用の軸状態を組み立てる |
| heat-2 | `patchState` | 部分更新パッチの `undefined` 意味（上書きしない） |
| heat-3 | `resolveSku` | 軸状態から一意の SKU 行を find する |

## 実務との対応

- `initListingVariationCombo` 初期化: 初期 `listingCode` の行から `stateFromSku(row)` で state を作る
- ピッカークリック: `patchState(state, { ballDiameter })` などで state を更新
- 更新後: `resolveSku(state, variationSkus)` で `sku.code` を確定

**ロジック実装力の鍛え方**: この forge では「オブジェクトの形を決める」「部分更新の契約を守る」「find の条件を軸ごとに分解する」の3段階で、**状態を扱うロジックの基本パターン**を固める。

## JSDoc の書き方

詳細はリポジトリ直下 [README.md](../../README.md) の「JSDoc の書き方」。

1文で何のための関数かを書く。2文目は「別のやり方もできたが、こう決めたこと」。無ければ消す。
