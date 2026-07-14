/* global React, Icon, DS */
function Profile({ account, onLogout, onViewHistory, onToggleLeaderboard, desktop }) {
  const { Badge, Switch } = window.DS;
  const { streak, history, badges } = account;
  const preview = history.slice(0, 3);
  const shown = account.showOnLeaderboard !== false;

  return (
    <div style={desktop ? { maxWidth: 920, margin: "0 auto", padding: "44px 48px 64px" } : { paddingBottom: 108 }}>
      <div style={{ padding: desktop ? 0 : "52px 20px 4px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: "var(--radius-full)", flexShrink: 0, boxShadow: "0 0 0 2px var(--navy-950), 0 0 0 4px var(--accent-primary)" }}>
          <image-slot id="member-photo" shape="circle" placeholder="Add photo" style={{ width: "100%", height: "100%" }}></image-slot>
        </div>
        <div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{account.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{account.phone}</span>
            <Badge tone="green" variant="subtle" style={{ padding: "2px 8px", font: "600 10px/1.3 var(--font-body)", letterSpacing: "0.05em" }}>Verified member</Badge>
          </div>
          {account.email &&
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Icon name="mail" size={13} style={{ color: "var(--navy-400)" }} />
            <span style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{account.email}</span>
          </div>
          }
        </div>
      </div>
      <p style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-dark)", margin: desktop ? "10px 0 0" : "10px 20px 0" }}>
        This photo is also what your RSVP share cards use by default.
      </p>

      <div className="grid cols-2" style={{ padding: desktop ? 0 : "0 20px", marginTop: 22, maxWidth: desktop ? 420 : "none" }}>
        <div style={{ background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 16, textAlign: "center" }}>
          <div style={{ font: "var(--text-display-sm)", color: "#fff" }}>{streak.current}</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Week streak</div>
        </div>
        <div style={{ background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 16, textAlign: "center" }}>
          <div style={{ font: "var(--text-display-sm)", color: "#fff" }}>{streak.longest}</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Longest streak</div>
        </div>
      </div>

      <div style={{ padding: desktop ? 0 : "26px 20px 0", marginTop: 26 }}>
        <div className="kicker" style={{ color: "var(--text-tertiary-dark)", marginBottom: 10 }}>Badges</div>
        <div style={{ display: "grid", gridTemplateColumns: desktop ? "repeat(5, minmax(0, 96px))" : "repeat(5, 1fr)", gap: 8 }}>
          {badges.map((b) =>
          <div key={b.key} style={{ textAlign: "center" }}>
              <div style={{
              width: 52, height: 52, margin: "0 auto 6px", borderRadius: "var(--radius-full)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: b.earned ? "var(--green-400)" : "var(--navy-800)",
              color: b.earned ? "var(--navy-950)" : "var(--navy-500)",
              border: b.earned ? "none" : "1px dashed var(--border-default-dark)"
            }}>
                <Icon name={b.icon} size={22} />
              </div>
              <div style={{ font: "var(--text-body-sm)", color: b.earned ? "var(--navy-100)" : "var(--navy-500)", lineHeight: 1.2 }}>{b.label}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: desktop ? 0 : "26px 20px 0", marginTop: 26 }}>
        <div className="kicker" style={{ color: "var(--text-tertiary-dark)", marginBottom: 10 }}>Privacy</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-md)", padding: "14px 16px", maxWidth: desktop ? 520 : "none" }}>
          <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: "var(--radius-full)", background: "rgba(228,232,245,0.06)", color: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={shown ? "trophy" : "eye-off"} size={19} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "var(--text-title-md)", color: "#fff" }}>Show me on the leaderboard</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>
              {shown ? "Your name and streak appear in the public ranking." : "You're hidden from the ranking — your stats stay private to you."}
            </div>
          </div>
          <Switch checked={shown} onChange={(v) => onToggleLeaderboard && onToggleLeaderboard(v)} />
        </div>
      </div>

      <div style={{ padding: desktop ? 0 : "26px 20px 0", marginTop: 26 }} data-comment-anchor="966a0c19b7-div-55-7">
        <div className="kicker" style={{ color: "var(--text-tertiary-dark)", marginBottom: 10 }}>Check-in history</div>
        {history.length ?
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {preview.map((h, i) =>
          <div key={i}>
                <div style={{
              display: "flex", alignItems: "center", gap: 12, background: "var(--navy-800)",
              borderRadius: "var(--radius-md)", padding: "12px 14px"
            }}>
                  <Icon name="check-circle-2" size={18} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ font: "var(--text-body-md)", color: "#fff" }}>{h.event}</div>
                    <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{h.date}</div>
                  </div>
                </div>
                {/* Reserved: quick post-event rating prompt hook — a later
                 pass surfaces a one-tap rating here, right after check-in. */}
              </div>
          )}
            {history.length > preview.length &&
            <button onClick={onViewHistory} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
              background: "transparent", border: "1px solid var(--border-default-dark)", borderRadius: "var(--radius-md)",
              padding: "12px 14px", cursor: "pointer", font: "var(--text-label-md)", color: "var(--navy-100)",
            }}>
                See all {history.length} check-ins<Icon name="arrow-right" size={15} />
              </button>
            }
          </div> :

        <p style={{ font: "var(--text-body-md)", color: "var(--navy-300)" }}>No check-ins yet. RSVP to a session to start your streak.</p>
        }
      </div>

      <div style={{ padding: desktop ? 0 : "30px 20px 0", marginTop: 30, textAlign: "center" }}>
        <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", font: "var(--text-label-md)", color: "var(--navy-400)", padding: 8 }}>
          Log out
        </button>
      </div>
    </div>);

}
window.Profile = Profile;
