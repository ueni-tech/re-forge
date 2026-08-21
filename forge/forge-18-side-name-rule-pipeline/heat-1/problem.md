# [heat-1] 名入れ上限の解決器

## 背景

名入れの文字数上限は **商品（バリエーション分類コード）× 書体** で決まり、和文を含むかどうかで **実効上限** が切り替わる。

本 heat では forge-18 後半が参照する **上限解決の層** だけを作る。文字の良否判定は forge-17 の責務。

## 作るもの

開発のガードレール。以下を満たす **解決器** を作る。

- 書体別上限（和文/英文）解決器を作る
- 入力内容に応じた実効上限決定器を作る

## 受け入れ条件

- 書体別上限解決器: `code` + `font` から `{ ja, en }` を返す。fixture の lookup に無い組み合わせは **例外を投げる**
- 実効上限決定器: 入力に日本語文字種（forge-17 の定義）が含まれれば `ja`、そうでなければ `en` を返す
- いずれも副作用・DOM 操作を持たない
- lookup テーブル自体は作らない（fixture 使用）

## 型

```ts
function resolveMaxLengthByScript(
  code: VariationClassificationCode,
  font: FontName,
): MaxLengthByScript;

function resolveEffectiveMaxLength(
  maxLengthByScript: MaxLengthByScript,
  value: UnverifiedValue,
): number;
```

型・lookup は `kata.ts` を参照。

## 実装者が決めること

- 日本語含有判定に forge-17 の `hasJapaneseScript` を import するか、heat 内に同梱するか
- 例外メッセージの文言

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-18-side-name-rule-pipeline/heat-1` でテストを通す
