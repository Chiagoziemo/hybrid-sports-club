/* global React, Icon, DS */
// Friendly-competition leaderboard, backed by the real leaderboard_checkins()
// RPC + client-side streak math (src/data.jsx computeLeaderboard). Tone is
// celebratory, not cutthroat: the current member's own row is always
// surfaced (pinned if they're outside the shown range); the board is
// month-scoped by `sessions` (this month's check-ins).

function rankMeta(rank) {
  if (rank === 1) return { bg: "var(--green-400)", fg: "var(--navy-950)" };
  if (rank === 2) return { bg: "var(--orange-400)", fg: "var(--navy-950)" };
  if (rank === 3) return { bg: "var(--yellow-400)", fg: "var(--navy-950)" };
  return { bg: "rgba(228,232,245,0.08)", fg: "var(--navy-200)" };
}

function LbRow({ entry, rank, isYou }) {
  const { Avatar } = window.DS;
  const m = rankMeta(rank);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
      borderRadius: "var(--radius-md)",
      background: isYou ? "rgba(61,220,122,0.10)" : "var(--navy-800)",
      border: "1px solid " + (isYou ? "var(--accent-primary)" : "var(--border-subtle-dark)"),
    }}>
      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: "var(--radius-full)",
        background: m.bg, color: m.fg, display: "flex", alignItems: "center", justifyContent: "center",
        font: "800 13px/1 var(--font-display)",
      }}>{rank}</div>
      <Avatar name={entry.name} size={36} ring={rank <= 3} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ font: "var(--text-title-md)", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {isYou ? "You" : entry.name}
          </span>
          {isYou && <span style={{ font: "700 9.5px/1 var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--navy-950)", background: "var(--accent-primary)", padding: "3px 6px", borderRadius: "var(--radius-full)" }}>You</span>}
        </div>
        <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>{entry.sessions} sessions this month</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
          <Icon name="flame" size={14} style={{ color: "var(--orange-400)" }} />
          <span style={{ font: "var(--text-title-md)", color: "#fff" }}>{entry.streak}</span>
          <span style={{ font: "var(--text-body-sm)", color: "var(--navy-400)" }}>wk</span>
        </div>
      </div>
    </div>
  );
}

function LeaderboardHidden({ account, style }) {
  const st = (account && account.streak) || { current: 0, totalSessions: 0 };
  return (
    <div style={{
      background: "var(--navy-900)", border: "1px solid var(--border-subtle-dark)",
      borderRadius: "var(--radius-lg)", padding: 18, ...style,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div className="kicker" style={{ color: "var(--accent-primary)" }}>Your stats</div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff", marginTop: 3 }}>Just for you</div>
        </div>
        <div style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: "var(--radius-full)", background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", font: "var(--text-body-sm)", color: "var(--navy-200)" }}>
          <Icon name="eye-off" size={13} style={{ color: "var(--navy-400)" }} />Hidden
        </div>
      </div>
      <p style={{ font: "var(--text-body-sm)", color: "var(--navy-300)", margin: "8px 0 14px" }}>
        You're off the public leaderboard, so we're not showing the ranking. Your progress still counts — here it is.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "var(--radius-full)", background: "var(--orange-100)", color: "var(--orange-500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="flame" size={20} />
          </div>
          <div>
            <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{st.current} wk</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Current streak</div>
          </div>
        </div>
        <div style={{ background: "var(--navy-800)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "var(--radius-full)", background: "var(--green-100)", color: "var(--green-600)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="calendar-check" size={20} />
          </div>
          <div>
            <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>{st.totalSessions}</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Sessions</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, font: "var(--text-body-sm)", color: "var(--navy-400)" }}>
        <Icon name="settings" size={13} />Turn on "Show me on the leaderboard" in Profile to join the ranking.
      </div>
    </div>
  );
}

function Leaderboard({ account, limit = 5, style }) {
  const optedOut = account && account.showOnLeaderboard === false;
  const [rows, setRows] = React.useState(null);

  React.useEffect(() => {
    if (optedOut) return;
    let cancelled = false;
    window.fetchLeaderboard().then((list) => { if (!cancelled) setRows(list); });
    return () => { cancelled = true; };
  }, [optedOut]);

  if (optedOut) return <LeaderboardHidden account={account} style={style} />;

  if (rows == null) {
    return (
      <div style={{ background: "var(--navy-900)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: 18, textAlign: "center", color: "var(--navy-400)", ...style }}>
        Loading leaderboard…
      </div>
    );
  }

  const ranked = rows.map((e, i) => ({ ...e, rank: i + 1 }));
  const meIdx = ranked.findIndex((e) => e.memberId === account.id);
  const me = meIdx >= 0 ? ranked[meIdx] : null;
  const top = ranked.slice(0, limit);
  const youInTop = me && me.rank <= limit;

  return (
    <div style={{
      background: "var(--navy-900)", border: "1px solid var(--border-subtle-dark)",
      borderRadius: "var(--radius-lg)", padding: 18, ...style,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <div>
          <div className="kicker" style={{ color: "var(--accent-primary)" }}>Leaderboard</div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff", marginTop: 3 }}>Most consistent this month</div>
        </div>
      </div>
      <p style={{ font: "var(--text-body-sm)", color: "var(--navy-300)", margin: "2px 0 14px" }}>
        Ranked by attendance streak. Resets every month, so it's anyone's to climb.
      </p>

      {top.length === 0 && (
        <p style={{ font: "var(--text-body-sm)", color: "var(--navy-400)" }}>No check-ins yet — be the first on the board.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {top.map((e) => <LbRow key={e.memberId} entry={e} rank={e.rank} isYou={me && e.memberId === me.memberId} />)}
      </div>

      {me && !youInTop &&
        <div style={{ marginTop: 8 }}>
          <div style={{ textAlign: "center", color: "var(--navy-500)", font: "var(--text-body-sm)", padding: "4px 0" }}>· · ·</div>
          <LbRow entry={me} rank={me.rank} isYou />
        </div>
      }
    </div>
  );
}

window.Leaderboard = Leaderboard;
