import { ALLOWED_CHAR_CLASS, DENIED_CHARS } from "../fixtures/constants";

export type UnverifiedValue = string;

export function hasDeniedCharacter(value: UnverifiedValue): boolean {
  return new RegExp(`[${DENIED_CHARS}]`, "u").test(value);
}

export function hasDisallowedCharacter(value: UnverifiedValue): boolean {
  return new RegExp(`[^${ALLOWED_CHAR_CLASS}]`, "u").test(value) || hasDeniedCharacter(value);
}
