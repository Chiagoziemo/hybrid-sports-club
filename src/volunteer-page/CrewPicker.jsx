/* global React, DS, Icon, PHOTO */
function CrewPicker({ member, event }) {
  const { Input, Button, Toast } = window.DS;
  const [roles, setRoles] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [phone, setPhone] = React.useState(member.phone && !member.phone.startsWith("auth:") ? member.phone : "");
  const [done, setDone] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState({});

  React.useEffect(() => {
    let cancelled = false;
    window.fetchVolunteerRoles(event.dbId).then((r) => { if (!cancelled) setRoles(r); });
    return () => { cancelled = true; };
  }, [event.dbId]);

  const submit = async () => {
    const e = {};
    if (role == null) e.role = true;
    if (!/[0-9]{7,}/.test(phone.replace(/\s/g, ""))) e.phone = "Add a valid WhatsApp number.";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const { error } = await window.sb.from("volunteers").insert({
      event_id: event.dbId, member_id: member.id, role: roles[role].title,
      name: member.name, phone: phone.trim(), email: member.email,
    });
    setBusy(false);
    if (error) { console.error(error); return; }
    setDone(true);
    setToast(true);
    setTimeout(() => setToast(false), 3200);
  };

  if (roles == null) {
    return <p style={{ textAlign: "center", color: "var(--navy-300)" }}>Loading crew roles…</p>;
  }

  if (done) {
    return (
      <div className="reveal in" style={{
        background: "var(--navy-800)", border: "1px solid var(--accent-primary)",
        borderRadius: "var(--radius-lg)", padding: 24, display: "flex", gap: 16, alignItems: "center", maxWidth: 640, margin: "0 auto",
      }}>
        <div style={{
          flexShrink: 0, width: 52, height: 52, borderRadius: "var(--radius-full)",
          background: "var(--green-400)", color: "var(--navy-950)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon name="party-popper" size={26} /></div>
        <div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Thank you, {member.name.split(" ")[0]}! You're signed up for the {roles[role].title.split(/[,&]/)[0].trim().toLowerCase()} crew.</div>
          <div style={{ font: "var(--text-body-md)", color: "var(--navy-200)" }}>An organizer will confirm you, then we'll WhatsApp you the plan.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid cols-2 reveal in" style={{ marginBottom: 28 }}>
        {roles.map((r, i) => {
          const active = role === i;
          return (
            <button key={r.title} onClick={() => setRole(i)} style={{
              textAlign: "left", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start",
              background: active ? "var(--navy-700)" : "var(--navy-800)",
              border: `1px solid ${active ? "var(--accent-primary)" : "var(--border-subtle-dark)"}`,
              borderRadius: "var(--radius-md)", padding: 16,
              boxShadow: active ? "var(--shadow-glow-green)" : "none",
              transition: "border-color var(--duration-base) var(--ease-out), background var(--duration-base) var(--ease-out)",
            }}>
              <div style={{
                flexShrink: 0, width: 42, height: 42, borderRadius: "var(--radius-sm)",
                background: active ? "var(--accent-primary)" : "rgba(228,232,245,0.08)",
                color: active ? "var(--navy-950)" : "var(--accent-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={active ? "check" : r.icon} size={21} />
              </div>
              <div>
                <div style={{ font: "var(--text-title-md)", color: "#fff" }}>{r.title}</div>
                <div style={{ font: "var(--text-body-sm)", color: "var(--navy-200)" }}>{r.blurb}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="reveal in" style={{
        background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)",
        borderRadius: "var(--radius-lg)", padding: 24,
      }}>
        <div className="grid cols-2" style={{ alignItems: "end", gap: 16 }}>
          <Input label="Confirm your WhatsApp number" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} error={err.phone} icon={<Icon name="phone" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
          <Button variant="secondary" size="lg" onClick={submit} disabled={busy} style={{ width: "100%" }}>{busy ? "Signing you up…" : "Sign me up"}</Button>
        </div>
        <p style={{ font: "var(--text-body-sm)", color: err.role ? "var(--danger)" : "var(--text-tertiary-dark)", margin: "14px 0 0" }}>
          {role == null ? (err.role ? "Pick a crew above to continue." : "Pick a crew above, then confirm your number.") : `Selected: ${roles[role].title}`}
        </p>
      </div>
      <Toast message="You're on the crew! 🎉" tone="success" visible={toast} />
    </div>
  );
}
window.CrewPicker = CrewPicker;
