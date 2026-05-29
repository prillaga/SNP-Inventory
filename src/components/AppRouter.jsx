import DashboardStats from "./DashboardStats";
import TodaySalesBanner from "./TodaySalesBanner";
import ProductGrid from "./ProductGrid";
import SalesCartPanel from "./SalesCartPanel";
import CalendarWidget from "./CalendarWidget";
import DailySalesSummary from "./DailySalesSummary";
import RecentTransactions from "./RecentTransactions";
import StockAlertsPanel from "./StockAlertsPanel";
import { isLowStock, isOutOfStock } from "../utils/productStatus";
import AddProductPage from "./AddProductPage";
import DataBackupPanel from "./DataBackupPanel";
import PageHeader from "./PageHeader";
import { navItems } from "../data/mockData";
import {
  usePosStore,
  selectOrdersToday,
  selectDailyRevenue,
  selectTotalOrders,
  selectCompletedRevenue,
  selectDailyProfit,
} from "../store/usePosStore";
import { formatPHP } from "../utils/format";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

function HomeView({ searchQuery, onSearchChange }) {
  return (
    <>
      <TodaySalesBanner />
      <DashboardStats />
      <StockAlertsPanel />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px] xl:items-stretch xl:h-[calc(100dvh-14rem)] xl:min-h-[520px]">
        <div className="flex min-h-0 flex-col gap-4">
          <ProductGrid
            scrollable
            className="min-h-0 flex-1"
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <div className="shrink-0">
            <RecentTransactions />
          </div>
        </div>
        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain scrollbar-thin xl:max-h-full">
          <SalesCartPanel />
          <DailySalesSummary />
          <CalendarWidget />
        </aside>
      </div>
    </>
  );
}

function ProductsView({ searchQuery, onSearchChange }) {
  return (
    <>
      <PageHeader title="Products" description="Browse and search your full product catalog." />
      <ProductGrid searchQuery={searchQuery} onSearchChange={onSearchChange} />
    </>
  );
}

function AddSaleView({ searchQuery, onSearchChange }) {
  return (
    <>
      <PageHeader title="Add Sale" description="Add items to the cart and complete checkout." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px] xl:items-stretch xl:h-[calc(100dvh-11rem)] xl:min-h-[480px]">
        <ProductGrid
          scrollable
          className="min-h-0 flex-1"
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <aside className="min-h-0 xl:max-h-full">
          <SalesCartPanel />
        </aside>
      </div>
    </>
  );
}

function SalesHistoryView() {
  const recentTransactions = usePosStore((s) => s.recentTransactions);
  const ordersToday = usePosStore(selectOrdersToday);
  const dailyRevenue = usePosStore(selectDailyRevenue);
  const totalOrders = usePosStore(selectTotalOrders);
  const completedRevenue = usePosStore(selectCompletedRevenue);

  return (
    <>
      <PageHeader title="Sales History" description="All completed sales transactions." />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Orders today</p>
          <p className="text-2xl font-bold text-slate-800">{ordersToday}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Revenue today</p>
          <p className="text-2xl font-bold text-emerald-700">{formatPHP(dailyRevenue)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">All-time orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">All-time revenue</p>
          <p className="text-2xl font-bold">{formatPHP(completedRevenue)}</p>
        </div>
      </div>
      <RecentTransactions />
      {!recentTransactions.length && (
        <p className="mt-4 text-center text-sm text-slate-500">Complete a sale from Add Sale to record transactions.</p>
      )}
    </>
  );
}

function CustomersView() {
  const customers = usePosStore((s) => s.customers);
  const saveCustomer = usePosStore((s) => s.saveCustomer);
  const deleteCustomer = usePosStore((s) => s.deleteCustomer);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(null);

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || (c.phone || "").includes(q);
  });

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    saveCustomer(form);
    setForm(null);
  };

  return (
    <>
      <PageHeader title="Customers" description="Manage your customer database." />
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => setForm({ id: "", name: "", phone: "", email: "", notes: "" })}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="mb-6 rounded-2xl border bg-white p-5 shadow-card space-y-3">
          <input
            required
            placeholder="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button type="button" onClick={() => setForm(null)} className="rounded-xl border px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.phone || "—"}</td>
                <td className="px-4 py-3">{c.email || "—"}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setForm(c)} className="mr-2 text-accent">
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCustomer(c.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="p-8 text-center text-slate-500">No customers yet.</p>}
      </div>
    </>
  );
}

