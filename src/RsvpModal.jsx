/* global React, DS, Icon, PHOTO, GUEST_TYPES, FESTIVAL_ACTIVITIES */
// Festival-specific RSVP — reachable from anywhere on the site (nav, hero,
// events). Fields, copy and behavior mirror the Festival page's Register
// form 1:1, and both write to the same public.rsvps table (event_id =
// the featured event's row), so "RSVP here" and "register on the festival
// page" are genuinely the same signup.
function RsvpModal() {
  const { Input, Select, Button, Tag } = window.DS;
  const events = window.useSupaEvents();
  const featured = events.find((e) => e.featured);
  const [open, setOpen] = React.useState(false);
  const blank = { firstName: "", lastName: "", phone: "", email: "", guestType: GUEST_TYPES[0], corpName: "", communityName: "", activities: [] };
  const [form, setForm] = React.useState(blank);
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState({});

  React.useEffect(() => {
    const onOpen = () => { setOpen(true); setDone(false); };
    window.addEventListener("open-rsvp-modal", onOpen);
    return () => window.removeEventListener("open-rsvp-modal", onOpen);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleActivity = (a) => setForm((f) => ({
    ...f, activities: f.activities.includes(a) ? f.activities.filter((t) => t !== a) : [...f.activities, a],
  }));

  const submit = async () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Add your first name.";
    if (!form.lastName.trim()) e.lastName = "Add your last name.";
    if (!/[0-9]{7,}/.test(form.phone.replace(/\s/g, ""))) e.phone = "Add a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Add a valid email.";
    if (!form.activities.length) e.activities = "Pick at least one activity.";
    setErr(e);
    if (Object.keys(e).length || !featured) return;
    setSubmitting(true);
    const { error } = await window.sb.from("rsvps").insert({
      event_id: featured.dbId,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      interests: form.activities,
      guest_type: form.guestType,
      corp_name: form.guestType === "Corporate or partner guest" ? form.corpName.trim() || null : null,
      community_name: form.guestType === "Member of an invited community" ? form.communityName.trim() || null : null,
    });
    setSubmitting(false);
    if (error) { console.error(error); setErr({ submit: "Something went wrong — try again." }); return; }
    setDone(true);
  };

  const reset = () => { setDone(false); setForm(blank); setOpen(false); };

  if (!open || !featured) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, background: "var(--overlay-scrim)", backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={`RSVP to ${featured.name}`}
        style={{
          width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto",
          background: "var(--navy-900)", borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)", animation: "hsc-rsvp-in 220ms var(--ease-out)",
        }}
      >
        <div style={{ position: "relative", height: 128, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", overflow: "hidden" }}>
          <img src={PHOTO(featured.photo)} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--navy-900) 6%, rgba(9,12,20,0.35) 60%, rgba(9,12,20,0.1) 100%)" }} />
          <button onClick={() => setOpen(false)} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer", background: "rgba(9,12,20,0.55)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={18} />
          </button>
          <span style={{ position: "absolute", left: 16, top: 14, font: "var(--text-label-sm)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--navy-950)", background: "var(--green-400)", padding: "5px 11px", borderRadius: "var(--radius-full)" }}>Festival RSVP</span>
        </div>

        <div style={{ padding: "18px 22px 24px" }}>
          <div style={{ font: "var(--text-title-lg)", fontWeight: 800, color: "#fff" }}>{featured.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, color: "var(--navy-200)", font: "var(--text-body-sm)" }}>
            <Icon name="calendar-days" size={15} style={{ color: "var(--accent-primary)" }} />
            {featured.dateLabel}{featured.timeLabel ? ` · ${featured.timeLabel}` : ""} · {featured.place}
          </div>

          <div style={{ height: 1, background: "var(--border-subtle-dark)", margin: "16px 0" }} />

          {done ? (
            <div style={{ textAlign: "center", padding: "4px 4px 4px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", margin: "0 auto 14px", background: "var(--green-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={30} /></div>
              <div style={{ font: "var(--text-title-lg)", color: "var(--text-primary-dark)" }}>You're in! See you on 1 August.</div>
              <p style={{ font: "var(--text-body-md)", color: "var(--text-secondary-dark)", marginTop: 6 }}>
                {featured.dateLabel}{featured.timeLabel ? ` · ${featured.timeLabel}` : ""} · {featured.place}
              </p>
              <div className="btn-pill"><Button variant="primary" size="md" style={{ marginTop: 16, borderRadius: "var(--radius-full)" }} onClick={reset}>Done</Button></div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="grid cols-2" style={{ gap: 14 }}>
                <Input label="First name" placeholder="Ada" value={form.firstName} onChange={set("firstName")} error={err.firstName} />
                <Input label="Last name" placeholder="Obi" value={form.lastName} onChange={set("lastName")} error={err.lastName} />
              </div>
              <Input label="Phone number" placeholder="+234 800 000 0000" value={form.phone} onChange={set("phone")} error={err.phone} icon={<Icon name="phone" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
              <Input label="Email address" placeholder="you@email.com" value={form.email} onChange={set("email")} error={err.email} icon={<Icon name="mail" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
              <Select label="Guest type" value={form.guestType} onChange={set("guestType")} options={GUEST_TYPES} />
              {form.guestType === "Corporate or partner guest" && (
                <Input label="Corporate body name" placeholder="e.g. First Ally Capital" value={form.corpName} onChange={set("corpName")} />
              )}
              {form.guestType === "Member of an invited community" && (
                <Input label="Invited community name" placeholder="e.g. Èkó Runners Club" value={form.communityName} onChange={set("communityName")} />
              )}
              <div>
                <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-dark)", display: "block", marginBottom: 8 }}>
                  Pick one or more activities you're here for
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {FESTIVAL_ACTIVITIES.map((a) => (
                    <Tag key={a} selected={form.activities.includes(a)} onClick={() => toggleActivity(a)}>{a}</Tag>
                  ))}
                </div>
                {err.activities && <p style={{ font: "var(--text-body-sm)", color: "var(--danger)", margin: "6px 0 0" }}>{err.activities}</p>}
              </div>
              {err.submit && <p style={{ font: "var(--text-body-sm)", color: "var(--danger)", margin: 0 }}>{err.submit}</p>}
              <div className="btn-pill"><Button variant="primary" size="lg" onClick={submit} disabled={submitting} style={{ width: "100%", marginTop: 2, borderRadius: "var(--radius-full)" }}>{submitting ? "Submitting…" : "Lock in my spot"}</Button></div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes hsc-rsvp-in { from { transform: translateY(12px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
window.RsvpModal = RsvpModal;
