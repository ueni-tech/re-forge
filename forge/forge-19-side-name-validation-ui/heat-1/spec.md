# [heat-1] spec.md — 答え合わせ用

## 観察ポイント

### runValidation が中心

DOM 取得（buildInput）と純粋検証（validateSideName）の **境界** が options DI にある。

### lastValidationResults Map

input 要素をキーにするのは、同一ページに複数行名入れがあるため。forge-16 の active/inactive と連動するのは heat-3。

### init は最小配線

heat-1 時点で input イベント配線まで含めてもよいが、テスト焦点は **active のみ初回 validate/display**。
