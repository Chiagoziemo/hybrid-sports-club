/* global React, Icon */
function Sidebar({ screen, setScreen, onLogout, open, onClose }) {
  const items = [
    ["overview", "layout-dashboard", "Overview"],
    ["members", "users", "Members"],
    ["events", "calendar-heart", "Events"],
    ["calendar", "calendar-range", "Club Calendar"],
  ];
  return (
    <div className={"admin-sidebar" + (open ? " open" : "")} style={{
      width: 232, flexShrink: 0, background: "var(--navy-950)", color: "#fff",
      display: "flex", flexDirection: "column", height: "100vh", top: 0,
      borderRight: "1px solid var(--border-subtle-dark)",
    }}>
      <div style={{ padding: "22px 20px", borderBottom: "1px solid var(--border-subtle-dark)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <window.Logo height={28} dark />
          <div style={{ font: "var(--text-label-sm)", letterSpacing: "var(--tracking-wide-label)", textTransform: "uppercase", color: "var(--accent-primary)", marginTop: 10 }}>
            Organizer
          </div>
        </div>
        <button onClick={onClose} aria-label="Close menu" style={{
          display: "none", border: "none", background: "none", cursor: "pointer", color: "var(--navy-300)", padding: 4,
        }} className="admin-sidebar-close"><Icon name="x" size={20} /></button>
      </div>

      <nav style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
        {items.map(([key, icon, label]) => {
          const active = screen === key;
          return (
            <button key={key} onClick={() => { setScreen(key); if (onClose) onClose(); }} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
              borderRadius: "var(--radius-full)", border: "none", cursor: "pointer", textAlign: "left",
              background: active ? "var(--green-400)" : "transparent",
              color: active ? "var(--navy-950)" : "var(--navy-300)",
              font: "var(--text-label-lg)", fontWeight: active ? 800 : 500, fontFamily: "var(--font-body)",
              transition: "background var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
            }}>
              <Icon name={icon} size={19} style={{ color: active ? "var(--navy-950)" : "var(--navy-400)" }} />
              {label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: 16, borderTop: "1px solid var(--border-subtle-dark)", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 10, font: "var(--text-label-md)", color: "var(--navy-300)",
          background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "var(--font-body)",
        }}>
          <Icon name="log-out" size={16} /> Log out
        </button>
        <a href="Hybrid Sports Club.html" style={{
          display: "flex", alignItems: "center", gap: 10, font: "var(--text-label-md)", color: "var(--navy-300)",
        }}>
          <Icon name="arrow-left" size={16} /> Back to public site
        </a>
      </div>
    </div>
  );
}
window.Sidebar = Sidebar;
