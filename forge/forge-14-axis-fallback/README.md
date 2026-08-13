# forge-14-axis-fallback — 無効な軸組み合わせのフォールバック

hankoya の `listing-variation-combo-logic.ts` の `applyAxisFallbacks` / `pickMinAxisValue` から、**ユーザー操作で無効になった選択を自動補正する**ロジックを切り出した forge。

色を変えた直後、以前の径・行数が新しい色では存在しないことがある。このとき **最小の有効値** に寄せる。

## 練習の進め方

`problem.md` は **仕様書・チケット** として読む。JSDoc の書き方はチケットに書かない。チケットから、コードの隣に残す最小限を自分で蒸留する。

```bash
npx vitest forge-14-axis-fallback
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `pickMinAxisValue` | 重複除去 + 数値として最小の軸値を選ぶ |
| heat-2 | `applyAxisFallbacks` | 径 → 行数の順にカスケードフォールバック |

## 実務との対応

- `applyResolvedSelection` 内で `resolveSku` の前に `applyAxisFallbacks` を呼ぶ
- 色変更後も resolve が失敗しにくくなる

**ロジック実装力の鍛え方**: 「配列から代表値を1つ選ぶ」→「状態を見て複数段階で修正する」の順。**副作用のある state 修正**と**純粋な値選択**を分けて考える。

## 推奨順序

forge-13 を先に終えると heat-2 のヘルパー理解が楽。
