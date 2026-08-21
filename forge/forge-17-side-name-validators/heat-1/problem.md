# [heat-1] 名入れ文字の基本判定器

## 背景

側面名入れでは、未入力・スペースの使い方・文字数上限を **入力文字列だけ** 見て判定する必要がある。alert や DOM は関与しない。

本 heat では、後続のルールエンジン（forge-18）が組み合わせる **原子判定器** の第一群を作る。

## 作るもの

開発のガードレール。以下を満たす **判定器** を作る。

- 未入力判定器を作る
- 先頭・末尾スペース検出器を作る
- 連続スペース検出器を作る
- 文字数上限超過判定器を作る

## 受け入れ条件

各判定器は **文字列（と必要なら数値）を受け取り boolean を返す** 純関数とする。

- 未入力: 空文字のみ true。空白だけの入力は本 heat では未入力扱いにしない
- 先頭・末尾スペース: 半角・全角スペースのいずれも検出する。文中の単一スペースは false
- 連続スペース: 半角・全角の混在連続も検出する。単一スペースは false
- 文字数上限: 上限を **超えた** 場合のみ true。ちょうど上限は false
- いずれも副作用・例外・DOM 操作を持たない

## 型

```ts
type UnverifiedValue = string;

function isEmpty(value: UnverifiedValue): boolean;
function hasLeadingOrTrailingSpace(value: UnverifiedValue): boolean;
function hasConsecutiveSpaces(value: UnverifiedValue): boolean;
function isOverMaxLength(value: UnverifiedValue, maxLength: number): boolean;
```

## 実装者が決めること

- 正規表現にするか、`trim` / 走査にするか
- 関数を1ファイルにまとめるか、heat 完了後の統合時に分割するか
- `isOverMaxLength` の `maxLength` が 0 以下のときの扱い（テスト対象外でよい）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-17-side-name-validators/heat-1` でテストを通す
