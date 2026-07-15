/* global React, DS, Icon, ACTIVITIES */
function JoinForm({ onJoined }) {
  const { Input, Select, Button, Tag } = window.DS;
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", heard: window.HOW_HEARD[0], birthday: "", activities: [] });
  const [err, setErr] = React.useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleActivity = (title) => setForm((f) => ({
    ...f,
    activities: f.activities.includes(title) ? f.activities.filter((t) => t !== title) : [...f.activities, title],
  }));

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Add your name.";
    if (!/[0-9]{7,}/.test(form.phone.replace(/\s/g, ""))) e.phone = "Add a valid WhatsApp number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Add a valid email.";
    if (!form.activities.length) e.activities = "Pick at least one activity.";
    setErr(e);
    if (Object.keys(e).length) return;
    onJoined({ ...form });
  };

  return (
    <div style={{
      background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)",
      borderRadius: "var(--radius-lg)", padding: 24, display: "flex", flexDirection: "column", gap: 16,
      maxWidth: 480, margin: "0 auto",
    }}>
      <Input label="Full name" placeholder="e.g. Ada Obi" value={form.name} onChange={set("name")} error={err.name} />
      <Input label="Phone / WhatsApp" placeholder="+234 800 000 0000" value={form.phone} onChange={set("phone")} error={err.phone} icon={<Icon name="phone" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
      <Input label="Email" placeholder="you@email.com" value={form.email} onChange={set("email")} error={err.email} icon={<Icon name="mail" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
      <Input label="Birthday" placeholder="DD / MM" value={form.birthday} onChange={set("birthday")} icon={<Icon name="cake" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
      <Select label="How did you hear about Hybrid?" value={form.heard} onChange={set("heard")} options={window.HOW_HEARD} />
      <div>
        <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-dark)", display: "block", marginBottom: 8 }}>
          Which activities are you into?
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ACTIVITIES.map((a) => (
            <Tag key={a.title} selected={form.activities.includes(a.title)} onClick={() => toggleActivity(a.title)}>
              {a.title}
            </Tag>
          ))}
        </div>
        {err.activities && <p style={{ font: "var(--text-body-sm)", color: "var(--danger)", margin: "6px 0 0" }}>{err.activities}</p>}
      </div>
      <Button variant="primary" size="lg" style={{ width: "100%" }} onClick={submit}>Become a member</Button>
    </div>
  );
}

window.JoinForm = JoinForm;
