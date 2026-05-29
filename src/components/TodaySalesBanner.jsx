import { TrendingUp } from "lucide-react";
import { usePosStore } from "../store/usePosStore";
import { formatPHP } from "../utils/format";

export default function TodaySalesBanner() {
  const dailyRevenue = usePosStore((state) => state.dailyRevenue);
  const productsSoldToday = usePosStore((state) => state.productsSoldToday);
  const totalOrders = usePosStore((state) => state.totalOrders);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-5 text-white shadow-card sm:p-6">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-100">Today&apos;s Total Sales</p>
          <p className="mt-1 font-[Poppins] text-3xl font-bold tracking-tight sm:text-4xl">
            {formatPHP(dailyRevenue)}
          </p>
          <p className="mt-2 text-sm text-emerald-100">Santillan Native Products — live sales tracking</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs text-emerald-100">Products Sold</p>
            <p className="text-lg font-semibold">{productsSoldToday}</p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
            <p className="text-xs text-emerald-100">Orders</p>
            <p className="text-lg font-semibold">{totalOrders}</p>
          </div>
        </div>
      </div>
      <TrendingUp className="absolute -bottom-4 -right-2 h-28 w-28 text-white/10" />
    </section>
  );
}
