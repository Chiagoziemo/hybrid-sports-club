/* global React, Icon, NKicker, PHOTO, CLUB */
function About() {
  const points = [
    { icon: "sunrise", title: "How we started", blurb: "A handful of friends and one football pitch, a year ago. We just kept showing up — and so did everyone else." },
    { icon: "heart", title: "Why we're here", blurb: "To make it easy to move, meet people, and belong to something in a big city. Community over competition, always." },
  ];
  return (
    <section id="about" className="section blk-paper">
      <div className="wrap">
        <NKicker n="01">About</NKicker>
        <div className="grid cols-2" style={{ gap: 56, alignItems: "flex-end", marginTop: 22 }}>
          <div className="reveal">
            <h2 className="d-big" style={{ color: "var(--navy-950)" }}>
              A Lagos community built on <span className="ital">showing up</span> for each other.
            </h2>
          </div>
          <div className="reveal">
            <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0 }}>
              <strong style={{ color: "var(--navy-950)" }}>Founded in 2025</strong>, Hybrid is now {CLUB.members}+ people who
              trade the group chat for real grass, real water and real sunrise, every single week. Not just fitness —
              friendships that last well past the final whistle.
            </p>
          </div>
        </div>

        {/* Founded-at box + photos */}
        <div className="grid reveal" style={{ gridTemplateColumns: "1fr", gap: 20, marginTop: 48 }}>
          <div className="grid" style={{ gridTemplateColumns: "minmax(220px, 320px) 1fr", gap: 20, alignItems: "stretch" }}>
            <div className="blk-green" style={{ borderRadius: "var(--radius-lg)", padding: "32px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 260 }}>
              <div style={{ font: "var(--text-label-lg)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--navy-950)" }}>On the grass since</div>
              <div className="stat-num" style={{ color: "var(--navy-950)" }}>2025</div>
            </div>
            <div style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: 260, boxShadow: "var(--shadow-lg)" }}>
              <img src={PHOTO("drone-group-workout")} alt="Hybrid Sports Club group workout from above" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            </div>
          </div>

          <div className="grid cols-2" style={{ gap: 40, marginTop: 12 }}>
            {points.map((p) => (
              <div key={p.title} style={{ display: "flex", gap: 16 }}>
                <div className="benefit-ico"><Icon name={p.icon} size={22} /></div>
                <div>
                  <div style={{ font: "var(--text-title-lg)", fontWeight: 800, color: "var(--navy-950)" }}>{p.title}</div>
                  <div style={{ font: "var(--text-body-md)", color: "var(--text-secondary-light)", marginTop: 4 }}>{p.blurb}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.About = About;
