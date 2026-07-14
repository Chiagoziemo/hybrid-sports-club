/* global React, Icon, NKicker, PHOTO, BENEFITS */
function Benefits() {
  return (
    <section id="benefits" className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 52px" }}>
          <NKicker n="02" style={{ justifyContent: "center" }}>Benefits</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 16px", color: "var(--navy-950)" }}>What you'll gain with us.</h2>
          <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0 }}>
            Hybrid is built on connection, support and movement. You come for a workout and leave with something
            steadier — not just fitness, but lasting friendships.
          </p>
        </div>

        <div className="grid reveal grid-benefits" style={{ gap: 48, alignItems: "center" }}>
          <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)", minHeight: 460 }}>
            <img src={PHOTO("group-stretch")} alt="Hybrid members stretching together" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div className="grid cols-2" style={{ gap: "36px 40px" }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{ display: "flex", gap: 16 }}>
                <div className="benefit-ico"><Icon name={b.icon} size={22} /></div>
                <div>
                  <div style={{ font: "var(--text-title-lg)", fontWeight: 800, color: "var(--navy-950)" }}>{b.title}</div>
                  <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", marginTop: 5 }}>{b.blurb}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Benefits = Benefits;
