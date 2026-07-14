/* global React, DS, NKicker, PHOTO, COLLABS */
// "Community & Collabs" — editorial full-bleed photo cards on paper.
function Collabs() {
  const { Badge } = window.DS;
  return (
    <section id="collabs" className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 820, marginBottom: 44 }}>
          <NKicker n="06">Community &amp; collabs</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 16px", color: "var(--navy-950)" }}>The moments we're proud of.</h2>
          <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0, maxWidth: 560 }}>
            A year of showing up got us into some good rooms — and onto some good pitches.
          </p>
        </div>

        <div className="grid cols-3 reveal">
          {COLLABS.map((c) => (
            <article key={c.stat} style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: 440, boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: `linear-gradient(to top, rgba(5,7,13,0.92) 8%, rgba(5,7,13,0.32) 54%, rgba(5,7,13,0.05) 100%), url(assets/photography/${c.photo}.jpeg) center/cover`, padding: 22 }}>
              <Badge tone="green" variant="solid" style={{ position: "absolute", top: 18, left: 18 }}>{c.tag}</Badge>
              <div className="d-mid" style={{ color: "#fff", marginBottom: 10 }}>{c.stat}</div>
              <p style={{ font: "var(--text-body-md)", color: "var(--paper-100)", margin: 0 }}>{c.line}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Collabs = Collabs;
