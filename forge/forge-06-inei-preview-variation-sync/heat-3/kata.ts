// [heat-3] イベント駆動コントローラ（createVariationSyncController）
//
// 実務での使われ方:
//   商品 PDP で書体・レイアウト・カラー選択が変わるたびにプレビュー横ラベルを
//   更新し、さらに `hankoya:goods-image-list-updated` カスタムイベントで
//   完成品プレビューのサムネ画像を差し替える。
//   複数のイベントソースと DOM の読み書きが一入口に束ねられる場面で、
//   deps に DOM 依存をすべて押し込み controller 本体を純粋なロジックにする。
//
// firstImageUrl(images) と createVariationSyncController(deps) を実装せよ。
//
// firstImageUrl は:
//   ① images / images.base / images.list が falsy か images.list.length === 0 のとき '' を返す
//   ② images.list[0].main を優先し、なければ images.list[0].thumb を path とする
//   ③ path が空文字（または undefined）なら '' を返す
//   ④ それ以外は `${images.base}/${path}` を返す
//
// createVariationSyncController(deps) は以下の deps を受け取り controller を返す:
//   - deps.readState(): LabelState      — 現在の選択状態を取得する DI
//   - deps.writeLabels(s: LabelState)   — ラベル要素へ書き込む DI
//   - deps.getThumbEl(): ThumbEl | null — サムネ要素を取得する DI
//   - deps.schedule(fn: () => void)     — 遅延実行の DI
//
// controller は:
//   ① controller.sync() — readState() の結果を writeLabels() へ即時渡す
//   ② controller.syncSoon() — schedule(() => sync()) を呼ぶ
//   ③ controller.onPickerClick(target) — target.closest('[data-listing-code]') が
//      truthy のときだけ syncSoon() を呼ぶ（falsy なら何もしない）
//   ④ controller.onImageListUpdated(detail) — firstImageUrl(detail.images) で URL を求め、
//      URL が '' でなく getThumbEl() が tagName === 'IMG' の要素を返すとき src を更新する

export type LabelState = {
  color: string;
  font: string;
  layout: string;
};

export type ThumbEl = { tagName: string; src: string };

export type ImageData = {
  base: string;
  list: Array<{ main?: string; thumb?: string }>;
};

export type ControllerDeps = {
  readState: () => LabelState;
  writeLabels: (state: LabelState) => void;
  getThumbEl: () => ThumbEl | null;
  schedule: (fn: () => void) => void;
};

export type VariationSyncController = {
  sync: () => void;
  syncSoon: () => void;
  onPickerClick: (target: { closest: (selector: string) => unknown }) => void;
  onImageListUpdated: (detail: { images?: ImageData | null }) => void;
};

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param images - （記述）
 * @returns （記述）
 */
export function firstImageUrl(images: ImageData | null | undefined): string {
  // ここに実装する
  throw new Error("not implemented");
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param deps - （記述）
 * @returns （記述）
 */
export function createVariationSyncController(
  deps: ControllerDeps,
): VariationSyncController {
  // ここに実装する
  throw new Error("not implemented");
}
