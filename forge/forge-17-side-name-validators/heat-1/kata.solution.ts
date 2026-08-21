export type UnverifiedValue = string;

export function isEmpty(value: UnverifiedValue): boolean {
  return value === "";
}

export function hasLeadingOrTrailingSpace(value: UnverifiedValue): boolean {
  return value !== value.trim();
}

export function hasConsecutiveSpaces(value: UnverifiedValue): boolean {
  return /\s{2,}/.test(value);
}

export function isOverMaxLength(value: UnverifiedValue, maxLength: number): boolean {
  return value.length > maxLength;
}
