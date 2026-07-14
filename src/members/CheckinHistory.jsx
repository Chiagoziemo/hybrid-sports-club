/* global React, Icon, DS */
// Minimal full check-in history — reached from the Profile "See all" link.
// Chronological, grouped by month so it reads like a lightweight calendar
// of every session the member has shown up to.

function monthKey(dateStr) {
  // "Sat, 4 Jul 2026" -> "Jul 2026"
  const parts = (dateStr || "").replace(",", "").split(" ");
  return parts.length >= 4 ? `${parts[2]} ${parts[3]}` : dateStr;
}

function CheckinHistory({ account, onBack, desktop }) {
  const history = account.history || [];
  const groups = React.useMemo(() => {
    const out = [];
    history.forEach((h) => {
      const key = monthKey(h.date);
      let g = out.find((x) => x.key === key);
      if (!g) { g = { key, items: [] }; out.push(g); }
      g.items.push(h);
    });
    return out;
  }, [history]);

  return (
    <div style={desktop ? { maxWidth: 720, margin: "0 auto", padding: "44px 48px 64px" } : { paddingBottom: 108 }}>
      <div style={{ padding: desktop ? 0 : "52px 20px 4px" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 0 14px", font: "var(--text-label-md)", color: "var(--navy-200)" }}>
          <Icon name="arrow-left" size={16} />Back to profile
        </button>
        <div className="kicker" style={{ color: "var(--accent-primary)" }}>Your record</div>
        <div className="screen-title" style={{ marginTop: 4 }}>Check-in history</div>
        <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "8px 0 0" }}>
          Every session you've shown up to — {history.length} and counting.
        </p>
      </div>

      <div style={{ padding: desktop ? 0 : "0 20px", marginTop: 24, display: "flex", flexDirection: "column", gap: 22 }}>
        {groups.length ? groups.map((g) =>
          <div key={g.key}>
            <div style={{ font: "600 11px/1 var(--font-display)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary-dark)", marginBottom: 10 }}>{g.key}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((h, i) =>
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: "12px 14px", border: "1px solid var(--border-subtle-dark)" }}>
                  <Icon name="check-circle-2" size={18} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: "var(--text-body-md)", color: "#fff" }}>{h.event}</div>
                    <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{h.date}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ font: "var(--text-body-md)", color: "var(--navy-300)" }}>No check-ins yet. RSVP to a session to start your streak.</p>
        )}
      </div>
    </div>
  );
}
window.CheckinHistory = CheckinHistory;
