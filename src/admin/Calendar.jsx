/* global React, DS, Icon, EVENT_FILTERS */
// Real insert/update against public.events. The DB stores cadence+time as
// one combined `schedule` string (matching how the 3 original rows were
// already written, e.g. "Weekly · Saturdays, 7:00–10:00am"), so this form
// collects Schedule as a single field rather than splitting Cadence/Time.
// `type` isn't admin-editable — it defaults to 'Other' for new events and
// is left untouched on edits; `category` (matching the site's filter
// tabs) is the taxonomy the admin actually manages.
// events.date is stored as UTC timestamptz; the admin form works in
// Lagos local time (WAT, fixed UTC+1, no DST) since that's the only
// timezone this club operates in.
function isoToLagosLocalInput(iso) {
  if (!iso) return "";
  const lagos = new Date(new Date(iso).getTime() + 60 * 60 * 1000);
  return lagos.toISOString().slice(0, 16);
}
function lagosLocalInputToIso(local) {
  return local ? new Date(local + ":00+01:00").toISOString() : null;
}

function EditSheet({ event, onClose, onSave }) {
  const { Sheet, Input, Select, Button } = window.DS;
  const blank = { name: "", schedule: "", place: "", category: EVENT_FILTERS[0], tagline: "", volunteeringEnabled: false, dateLocal: "" };
  const toForm = (ev) => ({ ...blank, ...ev, dateLocal: isoToLagosLocalInput(ev.date) });
  const [form, setForm] = React.useState(event ? toForm(event) : blank);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => { setForm(event ? toForm(event) : blank); }, [event]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = async () => {
    setSaving(true);
    await onSave({ ...form, date: lagosLocalInputToIso(form.dateLocal) });
    setSaving(false);
  };
  return (
    <Sheet open={!!event} onClose={onClose} title={event && event.dbId ? "Edit event" : "Add event"}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Event name" value={form.name} onChange={set("name")} placeholder="e.g. Saturday Session" />
        <Select label="Category" value={form.category} onChange={set("category")} options={EVENT_FILTERS} />
        <Input label="Schedule" value={form.schedule} onChange={set("schedule")} placeholder="e.g. Weekly · Saturdays, 7:00–10:00am" />
        <Input label="Location" value={form.place} onChange={set("place")} placeholder="e.g. Hybrid Pitch, Lekki" />
        <Input label="Date & time (optional — for one-off events, enables 'Add to calendar')" type="datetime-local" value={form.dateLocal} onChange={set("dateLocal")} />
        <Input label="Tagline (optional)" value={form.tagline} onChange={set("tagline")} placeholder="Short one-line description" />
        <label style={{ display: "flex", alignItems: "center", gap: 10, font: "var(--text-label-md)", color: "var(--navy-800)", cursor: "pointer" }}>
          <input type="checkbox" checked={!!form.volunteeringEnabled} onChange={(e) => setForm((f) => ({ ...f, volunteeringEnabled: e.target.checked }))} />
          Open volunteering for this event
        </label>
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={saving} onClick={save}>{saving ? "Saving…" : "Save event"}</Button>
      </div>
    </Sheet>
  );
}

function CalendarRow({ e, onEdit, onDelete }) {
  return (
    <div className="admin-table-row" style={{
      display: "grid", gridTemplateColumns: "2fr 2fr 1.6fr 1.1fr", alignItems: "center",
      padding: "14px 20px", borderBottom: "1px solid var(--border-subtle-light)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {e.featured && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--green-500)" }} />}
        <span style={{ font: "var(--text-label-lg)", color: "var(--navy-900)" }}>{e.name}</span>
      </div>
      <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>{e.cadence}</div>
      <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>{e.place}</div>
      <div style={{ display: "flex", gap: 14 }}>
        <button onClick={() => onEdit(e)} style={{
          font: "var(--text-label-md)", color: "var(--green-700)", border: "none", background: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}><Icon name="pencil" size={14} />Edit</button>
        <button onClick={() => onDelete(e)} style={{
          font: "var(--text-label-md)", color: "var(--danger)", border: "none", background: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}><Icon name="trash-2" size={14} />Delete</button>
      </div>
    </div>
  );
}

function Calendar({ events }) {
  const { Button } = window.DS;
  const [editing, setEditing] = React.useState(null);

  const save = async (form) => {
    if (editing && editing.dbId) {
      const { error } = await window.sb.from("events").update({
        title: form.name, schedule: form.schedule, location: form.place,
        description: form.tagline || null, category: form.category,
        volunteering_enabled: !!form.volunteeringEnabled, date: form.date,
      }).eq("id", editing.dbId);
      if (error) { console.error(error); return; }
    } else {
      const { error } = await window.sb.from("events").insert({
        title: form.name, slug: window.slugify(form.name), type: "Other", category: form.category,
        schedule: form.schedule, location: form.place, description: form.tagline || null,
        volunteering_enabled: !!form.volunteeringEnabled, date: form.date,
      });
      if (error) { console.error(error); return; }
    }
    window.refreshEvents();
    setEditing(null);
  };

  const remove = async (e) => {
    if (!window.confirm(`Delete "${e.name}"? This permanently removes all its RSVPs, check-ins, volunteer roles and signups, and sponsor associations. This can't be undone.`)) return;
    const { error } = await window.sb.from("events").delete().eq("id", e.dbId);
    if (error) { console.error(error); return; }
    window.refreshEvents();
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <window.PageHead title="Club Calendar" subtitle="Recurring sessions plus one-off events. Edit any row, or add the next one." />
        <Button variant="primary" size="md" className="pillbtn" icon={<Icon name="plus" size={16} />} onClick={() => setEditing({})}>
          Add event
        </Button>
      </div>

      <div style={{
        background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
        borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)",
      }}>
        <div className="admin-table-scroll">
        <div className="admin-table-row" style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.6fr 0.8fr", padding: "12px 20px", background: "var(--paper-100)", borderBottom: "1px solid var(--border-subtle-light)" }}>
          {["Event", "Schedule", "Location", ""].map((h) => (
            <div key={h} style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>{h}</div>
          ))}
        </div>
        {events.map((e) => <CalendarRow key={e.id} e={e} onEdit={setEditing} onDelete={remove} />)}
        </div>
      </div>

      <EditSheet event={editing} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}
window.CalendarScreen = Calendar;
