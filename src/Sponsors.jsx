/* global React, DS, Icon, SPONSORS */
function Sponsors() {
  const { Button } = window.DS;
  return (
    <section id="partners" className="section" style={{ background: "var(--paper-50)" }}>
      <div className="wrap" data-comment-anchor="92090fe49b-div-6-7">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
          <window.NKicker n="08" style={{ justifyContent: "center" }}>Partners</window.NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 16px", color: "var(--navy-950)" }}>
            Powered by partners who move with us.
          </h2>
          <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0 }}>
            Brands that show up with us, through gear, hydration, venues and this year's anniversary festival.
          </p>
        </div>

        <div className="grid reveal" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }} id="sponsor-grid">
          {SPONSORS.map((s) =>
          <div key={s.name} style={{
            display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
            minHeight: 108, padding: 18,
            background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)",
            borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)",
            transition: "transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)"
          }}
          onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-3px)";e.currentTarget.style.boxShadow = "var(--shadow-md)";}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = "none";e.currentTarget.style.boxShadow = "var(--shadow-sm)";}}>
              <img src={`assets/logos/sponsors/${s.logo}.png`} alt={s.name} style={{ maxWidth: "100%", maxHeight: 56, objectFit: "contain" }} />
            </div>
          )}
        </div>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-light)", textAlign: "center", marginTop: 14 }}>
          From the anniversary festival flyer, updated as new partners confirm.
        </p>

        <div className="reveal" style={{
          marginTop: 32, background: "var(--navy-950)", borderRadius: "var(--radius-lg)",
          padding: "28px 24px", display: "flex", flexWrap: "wrap", gap: 18,
          alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Want a booth in the Brand Village?</div>
            <div style={{ font: "var(--text-body-md)", color: "var(--navy-200)" }}>Reach 700+ active Lagos professionals at every Hybrid session and event.</div>
          </div>
          <a href="mailto:partnerships@hybridsportsclub.ng" className="btn-pill"><Button variant="primary" size="lg" icon={<Icon name="handshake" size={18} />} style={{ borderRadius: "var(--radius-full)" }}>Become a partner</Button></a>
        </div>
      </div>
    </section>);

}
window.Sponsors = Sponsors;
