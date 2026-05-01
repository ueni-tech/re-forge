# re-forge

実務コードを解読し、自分の手で再構築する deliberate practice リポジトリ。

## コンセプト

- **forge** — 実務コードから抽出した1つのパターン・テーマ
- **heat** — 同じパターンを抽象度を上げながら実装する段階（heat-1 → heat-2 → heat-3）

## ディレクトリ構成

```
re-forge/
└── forge-01-closure/
    ├── heat-1/
    │   ├── kata.ts       ← 実装
    │   └── kata.test.ts  ← テスト
    ├── heat-2/
    │   ├── kata.ts
    │   └── kata.test.ts
    └── heat-3/
        ├── kata.ts
        └── kata.test.ts
```

## セットアップ

```bash
npm install
```

## テストの実行

### 特定の forge だけ走らせる（推奨）

```bash
npx vitest forge-01-closure
```

### 特定の heat だけ走らせる

```bash
npx vitest forge-01-closure/heat-1
```

### 全テストを走らせる

```bash
npm test
```

### 1回だけ実行（watch なし）

```bash
npm run test:run
```

## 進め方

1. `kata.ts` の `throw new Error("not implemented")` を実装に置き換える
2. `npx vitest <パス>` でテストを走らせて確認する
3. 全テストがグリーンになったら次の heat へ

## forge 一覧

| forge | テーマ | ステータス |
|---|---|---|
| forge-01-closure | クロージャ / request sequencing | 🔨 進行中 |
| forge-02-gallery-sync | 商品ギャラリー: シグネチャ・非同期世代・dispatch 順 | 🔨 kata はスタブ／解答は `kata.solution.ts` |
| forge-03-variant-listing-blocks | 出品コードバリエーション: hidden 配列・祖先パス・select+notify | 🔨 kata はスタブ／解答は `kata.solution.ts` |
| forge-04-listing-variation-coordinator | listing variation: JSON マップ・初期コード・ギャラリー/カート同期の束ね | 🔨 kata はスタブ／解答は `kata.solution.ts` |
