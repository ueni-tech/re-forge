// 002-price-display — solution
//
// テストが import するのは resolvePriceDisplay だけ。型・内部関数・命名は自由。
// 境界の形は 01.md を参照。

type Product = { price: number; salePrice?: number };
type PriceContext = { taxRate: number; taxDisplay: "included" | "excluded" };
type PriceDisplayResult =
  | { status: "ok"; amount: number; taxLabel: "included" | "excluded" }
  | { status: "invalid" };

export function resolvePriceDisplay(product: Product, context: PriceContext): PriceDisplayResult {
  if (product.price < 0 || context.taxRate < 0) return { status: "invalid" };
  if (product.salePrice !== undefined && product.salePrice < 0) return { status: "invalid" };

  const taxLabel = context.taxDisplay === "included" ? "included" : "excluded";
  const basePrice = product.salePrice ?? product.price;
  const amount =
    taxLabel === "included" ? Math.floor(basePrice * (1 + context.taxRate)) : basePrice;

  return { status: "ok", amount, taxLabel };
}
