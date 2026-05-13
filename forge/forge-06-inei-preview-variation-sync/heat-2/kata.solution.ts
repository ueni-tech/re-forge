// [heat-2] 解答（kata.ts と同じシグネチャ・仕様）

export type LabelState = {
  color: string;
  font: string;
  layout: string;
};

export type LabelLike = { textContent: string | null };

export type LabelTargets = {
  color?: LabelLike | null;
  font?: LabelLike | null;
  layout?: LabelLike | null;
};

export type ScheduleSoonOptions = {
  raf?: (fn: () => void) => void;
};

export function syncLabels(state: LabelState, targets: LabelTargets): void {
  if (targets.color) targets.color.textContent = state.color;
  if (targets.font) targets.font.textContent = state.font;
  if (targets.layout) targets.layout.textContent = state.layout;
}

export function scheduleSoon(fn: () => void, options?: ScheduleSoonOptions): void {
  if (options?.raf) {
    options.raf(fn);
  } else if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(fn);
  } else {
    setTimeout(fn, 0);
  }
}
