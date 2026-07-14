/* global React, Icon, DS, PHOTO */
// Event-scoped volunteering. The member FIRST picks which event they want
// to volunteer for (only events with events.volunteering_enabled=true
// appear), THEN sees that event's roles, fetched live from
// event_volunteer_roles. Submitting inserts into public.volunteers
// (status defaults to pending_verification — a real organizer approval,
// not the old instant-success localStorage write).

function VerificationPending() {
  return (
    <div style={{
      background: "var(--navy-800)", border: "1px solid var(--orange-400)", borderRadius: "var(--radius-lg)",
      padding: 20, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "var(--shadow-md)",
    }}>
      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "var(--radius-full)", background: "var(--orange-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="hourglass" size={20} />
      </div>
      <div>
        <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Verification pending</div>
        <p style={{ font: "var(--text-body-md)", color: "var(--navy-100)", margin: "6px 0 0" }}>
          Volunteering is a confirmed-members' thing. Once an organizer confirms you're part of the crew, come back here to pick an event.
        </p>
      </div>
    </div>
  );
}

function EventPicker({ events, onPick }) {
  const { Badge } = window.DS;
  if (!events.length) {
    return (
      <div style={{ background: "var(--navy-800)", border: "1px dashed var(--border-default-dark)", borderRadius: "var(--radius-lg)", padding: 28, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, margin: "0 auto 14px", borderRadius: "var(--radius-full)", background: "rgba(228,232,245,0.06)", color: "var(--navy-300)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="calendar-x" size={24} />
        </div>
        <div style={{ font: "var(--text-title-lg)", color: "#fff", marginBottom: 6 }}>No events need crew right now</div>
        <p style={{ font: "var(--text-body-md)", color: "var(--navy-300)", margin: 0 }}>
          Volunteering opens per event. We'll post in the WhatsApp group the moment an organizer opens sign-ups — check back soon.
        </p>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
      {events.map((e) => (
        <button key={e.id} onClick={() => onPick(e)} style={{
          display: "flex", alignItems: "center", gap: 14, textAlign: "left", cursor: "pointer",
          background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 12,
          border: "1px solid var(--border-subtle-dark)", width: "100%",
          transition: "border-color var(--duration-base) var(--ease-out)",
        }}
          onMouseEnter={(ev) => ev.currentTarget.style.borderColor = "var(--accent-primary)"}
          onMouseLeave={(ev) => ev.currentTarget.style.borderColor = "var(--border-subtle-dark)"}>
          <img src={PHOTO(e.photo)} alt="" style={{ width: 68, height: 68, borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Badge tone={e.featured ? "orange" : "green"} variant="subtle" style={{ marginBottom: 4 }}>Volunteering open</Badge>
            <div style={{ font: "var(--text-title-md)", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{e.dateLabel}</div>
          </div>
          <Icon name="chevron-right" size={20} style={{ color: "var(--navy-400)", flexShrink: 0 }} />
        </button>
      ))}
    </div>
  );
}

function RolePicker({ event, roles, role, onRole, onBack, onSubmit }) {
  const { Button, Badge } = window.DS;
  return (
    <div>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 0 14px", font: "var(--text-label-md)", color: "var(--navy-200)" }}>
        <Icon name="arrow-left" size={16} />Change event
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-md)", padding: 12 }}>
        <img src={PHOTO(event.photo)} alt="" style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Volunteering for</div>
          <div style={{ font: "var(--text-title-md)", color: "#fff" }}>{event.name}</div>
        </div>
      </div>

      {roles.length === 0 ? (
        <p style={{ font: "var(--text-body-md)", color: "var(--navy-300)" }}>No open roles for this event right now.</p>
      ) : (
        <div className="grid cols-2">
          {roles.map((r, i) => {
            const active = role === i;
            return (
              <button key={r.title} onClick={() => onRole(i)} style={{
                textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8,
                background: active ? "var(--navy-700)" : "var(--navy-800)",
                border: `1px solid ${active ? "var(--accent-primary)" : "var(--border-subtle-dark)"}`,
                borderRadius: "var(--radius-md)", padding: 14,
                boxShadow: active ? "var(--shadow-glow-green)" : "none",
                transition: "border-color var(--duration-base) var(--ease-out), background var(--duration-base) var(--ease-out)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: "var(--radius-sm)", background: active ? "var(--accent-primary)" : "rgba(228,232,245,0.08)", color: active ? "var(--navy-950)" : "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={active ? "check" : r.icon} size={19} />
                  </div>
                  {r.spots ? <Badge tone="neutral" variant="subtle">{r.spots} spots</Badge> : null}
                </div>
                <div>
                  <div style={{ font: "var(--text-title-md)", color: "#fff" }}>{r.title}</div>
                  <div style={{ font: "var(--text-body-sm)", color: "var(--navy-200)" }}>{r.blurb}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <Button variant="secondary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={role == null} onClick={onSubmit}>
          {role == null ? "Pick a role above" : `Sign me up as ${roles[role].title.split(/[,&]/)[0].trim()}`}
        </Button>
      </div>
    </div>
  );
}

// volunteers.role is free text (matches event_volunteer_roles.role by
// string, no FK) so the WhatsApp link for a confirmed application has to
// be looked up by event_id + role text, not a clean embedded join.
function MyVolunteerApps({ account }) {
  const [apps, setApps] = React.useState(null);

  const load = React.useCallback(async () => {
    const { data: rows, error } = await window.sb.from("volunteers")
      .select("id, role, status, event_id, events ( title )")
      .eq("member_id", account.id).order("created_at", { ascending: false });
    if (error) { console.error(error); setApps([]); return; }

    const confirmed = (rows || []).filter((r) => r.status === "confirmed");
    const linkMap = {};
    if (confirmed.length) {
      const eventIds = Array.from(new Set(confirmed.map((r) => r.event_id)));
      const { data: roleRows } = await window.sb.from("event_volunteer_roles")
        .select("event_id, role, whatsapp_link").in("event_id", eventIds);
      (roleRows || []).forEach((rr) => { linkMap[rr.event_id + "::" + rr.role] = rr.whatsapp_link; });
    }

    setApps((rows || []).map((r) => ({
      id: r.id, role: r.role, status: r.status, eventName: r.events ? r.events.title : "",
      whatsappLink: linkMap[r.event_id + "::" + r.role] || null,
    })));
  }, [account.id]);

  React.useEffect(() => { load(); }, [load]);

  if (!apps || apps.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
      <div style={{ font: "var(--text-label-md)", color: "var(--navy-300)" }}>Your crew applications</div>
      {apps.map((a) => (
        <div key={a.id} style={{
          background: "var(--navy-800)", border: "1px solid " + (a.status === "confirmed" ? "var(--accent-primary)" : "var(--border-subtle-dark)"),
          borderRadius: "var(--radius-md)", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ font: "var(--text-title-md)", color: "#fff" }}>{a.role}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{a.eventName}</div>
          </div>
          {a.status === "confirmed" ? (
            a.whatsappLink ? (
              <a href={a.whatsappLink} target="_blank" rel="noreferrer" className="btn-pill">
                <window.DS.Button variant="primary" size="sm" icon={<Icon name="message-circle" size={15} />} style={{ borderRadius: "var(--radius-full)" }}>Join WhatsApp group</window.DS.Button>
              </a>
            ) : (
              <span style={{ font: "var(--text-label-sm)", color: "var(--navy-300)" }}>Confirmed — group link coming soon</span>
            )
          ) : (
            <span style={{ font: "var(--text-label-sm)", padding: "5px 12px", borderRadius: "var(--radius-full)", background: "var(--orange-400)", color: "var(--navy-950)" }}>Pending</span>
          )}
        </div>
      ))}
    </div>
  );
}

function MembersVolunteer({ account, desktop }) {
  const allEvents = window.useSupaEvents();
  const [event, setEvent] = React.useState(null);
  const [roles, setRoles] = React.useState([]);
  const [role, setRole] = React.useState(null);
  const [done, setDone] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const volEvents = allEvents.filter((e) => e.volunteeringEnabled);

  const pickEvent = async (e) => {
    setEvent(e); setRole(null);
    const r = await window.fetchVolunteerRoles(e.dbId);
    setRoles(r);
  };
  const back = () => { setEvent(null); setRole(null); setRoles([]); };

  const submit = async () => {
    if (role == null || !event) return;
    setBusy(true);
    const { error } = await window.sb.from("volunteers").insert({
      event_id: event.dbId, member_id: account.id, role: roles[role].title,
      name: account.name, phone: account.phone, email: account.email,
    });
    setBusy(false);
    if (error) { console.error(error); return; }
    setDone(true);
  };

  const wrap = (children) => (
    desktop
      ? <div style={{ maxWidth: 860, margin: "0 auto", padding: "44px 48px 64px" }}>{children}</div>
      : <div style={{ paddingBottom: 108 }}><div style={{ padding: "52px 20px 40px" }}>{children}</div></div>
  );

  if (account.status !== "active") {
    return wrap(
      <div>
        <div className="kicker" style={{ color: "var(--accent-primary)" }}>Members' crew</div>
        <div className="screen-title" style={{ marginTop: 4, marginBottom: 18 }}>Help us run Hybrid.</div>
        <VerificationPending />
      </div>
    );
  }

  if (done) {
    const { Button } = window.DS;
    return wrap(
      <div>
        <div style={{ background: "var(--navy-800)", border: "1px solid var(--accent-primary)", borderRadius: "var(--radius-lg)", padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "var(--radius-full)", background: "var(--green-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="party-popper" size={24} />
          </div>
          <div>
            <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>You're signed up for the {roles[role].title.split(/[,&]/)[0].trim().toLowerCase()} crew.</div>
            <div style={{ font: "var(--text-body-md)", color: "var(--navy-200)" }}>For {event.name}. An organizer will confirm you, then we'll WhatsApp you the plan.</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Button variant="outline" size="md" className="pillbtn" icon={<Icon name="arrow-left" size={16} />} onClick={() => { setDone(false); back(); }}>Volunteer for another event</Button>
        </div>
      </div>
    );
  }

  const intro = (
    <div>
      <div className="kicker" style={{ color: "var(--accent-primary)" }}>Members' crew</div>
      <div className="screen-title" style={{ marginTop: 4 }}>{event ? "Pick your role." : "Which event?"}</div>
      <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "8px 0 0" }}>
        {event ? "Every role here keeps this one running." : "Choose the event you'd like to help run — roles are set per event."}
      </p>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginTop: 14,
        background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: "10px 14px",
        font: "var(--text-body-sm)", color: "var(--navy-200)",
      }}>
        <Icon name="user-check" size={16} style={{ color: "var(--accent-primary)" }} />
        Volunteering as <strong style={{ color: "#fff" }}>{account.name}</strong> · {account.phone}
      </div>
    </div>
  );

  return wrap(
    <div>
      <MyVolunteerApps account={account} />
      {intro}
      <div style={{ marginTop: 20 }}>
        {!event
          ? <EventPicker events={volEvents} onPick={pickEvent} />
          : <RolePicker event={event} roles={roles} role={role} onRole={setRole} onBack={back} onSubmit={busy ? () => {} : submit} />
        }
      </div>
    </div>
  );
}
window.MembersVolunteer = MembersVolunteer;
