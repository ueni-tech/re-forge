// [heat-1] listing-variations.json からページキーのエントリを取得する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照(写経より意図の理解を優先)。

export type VariationSku = { code: string; label?: string };
export type PageVariation = {
  variationSkus: VariationSku[];
  defaultCode: string;
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - データから指定キーのオブジェクトを入手できる
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  - dataが配列でない値（null, オブジェクト, プリミティブ）の場合{variationSkus: [],defaultCode: ""} を返す
 *  - データに pageKey が存在しない場合は
{variationSkus: [],defaultCode: ""} を返す
 *  - variationSkus が配列ではなく単一のデータの場合は [] を設定して返す 
 *  - defaultCode が無効な値だった場合は variationSkus[0].code を設定して返す
 *  - 例外は投げない
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - 一旦 data はunknown で受け取り、配列かどうかのチェックを行う。呼び出し側にdata の型の責任を持たせない
 *  - 必ず PageVariation を返すことで後続の処理は呼び出し側に任せる
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  - 元のオブジェクトを破壊しないように新しいオブジェクトを返すという判断ができなかった。
 *  - for ... of が「ループの最後の処理で上書きされる」ことに気付かず使っていた。
 *
 * @param data - listing-variations.json をパースした値
 * @param pageKey - 探したいページキー
 */
// export function loadPageVariation(
//   data: unknown,
//   pageKey: string,
// ): PageVariation {
//   if (!data || typeof data !== "object" || !Array.isArray(data)) {
//     return { variationSkus: [], defaultCode: "" };
//   }
//   const array = data as Array<unknown>;
//   let obj;
//   for (const item of array) {
//     if (!item || typeof item !== "object" || Array.isArray(item)) {
//       continue;
//     }
//     if (pageKey in item) {
//       obj = item;
//     }
//   }
//   if (!obj) return { variationSkus: [], defaultCode: "" };
//   const pageVariation = obj[pageKey] as PageVariation;
//   if (!Array.isArray(pageVariation.variationSkus))
//     pageVariation.variationSkus = [];
//   if (
//     pageVariation.defaultCode === undefined ||
//     pageVariation.defaultCode === "" ||
//     typeof pageVariation.defaultCode !== "string"
//   ) {
//     pageVariation.defaultCode = pageVariation.variationSkus[0]?.code;
//   }
//   if (!pageVariation.defaultCode) {
//     pageVariation.defaultCode = "";
//   }

//   return pageVariation;
// }

/* ---------------------------------------
初回レビュー
----------------------------------------*/
// 【確認ポイント（cskさんに考えてほしい箇所）】

// 「最初の要素を採用」 vs 「最後の要素を採用」
// 今の kata.ts は最後にマッチした要素を採用する実装になっています。テストデータ的には差が出ないので「テストは緑だが仕様とは違う」状態です。
// これは典型的な「テストが仕様の網羅にはならない」ケース。spec.md ② を読んだうえで、for ... of を find に書き換えるか、break を入れるかを判断してみてください。

// 入力のミューテーション
// kata.ts 側の pageVariation.variationSkus = [] のような書き換えは、呼び出し元が渡した JSON のパース結果を破壊します。
// 今回は呼び出し元が再利用しないケースなので顕在化しませんが、純粋関数として書くなら新しいオブジェクトを返すのが原則です。
// as PageVariation で信頼しきった瞬間に、この副作用が「型的には見えなくなる」のがポイントです。

// defaultCode のフォールバック条件
//  === undefined || === "" || typeof !== "string" の3条件は、実は「空でない文字列であること」の否定で1行に潰せます。
// 条件が増えたときに追従しやすいのは、肯定形を1個書いて否定するスタイル。

// as PageVariation を使うかどうか
//  unknown を受けたあとに as でキャストしてしまうと、型ガードの責務が消えます。
// 模範解答では raw.variationSkus を Array.isArray で確認、raw.defaultCode を typeof === "string" で確認、と1段ずつ絞っています。
// 「unknown の意味」を最後まで尊重する書き方です。

export function loadPageVariation(
  data: unknown,
  pageKey: string,
): PageVariation {
  if (!Array.isArray(data)) {
    return { variationSkus: [], defaultCode: "" };
  }

  const array = data as Array<unknown>;
  const obj = array.find((item) => {
    return (
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      Object.hasOwn(item, pageKey)
    );
  });

  if (!obj) return { variationSkus: [], defaultCode: "" };
  const row = obj[pageKey];

  if (!row || typeof row !== "object")
    return { variationSkus: [], defaultCode: "" };

  const variationSkus = Array.isArray(row.variationSkus)
    ? row.variationSkus
    : [];

  const defaultCode =
    typeof row.defaultCode === "string" && row.defaultCode !== ""
      ? row.defaultCode
      : (variationSkus[0]?.code ?? "");

  return { variationSkus, defaultCode };
}
