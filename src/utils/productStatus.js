/** Stock at or below this count (but above 0) is "Low Stock". */
export const LOW_STOCK_MAX = 5;

export function isOutOfStock(stock) {
  return Number(stock || 0) <= 0;
}

export function isLowStock(stock) {
  const qty = Number(stock || 0);
  return qty > 0 && qty <= LOW_STOCK_MAX;
}

export function isInStock(stock) {
  return Number(stock || 0) > LOW_STOCK_MAX;
}

export function getStockStatus(stock) {
  const qty = Number(stock || 0);
  if (qty <= 0) return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
  if (qty <= LOW_STOCK_MAX) return { label: "Low Stock", className: "bg-amber-100 text-amber-700" };
  return { label: "In Stock", className: "bg-emerald-100 text-emerald-700" };
}
