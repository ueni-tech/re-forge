# forge-08-factory-init-closure — 初期化ファクトリパターン

`createGalleryVariationSync` / `createCartVariationSync` で使われている「ファクトリが DOM 参照をクロージャに保持し、初期化副作用を実行してからハンドラ関数を返す」パターンを、3段階の責務に分解して身につける forge。

## 練習の進め方

各 heat は2段階構成。詳細はリポジトリ直下の README を参照。

1. **段階A**: `problem.md` だけ読んで `kata.ts` を実装する
2. **段階B**: `spec.md` を開いて自分の判断と突き合わせ、テストを通す

```bash
npx vitest forge-08-factory-init-closure
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `createBlockSwitcher` | DOM をクロージャに保持し、前提が揃わなければ null を返す |
| heat-2 | `createButtonSwitcher` | 初期化副作用をファクトリ呼び出し時に実行する |
| heat-3 | `initVariantPicker` | 複数ファクトリを合成し、クリックハンドラへ配線するコーディネーター |

## 実務との対応

- `createCartVariationSync`（`listing-variation-cart.ts`）: heat-1 のプロトタイプ。コンテナ DOM をキャプチャして null ガードを返す最小形
- `createGalleryVariationSync`（`listing-variation-goods-image.ts`）: heat-2 のプロトタイプ。ファクトリ呼び出し時に初期 UI 同期を行い、ハンドラを返す
- `initListingVariationPicker`（`listing-variation-entry.ts`）: heat-3 のプロトタイプ。2つのファクトリ結果を合成し、クリックで両方を呼ぶ

レガシー jQuery 環境では「イベントハンドラに DOM 参照とロジックがベタ書き」になりがち。それを「**初期化時に DOM を一度だけキャプチャする**」「**前提不在は null で返す**」「**初期化副作用をファクトリに閉じる**」「**複数ハンドラをコーディネーターで合成する**」の4段階に分解するのがこの forge のテーマ。

## JSDoc の書き方

詳細はリポジトリ直下 [README.md](../../README.md) の「JSDoc の書き方」。

1文で何のための関数かを書き、型を見ても分からない注意だけ足す。見出し（【意図】【契約】）は使わない。
