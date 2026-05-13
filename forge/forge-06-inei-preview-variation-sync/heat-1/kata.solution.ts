// [heat-1] 解答（kata.ts と同じシグネチャ・仕様）

export type InputLike = { name: string; checked: boolean; value: string };
export type ButtonLike = { disabled: boolean; textContent: string };

export function getCheckedValue(inputs: InputLike[], name: string): string {
  const found = inputs.find((i) => i.name === name && i.checked);
  return found ? String(found.value || '').trim() : '';
}

export function getActiveLabel(buttons: ButtonLike[] | null | undefined): string {
  if (!buttons) return '';
  const active = buttons.find((b) => b.disabled);
  return active ? String(active.textContent || '').trim() : '';
}
