/* global React, NKicker, ITINERARY */
function Itinerary() {
  return (
    <section id="itinerary" className="section blk-navy">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 620, marginBottom: 48 }}>
          <NKicker n="02" style={{ color: "var(--green-400)" }}>Move through the day</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 0", color: "#fff" }}>One festival, five acts.</h2>
        </div>
        <div className="reveal timeline">
          {ITINERARY.map((row, i) => (
            <div className="tl-row" key={row.time}>
              <div className="tl-time">{row.time}</div>
              <div className="tl-rail"><div className="tl-dot" />{i < ITINERARY.length - 1 && <div className="tl-line" />}</div>
              <div className="tl-body">
                <div style={{ font: "var(--text-title-md)", fontWeight: 800, color: "#fff" }}>{row.title}</div>
                <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "6px 0 0" }}>{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Itinerary = Itinerary;
