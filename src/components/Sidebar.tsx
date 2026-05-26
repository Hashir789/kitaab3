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
};

const Sidebar = ({ current, onSelect }: SidebarProps) => {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar-brand">
        Kitaab<span className="sidebar-brand-sub">Backoffice</span>
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
              onClick={() => onSelect(item.key)}
            >
              <span className="dot" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
