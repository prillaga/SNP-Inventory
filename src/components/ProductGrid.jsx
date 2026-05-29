import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { usePosStore } from "../store/usePosStore";
import { isLowStock, isOutOfStock } from "../utils/productStatus";
import ProductCard from "./ProductCard";

const STOCK_FILTERS = [
  { id: "all", label: "All" },
  { id: "low", label: "Low stock" },
  { id: "out", label: "Out of stock" },
];

export default function ProductGrid({ searchQuery, onSearchChange, scrollable = false, className = "" }) {
  const products = usePosStore((state) => state.products);
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const counts = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const p of products) {
      if (isOutOfStock(p.stock)) out += 1;
      else if (isLowStock(p.stock)) low += 1;
    }
    return { low, out };
  }, [products]);

  const filtered = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = category === "all" || product.category === category;
    const matchStock =
      stockFilter === "all" ||
      (stockFilter === "low" && isLowStock(product.stock)) ||
      (stockFilter === "out" && isOutOfStock(product.stock));
    return matchSearch && matchCategory && matchStock;
  });

  return (
    <section
      className={`flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5 ${
        scrollable ? "min-h-0 max-h-[min(58dvh,600px)] flex-1 xl:max-h-none" : ""
      } ${className}`}
    >
      <div className="mb-5 shrink-0 space-y-3">
        <div>
          <h3 className="font-[Poppins] text-lg font-semibold text-slate-800">Product Inventory</h3>
          <p className="text-sm text-slate-500">
            {products.length} products
            {(counts.low > 0 || counts.out > 0) && (
              <span>
                {" "}
                ·{" "}
                {counts.low > 0 && (
                  <span className="font-medium text-amber-700">{counts.low} low stock</span>
                )}
                {counts.low > 0 && counts.out > 0 && ", "}
                {counts.out > 0 && (
                  <span className="font-medium text-red-700">{counts.out} out of stock</span>
                )}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STOCK_FILTERS.map((f) => {
            const count =
              f.id === "low" ? counts.low : f.id === "out" ? counts.out : products.length;
            const active = stockFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStockFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? f.id === "out"
                      ? "bg-red-600 text-white"
                      : f.id === "low"
                        ? "bg-amber-500 text-white"
                        : "bg-slate-800 text-white"
                    : f.id === "out"
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : f.id === "low"
                        ? "bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {f.label}
                {f.id !== "all" && ` (${count})`}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-accent focus:bg-white sm:w-44 sm:shrink-0"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={
          scrollable
            ? "min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 scrollbar-thin"
            : ""
        }
      >
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            {stockFilter === "low"
              ? "No low-stock products match your search."
              : stockFilter === "out"
                ? "No out-of-stock products match your search."
                : "No products match your search."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
