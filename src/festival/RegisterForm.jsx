/* global React, Icon, NKicker, GUEST_TYPES, FESTIVAL_ACTIVITIES */
function RegisterForm() {
  const { Input, Select, Button, Tag } = window.DS;
  const events = window.useSupaEvents();
  const featured = events.find((e) => e.featured);
  const [form, setForm] = React.useState({
    firstName: "", lastName: "", phone: "", email: "",
    guestType: GUEST_TYPES[0], corpName: "", communityName: "", activities: [],
  });
  const [err, setErr] = React.useState({});
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

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

  return (
    <section id="register" className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 620, marginBottom: 40 }}>
          <NKicker n="03">Register</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 12px", color: "var(--navy-950)" }}>Save your spot.</h2>
          <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0 }}>Free to attend. Tell us who's coming and what you're here for.</p>
        </div>

        <div className="reveal" style={{ maxWidth: 520, margin: "0 auto", background: "var(--navy-900)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", padding: 28 }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "12px 4px" }}>
              <div style={{ width: 60, height: 60, borderRadius: "var(--radius-full)", margin: "0 auto 16px", background: "var(--green-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={32} /></div>
              <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>You're in! See you on 1 August.</div>
              <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "8px 0 4px" }}>Saturday, 1 August 2026 · Alaro City, Epe, Lagos</p>
              <p style={{ font: "var(--text-body-sm)", color: "var(--navy-300)", margin: "0 0 20px" }}>Bring a friend — the more, the merrier.</p>
              <div className="btn-pill"><Button variant="secondary" size="md" icon={<Icon name="share-2" size={16} />} style={{ borderRadius: "var(--radius-full)" }}>Add a friend</Button></div>
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
              <div className="btn-pill"><Button variant="primary" size="lg" onClick={submit} disabled={submitting} style={{ width: "100%", marginTop: 4, borderRadius: "var(--radius-full)" }}>{submitting ? "Submitting…" : "Lock in my spot"}</Button></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
window.RegisterForm = RegisterForm;
