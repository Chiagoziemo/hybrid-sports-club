/* global React, Icon, DS, PHOTO */
function EventsList({ account, onRsvp, desktop }) {
  const { Badge, Button, Card, Sheet } = window.DS;
  const events = window.useSupaEvents();
  const [confirm, setConfirm] = React.useState(null); // event pending confirmation in the sheet

  return (
    <div style={desktop ? { maxWidth: 1120, margin: "0 auto", padding: "44px 48px 64px" } : { paddingBottom: 108 }}>
      <div style={desktop ? {} : { padding: "52px 20px 4px" }}>
        <div className="kicker" style={{ color: "var(--accent-primary)" }}>On the calendar</div>
        <div className="screen-title" style={{ marginTop: 4 }}>Upcoming sessions</div>
        <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "6px 0 0" }}>
          The featured one-off, plus the sessions that happen every week.
        </p>
      </div>

      <div style={desktop
        ? { marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }
        : { padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {events.map((e) => {
          const isCurrent = e.id === account.currentRsvpEventId;
          return (
            <Card key={e.id} variant="photo" image={PHOTO(e.photo)}>
              <Badge tone={e.featured ? "green" : "neutral"} variant="solid" style={{ marginBottom: 10 }}>{e.badge}</Badge>
              <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{e.name}</div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--navy-100)", marginTop: 3, marginBottom: 14 }}>
                {e.dateLabel}{e.timeLabel ? ` · ${e.timeLabel}` : ""} · {e.place}
              </div>
              {isCurrent ? (
                <Button variant="outline" size="md" className="pillbtn" icon={<Icon name="check" size={16} />} style={{ width: "100%" }} disabled>
                  You're in
                </Button>
              ) : (
                <Button variant={e.featured ? "primary" : "secondary"} size="md" className="pillbtn" style={{ width: "100%" }} onClick={() => setConfirm(e)}>
                  RSVP{e.featured ? " for the festival" : ""}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title={confirm ? `RSVP to ${confirm.name}` : ""}>
        {confirm && (
          <div>
            <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "0 0 4px" }}>
              {confirm.dateLabel}{confirm.timeLabel ? ` · ${confirm.timeLabel}` : ""}
            </p>
            <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "0 0 20px" }}>{confirm.place}</p>
            <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} onClick={() => { const id = confirm.id; setConfirm(null); onRsvp(id); }}>
              Confirm RSVP
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
window.EventsList = EventsList;
