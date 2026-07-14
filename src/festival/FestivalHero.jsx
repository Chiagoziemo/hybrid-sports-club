/* global React, Icon, PHOTO */
function FestivalCountdown({ target }) {
  const { d, h, m, s, done } = window.useCountdown(target);
  const cells = [["Days", d], ["Hrs", h], ["Min", m], ["Sec", s]];
  return (
    <div className="cd">
      {cells.map(([lab, val]) => (
        <div className="cd-cell" key={lab}>
          <div className="cd-num">{done ? "0" : String(val).padStart(2, "0")}</div>
          <div className="cd-lab">{lab}</div>
        </div>
      ))}
    </div>
  );
}

function FestivalHero() {
  const { Button } = window.DS;
  const events = window.useSupaEvents();
  const featured = events.find((e) => e.featured);
  const pill = { borderRadius: "var(--radius-full)" };

  return (
    <header id="top">
      <div style={{ position: "relative", overflow: "hidden", minHeight: "92vh", display: "flex", alignItems: "flex-end" }}>
        <img src={PHOTO("drone-group-workout")} alt="Drone view of the Hybrid Sports Club community working out together" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,7,13,0.94) 4%, rgba(5,7,13,0.55) 36%, rgba(5,7,13,0.12) 68%)" }} />

        <div className="wrap" style={{ position: "relative", paddingTop: 110, paddingBottom: 52, width: "100%" }}>
          <div className="reveal in" style={{ maxWidth: 980 }}>
            <div className="kicker-plain" style={{ color: "var(--green-300)", marginBottom: 20 }}>Special event · one year</div>

            <h1 className="d-huge" style={{ color: "#fff", margin: 0 }}>One community. One movement. One year.</h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              <span className="meta-chip"><Icon name="calendar-days" size={15} style={{ color: "var(--green-400)" }} />{featured ? featured.dateLabel : "Saturday, 1 August 2026"}</span>
              <span className="meta-chip"><Icon name="map-pin" size={15} style={{ color: "var(--orange-400)" }} />{featured ? featured.place : "Alaro City, Epe, Lagos"}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28, marginTop: 30 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#register" className="btn-pill"><Button variant="primary" size="lg" icon={<Icon name="arrow-up-right" size={18} />} iconPosition="right" style={pill}>Register now</Button></a>
                <a href="#itinerary" className="btn-pill"><Button variant="outline" size="lg" style={{ ...pill, color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>See the day</Button></a>
              </div>

              <div style={{
                maxWidth: 360, background: "rgba(5,7,13,0.55)", backdropFilter: "blur(10px)",
                border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: "20px 22px",
              }}>
                <p style={{ font: "var(--text-body-md)", color: "var(--paper-100)", margin: 0 }}>
                  A full-day celebration of fitness, sports, wellness, food and community. Everyone's welcome — bring a friend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {featured && featured.target && (
        <div className="blk-green">
          <div className="wrap" style={{ padding: "40px 24px 44px" }}>
            <div className="nkicker" style={{ color: "var(--navy-950)", marginBottom: 18 }}><span className="nk-num">!</span>Countdown to the festival</div>
            <FestivalCountdown target={featured.target} />
          </div>
        </div>
      )}
    </header>
  );
}
window.FestivalHero = FestivalHero;
