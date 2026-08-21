# forge-19-side-name-validation-ui — 名入れ検証 UI ファクトリ

`side_name_validation` 再構築シリーズ **3/3**。

forge-18 の `validateSideName` を DOM に接続する **ファクトリ** を段階的に組み立てる forge。

## 前提

- forge-18 完了（`validateSideName` / `resolveRuleSet` が使える状態）
- forge-16 推奨（block 表示切替と `syncValidationState` の関係理解）

## チケットの読み方

**「作るもの」** = この heat 終了時に存在すべき責務（抽象）。  
**「受け入れ条件」** = jsdom テストで担保する挙動（具体）。

## 練習の進め方

```bash
npx vitest forge-19-side-name-validation-ui
```

## heat 構成

| heat | テーマ | 作るもの（要約） |
|------|--------|------------------|
| heat-1 | 検証ループ | 1入力分の検証実行器・結果表示器・結果集約器 |
| heat-2 | 入力イベント | IME 対応入力配線・デバウンス付き再検証配線 |
| heat-3 | 初期化・同期 | 初期化器・全件同期器・履歴復元対策・簡略 Input 組み立て器 |

## 実務との対応

| 統合先 | 内容 |
|--------|------|
| `createSideNameValidation.ts` | heat-1〜3 |
| `ui/adapters/pdp_build_validation_input.ts` | heat-3 の Input 組み立て器を実 DOM セレクタで置換 |
| `ui/adapters/pdp.ts` | boot + `carving-blocks:synced` リスナー（forge 外で配線） |

cart 側 adapter は pdp と同パターン。本 forge では **簡略 fixture 1種** のみ。
