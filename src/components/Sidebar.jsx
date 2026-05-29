import {
  Home,
  Package,
  Plus,
  ShoppingCart,
  History,
  Users,
  BarChart3,
  Wallet,
  UserCog,
  Settings,
} from "lucide-react";
import { navItems, BRAND } from "../data/mockData";

const iconMap = {
  Home,
  Package,
  Plus,
  ShoppingCart,
  History,
  Users,
  BarChart3,
  Wallet,
  UserCog,
  Settings,
};

export default function Sidebar({ activeItem, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-slate-200 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-700/60 px-5 py-5">
          <img
            src={BRAND.logo}
            alt={`${BRAND.name} logo`}
            className="h-11 w-11 rounded-full border-2 border-white/80 object-cover bg-white"
          />
          <div>
            <h1 className="font-[Poppins] text-sm font-semibold leading-tight text-white">{BRAND.name}</h1>
            <p className="text-xs text-slate-400">{BRAND.tagline}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = activeItem === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-white shadow-md shadow-emerald-900/30"
                        : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.25 : 2} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-700/60 px-5 py-4">
          <p className="text-xs text-slate-500">Native Products Store</p>
          <p className="text-sm font-medium text-slate-300">Inventory Dashboard</p>
          <p className="mt-1 text-[10px] text-emerald-400">Offline · localStorage</p>
        </div>
      </aside>
    </>
  );
}
