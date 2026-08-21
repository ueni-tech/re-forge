# [heat-2] 名入れ文字種の判定器

## 背景

名入れでは書体によって日本語可否が変わる。ルール適用の前段として、入力文字列に **どの文字種が含まれるか** を判定する器が必要である。

本 heat では forge-18 の Context 組み立て・ルール分岐が参照する **文字種判定器** を作る。

## 作るもの

開発のガードレール。以下を満たす **判定器** を作る。

- 日本語文字（ひらがな・全角カタカナ・漢字・々・〇）検出器を作る
- 半角カタカナ検出器を作る
- 半角強制対象の全角英数字・記号検出器を作る

## 受け入れ条件

各判定器は **文字列を受け取り boolean を返す** 純関数とする。

- 日本語検出器: ひらがな・全角カタカナ・漢字・々・〇 を含めば true。半角カナ・英字は false
- 日本語検出器: 全角中点（・）は **日本語として数えない**
- 日本語検出器: 全角「」、。は **日本語として数えない**（別ルールの例外記号）
- 半角カタカナ検出器: 半角カナ1文字でも含めば true
- 全角英数字・記号検出器: 許可記号のうち **半角入力を強制する対象** が全角で入力されていれば true
- 全角英数字・記号検出器: 全角「」、。は **検出しない**（例外）
- いずれも副作用・例外・DOM 操作を持たない

文字クラス定数は `kata.ts` の fixture を使う。定数の中身を自分で設計し直す必要はない。

## 型

```ts
function hasJapaneseScript(value: UnverifiedValue): boolean;
function hasHalfWidthKatakana(value: UnverifiedValue): boolean;
function hasAllowedCharWithFullwidthInput(value: UnverifiedValue): boolean;
```

## 実装者が決めること

- Unicode プロパティ（`\p{}`）を使うか、文字クラス定数から `RegExp` を組むか
- 日本語検出と半角カナ検出の判定順序（本 heat では独立関数のため、呼び出し側の責務）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-17-side-name-validators/heat-2` でテストを通す
