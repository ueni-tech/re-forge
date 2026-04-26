# _sample — forge 作成リファレンス

新しい forge を AI に作成させるための参照用サンプルです。
実装済みコードを通じてフォーマット・規約・heat の段階構成を示します。

## ディレクトリ構成

```
forge-XX-<theme>/
├── heat-1/
│   ├── kata.ts       ← 実装ファイル（ユーザーが解く前は throw new Error）
│   └── kata.test.ts  ← テスト（AI が作成、ユーザーは変更しない）
├── heat-2/
│   └── ...
└── heat-3/
    └── ...
```

## heat の役割

| heat | 特徴 |
|------|------|
| heat-1 | クロージャで状態を持つ最小実装 |
| heat-2 | 非同期・タイマーを追加（`vi.useFakeTimers()` 使用） |
| heat-3 | DI（依存性注入）を追加し、実装を外から差し替え可能にする |

## kata.ts の規約

```typescript
// [heat-N] 短い説明（1行）
// createXxx() を実装せよ。
// 返却された関数は:
//   ① ...
//   ② ...

// スタブ（変更不要）
export function fakeXxx(...): void { ... }

export type SomeType = { ... };

export function createXxx(...) {
  // ここに実装する
  throw new Error("not implemented");
}
```

## kata.test.ts の規約

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createXxx } from "./kata";

describe("[heat-N] createXxx", () => {
  it("日本語で仕様を記述する", () => { ... });
  // 3〜4テスト
});
```

- fake timers を使う場合は `beforeEach(() => vi.useFakeTimers())` と `afterEach(() => vi.useRealTimers())`
- DI を持つ heat-3 では `vi.fn()` でスタブを差し替えてテストする

## このサンプルのテーマ: キャッシュ（cache）

| heat | 関数 | 追加要素 |
|------|------|----------|
| heat-1 | `createCache<V>()` | クロージャで Map を保持 |
| heat-2 | `createTTLCache<V>(ttl)` | TTL 期限切れ + fake timers |
| heat-3 | `createAsyncCacheLoader(storage, validKeys, fetcher?)` | DI + 非同期フェッチ |
