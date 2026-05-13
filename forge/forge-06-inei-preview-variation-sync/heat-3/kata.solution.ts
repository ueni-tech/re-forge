// [heat-3] 解答（kata.ts と同じシグネチャ・仕様）

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

export function firstImageUrl(images: ImageData | null | undefined): string {
  if (!images || !images.base || !images.list || !images.list.length) return '';
  const first = images.list[0];
  const path = (first && (first.main || first.thumb)) || '';
  return path ? `${images.base}/${path}` : '';
}

export function createVariationSyncController(
  deps: ControllerDeps,
): VariationSyncController {
  function sync() {
    deps.writeLabels(deps.readState());
  }

  function syncSoon() {
    deps.schedule(sync);
  }

  function onPickerClick(target: { closest: (selector: string) => unknown }) {
    if (target.closest('[data-listing-code]')) {
      syncSoon();
    }
  }

  function onImageListUpdated(detail: { images?: ImageData | null }) {
    const url = firstImageUrl(detail.images);
    if (!url) return;
    const el = deps.getThumbEl();
    if (el && el.tagName === 'IMG') {
      el.src = url;
    }
  }

  return { sync, syncSoon, onPickerClick, onImageListUpdated };
}
