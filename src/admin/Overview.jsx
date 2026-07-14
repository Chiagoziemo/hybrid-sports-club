/* global React, Icon, CLUB, ACTIVITIES */
function StatTile({ icon, value, label, accent }) {
  return (
    <div style={{
      background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
      borderRadius: "var(--radius-md)", padding: 20, boxShadow: "var(--shadow-sm)",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: "var(--radius-sm)",
        background: "var(--navy-950)", color: accent || "var(--accent-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><Icon name={icon} size={19} /></div>
      <div style={{ font: "800 clamp(30px, 3vw, 38px)/1 var(--font-display)", letterSpacing: "-0.02em", color: "var(--navy-900)" }}>{value}</div>
      <div style={{ font: "var(--text-label-md)", color: "var(--text-secondary-light)" }}>{label}</div>
    </div>
  );
}

function BarList({ rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (!rows.length) return <p style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)" }}>{empty}</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r) => (
        <div key={r.label} className="barlist-row" style={{ display: "grid", gap: 12, alignItems: "center" }}>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-800)" }}>{r.label}</div>
          <div style={{ background: "var(--paper-100)", borderRadius: "var(--radius-full)", height: 10, overflow: "hidden" }}>
            <div style={{
              width: `${(r.count / max) * 100}%`, height: "100%",
              background: r.accent || "linear-gradient(90deg, var(--green-500), var(--green-400))",
              borderRadius: "var(--radius-full)", transition: "width var(--duration-slow) var(--ease-out)",
            }} />
          </div>
          <div style={{ font: "var(--text-label-md)", color: "var(--navy-700)", textAlign: "right" }}>{r.count}</div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      font: "var(--text-label-sm)", letterSpacing: "var(--tracking-wide-label)", textTransform: "uppercase",
      color: "var(--text-tertiary-light)", margin: "0 0 12px",
    }}>{children}</div>
  );
}

// Community-wide insights. Member count + activity-interest breakdown are
// live queries; sessionsRun/avgWeeklyAttendance stay as curated brand
// facts (CLUB) since they're historical rather than something derivable
// cleanly from a young club's check-in data yet.
function Overview() {
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ count: totalMembers }, { data: interestRows }] = await Promise.all([
        window.sb.from("members").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
        window.sb.from("members").select("interests").eq("status", "confirmed"),
      ]);
      if (cancelled) return;
      const tally = {};
      (interestRows || []).forEach((r) => (r.interests || []).forEach((i) => { tally[i] = (tally[i] || 0) + 1; }));
      const byInterest = Object.entries(tally)
        .sort((a, b) => b[1] - a[1])
        .map(([activity, count]) => ({ label: activity, count, accent: "linear-gradient(90deg, var(--green-500), var(--green-400))" }));
      setStats({ totalMembers: totalMembers || 0, byInterest });
    })();
    return () => { cancelled = true; };
  }, []);

  if (!stats) return <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary-light)" }}>Loading…</div>;

  return (
    <div>
      <PageHead title="Overview" subtitle="How the club is doing overall." />

      <SectionLabel>Community</SectionLabel>
      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <StatTile icon="users" value={stats.totalMembers} label="Confirmed members" />
        <StatTile icon="calendar-check" value={CLUB.sessionsRun} label="Sessions run to date" />
        <StatTile icon="activity" value={CLUB.avgWeeklyAttendance} label="Avg. weekly attendance" accent="var(--accent-secondary)" />
        <StatTile icon="dumbbell" value={ACTIVITIES.length} label="Sports & activities offered" />
      </div>

      <div style={{
        background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
        borderRadius: "var(--radius-lg)", padding: 24, boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ font: "var(--text-title-lg)", color: "var(--navy-900)", marginBottom: 4 }}>Members by activity interest</div>
        <div style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)", marginBottom: 20 }}>
          From join-form signups — members can pick more than one activity.
        </div>
        <BarList rows={stats.byInterest} empty="No member interest data yet." />
      </div>
    </div>
  );
}

function PageHead({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 className="page-title">{title}</h1>
      <p style={{ font: "var(--text-body-md)", color: "var(--text-secondary-light)", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

window.Overview = Overview;
window.PageHead = PageHead;
window.StatTile = StatTile;
window.BarList = BarList;
window.SectionLabel = SectionLabel;
