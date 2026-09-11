# チケット: SKU検索機能の実装

## 背景
ECサイトの商品詳細ページ(PDP)で、ユーザーが選択した「色」「直径」「行(row)」の組み合わせから、対応するSKUを検索する機能が必要になった。
在庫マスタには全ての組み合わせが登録されているわけではない。一部の組み合わせは欠品（未登録）であり、その場合はユーザーに代替候補を提示したい。

## 要件

1. 色・直径・行を指定すると、完全一致するSKUを1件返す。
2. 完全一致するSKUが存在しない場合、**直径だけを変更した**近い候補（色・行は一致）を在庫マスタの中から探し、直径の差が小さい順に**最大3件**提案する。近い候補が1件もない場合は空の候補リストを返す。
3. 指定された色または行が、在庫マスタのどのレコードにも一度も登場しない場合は「不正な入力」として扱う（直径の不一致とは区別すること）。
4. 在庫マスタは配列として与えられるものとし、外部DB・API呼び出しは考慮しなくてよい。
5. 直径は数値（小数を許容）とする。

## 制約
- 在庫マスタの件数は最大1000件程度を想定
- 色・行は文字列（例: "red", "row-A"）

## 境界契約（この形だけ守ってください。中身の設計・分割・命名・追加の型定義はすべて自由です）

エントリーポイントとして、以下の1関数だけを `solution.ts` からexportしてください。

```typescript
// 入力
type SkuQuery = {
  color: string;
  diameter: number;
  row: string;
};

type InventoryItem = {
  sku: string;
  color: string;
  diameter: number;
  row: string;
};

// 出力（3パターンのいずれか）
type SkuSearchResult =
  | { status: "exact"; sku: string }
  | { status: "suggestions"; candidates: string[] } // 完全一致なし、近い候補あり or なし(空配列)
  | { status: "invalid" }; // 色 or 行がマスタに一度も存在しない

// この1関数のみが境界。内部の関数分割・命名・エラー処理方針はすべて自分で設計すること。
export function findSku(query: SkuQuery, inventory: InventoryItem[]): SkuSearchResult;
```

## 入出力例（一部）

| color | diameter | row | inventoryの概要 | 期待結果 |
|---|---|---|---|---|
| "red" | 10 | "row-A" | (red,10,row-A)が存在 | exact, sku一致 |
| "red" | 10 | "row-A" | (red,10,row-A)は無いが(red,12,row-A)(red,8,row-A)(red,20,row-A)がある | suggestions, 差が小さい順に最大3件 |
| "red" | 10 | "row-A" | redのrow-Aが1件も無い | suggestions, candidates: [] |
| "blue" | 10 | "row-A" | blueという色が在庫マスタに一度も存在しない | invalid |
| "red" | 10 | "row-Z" | row-Zという行が在庫マスタに一度も存在しない | invalid |

テストファイル(`solution.test.ts`)側で、この表の内容を実際のテストケースとして用意してあります。
