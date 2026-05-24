# forge-07-basket-param-prefill — カートパラメーター事前入力

商品詳細ページ（PDP）でユーザーが選んだ書体・サイズ等を sessionStorage に退避し、次画面のフォームで自動入力する一連の処理を、3段階の責務に分解して身につける forge。

## 練習の進め方

各 heat は2段階構成。詳細はリポジトリ直下の README を参照。

1. **段階A**: `problem.md` だけ読んで `kata.ts` を実装する
2. **段階B**: `spec.md` を開いて自分の判断と突き合わせ、テストを通す

```bash
npx vitest forge-07-basket-param-prefill
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `collectPayload` | DOM 走査の純粋関数化: 最小インターフェース型で受ける設計 |
| heat-2 | `parsePrefillData` / `getPrefillValue` | 失敗を握りつぶす安全なパースと、構造的なキー解析の責務分離 |
| heat-3 | `getStrategyKey` / `initForm` | Strategy テーブルによる分岐の表現と、DI によるオーケストレーション |

## 実務との対応

- カートボタン押下直前に DOM を走査し、選択状態を payload として組み立てて sessionStorage に保存
- 次画面ロード時に sessionStorage から読み出し、name 属性の構造から prefill 値を引いてフォームに適用
- input タイプ（radio / checkbox / text）ごとの適用方法の違いを Strategy テーブルで表現

レガシー jQuery 環境では「DOM を触る関数」と「ロジック」がベタ書きで混ざりがち。それを「**ロジックだけ純粋関数として切り出す**」「**DOM 依存を最小インターフェース型で抽象化する**」「**依存を DI する**」の3段階に分解するのがこの forge のテーマ。

## JSDoc 雛形について

- **【意図】** 必須。呼ぶ側にとっての価値を1〜2行で。
- **【契約】** 任意。各 heat の `problem.md`「JSDoc【契約】を書く考え方」の4問への答え。型と問題文で表現できないことだけ書く。
- **【設計の読解】** 任意。最小インターフェース型・DI・Strategy など、API 形状の理由。
- **【実装メモ】** 任意。自分が迷った判断があれば書く。

詳細はリポジトリ直下 [README.md](../../README.md) の「契約を書く考え方（4問）」を参照。
