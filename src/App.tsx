import { useState } from "react";
import Sidebar from "./components/Sidebar.tsx";
import type { NavKey } from "./components/Sidebar.tsx";
import VisitorsPage from "./pages/VisitorsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";

const titles: Record<NavKey, string> = {
  visitors: "Visitors",
  users: "Users",
};

const App = () => {
  const [current, setCurrent] = useState<NavKey>("visitors");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar
        current={current}
        onSelect={setCurrent}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main">
        <div className="topbar">
          <button
            type="button"
            className="topbar-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <span className="topbar-title">{titles[current]}</span>
        </div>
        <div className="content">
          {current === "visitors" ? <VisitorsPage /> : <UsersPage />}
        </div>
      </main>
    </div>
  );
};

export default App;
