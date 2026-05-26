import { useAuth } from "../context/AuthContext.tsx";

export type NavKey = "visitors" | "users";

type NavItem = {
  key: NavKey;
  label: string;
};

const items: NavItem[] = [
  { key: "visitors", label: "Visitors" },
  { key: "users", label: "Users" },
];

type SidebarProps = {
  current: NavKey;
  onSelect: (key: NavKey) => void;
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ current, onSelect, isOpen, onClose }: SidebarProps) => {
  const { loginEmail, logout } = useAuth();

  const handleSelect = (key: NavKey) => {
    onSelect(key);
    onClose();
  };

  const initial = loginEmail ? loginEmail.charAt(0).toUpperCase() : "?";

  return (
    <>
      <div
        className={`sidebar-backdrop${isOpen ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sidebar${isOpen ? " is-open" : ""}`}
        aria-label="Primary"
      >
        <div className="sidebar-brand">
          Kitaab<span className="sidebar-brand-sub">Backoffice</span>
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="sidebar-section">Analytics</div>
        <nav className="sidebar-nav">
          {items.map((item) => {
            const isActive = current === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar-item${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleSelect(item.key)}
              >
                <span className="dot" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-avatar" aria-hidden="true">
              {initial}
            </span>
            <span className="sidebar-user-email" title={loginEmail ?? undefined}>
              {loginEmail ?? "Signed in"}
            </span>
          </div>
          <button
            type="button"
            className="sidebar-signout"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
