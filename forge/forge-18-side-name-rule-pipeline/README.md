# forge-18-side-name-rule-pipeline — 名入れルールパイプライン

`side_name_validation` 再構築シリーズ **2/3**。

forge-17 の判定器を **Context + RuleStep 列** で評価し、`validateSideName` 相当の入口まで組み立てる forge。

## 前提

- forge-17 完了（または同等の判定器を自分用 repo に統合済み）
- 本 forge の `kata.ts` には lookup テーブル・型・判定器を fixture として同梱する

## チケットの読み方

`problem.md` の **「作るもの」** は開発ガードレール。手順の写経ではなく、「この heat 終了時に存在すべき責務」を抽象名詞で列挙している。

## 練習の進め方

```bash
npx vitest forge-18-side-name-rule-pipeline
```

## heat 構成

| heat | テーマ | 作るもの（要約） |
|------|--------|------------------|
| heat-1 | 上限解決 | 書体別上限の解決器・実効上限の決定器 |
| heat-2 | Context + 実行器 | 検証 Context 組み立て器・ルール実行器 |
| heat-3 | 入口 + ルールセット | 検証入口・名入れルールセット定義 |

## 実務との対応

| 統合先 | 内容 |
|--------|------|
| `side_name_validation.ts` | heat-1〜3 |
| `rules.ts` | heat-3 のルールセット・ルール名解決 |

forge-09（汎用バリデ分解）とは **パターンが異なる**。forge-09 完了後に取り組むと差分が見えやすい。
