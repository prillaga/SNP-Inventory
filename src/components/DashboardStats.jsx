import { useMemo } from "react";
import {
  usePosStore,
  selectTotalProducts,
  selectDailyRevenue,
  selectDailyProfit,
  selectProductsSoldToday,
  selectOrdersToday,
} from "../store/usePosStore";
import { formatPHP } from "../utils/format";
import StatCard from "./StatCard";

export default function DashboardStats() {
  const totalProducts = usePosStore(selectTotalProducts);
  const dailyRevenue = usePosStore(selectDailyRevenue);
  const dailyProfit = usePosStore(selectDailyProfit);
  const productsSoldToday = usePosStore(selectProductsSoldToday);
  const ordersToday = usePosStore(selectOrdersToday);
  const products = usePosStore((s) => s.products);
  const cartCount = usePosStore((s) => s.cart.length);

  const inStock = products.filter((p) => p.stock > 0).length;

  const cards = useMemo(
    () => [
      {
        label: "Total Products",
        value: String(totalProducts),
        change: `${inStock} in stock`,
        color: "bg-blue-50 text-blue-700 border-blue-100",
      },
      {
        label: "Daily Revenue",
        value: formatPHP(dailyRevenue),
        change: "Today only",
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      },
      {
        label: "Products Sold Today",
        value: String(productsSoldToday),
        change: "Units checked out today",
        color: "bg-violet-50 text-violet-700 border-violet-100",
      },
      {
        label: "Orders Today",
        value: String(ordersToday),
        change: cartCount > 0 ? `${cartCount} lines in open cart` : "Completed checkouts today",
        color: "bg-amber-50 text-amber-700 border-amber-100",
      },
      {
        label: "Daily Profit",
        value: formatPHP(dailyProfit),
        change: "Selling price − cost (today)",
        color: "bg-teal-50 text-teal-700 border-teal-100",
      },
    ],
    [totalProducts, dailyRevenue, dailyProfit, productsSoldToday, ordersToday, inStock, cartCount]
  );

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
