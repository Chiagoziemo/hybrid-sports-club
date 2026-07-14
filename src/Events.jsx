/* global React, DS, Icon, NKicker, EVENT_FILTERS, PHOTO */
function Events() {
  const { Button, Badge } = window.DS;
  const events = window.useSupaEvents();
  const [filter, setFilter] = React.useState(EVENT_FILTERS[0]);
  const rows = events.filter((e) => e.category === filter);

  return (
    <section id="events" className="section blk-paper2">
      <div className="wrap">
        <div className="grid grid-events" style={{ gap: 56, alignItems: "flex-start" }}>
          {/* Left header column */}
          <div className="reveal">
            <NKicker n="03">Experiences</NKicker>
            <h2 className="d-big" style={{ margin: "20px 0 16px", color: "var(--navy-950)" }}>Discover our upcoming experiences.</h2>
            <p className="lede" style={{ color: "var(--text-secondary-light)", margin: "0 0 24px" }}>
              From easy weekly sessions to one-off days out. Save the date, bring a friend, and show up as you are.
            </p>
            <div className="ftabs">
              {EVENT_FILTERS.map((f) => (
                <button key={f} className={`ftab${f === filter ? " on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>

            {/* Membership gate — sessions are for members; point people to join first */}
            <div style={{ marginTop: 26, background: "var(--paper-0)", border: "1px solid var(--border-default-light)", borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name="lock" size={16} style={{ color: "var(--green-700)" }} />
                <span style={{ font: "var(--text-label-md)", fontWeight: 800, color: "var(--navy-950)" }}>Members come along</span>
              </div>
              <p style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", margin: "0 0 16px", textWrap: "pretty" }}>
                Weekly sessions are for members of the club — it's free to join, and takes a minute. Become one first, then show up to any of these.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <a href="#join" className="btn-pill"><Button variant="primary" size="md" icon={<Icon name="arrow-up-right" size={16} />} iconPosition="right" style={{ borderRadius: "var(--radius-full)" }}>Join to take part</Button></a>
                <a onClick={() => window.openRsvpModal()} className="btn-pill" style={{ cursor: "pointer" }}><Button variant="outline" size="md" style={{ borderRadius: "var(--radius-full)", color: "var(--navy-900)", borderColor: "var(--border-default-light)" }} onClick={() => window.openRsvpModal()}>RSVP to the festival</Button></a>
              </div>
              <p style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)", margin: "12px 0 0" }}>
                The anniversary festival is open to all — bring a friend.
              </p>
            </div>
          </div>

          {/* Right list */}
          <div className="reveal" style={{ minHeight: 380 }}>
            {rows.length === 0 && (
              <div style={{ font: "var(--text-body-md)", color: "var(--text-tertiary-light)", padding: "24px 0" }}>Nothing on the calendar here just yet — check back soon.</div>
            )}
            {rows.map((e, i) => (
              <div key={e.id} style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "22px 0", borderTop: i === 0 ? "none" : "1px solid var(--border-default-light)" }}>
                <img src={PHOTO(e.photo)} alt={e.name} style={{ width: 104, height: 84, objectFit: "cover", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div className="d-mid" style={{ fontSize: 22, color: "var(--navy-950)" }}>{e.name}</div>
                    {e.featured && <Badge tone="green" variant="solid">Featured</Badge>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", font: "var(--text-label-md)", color: "var(--navy-700)", margin: "7px 0 8px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="calendar-days" size={15} style={{ color: "var(--green-700)" }} />{e.dateLabel}{e.timeLabel ? ` · ${e.timeLabel}` : ""}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="map-pin" size={15} style={{ color: "var(--orange-600)" }} />{e.place}</span>
                  </div>
                  <p style={{ font: "var(--text-body-md)", color: "var(--text-secondary-light)", margin: 0, textWrap: "pretty" }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Events = Events;
