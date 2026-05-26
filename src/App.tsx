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

  return (
    <div className="app">
      <Sidebar current={current} onSelect={setCurrent} />
      <main className="main">
        <div className="topbar">
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
