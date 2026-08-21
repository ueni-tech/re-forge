/** 許可記号 */
export const ALLOWED_SYMBOLS = `!"#$%&'()=~|{+*}<>?_/-+ ^¥@｢;:｣､｡･[],./\``;

/** 特別に拒否する文字（漢字範囲内だが側面名入れでは不許可） */
export const DENIED_CHARS = "卍卐";

/** ひらがな */
export const HIRAGANA = "\\u3040-\\u309F";

/**
 * 全角カタカナ（\u30FB（全角中点: ・）は 除外）
 * 全角中点は記号として hasAllowedCharWithFullwidthInput で検出する
 */
export const FULLWIDTH_KATAKANA = "\\u30A0-\\u30FA\\u30FC-\\u30FF";

/**
 * 半角カタカナ（文字）
 * U+FF61-FF65（｡｢｣､･）は半角記号として ALLOWED_SYMBOLS 側で許可するため含めない。
 */
export const HALFWIDTH_KATAKANA = "\\uFF66-\\uFF9F";

/** 半角英数字 */
export const HALFWIDTH_ALPHANUMERIC = "0-9A-Za-z";

/** 全角英数字 */
export const FULLWIDTH_ALPHANUMERIC = "\\uFF10-\\uFF19\\uFF21-\\uFF3A\\uFF41-\\uFF5A";

function escapeForCharClass(char: string): string {
  return char.replace(/[\^\]\\-]/g, "\\$&");
}

/**
 * ALLOWED_SYMBOLS の半角記号 → 全角記号の対応（ASCII 以外）
 * ASCII 印字可能文字は code + 0xFEE0 で全角化する。
 *
 * ｡｢｣､ → 。「」、 は半角強制の例外（全角入力可）のため、ここには載せない。
 * 検出対象にすると hasAllowedCharWithFullwidthInput で弾かれてしまう。
 */
const HALFWIDTH_TO_FULLWIDTH_SYMBOL: Readonly<Record<string, string>> = {
  "\u00A5": "\uFFE5", // ¥ → ￥
  "\uFF65": "\u30FB", // ･ → ・
};

/**
 * 半角強制の例外として全角入力を許可する句読点・かぎ括弧（「」、。）
 * 日本語判定（hasJapaneseScript）には含めない。
 */
export const FULLWIDTH_ALLOWED_JP_PUNCTUATION = "\u300C\u300D\u3001\u3002";

/**
 * ALLOWED_SYMBOLS の1文字に対応する全角版を返す（#6 検出対象）
 * 半角スペースは全角スペースとして別扱いのため null。
 */
export function toFullWidthSymbol(half: string): string | null {
  if (half === " ") {
    return null;
  }

  const mapped = HALFWIDTH_TO_FULLWIDTH_SYMBOL[half];
  if (mapped) {
    return mapped;
  }

  const code = half.codePointAt(0)!;
  if (code >= 0x21 && code <= 0x7e) {
    return String.fromCodePoint(code + 0xfee0);
  }

  return null;
}

function buildFullwidthAllowedSymbolClass(): string {
  const fullwidthChars = new Set<string>();

  for (const half of new Set(ALLOWED_SYMBOLS)) {
    const full = toFullWidthSymbol(half);
    if (full) {
      fullwidthChars.add(full);
    }
  }

  return [...fullwidthChars].map(escapeForCharClass).join("");
}

/**
 * 許可記号・英数字の全角入力の検出用（半角強制の対象）
 * - 全角英数字
 * - ALLOWED_SYMBOLS に含まれる記号の全角版（「」、。は例外のため含まない）
 * 許可外の全角記号（例: 〒 U+3012）は hasDisallowedCharacter 側で検出する。
 */
export const ALLOWED_CHAR_WITH_FULLWIDTH_INPUT_CHAR_CLASS =
  FULLWIDTH_ALPHANUMERIC + buildFullwidthAllowedSymbolClass();

/** 全角スペース（文字間は許可。連続は hasConsecutiveSpaces で弾く） */
export const IDEOGRAPHIC_SPACE = "\\u3000";

/** CJK統合漢字 */
export const CJK_UNIFIED_IDEOGRAPHS = "\\u4E00-\\u9FFF";

/** 氏名で使う踊り字（々）。漢字扱いに準じる */
export const IDEOGRAPHIC_ITERATION_MARK = "\\u3005";

/** 漢数字の〇（U+3007）。CJK統合漢字範囲外だが漢字相当として許可する */
export const IDEOGRAPHIC_NUMBER_ZERO = "\\u3007";

/** 側面名入れで「漢字相当」とみなす文字種 */
export const IDEOGRAPH_CHAR_CLASS =
  CJK_UNIFIED_IDEOGRAPHS + IDEOGRAPHIC_ITERATION_MARK + IDEOGRAPHIC_NUMBER_ZERO;

/** 日本語判定用（書体・文字数パターン） */
export const JAPANESE_SCRIPT_CHAR_CLASS = HIRAGANA + FULLWIDTH_KATAKANA + IDEOGRAPH_CHAR_CLASS;

const symbolClassBody = [...new Set(ALLOWED_SYMBOLS)].map(escapeForCharClass).join("");
const fullwidthAllowedJpPunctuationClass = [...FULLWIDTH_ALLOWED_JP_PUNCTUATION]
  .map(escapeForCharClass)
  .join("");

/**
 * 使用可能文字種チェック用
 * 半角カタカナ・全角英数字は意図的に含める。
 * それらの不許可判定は hasHalfWidthKatakana / hasAllowedCharWithFullwidthInput に任せる。
 * 「」、。は半角強制の例外として許可する（日本語判定には含めない）。
 */
export const ALLOWED_CHAR_CLASS =
  HIRAGANA +
  FULLWIDTH_KATAKANA +
  IDEOGRAPH_CHAR_CLASS +
  IDEOGRAPHIC_SPACE +
  HALFWIDTH_KATAKANA +
  HALFWIDTH_ALPHANUMERIC +
  FULLWIDTH_ALPHANUMERIC +
  symbolClassBody +
  fullwidthAllowedJpPunctuationClass;
