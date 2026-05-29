import { AlertTriangle, PackageX } from "lucide-react";
import { useMemo } from "react";
import { usePosStore } from "../store/usePosStore";
import { isLowStock, isOutOfStock } from "../utils/productStatus";

function StockList({ title, icon: Icon, items, emptyText, tone }) {
  const tones = {
    amber: {
      wrap: "border-amber-200 bg-amber-50/80",
      title: "text-amber-900",
      row: "hover:bg-amber-100/80",
      badge: "bg-amber-200 text-amber-900",
      empty: "text-amber-700/80",
    },
    red: {
      wrap: "border-red-200 bg-red-50/80",
      title: "text-red-900",
      row: "hover:bg-red-100/80",
      badge: "bg-red-200 text-red-900",
      empty: "text-red-700/80",
    },
  };
  const t = tones[tone];

  return (
    <div className={`rounded-2xl border p-4 shadow-card ${t.wrap}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className={t.title} />
        <h3 className={`font-[Poppins] text-sm font-semibold ${t.title}`}>
          {title} ({items.length})
        </h3>
      </div>
      {items.length === 0 ? (
        <p className={`text-sm ${t.empty}`}>{emptyText}</p>
      ) : (
        <ul className="max-h-52 space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {items.map((p) => (
            <li
              key={p.id}
              className={`flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm ${t.row}`}
            >
              <span className="min-w-0 truncate font-medium text-slate-800">{p.name}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${t.badge}`}>
                {p.stock <= 0 ? "0 left" : `${p.stock} left`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function StockAlertsPanel() {
  const products = usePosStore((s) => s.products);

  const { lowStock, outOfStock } = useMemo(() => {
    const low = [];
    const out = [];
    for (const p of products) {
      if (isOutOfStock(p.stock)) out.push(p);
      else if (isLowStock(p.stock)) low.push(p);
    }
    low.sort((a, b) => a.stock - b.stock);
    out.sort((a, b) => a.name.localeCompare(b.name));
    return { lowStock: low, outOfStock: out };
  }, [products]);

  if (!lowStock.length && !outOfStock.length) {
    return null;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <StockList
        title="Low stock"
        icon={AlertTriangle}
        items={lowStock}
        emptyText="All products have healthy stock levels."
        tone="amber"
      />
      <StockList
        title="Out of stock"
        icon={PackageX}
        items={outOfStock}
        emptyText="No products are out of stock."
        tone="red"
      />
    </section>
  );
}
