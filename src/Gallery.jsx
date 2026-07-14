/* global React, DS, Icon, PHOTO, GALLERY, EVENT */
function Gallery() {
  const { Button } = window.DS;
  const [open, setOpen] = React.useState(null);

  React.useEffect(() => {
    if (open == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="gallery" className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
          <div style={{ maxWidth: 640 }}>
            <window.NKicker n="07">Gallery</window.NKicker>
            <h2 className="d-big" style={{ margin: "20px 0 16px", color: "var(--navy-950)" }}>
              A year on grass, sand and water.
            </h2>
            <p className="lede" style={{ color: "var(--text-secondary-light)", margin: 0 }}>
              Straight off our Saturdays, no filters, no stock. Tap any shot to open it.
            </p>
          </div>
          <a href="#join" className="btn-pill"><Button variant="primary" size="md" icon={<Icon name="arrow-right" size={16} />} iconPosition="right" style={{ borderRadius: "var(--radius-full)" }}>Add yourself to the next one</Button></a>
        </div>

        <div style={{ columns: "3", columnGap: 18 }} className="reveal">
          {GALLERY.map((g, i) => (
            <button key={g} onClick={() => setOpen(i)} style={{
              display: "block", width: "100%", padding: 0, border: "none", background: "none",
              cursor: "pointer", marginBottom: 16, breakInside: "avoid",
              borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-md)",
            }}>
              <img src={PHOTO(g)} alt="Hybrid Sports Club session" loading="lazy" style={{
                width: "100%", display: "block", transition: "transform var(--duration-slow) var(--ease-out)",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
            </button>
          ))}
        </div>
      </div>

      {open != null && (
        <div className="lb-backdrop" onClick={() => setOpen(null)}>
          <button onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + GALLERY.length) % GALLERY.length); }} style={lbNav("left")}>
            <Icon name="chevron-left" size={26} style={{ color: "#fff" }} />
          </button>
          <img src={PHOTO(GALLERY[open])} alt="" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: "min(92vw, 900px)", maxHeight: "86vh", objectFit: "contain",
            borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)",
          }} />
          <button onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % GALLERY.length); }} style={lbNav("right")}>
            <Icon name="chevron-right" size={26} style={{ color: "#fff" }} />
          </button>
          <button onClick={() => setOpen(null)} style={{ ...lbNav("right"), right: 16, top: 16, transform: "none" }}>
            <Icon name="x" size={24} style={{ color: "#fff" }} />
          </button>
        </div>
      )}
    </section>
  );
}

function lbNav(side) {
  return {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    [side]: 12, width: 46, height: 46, borderRadius: "var(--radius-full)",
    background: "rgba(228,232,245,0.12)", border: "1px solid var(--border-subtle-dark)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    backdropFilter: "blur(6px)",
  };
}
window.Gallery = Gallery;
