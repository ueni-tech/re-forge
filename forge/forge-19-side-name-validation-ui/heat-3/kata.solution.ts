export { createSideNameValidation } from "../heat-1/kata.solution";

import { MAX_LENGTH_BY_CODE_AND_FONT } from "../../forge-18-side-name-rule-pipeline/fixtures/max_length";
import type { FontName, ValidationInput, VariationClassificationCode } from "../../forge-18-side-name-rule-pipeline/fixtures/types";

export function buildValidationInput(inputEl: HTMLInputElement): ValidationInput | undefined {
  const value = inputEl.value;
  const scope = inputEl.closest<HTMLElement>(".js-validation-scope");
  if (!scope) return;

  const checkedOption = scope.querySelector<HTMLInputElement>(
    '[data-validation-part="engraving-font"]:checked',
  );
  if (!checkedOption) return;

  const rawCode = checkedOption.dataset.basketParam;
  if (!rawCode || !(rawCode in MAX_LENGTH_BY_CODE_AND_FONT)) return;
  const code = rawCode as VariationClassificationCode;

  const rawFont = checkedOption.dataset.basketValue;
  if (!rawFont || !(rawFont in MAX_LENGTH_BY_CODE_AND_FONT[code])) return;
  const font = rawFont as FontName;

  return { value, code, font };
}
