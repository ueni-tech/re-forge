# escapeHtml

難易度: ★☆☆

文字列に含まれる HTML 特殊文字を、対応する文字実体参照（character reference）に変換する関数を書く。

> **背景**: 老舗EC のレガシーコードでは `'<li>' + name + '</li>'` のように、ユーザー入力をそのまま文字列連結して HTML を組み立てている箇所が多い。`name` に `<script>` が入れば XSS になる。その入口を塞ぐのがこの関数。

## 関数

```ts
function escapeHtml(input: string): string
```

## 変換表

| 文字 | 変換後     |
|------|-----------|
| `&`  | `&amp;`   |
| `<`  | `&lt;`    |
| `>`  | `&gt;`    |
| `"`  | `&quot;`  |
| `'`  | `&#39;`   |

上記5文字以外はそのまま残す。

## 例

```ts
escapeHtml("Tom & Jerry")        // "Tom &amp; Jerry"
escapeHtml("<script>")           // "&lt;script&gt;"
escapeHtml('say "hi"')           // "say &quot;hi&quot;"
escapeHtml("it's ok")            // "it&#39;s ok"
escapeHtml("a < b && c > d")     // "a &lt; b &amp;&amp; c &gt; d"
escapeHtml("")                   // ""
escapeHtml("no special chars")   // "no special chars"
```

## 制約

- 入力は任意の文字列（空文字を含む）。
- `&` の変換が他の変換より先に行われること（`<` を `&lt;` にした後でその `&` をさらに変換してしまわない）。
- 同じ特殊文字が複数回出てきたら、すべて変換する。

## 進め方

```bash
npx vitest forge-10-safe-html/heat-1
```
