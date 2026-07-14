/* global React, DS, Icon, NKicker, HERO_STATS, PHOTO */
function CountdownBand({ event }) {
  const { d, h, m, s, done } = window.useCountdown(event.target);
  const cells = [["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]];
  return (
    <div className="cd">
      {cells.map(([lab, val]) =>
      <div className="cd-cell" key={lab}>
          <div className="cd-num">{done ? "0" : String(val).padStart(2, "0")}</div>
          <div className="cd-lab">{lab}</div>
        </div>
      )}
    </div>);

}

const AVATAR_NAMES = ["Tomiwa A", "Amara O", "Ife B", "Chidi E", "Zainab M"];

function Hero() {
  const { Button, Avatar } = window.DS;
  const events = window.useSupaEvents();
  const ev = events.find((e) => e.featured);
  const pill = { borderRadius: "var(--radius-full)" };

  return (
    <header id="top">
      {/* Full-bleed photo hero */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "flex-end" }}>
        <img src={PHOTO("group-photo-pitch")} alt="Hybrid Sports Club members on the pitch at sunrise" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,13,0.92) 2%, rgba(5,7,13,0.5) 34%, rgba(5,7,13,0.10) 66%)" }} />

        <div className="wrap" style={{ position: "relative", paddingTop: 96, paddingBottom: 52, width: "100%" }}>
          <div className="reveal in" style={{ maxWidth: 1000 }}>
            {/* avatar cluster + members count */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
              <div className="avatar-stack">
                {AVATAR_NAMES.map((n) => <Avatar key={n} name={n} size={42} />)}
              </div>
              <div style={{ color: "#fff" }}>
                <div style={{ font: "var(--text-title-lg)", fontWeight: 800, lineHeight: 1 }}>700+</div>
                <div style={{ font: "var(--text-label-md)", color: "var(--paper-200)" }}>active members</div>
              </div>
            </div>

            <h1 className="d-huge" style={{ color: "#fff", margin: 0 }}>Sweat, laughs, and good company.</h1>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28, marginTop: 30 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#join" className="btn-pill"><Button variant="primary" size="lg" icon={<Icon name="arrow-up-right" size={18} />} iconPosition="right" style={pill}>Join the club</Button></a>
                <a href="#events" className="btn-pill"><Button variant="outline" size="lg" style={{ ...pill, color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>See what's on</Button></a>
              </div>

              {/* floating description card, bottom-right per reference */}
              <div style={{
                maxWidth: 360, background: "rgba(5,7,13,0.55)", backdropFilter: "blur(10px)",
                border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: "20px 22px"
              }}>
                <p style={{ font: "var(--text-body-md)", color: "var(--paper-100)", margin: 0 }}>
                  We're 700+ Lagos people who show up on the grass every Saturday at 7am. Come as you
                  are, whatever your fitness level — move, breathe, then stick around for the people.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GREEN statement band — featured event countdown + giant stat trio */}
      <div className="blk-green">
        <div className="wrap" style={{ padding: "56px 24px 60px" }}>
          {ev && ev.target &&
          <div style={{ paddingBottom: 40, marginBottom: 44, borderBottom: "2px solid rgba(5,7,13,0.18)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 26 }}>
                <div>
                  <NKicker n="!" style={{ color: "var(--navy-950)", marginBottom: 14 }}>Coming up</NKicker>
                  <div className="d-mid" style={{ color: "var(--navy-950)", marginTop: 14 }}>{ev.name}</div>
                  <div style={{ font: "var(--text-label-lg)", color: "var(--navy-800)", marginTop: 8 }}>
                    {ev.dateLabel}{ev.timeLabel ? ` · ${ev.timeLabel}` : ""} · {ev.place}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <a className="btn-pill" onClick={() => window.openRsvpModal()} style={{ cursor: "pointer" }}>
                    <Button variant="secondary" size="lg" icon={<Icon name="check" size={18} />} style={{ borderRadius: "var(--radius-full)" }} onClick={() => window.openRsvpModal()}>{ev.cta || "RSVP now"}</Button>
                  </a>
                  <a href="Hybrid Sports Club Festival.html" className="btn-pill">
                    <Button variant="outline" size="lg" style={{ borderRadius: "var(--radius-full)", color: "var(--navy-950)", borderColor: "var(--navy-950)" }}>See festival details</Button>
                  </a>
                </div>
              </div>
              <CountdownBand event={ev} />
            </div>
          }
          <div className="grid cols-3" style={{ gap: 12 }}>
            {HERO_STATS.map((st) =>
            <div key={st.label}>
                <div className="stat-num" style={{ color: "var(--navy-950)" }}>{st.value}</div>
                <div className="stat-lab" style={{ color: "var(--navy-950)", marginTop: 8, opacity: 0.72 }}>{st.label}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>);

}
window.Hero = Hero;
