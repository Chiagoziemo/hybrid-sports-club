/* global React, Icon, DS */
function RoleEditSheet({ role, eventId, onClose, onSaved }) {
  const { Sheet, Input, Button } = window.DS;
  const blank = { role: "", description: "", spots: 0, whatsapp_link: "", enabled: true };
  const [form, setForm] = React.useState(role ? { ...blank, ...role } : blank);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => { setForm(role ? { ...blank, ...role } : blank); }, [role]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    const payload = {
      event_id: eventId, role: form.role.trim(), description: form.description.trim() || null,
      spots: Number(form.spots) || 0, whatsapp_link: form.whatsapp_link.trim() || null, enabled: !!form.enabled,
    };
    const { error } = role && role.id
      ? await window.sb.from("event_volunteer_roles").update(payload).eq("id", role.id)
      : await window.sb.from("event_volunteer_roles").insert(payload);
    setSaving(false);
    if (error) { console.error(error); return; }
    onSaved();
  };

  return (
    <Sheet open={!!role} onClose={onClose} title={role && role.id ? "Edit role" : "Add role"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Role name" value={form.role} onChange={set("role")} placeholder="e.g. Setup Crew" />
        <Input label="Description" value={form.description} onChange={set("description")} placeholder="What this crew does" />
        <Input label="Spots" type="number" value={form.spots} onChange={set("spots")} placeholder="e.g. 6" />
        <Input label="WhatsApp group link" value={form.whatsapp_link} onChange={set("whatsapp_link")} placeholder="https://chat.whatsapp.com/..." />
        <label style={{ display: "flex", alignItems: "center", gap: 10, font: "var(--text-label-md)", color: "var(--navy-800)", cursor: "pointer" }}>
          <input type="checkbox" checked={!!form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />
          Open for sign-ups
        </label>
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={saving || !form.role.trim()} onClick={save}>
          {saving ? "Saving…" : "Save role"}
        </Button>
      </div>
    </Sheet>
  );
}

function RolesPanel({ eventId }) {
  const [roles, setRoles] = React.useState(null);
  const [editing, setEditing] = React.useState(null); // null = closed, {} = new, row = edit

  const load = React.useCallback(() => {
    window.sb.from("event_volunteer_roles").select("*").eq("event_id", eventId).order("created_at").then(({ data, error }) => {
      if (error) { console.error(error); setRoles([]); return; }
      setRoles(data || []);
    });
  }, [eventId]);
  React.useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Delete this role? Existing volunteer signups for it will remain, but it'll no longer be pickable.")) return;
    const { error } = await window.sb.from("event_volunteer_roles").delete().eq("id", id);
    if (error) { console.error(error); return; }
    load();
  };

  if (roles == null) {
    return <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)" }}>Loading…</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <window.DS.Button variant="primary" size="md" className="pillbtn" icon={<Icon name="plus" size={16} />} onClick={() => setEditing({})}>
          Add role
        </window.DS.Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roles.map((r) => (
          <div key={r.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
            borderRadius: "var(--radius-md)", padding: "14px 18px", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ font: "var(--text-title-md)", color: "var(--navy-900)" }}>{r.role}</span>
                {!r.enabled && (
                  <span style={{ font: "var(--text-label-sm)", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--paper-200)", color: "var(--text-tertiary-light)" }}>Closed</span>
                )}
              </div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", marginTop: 2 }}>
                {r.description || "No description"} · {r.spots} spots
              </div>
              <div style={{
                font: "var(--text-body-sm)", marginTop: 2, display: "flex", alignItems: "center", gap: 6,
                color: r.whatsapp_link ? "var(--green-700)" : "var(--text-tertiary-light)",
              }}>
                <Icon name="message-circle" size={13} />{r.whatsapp_link ? "WhatsApp link set" : "No WhatsApp link yet"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setEditing(r)} aria-label="Edit role" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--green-700)", padding: 6 }}>
                <Icon name="pencil" size={16} />
              </button>
              <button onClick={() => remove(r.id)} aria-label="Delete role" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--danger)", padding: 6 }}>
                <Icon name="trash-2" size={16} />
              </button>
            </div>
          </div>
        ))}
        {roles.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)", font: "var(--text-body-md)" }}>No roles yet for this event.</div>
        )}
      </div>
      <RoleEditSheet role={editing} eventId={eventId} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}
window.RolesPanel = RolesPanel;
