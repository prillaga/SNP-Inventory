import { useEffect, useState } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { usePosStore } from "./store/usePosStore";

console.log("Santillan POS — offline GitHub Pages build");

export default function App() {
  const ensureToday = usePosStore((s) => s.ensureToday);
  const [activeItem, setActiveItem] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const run = () => ensureToday();
    if (usePosStore.persist.hasHydrated()) {
      run();
    }
    return usePosStore.persist.onFinishHydration(run);
  }, [ensureToday]);

  const handleNavigate = (itemId) => {
    setActiveItem(itemId);
    setSidebarOpen(false);
  };

  return (
    <DashboardLayout
      activeItem={activeItem}
      onNavigate={handleNavigate}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((open) => !open)}
      onSidebarClose={() => setSidebarOpen(false)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}
