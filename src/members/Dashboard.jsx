/* global React, Icon, DS, PHOTO, CLUB */
// The member's personalized home base — NOT a second events list.
//  1. Personal greeting + prominent streak
//  2. THE one session they're next RSVP'd to (single focused card + share)
//  3. Leaderboard
//  4. A compact "coming up" teaser that links out to the full Events page

function SectionLabel({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
      <div className="kicker" style={{ color: "var(--text-tertiary-dark)" }}>{children}</div>
      {action &&
        <button onClick={onAction} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 3, font: "var(--text-label-md)", color: "var(--accent-primary)" }}>
          {action}<Icon name="arrow-right" size={14} />
        </button>
      }
    </div>
  );
}

function StreakHero({ account, desktop }) {
  const { streak } = account;
  const started = streak.totalSessions > 0;
  const dots = 8;
  const filled = Math.min(streak.current, dots);

  if (!started) {
    return (
      <div style={{ background: "var(--navy-800)", border: "1px dashed var(--border-default-dark)", borderRadius: "var(--radius-lg)", padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: "var(--radius-full)", background: "var(--orange-100)", color: "var(--orange-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="flame" size={22} />
        </div>
        <div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Start your streak</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Show up to your first session and the count begins.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(120deg, var(--navy-800), var(--navy-900))",
      border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)",
      padding: desktop ? 24 : 20, display: "flex", alignItems: "center", gap: desktop ? 28 : 18,
      flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "1 1 auto", minWidth: 200 }}>
        <div style={{ flexShrink: 0, width: 58, height: 58, borderRadius: "var(--radius-full)", background: "var(--orange-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-glow-orange)" }}>
          <Icon name="flame" size={30} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ font: "var(--text-display-sm)", color: "#fff", lineHeight: 1 }}>{streak.current}</span>
            <span style={{ font: "var(--text-title-md)", color: "var(--navy-200)" }}>week streak</span>
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
            {Array.from({ length: dots }).map((_, i) =>
              <span key={i} style={{ width: 9, height: 9, borderRadius: "var(--radius-full)", background: i < filled ? "var(--orange-400)" : "rgba(228,232,245,0.14)" }} />
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ background: "rgba(228,232,245,0.05)", borderRadius: "var(--radius-md)", padding: "12px 16px", textAlign: "center", minWidth: 80 }}>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{streak.longest}</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Best</div>
        </div>
        <div style={{ background: "rgba(228,232,245,0.05)", borderRadius: "var(--radius-md)", padding: "12px 16px", textAlign: "center", minWidth: 80 }}>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{streak.totalSessions}</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Sessions</div>
        </div>
      </div>
    </div>
  );
}

function NextSession({ current, onShare, onGoTab }) {
  const { Badge, Button, Card } = window.DS;
  if (!current) {
    return (
      <div style={{ background: "var(--navy-800)", border: "1px dashed var(--border-default-dark)", borderRadius: "var(--radius-lg)", padding: 24, textAlign: "center" }}>
        <div style={{ width: 46, height: 46, margin: "0 auto 12px", borderRadius: "var(--radius-full)", background: "rgba(228,232,245,0.06)", color: "var(--navy-300)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="calendar-plus" size={22} />
        </div>
        <div style={{ font: "var(--text-title-md)", color: "#fff", marginBottom: 4 }}>You're not booked in yet</div>
        <p style={{ font: "var(--text-body-sm)", color: "var(--navy-300)", margin: "0 0 16px" }}>Pick a session and we'll save your spot.</p>
        <Button variant="primary" size="md" className="pillbtn" onClick={() => onGoTab("events")}>Browse sessions</Button>
      </div>
    );
  }
  return (
    <div>
      <Card variant="photo" image={PHOTO(current.photo)} style={{ minHeight: 260 }}>
        <Badge tone="green" variant="solid" style={{ marginBottom: 10 }}>You're in</Badge>
        <div style={{ font: "var(--text-title-xl, var(--text-title-lg))", color: "#fff", fontSize: 26, fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.02em" }}>{current.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-body-sm)", color: "var(--navy-100)" }}>
            <Icon name="calendar" size={14} style={{ color: "var(--green-300)" }} />{current.dateLabel}{current.timeLabel ? ` · ${current.timeLabel}` : ""}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--text-body-sm)", color: "var(--navy-100)" }}>
            <Icon name="map-pin" size={14} style={{ color: "var(--green-300)" }} />{current.place}
          </span>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Button variant="primary" size="md" className="pillbtn" style={{ flex: 1 }} icon={<Icon name="share" size={16} />} onClick={() => onShare(current.id)}>Get my share card</Button>
        <Button variant="outline" size="md" className="pillbtn" style={{ flex: "0 0 auto" }} icon={<Icon name="calendar-days" size={16} />} onClick={() => onGoTab("events")}>All sessions</Button>
      </div>
    </div>
  );
}

function UpcomingStrip({ events, current, onGoTab }) {
  const { Badge } = window.DS;
  const list = events.filter((e) => e.id !== (current && current.id)).slice(0, 3);
  return (
    <div>
      <SectionLabel action="See all" onAction={() => onGoTab("events")}>Coming up</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((e) =>
          <button key={e.id} onClick={() => onGoTab("events")} style={{
            display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer",
            background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 10,
            border: "1px solid var(--border-subtle-dark)", width: "100%",
          }}>
            <img src={PHOTO(e.photo)} alt="" style={{ width: 52, height: 52, borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Badge tone={e.featured ? "orange" : "neutral"} variant="subtle" style={{ marginBottom: 3 }}>{e.badge}</Badge>
              <div style={{ font: "var(--text-title-md)", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{e.dateLabel}</div>
            </div>
            <Icon name="chevron-right" size={18} style={{ color: "var(--navy-400)", flexShrink: 0 }} />
          </button>
        )}
      </div>
    </div>
  );
}

function Dashboard({ account, onRsvp, onShare, onGoTab, desktop }) {
  const { Avatar } = window.DS;
  const events = window.useSupaEvents();
  const firstName = account.name.split(" ")[0];
  const current = events.find((e) => e.id === account.currentRsvpEventId);

  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
      <div>
        <div className="kicker" style={{ color: "var(--accent-primary)" }}>Welcome back</div>
        <div className="screen-title" style={{ marginTop: 4 }}>Hey {firstName}.</div>
      </div>
      {!desktop && <Avatar name={account.name} ring size={46} />}
    </div>
  );

  if (desktop) {
    return (
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "44px 48px 64px" }}>
        {header}
        <div style={{ marginTop: 22 }}><StreakHero account={account} desktop /></div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(340px,1fr)", gap: 24, marginTop: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div>
              <SectionLabel>Your next session</SectionLabel>
              <NextSession current={current} onShare={onShare} onGoTab={onGoTab} />
            </div>
            <UpcomingStrip events={events} current={current} onGoTab={onGoTab} />
          </div>
          <window.Leaderboard account={account} limit={6} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 108 }}>
      <div style={{ padding: "52px 20px 0" }}>{header}</div>
      <div style={{ padding: "20px 20px 0" }}><StreakHero account={account} /></div>
      <div style={{ padding: "26px 20px 0" }}>
        <SectionLabel>Your next session</SectionLabel>
        <NextSession current={current} onShare={onShare} onGoTab={onGoTab} />
      </div>
      <div style={{ padding: "26px 20px 0" }}>
        <window.Leaderboard account={account} limit={5} />
      </div>
      <div style={{ padding: "26px 20px 0" }}>
        <UpcomingStrip events={events} current={current} onGoTab={onGoTab} />
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
