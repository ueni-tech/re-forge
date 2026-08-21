import type { ValidationInput } from "../../forge-18-side-name-rule-pipeline/fixtures/types";

export type ValidationResult =
  | { ok: true }
  | { ok: false; ruleId: string; message: string };

export type CreateSideNameValidationOptions = {
  buildInput: (inputEl: HTMLInputElement) => ValidationInput | undefined;
  hasFont: (inputEl: HTMLInputElement) => boolean;
  isActiveInput?: (inputEl: HTMLInputElement) => boolean;
  findFontRadios: (inputEl: HTMLInputElement) => NodeListOf<HTMLInputElement> | undefined;
  findMaxLengthDisplayEl: (inputEl: HTMLInputElement) => HTMLElement | null | undefined;
  onResultsChange?: (allOk: boolean) => void;
};

export type { ValidationInput };
