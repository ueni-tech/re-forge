# [heat-1] 名入れ 1入力分の検証ループ

## 背景

PDP・カートでは名入れ input が複数あり、入力のたびに検証してメッセージを出し、**全体が通ったか** を submit ゲートに通知する必要がある。

本 heat では `createSideNameValidation` の中核である **1 input 分の検証〜表示〜集約** だけを切り出す。

## 作るもの

開発のガードレール。ファクトリ内部に以下を作る。

- 1入力分の検証実行器を作る
- 検証メッセージ表示器を作る
- 入力ごとの最新結果を保持する集約器を作る
- 集約結果を呼び出し側へ通知する通知器を作る（`onResultsChange` 省略時は no-op）

## 受け入れ条件

### 検証実行器

- 非 active 入力（`isActiveInput` が false）では **何もしない**（早期 return）
- `data-validation-rule` からルールセットを解決できない → その input を NG 扱いで集約器に記録
- `buildInput` が `undefined` → 同上
- 正常時: `buildInput` → `validateSideName` → 表示器 → 集約器更新 → 通知器

### 表示器

- OK ならメッセージ要素を空にする
- NG なら `ValidationResult.message` を `.js-validation-message` に表示
- メッセージ要素が無い場合は console エラーして return（throw しない）

### 集約器

- `HTMLInputElement` をキーに最新の ok/ng を保持
- 全 entry が true のときだけ `onResultsChange(true)`

### ファクトリ戻り値

- `{ init, syncValidationState }` の形で返す（本 heat では `init` / `syncValidationState` はスタブでよい）
- 検証実行器を heat-2/3 から呼べるよう、ファクトリ内部に閉じる

## 型

```ts
type CreateSideNameValidationOptions = {
  buildInput: (inputEl: HTMLInputElement) => ValidationInput | undefined;
  hasFont: (inputEl: HTMLInputElement) => boolean;
  isActiveInput?: (inputEl: HTMLInputElement) => boolean;
  findFontRadios: (inputEl: HTMLInputElement) => NodeListOf<HTMLInputElement> | undefined;
  findMaxLengthDisplayEl: (inputEl: HTMLInputElement) => HTMLElement | null | undefined;
  onResultsChange?: (allOk: boolean) => void;
};

function createSideNameValidation(
  options: CreateSideNameValidationOptions,
): { init: () => void; syncValidationState: () => void };
```

`validateSideName` / `resolveRuleSet` は `kata.ts` の fixture を import してよい。

## 実装者が決めること

- 集約器に `Map` を使うか
- 検証実行器を heat-2 から参照する方法（クロージャ内関数でよい）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-19-side-name-validation-ui/heat-1` でテストを通す
