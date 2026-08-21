# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の JSDoc と比較する観点

- `hasDisallowedCharacter` が「許可集合の補集合」であることが1文目から分かるか
- `hasDeniedCharacter` との関係（合成か二重チェックか）を2文目に書いたか

## 観察ポイント

### 否定クラス `[^...]` の罠

`ALLOWED_CHAR_CLASS` は長大。字符クラス内の `-` エスケープは fixture 側で済んでいる。

### 半角カナ・全角英数は ALLOWED_CHAR_CLASS に含む

それらの **不許可** は heat-2 の専用判定器 + forge-18 のルール順序で先に弾く。許可外判定だけ見ると「通る」文字もある。

### forge-17 統合

heat-1〜3 完了後、実務の `validators.ts` 1ファイルにまとめる。export 名を揃えれば実務テストにそのまま載せ替え可能。
