# forge-17-side-name-validators — 名入れ文字の判定器

`aics_hankoya.ssl` の `side_name_validation` 再構築シリーズ **1/3**。

名入れテキストを **DOM なしの純関数** で判定する層を、判定器単位で積み上げる forge。完成後は `validators.ts` に相当するファイル群として統合する。

## シリーズ構成

| forge | テーマ | 統合先（目安） |
|-------|--------|----------------|
| **forge-17**（本 forge） | 文字判定器 | `validators.ts` |
| forge-18 | ルールパイプライン | `rules.ts` / `side_name_validation.ts` |
| forge-19 | 検証 UI ファクトリ | `createSideNameValidation.ts` |

推奨: **forge-16（block sync）→ forge-17 → 18 → 19 → 実務 diff**

## チケットの読み方

各 heat の `problem.md` には **「作るもの」** がある。これは実装手順ではなく **開発のガードレール**（この heat で生み出すべき責務の一覧）である。

- 「作るもの」= 何を切り出すか（抽象）
- 「受け入れ条件」= 業務側と握った挙動（具体）
- 内部アルゴリズム・ファイル分割・命名は **実装者が決めること**

## 練習の進め方

```bash
npx vitest forge-17-side-name-validators
```

1. **段階A**: `problem.md`（チケット）だけ読んで `kata.ts` を実装する
2. **段階B**: `spec.md` で答え合わせ、テストを通す

## heat 構成

| heat | テーマ | 作るもの（要約） |
|------|--------|------------------|
| heat-1 | 基本判定器 | 未入力・スペース・文字数の判定器 |
| heat-2 | 文字種判定器 | 日本語・半角カナ・全角英数字の判定器 |
| heat-3 | 許可文字判定器 | 拒否文字・許可外文字の判定器 |

## 渡すインフラ

`kata.ts` に文字クラス定数（`constants.ts` 相当）を同梱する。lookup テーブルや型の写経は本 forge の題材にしない。

## 実務との対応

- `validators.ts` — 本 forge 完了後に統合
- `constants.ts` — heat-3 までに段階的に fixture として渡す
