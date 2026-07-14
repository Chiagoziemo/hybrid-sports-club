/* global React, Icon */
function RoleGroup({ role, people, onToggle }) {
  const [open, setOpen] = React.useState(false);
  const confirmed = people.filter((p) => p.status === "Confirmed").length;
  const pending = people.length - confirmed;
  return (
    <div style={{
      background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
      borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-sm)",
    }}>
      <button onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 20px", border: "none", background: "none", cursor: "pointer", textAlign: "left",
      }}>
        <div>
          <div style={{ font: "var(--text-title-md)", color: "var(--navy-900)" }}>{role}</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)", marginTop: 2 }}>
            {people.length} signed up
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-label-md)", color: "var(--green-700)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--green-500)" }} />{confirmed} confirmed
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-label-md)", color: "var(--orange-700)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--orange-500)" }} />{pending} pending
          </span>
          <Icon name={open ? "chevron-up" : "chevron-down"} size={16} style={{ color: "var(--text-tertiary-light)" }} />
        </div>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid var(--border-subtle-light)" }}>
          {people.map((p) => (
            <div key={p.id || p.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 20px", borderBottom: "1px solid var(--border-subtle-light)",
            }}>
              <span style={{ font: "var(--text-body-md)", color: "var(--navy-800)" }}>{p.name}</span>
              <button onClick={() => onToggle(p)} style={{
                font: "var(--text-label-sm)", letterSpacing: "var(--tracking-wide-label)", textTransform: "uppercase",
                padding: "5px 12px", borderRadius: "var(--radius-full)", cursor: "pointer", border: "none",
                background: p.status === "Confirmed" ? "var(--green-100)" : "var(--orange-100)",
                color: p.status === "Confirmed" ? "var(--green-700)" : "var(--orange-700)",
              }}>{p.status}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Role groups are derived from whatever role names actually appear in the
// data (event_volunteer_roles.role text), not a hardcoded list — a
// hardcoded list would silently drop any volunteer whose role text didn't
// match it exactly.
function VolunteersPanel({ volunteers, setVolunteers, eventName }) {
  const toggle = async (person) => {
    const wasConfirmed = person.status === "Confirmed";
    const nextLabel = wasConfirmed ? "Pending" : "Confirmed";
    const nextDb = wasConfirmed ? "pending_verification" : "confirmed";
    setVolunteers((all) => all.map((v) => (v === person ? { ...v, status: nextLabel } : v)));
    const { error } = await window.sb.from("volunteers").update({ status: nextDb }).eq("id", person.id);
    if (error) { console.error(error); setVolunteers((all) => all.map((v) => (v === person ? { ...v, status: person.status } : v))); }
  };
  const scoped = volunteers.filter((v) => v.event === eventName);
  const roles = Array.from(new Set(scoped.map((v) => v.role))).sort();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {roles.map((role) => (
        <RoleGroup key={role} role={role} people={scoped.filter((v) => v.role === role)} onToggle={toggle} />
      ))}
      {roles.length === 0 && (
        <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)", font: "var(--text-body-md)", background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)", borderRadius: "var(--radius-md)" }}>
          No volunteers signed up yet.
        </div>
      )}
    </div>
  );
}
window.VolunteersPanel = VolunteersPanel;
