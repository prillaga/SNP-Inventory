import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import AppRouter from "./AppRouter";
import { navItems } from "../data/mockData";
import { usePosStore } from "../store/usePosStore";

export default function DashboardLayout({
  activeItem,
  onNavigate,
  sidebarOpen,
  onSidebarToggle,
  onSidebarClose,
  searchQuery,
  onSearchChange,
}) {
  const dailyRevenue = usePosStore((state) => state.dailyRevenue);
  const pageLabel = navItems.find((n) => n.id === activeItem)?.label || "Dashboard";

  const handleNavigate = (id) => {
    if (id === "suppliers") {
      onNavigate("add-product");
      return;
    }
    onNavigate(id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeItem={activeItem === "suppliers" ? "add-product" : activeItem}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={onSidebarClose}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuToggle={onSidebarToggle} todaySales={dailyRevenue} pageTitle={pageLabel} />

        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-[1600px]">
            <AppRouter
              activeItem={activeItem}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
