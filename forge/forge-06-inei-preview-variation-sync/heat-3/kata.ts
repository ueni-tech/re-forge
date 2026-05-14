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
 * - imagesの最初の要素の base と main または thumb のパスが `${images.base}/${path}` の形式で返ってくる
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - images / images.base / images.list が falsy か images.list.length === 0 のとき '' を返す
 * - images.list[0].main を優先し、なければ images.list[0].thumb を path とする
 * - path が空文字（または undefined）なら '' を返す
 * - それ以外は `${images.base}/${path}` を返す
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param images - 画像のベースURLと main, thumb のファイル名
 * @returns `${images.base}/${path}` の形式 の文字列
 */
export function firstImageUrl(images: ImageData | null | undefined): string {
  if (!images || !images.base || !images.list || images.list.length === 0)
    return "";
  const path = images.list[0].main || images.list[0].thumb;
  if (!path) return "";
  return `${images.base}/${path}`;
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - DOM 依存を設定済みのバリデーション同期用の純粋なメソッドを持つオブジェクトが手に入る
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - controller.sync() — readState() の結果を writeLabels() へ即時渡す
 * - controller.syncSoon() — schedule(() => sync()) を呼ぶ
 * - controller.onPickerClick(target) — target.closest('[data-listing-code]') が
 *   truthy のときだけ syncSoon() を呼ぶ（falsy なら何もしない）
 * - controller.onImageListUpdated(detail) — firstImageUrl(detail.images) で URL を求め、
 *   URL が '' でなく getThumbEl() が tagName === 'IMG' の要素を返すとき src を更新する
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - deps を外から渡すことでこの関数はオブジェクトを返すことに集中できる
 * - 複数個所にコントローラーが欲しいときに内蔵型だとファクトリをコピーして差分を作りがちになるが、
 *   注入型だと deps と同型のオブジェクトを作って同じファクトリで生成するだけで違うコントローラが手に入る
 * - 却下案: deps を関数内に書くと保守性が下がるため不採用
 *
 * @param deps - DOM に依存するプロパティ・メソッドを持つオブジェクト
 * @returns DOM 依存を設定済みのバリデーション同期用の純粋なメソッドを持つオブジェクト
 */
export function createVariationSyncController(
  deps: ControllerDeps,
): VariationSyncController {
  return {
    sync: function () {
      deps.writeLabels(deps.readState());
    },
    syncSoon: function () {
      deps.schedule(this.sync);
    },
    onPickerClick: function (target) {
      if (target && target.closest("[data-listing-code]")) {
        this.syncSoon();
      }
    },
    onImageListUpdated: function (detail) {
      const url = firstImageUrl(detail.images);
      const thumb = deps.getThumbEl();
      if (url !== "" && thumb && thumb.tagName === "IMG") {
        thumb.src = url;
      }
    },
  };
}
