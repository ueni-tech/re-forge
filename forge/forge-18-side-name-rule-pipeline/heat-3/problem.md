# [heat-3] 名入れ検証入口とルールセット

## 背景

PDP・カートは `data-validation-rule` 属性で **どのルールセットを適用するか** を指定する。入口関数と、名入れ（engraving-text）用の **ルールセット定義** を1か所に集約する。

## 作るもの

開発のガードレール。以下を満たす **入口・定義・解決器** を作る。

- 側面名入れ検証入口を作る
- 名入れ用ルールセット定義を作る
- 属性値からルールセットを解決する解決器を作る
- 登録済みルール名から DOM セレクタを組み立てる生成器を作る（UI 層向け）

## 受け入れ条件

### 検証入口

- `ValidationInput` と optional な RuleStep 列を受け取り `ValidationResult` を返す
- RuleStep 列省略時は名入れ用ルールセットを使う
- heat-2 の Context 組み立て器・ルール列実行器を利用する

### 名入れ用ルールセット

次の **検証意図** を RuleStep 列として定義する（順序は失敗優先度として機能すること）。

1. 未入力
2. 先頭・末尾スペース
3. 連続スペース
4. 書体が日本語不可なのに日本語・半角カナが含まれる（メッセージは商品に日本語可能書体があるかで分岐）
5. 半角カタカナ
6. 全角英数字・記号（半角強制）
7. 許可外文字
8. 文字数上限超過（メッセージに実効上限を含める）

各 RuleStep には安定した `ruleId` を付ける。

### ルールセット解決器

- 未登録・空の属性値 → `undefined`
- 登録済み `"engraving-text"` → 名入れ用ルールセット

### セレクタ生成器

- 登録済みルール名ごとに `[data-validation-rule="..."]` をカンマ結合した文字列を返す

## 型

```ts
function validateSideName(
  input: ValidationInput,
  ruleSet?: RuleStep[],
): ValidationResult;

const ENGRAVING_TEXT_RULE_SET: RuleStep[];

function resolveRuleSet(ruleName: string | undefined): RuleStep[] | undefined;

function validationRuleFieldSelector(): string;
```

## 実装者が決めること

- ルールセットを別ファイル（`rules.ts`）に分けるタイミング
- 動的メッセージの文言（テスト fixture に合わせる）
- forge-17 判定器の import 元（統合済み repo vs kata fixture）

## 統合メモ（forge 外）

heat-1〜3 完了後、`side_name_validation.ts` + `rules.ts` として統合し、実務の `__tests__/side_name_validation.test.ts` と diff を取る。

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-18-side-name-rule-pipeline/heat-3` でテストを通す
