# [heat-2] 名入れ入力イベント配線

## 背景

日本語 IME 入力中に `input` イベントだけで検証すると、未確定文字で誤 NG になる。確定後に検証し、通常入力は **デバウンス** して走査コストを抑える必要がある。

## 作るもの

開発のガードレール。以下を作る。

- IME 入力中フラグ付き input イベント配線を作る
- デバウンス付き再検証配線を作る
- 書体変更時の再検証配線を作る
- 書体変更時の上限表示更新器を作る

## 受け入れ条件

### input イベント配線

- `compositionstart` で IME 入力中とみなす
- `compositionend` で IME 終了 → **即座に** 検証実行器を呼ぶ
- `input` イベント: IME 入力中は無視。それ以外はデバウンス（300ms）後に検証実行器を呼ぶ

### 書体変更配線

- 書体ラジオの `change` で検証実行器を呼ぶ
- 同タイミングで上限表示更新器を呼ぶ

### 上限表示更新器

- `buildInput` 成功時、`resolveMaxLengthByScript` で上限を取得
- 和文不可書体なら英文のみ、そうでなければ和文/英文両方のラベルを表示
- 表示要素が無い場合は warn して return

### スコープ

- 本 heat では **init が配線を付ける** ところまで。init の走査ロジック本体は heat-3

## 型

heat-1 と同じ `createSideNameValidation` を拡張する。新規 export 不要。

## 実装者が決めること

- デバウンス実装（自前 timer / ライブラリ不使用）
- 上限ラベルの文言フォーマット
- 書体ラジオの取得（`findFontRadios`）を input ごとに bind するか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-19-side-name-validation-ui/heat-2` でテストを通す
