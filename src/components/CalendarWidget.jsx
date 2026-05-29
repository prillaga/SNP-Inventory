import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatMonthYear(date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default function CalendarWidget() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const today = new Date();

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [viewDate]);

  const shiftMonth = (delta) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[Poppins] text-base font-semibold text-slate-800">Calendar</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm font-medium text-slate-600">{formatMonthYear(viewDate)}</p>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="aspect-square" />;
          }
          const isToday = isSameDay(date, today);
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`aspect-square rounded-lg text-xs font-medium transition ${
                isToday
                  ? "bg-accent text-white shadow-md shadow-blue-500/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}
