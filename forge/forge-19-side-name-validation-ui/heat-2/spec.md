# [heat-2] spec.md — 答え合わせ用

## 観察ポイント

### compositionstart/end

IME 確定前の `input` を無視するのが日本語名入れの必須パターン。debounce だけでは不足。

### inactive でも bind

forge-16 で後から active 化される input に備え、**リスナーは常に付ける** が実務の契約。
