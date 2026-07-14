/* global React, Icon, DS */
// Responsive members shell.
//  - Desktop (≥ 900px): persistent left sidebar (nav + member card) with a
//    scrolling main content area to the right — a logged-in dashboard shell.
//  - Mobile (< 900px): collapses back to the phone-width column + the
//    existing floating bottom-nav pattern.
// The active screen is passed as `children`; the shell injects a `desktop`
// flag so each screen can widen its layout on desktop.

function useIsDesktop() {
  const q = "(min-width: 900px)";
  const [is, setIs] = React.useState(() => window.matchMedia(q).matches);
  React.useEffect(() => {
    const m = window.matchMedia(q);
    const on = (e) => setIs(e.matches);
    m.addEventListener ? m.addEventListener("change", on) : m.addListener(on);
    return () => { m.removeEventListener ? m.removeEventListener("change", on) : m.removeListener(on); };
  }, []);
  return is;
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "home" },
  { key: "events", label: "Events", icon: "calendar-days" },
  { key: "volunteer", label: "Volunteer", icon: "handshake" },
  { key: "profile", label: "Profile", icon: "user" },
];

function MemberChip({ account, compact }) {
  const { Avatar } = window.DS;
  const streak = account.streak || { current: 0 };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <Avatar name={account.name} ring size={compact ? 40 : 44} />
      <div style={{ minWidth: 0 }}>
        <div style={{ font: "var(--text-title-md)", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{account.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
          <Icon name="flame" size={13} style={{ color: "var(--orange-400)" }} />
          <span style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>
            {streak.current > 0 ? `${streak.current}-week streak` : "No streak yet"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ account, active, onChange, onLogout }) {
  return (
    <aside style={{
      width: 268, flexShrink: 0, height: "100dvh", position: "sticky", top: 0,
      background: "var(--navy-900)", borderRight: "1px solid var(--border-subtle-dark)",
      display: "flex", flexDirection: "column", padding: "26px 18px 20px",
    }}>
      <div style={{ padding: "2px 10px 26px" }}>
        <window.Logo height={30} dark />
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV_ITEMS.map((n) => {
          const on = active === n.key;
          return (
            <button key={n.key} onClick={() => onChange(n.key)} style={{
              display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left",
              padding: "12px 14px", borderRadius: "var(--radius-md)", cursor: "pointer",
              border: "1px solid " + (on ? "var(--border-subtle-dark)" : "transparent"),
              background: on ? "var(--navy-800)" : "transparent",
              color: on ? "#fff" : "var(--navy-200)",
              font: "var(--text-label-lg)",
              transition: "background var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
            }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(228,232,245,0.05)"; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ color: on ? "var(--accent-primary)" : "var(--navy-400)", display: "inline-flex" }}>
                <Icon name={n.icon} size={20} />
              </span>
              {n.label}
            </button>
          );
        })}
      </nav>

      <div style={{
        marginTop: 16, padding: 14, borderRadius: "var(--radius-md)",
        background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)",
        display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between",
      }}>
        <button onClick={() => onChange("profile")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flex: 1, minWidth: 0 }}>
          <MemberChip account={account} compact />
        </button>
        <button onClick={onLogout} title="Log out" aria-label="Log out" style={{
          flexShrink: 0, width: 34, height: 34, borderRadius: "var(--radius-full)",
          background: "transparent", border: "1px solid var(--border-subtle-dark)", cursor: "pointer",
          color: "var(--navy-300)", display: "flex", alignItems: "center", justifyContent: "center",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-secondary)"; e.currentTarget.style.borderColor = "var(--accent-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--navy-300)"; e.currentTarget.style.borderColor = "var(--border-subtle-dark)"; }}>
          <Icon name="log-out" size={16} />
        </button>
      </div>
    </aside>
  );
}

function MembersShell({ account, tab, onChange, onLogout, children }) {
  const desktop = useIsDesktop();
  const screen = React.cloneElement(children, { desktop });

  if (desktop) {
    return (
      <div style={{ display: "flex", minHeight: "100dvh", background: "var(--navy-950)" }}>
        <Sidebar account={account} active={tab} onChange={onChange} onLogout={onLogout} />
        <main style={{ flex: 1, minWidth: 0, position: "relative", overflowX: "hidden" }}>
          {screen}
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-scroll">{screen}</div>
      <window.MembersBottomNav active={tab} onChange={onChange} />
    </div>
  );
}

Object.assign(window, { useIsDesktop, MembersShell });
