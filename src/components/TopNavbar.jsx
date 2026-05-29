import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "../data/mockData";
import { formatPHP } from "../utils/format";

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TopNavbar({ onMenuToggle, todaySales = 0, pageTitle = "Dashboard" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:bg-slate-50 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="font-[Poppins] text-lg font-semibold text-slate-800 sm:text-xl">{pageTitle}</h2>
          <p className="hidden text-sm text-slate-500 sm:block">{BRAND.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 sm:text-xs">Today</p>
          <p className="text-sm font-bold text-emerald-800 sm:text-base">{formatPHP(todaySales)}</p>
        </div>
        <time className="hidden rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 lg:block md:text-sm">
          {formatDateTime(now)}
        </time>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <img
          src={BRAND.logo}
          alt="Store logo"
          className="hidden h-10 w-10 rounded-full border border-slate-200 object-cover sm:block"
        />
      </div>
    </header>
  );
}
