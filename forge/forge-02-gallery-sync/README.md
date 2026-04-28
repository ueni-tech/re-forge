# forge-02-gallery-sync — 商品画像ギャラリーの「差し替え追従」エッセンス

業務リポジトリ（hankoya）の `_pkg/ui/goods-image` で行った **バリエーション切替時に Preview / Grid / Slider が追従する**対応から、**DOM や Redux に依存しない核**だけを切り出した forge です。

## 実務との対応（読み返し用）

| heat | エッセンス | hankoya でのイメージ |
|------|------------|----------------------|
| heat-1 | **一覧シグネチャ** — `base` と各ファイルを連結した文字列で「画像セットが変わったか」を判定 | `Grid` / `PageControl` の `buildImageListSignature` 相当 |
| heat-2 | **非同期の世代番号** — 遅れて返った古い `getImage` 結果を捨てる | `Preview` の `previewLoadSeq`、バリエーションの `latestSeq` と同型 |
| heat-3 | **dispatch 順** — 新リスト適用前に「見ている index」を 0 にし、中間状態で不整合を出さない | `applyImageStateAndResetIndex` の `showPreview(0)` → `activeSlider(0)` → `setImageList` 順 |

## 練習の進め方

1. `heat-N/kata.ts` は **未実装スタブ**（`throw new Error("not implemented")`）から始まる。`kata.test.ts` と README の表を頼りに **kata.ts だけを実装**する。
2. 行き詰まったときだけ **`heat-N/kata.solution.ts`**（模範解答・閲覧専用）を開き、仕様との対応を読む（写経より意図の理解を優先）。
3. `npx vitest forge-02-gallery-sync` がすべてグリーンになるまで繰り返す。

```bash
npx vitest forge-02-gallery-sync
```

## あえて入れていないもの

- hyperhtml / jQuery / 実 `getImage` — ここでは **純関数と Promise と dispatch 記録**に圧縮している。
- `Slider` の `list.length === 0` ガード — heat-3 の reducer で「空リスト時の preview/slider」に触れているが、実務の `renderImage` 早期 return は別パターンとして、hankoya 側の `_pkg/ui/goods-image/src/components/Slider.ts` を読むとよい。
