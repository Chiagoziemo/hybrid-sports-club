/* global React, DS, Icon */
function RsvpsPanel({ rsvps, setRsvps, eventName }) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState({ key: "name", dir: 1 });
  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  const rows = rsvps.filter((r) => r.event === eventName)
    .filter((r) => (r.name + r.phone + r.activity).toLowerCase().includes(q.toLowerCase()))
    .slice()
    .sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (typeof av === "number") return (av - bv) * sort.dir;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });

  const toggleCheckIn = async (r) => {
    const prev = r.checkedIn;
    setRsvps((all) => all.map((x) => (x === r ? { ...x, checkedIn: !prev } : x)));
    const { error } = await window.sb.rpc("toggle_rsvp_check_in", { p_rsvp_id: r.id });
    if (error) { console.error(error); setRsvps((all) => all.map((x) => (x === r ? { ...x, checkedIn: prev } : x))); }
  };

  const cols = [["name", "Name"], ["phone", "Phone"], ["guests", "Guests"], ["activity", "Activity"]];

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
        background: "var(--paper-0)", border: "1px solid var(--border-default-light)",
        borderRadius: "var(--radius-md)", padding: "10px 14px", maxWidth: 340,
      }}>
        <Icon name="search" size={17} style={{ color: "var(--text-tertiary-light)" }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, activity"
          style={{ border: "none", outline: "none", flex: 1, font: "var(--text-body-md)", color: "var(--navy-900)", background: "transparent", fontFamily: "var(--font-body)" }} />
      </div>

      <div style={{
        background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
        borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.4fr 1fr", padding: "12px 20px", background: "var(--paper-100)", borderBottom: "1px solid var(--border-subtle-light)" }}>
          {cols.map(([key, label]) => (
            <button key={key} onClick={() => toggleSort(key)} style={{
              display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer",
              font: "var(--text-label-md)", color: "var(--text-secondary-light)", textAlign: "left", padding: 0,
            }}>
              {label}
              {sort.key === key && <Icon name={sort.dir === 1 ? "chevron-up" : "chevron-down"} size={13} />}
            </button>
          ))}
          <div style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>Checked in</div>
        </div>
        {rows.map((r, i) => (
          <div key={r.id || r.name + i} style={{
            display: "grid", gridTemplateColumns: "2fr 1.4fr 0.8fr 1.4fr 1fr", padding: "14px 20px",
            borderBottom: "1px solid var(--border-subtle-light)", alignItems: "center",
          }}>
            <div style={{ font: "var(--text-label-lg)", color: "var(--navy-900)" }}>{r.name}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>{r.phone}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>{r.guests}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>{r.activity}</div>
            <div>
              <window.DS.Switch checked={!!r.checkedIn} onChange={() => toggleCheckIn(r)}
                style={{ background: r.checkedIn ? "var(--green-500)" : "var(--paper-300)" }} />
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)", font: "var(--text-body-md)" }}>No RSVPs yet.</div>
        )}
      </div>
    </div>
  );
}
window.RsvpsPanel = RsvpsPanel;
