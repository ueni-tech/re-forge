# renderProductList

難易度: ★★★

商品の配列から、商品リンクの箇条書き HTML を組み立てる関数を書く。名前・URL はすべてエスケープする。

> **背景**: 老舗EC の商品一覧で `html += '<li><a href="' + p.url + '">' + p.name + '</a></li>'` と組み立てている処理の安全版。名前や URL にユーザー由来の文字列が混ざっても壊れない・差し込まれない形にする。

## 与えられた型（`kata.ts` に定義済み）

```ts
type Product = { name: string; url: string };
```

## 実装する関数

上の型を使い、`renderProductList` を自分で宣言・実装する。**シグネチャ（引数・戻り値の型）は自分で設計する**（`export` する名前は固定）。何を引数に取り何を返すかは下の「仕様」と「例」から読み取って決める。

## 仕様

全体を `<ul>` … `</ul>` で囲み、中に各商品の `<li>` を挿入順に並べる。1商品の形は次の通り。

```
<li><a href="エスケープ済みURL">エスケープ済み名前</a></li>
```

- `name` と `url` は HTML エスケープする（`&` `<` `>` `"` `'` の5文字。変換表は heat-1 と同じ）。
- 商品が0件のときは `<ul></ul>` を返す（`<li>` は1つも入らない）。
- `<li>` 同士の間に区切り文字（改行・スペース）は入れない。

> 補足: ここで行うのは **HTML エスケープ**であって URL エンコードではない。`href` の値を HTML 文脈で安全にすることが目的（`"` でのタグ破壊や `&` の実体参照化）。

## 例

```ts
renderProductList([{ name: "Tea & Co", url: "/p?id=1&c=2" }])
// '<ul><li><a href="/p?id=1&amp;c=2">Tea &amp; Co</a></li></ul>'

renderProductList([
  { name: "A", url: "/a" },
  { name: "B", url: "/b" },
])
// '<ul><li><a href="/a">A</a></li><li><a href="/b">B</a></li></ul>'

renderProductList([{ name: '<script>alert(1)</script>', url: "/x" }])
// '<ul><li><a href="/x">&lt;script&gt;alert(1)&lt;/script&gt;</a></li></ul>'

renderProductList([])
// '<ul></ul>'
```

## 制約

- `name` `url` は任意の文字列（空文字を含む）。
- 出力は1行の文字列（整形・インデントはしない）。

## 進め方

```bash
npx vitest forge-10-safe-html/heat-3
```
