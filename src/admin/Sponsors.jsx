/* global React, Icon */
const TIER_COLOR = {
  Title: "var(--yellow-500)", Gold: "var(--yellow-500)", Silver: "var(--navy-400)",
  Bronze: "var(--orange-500)", "In-kind": "var(--green-600)",
};
const STATUS_STYLE = {
  Confirmed: { bg: "var(--green-100)", fg: "var(--green-700)" },
  Pending: { bg: "var(--yellow-100)", fg: "#8a6a00" },
  "Follow-up": { bg: "var(--orange-100)", fg: "var(--orange-700)" },
  Declined: { bg: "var(--paper-200)", fg: "var(--text-tertiary-light)" },
};
const STATUSES = ["Confirmed", "Pending", "Follow-up", "Declined"];

function SponsorCard({ s, onStatus }) {
  const [editing, setEditing] = React.useState(false);
  const st = STATUS_STYLE[s.status] || STATUS_STYLE.Pending;
  return (
    <div style={{
      background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
      borderRadius: "var(--radius-md)", padding: 18, boxShadow: "var(--shadow-sm)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ font: "700 18px var(--font-display)", color: "var(--navy-900)" }}>{s.name}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: TIER_COLOR[s.tier] }} />
            <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>{s.tier} tier</span>
          </div>
        </div>
        <button onClick={() => setEditing((e) => !e)} style={{
          font: "var(--text-label-sm)", letterSpacing: "var(--tracking-wide-label)", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: "var(--radius-full)", cursor: "pointer", border: "none",
          background: st.bg, color: st.fg,
        }}>{s.status}</button>
      </div>

      {editing && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 0", borderTop: "1px solid var(--border-subtle-light)", borderBottom: "1px solid var(--border-subtle-light)" }}>
          {STATUSES.map((opt) => (
            <button key={opt} onClick={() => { onStatus(opt); setEditing(false); }} style={{
              font: "var(--text-label-sm)", padding: "5px 10px", borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-default-light)", cursor: "pointer",
              background: opt === s.status ? "var(--navy-900)" : "var(--paper-0)",
              color: opt === s.status ? "#fff" : "var(--navy-700)",
            }}>{opt}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>
          <Icon name="user" size={14} style={{ color: "var(--text-tertiary-light)" }} />{s.contact}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>
          <Icon name="mail" size={14} style={{ color: "var(--text-tertiary-light)" }} />{s.email}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>
          <Icon name="phone" size={14} style={{ color: "var(--text-tertiary-light)" }} />{s.phone}
        </div>
      </div>
    </div>
  );
}

function SponsorsAdminPanel({ sponsors, setSponsors, eventName }) {
  const setStatus = async (s, status) => {
    const prev = s.status;
    setSponsors((all) => all.map((x) => (x === s ? { ...x, status } : x)));
    const { error } = await window.sb.from("event_sponsors").update({ status }).eq("id", s.dbId);
    if (error) { console.error(error); setSponsors((all) => all.map((x) => (x === s ? { ...x, status: prev } : x))); }
  };
  const scoped = sponsors.filter((s) => s.event === eventName);
  return (
    <div className="admin-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {scoped.map((s) => (
        <SponsorCard key={s.dbId || s.name} s={s} onStatus={(status) => setStatus(s, status)} />
      ))}
      {scoped.length === 0 && (
        <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)", font: "var(--text-body-md)" }}>No sponsors yet.</div>
      )}
    </div>
  );
}
window.SponsorsAdminPanel = SponsorsAdminPanel;
