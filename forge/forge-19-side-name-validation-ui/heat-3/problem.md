# [heat-3] 名入れ検証の初期化・同期・Input 組み立て

## 背景

SKU 切替（forge-16）で名入れ block の active/inactive が変わるたび、検証対象とメッセージを **全体同期** する必要がある。また bfcache 復帰時はブラウザがフォーム値を復元する **前後** で検証タイミングがずれる。

## 作るもの

開発のガードレール。以下を作る。

- 検証対象 input の初期化器を作る
- 全 input の検証状態同期器を作る
- ブラウザ履歴復帰後の再検証配線を作る
- DOM から ValidationInput を組み立てる **簡略** Input 組み立て器を作る（fixture 用）

## 受け入れ条件

### 初期化器（`init`）

- 登録済み `data-validation-rule` を持つ input のみ走査
- 同スコープに書体ラジオが無い input はスキップ（warn）
- active input のみ初回 validate + 上限表示
- inactive でも input/書体の **イベント配線は付ける**（後から active 化に備える）
- 履歴復帰配線を1回だけ登録する

### 全件同期器（`syncValidationState`）

- 登録済み rule を持つ全 input を走査
- inactive 化: 集約器から削除 + メッセージクリア
- active: 集約器に未登録なら NG 仮置き → validate + 上限表示
- 最後に通知器を呼ぶ

### 履歴復帰配線

- `pageshow` 後、次タスク（`setTimeout 0`）で全 tracked input を再 validate + 上限表示
- リスナー多重登録を防ぐ

### 簡略 Input 組み立て器

- fixture の `.js-validation-scope` 内から、checked 書体ラジオの `data-basket-param` / `data-basket-value` と input の `value` で `ValidationInput` を返す
- scope 不在・書体未選択・lookup 外 code/font → `undefined`

## 型

```ts
// heat-1 の createSideNameValidation を完成させる

function buildValidationInput(inputEl: HTMLInputElement): ValidationInput | undefined;
```

`buildValidationInput` は heat-3 の kata または同ディレクトリで export し、テスト fixture と組み合わせてよい。

## 実装者が決めること

- init と sync の走査セレクタ（`validationRuleFieldSelector` 利用推奨だが必須ではない）
- 簡略 Input 組み立て器を adapter ファイルに分離するタイミング
- 実務 `pdp_build_validation_input.ts` との差分（visible block 優先など）は spec で確認

## 統合メモ（forge 外）

1. `createSideNameValidation.ts` として統合
2. `pdp.ts` で boot + `document.addEventListener("carving-blocks:synced", syncValidationState)`
3. 実務 `createSideNameValidation.test.ts` と diff

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-19-side-name-validation-ui/heat-3` でテストを通す
