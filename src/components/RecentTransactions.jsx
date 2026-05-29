import { usePosStore } from "../store/usePosStore";
import { formatPHP, formatTime } from "../utils/format";

export default function RecentTransactions() {
  const recentTransactions = usePosStore((state) => state.recentTransactions);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4">
        <h3 className="font-[Poppins] text-lg font-semibold text-slate-800">Recent Sales</h3>
        <p className="text-sm text-slate-500">Latest completed checkout transactions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-semibold">Time</th>
              <th className="px-3 py-2 font-semibold">Items</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              <th className="px-3 py-2 font-semibold">Total</th>
              <th className="px-3 py-2 font-semibold">Profit</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  No completed orders yet. Checkout a sale to see transactions here.
                </td>
              </tr>
            )}
            {recentTransactions.map((txn) => (
              <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700">
                  {formatTime(new Date(txn.time))}
                </td>
                <td className="max-w-xs truncate px-3 py-3 text-slate-600">{txn.items}</td>
                <td className="px-3 py-3 text-slate-600">{txn.itemCount}</td>
                <td className="px-3 py-3 font-semibold text-slate-800">{formatPHP(txn.total)}</td>
                <td className="px-3 py-3 font-semibold text-emerald-700">
                  {formatPHP(txn.profit ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
