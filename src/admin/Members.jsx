/* global React, Icon, DS */
// The missing link the old localStorage prototype never had: a real way
// for an organizer to approve or reject pending member signups
// (public.members.status). Without this screen, complete_member_signup's
// roster-check auto-confirms recognized names but anyone else would be
// stuck "pending" forever with no path to "confirmed".

function MembersPanel() {
  const [members, setMembers] = React.useState(null);
  const [filter, setFilter] = React.useState("pending_verification");
  const [busy, setBusy] = React.useState(null);

  const load = React.useCallback(() => {
    window.sb.from("members").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) { console.error(error); setMembers([]); return; }
      setMembers(data || []);
    });
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    setBusy(id);
    const { error } = await window.sb.from("members").update({ status }).eq("id", id);
    setBusy(null);
    if (error) { console.error(error); return; }
    load();
  };

  if (members == null) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary-light)" }}>Loading…</div>;
  }

  const rows = members.filter((m) => filter === "all" || m.status === filter);
  const tabs = [["pending_verification", "Pending"], ["confirmed", "Confirmed"], ["rejected", "Rejected"], ["all", "All"]];

  return (
    <div>
      <window.PageHead title="Members" subtitle="Approve new signups or manage the roster." />
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "var(--radius-full)",
            font: "var(--text-label-md)", fontWeight: 700,
            background: filter === key ? "var(--navy-950)" : "var(--paper-100)",
            color: filter === key ? "#fff" : "var(--navy-700)",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {rows.length === 0 && <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)" }}>No members here.</div>}
        {rows.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--border-subtle-light)", flexWrap: "wrap" }}>
            <div>
              <div style={{ font: "var(--text-label-lg)", color: "var(--navy-900)" }}>{m.name}</div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>
                {m.email || "—"} · {m.phone && !m.phone.startsWith("auth:") ? m.phone : "no phone yet"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <span style={{
                font: "var(--text-label-sm)", padding: "4px 10px", borderRadius: "var(--radius-full)",
                background: m.status === "confirmed" ? "var(--green-100)" : m.status === "rejected" ? "var(--paper-200)" : "var(--yellow-100)",
                color: m.status === "confirmed" ? "var(--green-700)" : m.status === "rejected" ? "var(--text-tertiary-light)" : "#8a6a00",
              }}>{m.status.replace("_", " ")}</span>
              {m.status !== "confirmed" &&
                <button disabled={busy === m.id} onClick={() => setStatus(m.id, "confirmed")} style={{ border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: "var(--radius-full)", background: "var(--green-500)", color: "#fff", font: "var(--text-label-sm)", fontWeight: 700 }}>Confirm</button>
              }
              {m.status !== "rejected" &&
                <button disabled={busy === m.id} onClick={() => setStatus(m.id, "rejected")} style={{ border: "1px solid var(--border-default-light)", cursor: "pointer", padding: "6px 12px", borderRadius: "var(--radius-full)", background: "transparent", color: "var(--navy-700)", font: "var(--text-label-sm)" }}>Reject</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.MembersPanel = MembersPanel;
