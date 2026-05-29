import {
  usePosStore,
  selectDailyRevenue,
  selectDailyProfit,
  selectOrdersToday,
  selectProductsSoldToday,
  selectTotalOrders,
  selectCompletedRevenue,
} from "../store/usePosStore";
import { formatPHP } from "../utils/format";

export default function DailySalesSummary() {
  const dailyRevenue = usePosStore(selectDailyRevenue);
  const dailyProfit = usePosStore(selectDailyProfit);
  const ordersToday = usePosStore(selectOrdersToday);
  const productsSoldToday = usePosStore(selectProductsSoldToday);
  const totalOrders = usePosStore(selectTotalOrders);
  const completedRevenue = usePosStore(selectCompletedRevenue);
  const averageOrderValue = totalOrders > 0 ? completedRevenue / totalOrders : 0;

  const rows = [
    { label: "Total Sales (today)", value: formatPHP(dailyRevenue) },
    { label: "Daily Profit", value: formatPHP(dailyProfit), highlight: true },
    { label: "Orders Today", value: String(ordersToday) },
    { label: "Products Sold Today", value: String(productsSoldToday) },
    { label: "All-time Orders", value: String(totalOrders) },
    { label: "All-time Revenue", value: formatPHP(completedRevenue) },
    { label: "Average Order (all-time)", value: formatPHP(averageOrderValue) },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <h3 className="font-[Poppins] text-base font-semibold text-slate-800">Daily Sales Summary</h3>
      <p className="mb-4 text-sm text-slate-500">Saved automatically · works offline</p>

      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
              row.highlight ? "bg-emerald-50" : "bg-slate-50"
            }`}
          >
            <dt className="text-sm text-slate-600">{row.label}</dt>
            <dd
              className={`text-sm font-semibold ${
                row.highlight ? "text-emerald-700" : "text-slate-800"
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
