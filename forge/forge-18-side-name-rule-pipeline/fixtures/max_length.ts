/** forge-18 用 lookup 縮小版（実務 max_length_by_code_and_font のサブセット） */
export const MAX_LENGTH_BY_CODE_AND_FONT = {
  engraving_2font_12letter_na: {
    "楷書体★": { ja: 6, en: 12 },
    "英字【筆記体】(頭文字大文字)": { ja: 0, en: 12 },
  },
  engraving_6font_3letter_na: {
    "楷書体★": { ja: 0, en: 3 },
    "英字【筆記体】(頭文字大文字)": { ja: 0, en: 3 },
  },
  engraving_6font_12letter_na: {
    "楷書体★": { ja: 6, en: 12 },
    "英字【筆記体】(頭文字大文字)": { ja: 0, en: 12 },
  },
} as const;
