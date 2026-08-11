# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 仕様の一次ソース

合意済み仕様は `problem.md` が一次ソース。

## 自分の契約と比較する観点

### `undefined` = 「更新しない」の意味

JavaScript では「キーを削除したい」と「更新しない」が `undefined` だけでは区別しづらい。実務では **パッチは「触りたい軸だけ渡す」** 運用に寄せ、`undefined` は未指定と同義にする。

これは **Partial<T> パッチの定番パターン**。React では spread + undefined フィルタに近い。

### ミュータブル state を採用する理由

`initListingVariationCombo` は1つの `state` をクロージャに保持し、クリックのたびに更新→resolve する。**参照を固定**できるのでイベントリスナーに渡しやすい。immutable に毎回 `{...state, ...patch}` でもよいが、実コードはミュートで統一。

### Object.keys で回す理由

`ComboState` のキーが増えても patch ループは変更不要。**列挙と更新を一致させる**書き方。

## 観察ポイント: パッチ更新はロジックの「分岐の集約」

クリックハンドラ側は `patchState(state, { label })` / `patchState(state, { ballDiameter })` と**軸ごとに分岐**するが、更新ロジック自体は1関数に集約できる。分岐は「何をパッチするか」、共通処理は「どう適用するか」——**責務分離**の最小例。
