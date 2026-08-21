# [heat-3] 名入れ許可文字の判定器

## 背景

名入れでは「使える文字の集合」が決まっており、集合外・明示拒否文字を検出する必要がある。forge-17 の判定器群が揃ったあと、**最終的な文字許可チェック** を担う器を作る。

## 作るもの

開発のガードレール。以下を満たす **判定器** を作る。

- 明示拒否文字検出器を作る
- 許可文字集合外検出器を作る（拒否文字検出器と合成可能な形でよい）

## 受け入れ条件

各判定器は **文字列を受け取り boolean を返す** 純関数とする。

- 明示拒否文字: fixture の `DENIED_CHARS` に1文字でも該当すれば true
- 許可外文字: 許可文字クラス外の文字が1文字でもあれば true
- 許可外文字: 明示拒否文字も許可外として扱う（単独の拒否検出器と結果が一致するケースがある）
- 許可記号の半角入力は **許可外判定の対象外**（forge-17 heat-2 の全角検出器の責務）
- 全角「」、。は **許可文字として通す**
- いずれも副作用・例外・DOM 操作を持たない

## 型

```ts
function hasDeniedCharacter(value: UnverifiedValue): boolean;
function hasDisallowedCharacter(value: UnverifiedValue): boolean;
```

## 実装者が決めること

- `hasDisallowedCharacter` が `hasDeniedCharacter` を内部で呼ぶか、1つの正規表現にまとめるか
- heat-1〜3 完了後、`validators.ts` 1ファイルにまとめるか、判定器ごとに分割するか

## 統合メモ（forge 外）

heat-1〜3 完了後、自分用 repo に `validators.ts` として統合する。export 名は実務コードと揃えてよい。

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-17-side-name-validators/heat-3` でテストを通す
