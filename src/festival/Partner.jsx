/* global React, Icon */
function Partner() {
  const { Button } = window.DS;
  return (
    <section className="section blk-navy">
      <div className="wrap reveal" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <h2 className="d-big" style={{ margin: 0, color: "#fff" }}>Partner with the Hybrid community.</h2>
        <p className="lede" style={{ color: "var(--navy-200)", margin: "18px 0 30px" }}>
          Sponsor an activity zone, recovery station, nutrition, prizes or a community experience — and reach 700+ active Lagos professionals.
        </p>
        <a href="mailto:partnerships@hybridsportsclub.com" className="btn-pill"><Button variant="primary" size="lg" icon={<Icon name="mail" size={18} />} style={{ borderRadius: "var(--radius-full)" }}>Get in touch</Button></a>
      </div>
    </section>
  );
}
window.Partner = Partner;
