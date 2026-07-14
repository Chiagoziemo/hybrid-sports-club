/* global React, DS, Icon, NKicker, TESTIMONIALS, PHOTO */
// Member testimonials — navy photo-quote panel (like the reference
// "Stories from the ..." block), green accents, no rainbow color-blocking.
function Testimonials() {
  const { Avatar } = window.DS;
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section id="testimonials" className="section blk-navy">
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <NKicker n="05" style={{ justifyContent: "center", color: "#fff" }}>Stories</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 14px", color: "#fff" }}>Stories from the pitch.</h2>
          <p className="lede" style={{ color: "var(--navy-100)", margin: 0 }}>
            Every Saturday makes a memory worth sharing. Here's what keeps our members coming back.
          </p>
        </div>

        <div className="grid grid-testimonials" style={{ gap: 20, alignItems: "stretch" }}>
          {/* Lead quote over photo */}
          <figure className="reveal" style={{ margin: 0, position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 30, boxShadow: "var(--shadow-lg)", background: `linear-gradient(to top, rgba(5,7,13,0.94) 8%, rgba(5,7,13,0.3) 60%, rgba(5,7,13,0.05) 100%), url(assets/photography/group-lie-down-stretch.jpeg) center/cover` }}>
            <Icon name="quote" size={34} style={{ color: "var(--green-400)", marginBottom: 12 }} />
            <blockquote style={{ font: "var(--text-title-xl)", fontWeight: 700, fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.28, color: "#fff", margin: "0 0 20px", textWrap: "pretty" }}>{lead.quote}</blockquote>
            <figcaption style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={lead.name} size={44} ring />
              <div>
                <div style={{ font: "var(--text-title-md)", fontWeight: 800, color: "#fff" }}>{lead.name}</div>
                <div style={{ font: "var(--text-label-md)", color: "var(--green-300)" }}>Member</div>
              </div>
            </figcaption>
          </figure>

          {/* Supporting quotes */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {rest.map((t) => (
              <figure key={t.name} style={{ margin: 0, background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <blockquote style={{ font: "var(--text-body-lg)", color: "var(--paper-100)", margin: "0 0 16px", lineHeight: 1.5, textWrap: "pretty" }}>{t.quote}</blockquote>
                <figcaption style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={t.name} size={38} />
                  <div style={{ font: "var(--text-title-md)", fontWeight: 800, color: "#fff" }}>{t.name}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Testimonials = Testimonials;
