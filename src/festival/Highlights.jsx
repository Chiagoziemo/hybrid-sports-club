/* global React, Icon, NKicker, FESTIVAL_HIGHLIGHTS */
function Highlights() {
  return (
    <section id="highlights" className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 620, marginBottom: 48 }}>
          <NKicker n="01">Festival highlights</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 0", color: "var(--navy-950)" }}>Six ways to spend your day.</h2>
        </div>
        <div className="grid cols-3 reveal">
          {FESTIVAL_HIGHLIGHTS.map((h) => (
            <div key={h.title} style={{ background: "var(--paper-0)", border: "1px solid var(--border-default-light)", borderRadius: "var(--radius-lg)", padding: "24px 22px" }}>
              <div className="benefit-ico" style={{ marginBottom: 16 }}><Icon name={h.icon} size={22} /></div>
              <div style={{ font: "var(--text-title-md)", fontWeight: 800, color: "var(--navy-950)" }}>{h.title}</div>
              <p style={{ font: "var(--text-body-md)", color: "var(--text-secondary-light)", margin: "8px 0 0" }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Highlights = Highlights;
