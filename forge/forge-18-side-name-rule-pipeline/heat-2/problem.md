# [heat-2] 名入れ検証 Context とルール実行器

## 背景

個別判定器（forge-17）と上限解決（heat-1）を **1回の検証で共有する情報** にまとめ、ルール列を **先頭失敗で評価** する実行器が必要である。

## 作るもの

開発のガードレール。以下を満たす **組み立て器・実行器** を作る。

- 検証 Context 組み立て器を作る
- ルール列実行器を作る（先頭失敗で打ち切る）

## 受け入れ条件

### Context 組み立て器

入力（値・code・font）から、少なくとも次を含む Context を返す。

- 入力値・code・font
- 実効上限文字数（heat-1 の決定器を利用）
- 選択書体が日本語を許可するか（lookup の `ja > 0` で決める）
- 当該商品に日本語可能書体が1つでもあるか

### ルール列実行器

- RuleStep 列を **定義順** に評価する
- 最初に `fails(ctx)` が true になった RuleStep の結果を返す
- 失敗時: `{ ok: false, ruleId, message }`。`message` が関数なら Context を渡して解決する
- 全ルール通過: `{ ok: true }`
- Context・RuleStep 列・入力オブジェクトは変更しない

## 型

```ts
function buildContext(input: ValidationInput): ValidationContext;

function runRules(
  ctx: ValidationContext,
  ruleSet: RuleStep[],
): ValidationResult;
```

型は `kata.ts` を参照。

## 実装者が決めること

- `buildContext` を export するか、内部関数に留めるか
- ループ実装（for / find / 再帰）— 先頭失敗の契約を守ればよい

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-18-side-name-rule-pipeline/heat-2` でテストを通す