function ReportsView() {
  const products = usePosStore((s) => s.products);
  const dailyProfit = usePosStore(selectDailyProfit);
  const dailyRevenue = usePosStore(selectDailyRevenue);
  const completedRevenue = usePosStore(selectCompletedRevenue);
  const expenses = usePosStore((s) => s.expenses);
  const lowStock = products.filter((p) => isLowStock(p.stock)).sort((a, b) => a.stock - b.stock);
  const outOfStock = products.filter((p) => isOutOfStock(p.stock));
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <>
      <PageHeader title="Reports" description="Sales and inventory summary." />
      <DashboardStats />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Today&apos;s profit</p>
          <p className="text-xl font-bold text-emerald-700">{formatPHP(dailyProfit)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Today&apos;s sales</p>
          <p className="text-xl font-bold">{formatPHP(dailyRevenue)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">All-time revenue</p>
          <p className="text-xl font-bold">{formatPHP(completedRevenue)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Total expenses</p>
          <p className="text-xl font-bold text-red-600">{formatPHP(totalExpenses)}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">Low stock ({lowStock.length})</p>
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-sm text-amber-900 scrollbar-thin">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between gap-2 rounded-lg bg-amber-100/50 px-2 py-1.5">
                <span className="truncate">{p.name}</span>
                <span className="shrink-0 font-semibold">{p.stock} left</span>
              </li>
            ))}
            {!lowStock.length && <li>None</li>}
          </ul>
        </div>
        <div className="rounded-2xl border bg-red-50 p-4">
          <p className="font-semibold text-red-800">Out of stock ({outOfStock.length})</p>
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-sm text-red-900 scrollbar-thin">
            {outOfStock.map((p) => (
              <li key={p.id} className="rounded-lg bg-red-100/50 px-2 py-1.5">
                {p.name}
              </li>
            ))}
            {!outOfStock.length && <li>None</li>}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <DailySalesSummary />
      </div>
    </>
  );
}

function ExpensesView() {
  const expenses = usePosStore((s) => s.expenses);
  const saveExpense = usePosStore((s) => s.saveExpense);
  const deleteExpense = usePosStore((s) => s.deleteExpense);
  const [form, setForm] = useState(null);

  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <>
      <PageHeader title="Expenses" description="Track business expenses." />
      <p className="mb-4 text-sm font-semibold text-slate-700">Total expenses: {formatPHP(total)}</p>
      <button
        type="button"
        onClick={() => setForm({ id: "", description: "", amount: "", category: "General" })}
        className="mb-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Plus size={16} /> Add Expense
      </button>

      {form && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveExpense(form);
            setForm(null);
          }}
          className="mb-6 rounded-2xl border bg-white p-5 shadow-card space-y-3"
        >
          <input
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button type="button" onClick={() => setForm(null)} className="rounded-xl border px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-3">{e.description}</td>
                <td className="px-4 py-3 font-semibold">{formatPHP(e.amount)}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => setForm(e)} className="mr-2 text-accent">
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteExpense(e.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!expenses.length && <p className="p-8 text-center text-slate-500">No expenses recorded.</p>}
      </div>
    </>
  );
}

function UsersView() {
  return (
    <>
      <PageHeader title="Users" description="User accounts and roles (demo mode)." />
      <div className="rounded-2xl border bg-white p-6 shadow-card">
        <p className="text-sm text-slate-600">
          User management requires the cloud version with Supabase authentication. In this offline app you are
          logged in as <strong>Admin</strong>.
        </p>
      </div>
    </>
  );
}

function SettingsView() {
  const settings = usePosStore((s) => s.settings);
  const updateSettings = usePosStore((s) => s.updateSettings);
  const [storeName, setStoreName] = useState(settings.storeName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStoreName(settings.storeName);
  }, [settings.storeName]);

  const save = () => {
    updateSettings({ storeName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader title="Settings" description="Store preferences and data backup." />
      <div className="max-w-md rounded-2xl border bg-white p-6 shadow-card space-y-4 mb-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Store name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>
        <button type="button" onClick={save} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
          Save Settings
        </button>
        {saved && <p className="text-sm text-emerald-600">Settings saved automatically.</p>}
      </div>
      <DataBackupPanel />
    </>
  );
}

export default function AppRouter({ activeItem, searchQuery, onSearchChange }) {
  const page = navItems.find((n) => n.id === activeItem);

  let content;
  switch (activeItem) {
    case "products":
      content = <ProductsView searchQuery={searchQuery} onSearchChange={onSearchChange} />;
      break;
    case "add-sale":
      content = <AddSaleView searchQuery={searchQuery} onSearchChange={onSearchChange} />;
      break;
    case "sales-history":
      content = <SalesHistoryView />;
      break;
    case "customers":
      content = <CustomersView />;
      break;
    case "add-product":
      content = <AddProductPage />;
      break;
    case "reports":
      content = <ReportsView />;
      break;
    case "expenses":
      content = <ExpensesView />;
      break;
    case "users":
      content = <UsersView />;
      break;
    case "settings":
      content = <SettingsView />;
      break;
    case "home":
    default:
      content = <HomeView searchQuery={searchQuery} onSearchChange={onSearchChange} />;
      break;
  }

  return (
    <div key={activeItem} className="page-enter">
      {content}
      {!page && activeItem !== "home" && (
        <PageHeader title="Page not found" description={`Unknown section: ${activeItem}`} />
      )}
    </div>
  );
}
