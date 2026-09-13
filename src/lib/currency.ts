export const CURRENCY_CODE = "PKR";
export const CURRENCY_SYMBOL = "Rs.";

/**
 * Format any numerical price into Pakistani Rupee display format
 * Example: 68500 -> "Rs. 68,500"
 */
export function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${CURRENCY_SYMBOL} 0`;
  }
  return `${CURRENCY_SYMBOL} ${Math.round(amount).toLocaleString("en-PK")}`;
}
