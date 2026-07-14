/* global React, DS, Icon, EVENT_COLORS */
function EventCard({ e, stats, onOpen }) {
  const color = EVENT_COLORS[e.name] || "var(--navy-500)";
  return (
    <button onClick={onOpen} style={{
      textAlign: "left", cursor: "pointer", border: "1px solid var(--border-subtle-light)",
      background: "var(--paper-0)", borderRadius: "var(--radius-lg)", overflow: "hidden",
      boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: 5, background: color }} />
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          {e.featured && <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />}
          <div style={{ font: "var(--text-title-lg)", color: "var(--navy-900)" }}>{e.name}</div>
        </div>
        <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", marginBottom: 16 }}>
          {e.cadence} · {e.time} · {e.place}
        </div>
        <div style={{ display: "flex", gap: 16, borderTop: "1px solid var(--border-subtle-light)", paddingTop: 14 }}>
          <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>
            <strong style={{ color: "var(--navy-900)" }}>{stats.totalRsvps}</strong> RSVPs
          </span>
          <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>
            <strong style={{ color: "var(--navy-900)" }}>{stats.volunteersSignedUp}</strong> volunteers
          </span>
          <span style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>
            <strong style={{ color: "var(--navy-900)" }}>{stats.sponsorsConfirmed}</strong> sponsors
          </span>
        </div>
      </div>
    </button>
  );
}

function eventStats(eventName, rsvps, volunteers, sponsors) {
  const rows = rsvps.filter((r) => r.event === eventName);
  const vols = volunteers.filter((v) => v.event === eventName);
  const spons = sponsors.filter((s) => s.event === eventName);
  return {
    totalRsvps: rows.length,
    totalAttending: rows.reduce((n, r) => n + 1 + (Number(r.guests) || 0), 0),
    checkedIn: rows.filter((r) => r.checkedIn).length,
    volunteersSignedUp: vols.length,
    sponsorsConfirmed: spons.filter((s) => s.status === "Confirmed").length,
  };
}

function EventDetail({ event, rsvps, setRsvps, volunteers, setVolunteers, sponsors, setSponsors, onBack }) {
  const [tab, setTab] = React.useState("overview");
  const color = EVENT_COLORS[event.name] || "var(--navy-500)";
  const stats = eventStats(event.name, rsvps, volunteers, sponsors);
  const scopedVolunteers = volunteers.filter((v) => v.event === event.name);
  const roleNames = Array.from(new Set(scopedVolunteers.map((v) => v.role)));
  const byRole = roleNames.map((role) => ({
    label: role, count: scopedVolunteers.filter((v) => v.role === role).length,
  }));

  const tabs = [["overview", "Overview"], ["rsvps", "RSVPs"], ["volunteers", "Volunteers"], ["sponsors", "Sponsors"]];

  return (
    <div>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer",
        font: "var(--text-label-md)", color: "var(--text-secondary-light)", marginBottom: 16, padding: 0,
      }}><Icon name="arrow-left" size={15} />All events</button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: "var(--radius-full)", background: color }} />
        <h1 className="page-title" style={{ margin: 0 }}>{event.name}</h1>
      </div>
      <p style={{ font: "var(--text-body-md)", color: "var(--text-secondary-light)", margin: "0 0 20px" }}>
        {event.cadence} · {event.time} · {event.place}
      </p>

      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-subtle-light)", marginBottom: 24 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            border: "none", background: "none", cursor: "pointer", padding: "10px 16px",
            font: "var(--text-label-lg)", color: tab === key ? "var(--navy-900)" : "var(--text-tertiary-light)",
            borderBottom: tab === key ? "2px solid var(--accent-primary)" : "2px solid transparent",
          }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="admin-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 28 }}>
            <window.StatTile icon="clipboard-list" value={stats.totalRsvps} label="Total RSVPs" />
            <window.StatTile icon="users" value={stats.totalAttending} label="Total attending" />
            <window.StatTile icon="qr-code" value={stats.checkedIn} label="Checked in" accent="var(--accent-secondary)" />
            <window.StatTile icon="hand-heart" value={stats.volunteersSignedUp} label="Volunteers signed up" />
            <window.StatTile icon="handshake" value={stats.sponsorsConfirmed} label="Sponsors confirmed" accent="var(--accent-secondary)" />
          </div>
          <div style={{
            background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
            borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ font: "var(--text-title-lg)", color: "var(--navy-900)", marginBottom: 4 }}>Volunteers by category</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)", marginBottom: 20 }}>
              {stats.volunteersSignedUp} total signups across {roleNames.length} crews
            </div>
            <window.BarList rows={byRole} empty="No volunteers signed up yet." />
          </div>
        </div>
      )}
      {tab === "rsvps" && <window.RsvpsPanel rsvps={rsvps} setRsvps={setRsvps} eventName={event.name} />}
      {tab === "volunteers" && <window.VolunteersPanel volunteers={volunteers} setVolunteers={setVolunteers} eventName={event.name} />}
      {tab === "sponsors" && <window.SponsorsAdminPanel sponsors={sponsors} setSponsors={setSponsors} eventName={event.name} />}
    </div>
  );
}

function Events({ events, rsvps, setRsvps, volunteers, setVolunteers, sponsors, setSponsors }) {
  const [selected, setSelected] = React.useState(null);

  if (selected) {
    return (
      <EventDetail
        event={selected} rsvps={rsvps} setRsvps={setRsvps}
        volunteers={volunteers} setVolunteers={setVolunteers}
        sponsors={sponsors} setSponsors={setSponsors}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div>
      <window.PageHead title="Events" subtitle="Every upcoming or running event. Open one for its RSVPs, volunteers and sponsors." />
      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {events.map((e) => (
          <EventCard key={e.id} e={e} stats={eventStats(e.name, rsvps, volunteers, sponsors)} onOpen={() => setSelected(e)} />
        ))}
      </div>
    </div>
  );
}
window.EventsScreen = Events;
