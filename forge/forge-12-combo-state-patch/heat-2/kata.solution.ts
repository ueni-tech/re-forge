export type ComboState = {
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
};

export function patchState(state: ComboState, patch: Partial<ComboState>): void {
  (Object.keys(patch) as Array<keyof ComboState>).forEach((key) => {
    const value = patch[key];
    if (value !== undefined) {
      (state as Record<keyof ComboState, string | undefined>)[key] = value;
    }
  });
}
