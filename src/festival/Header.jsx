/* global React, Icon */
function FestivalHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(5,7,13,0.5)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="Hybrid Sports Club.html" style={{ display: "flex", alignItems: "center" }}>
          <window.Logo height={30} dark />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="Hybrid Sports Club.html" style={{ display: "flex", alignItems: "center", gap: 6, font: "var(--text-label-md)", color: "#fff", opacity: 0.85 }}>
            <Icon name="arrow-left" size={15} />Back to site
          </a>
          <a href="#register" className="btn-pill" style={{ opacity: scrolled ? 1 : 0, transform: scrolled ? "none" : "translateY(-6px)", pointerEvents: scrolled ? "auto" : "none", transition: "opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)" }}>
            <window.DS.Button variant="primary" size="sm" style={{ borderRadius: "var(--radius-full)" }}>Register</window.DS.Button>
          </a>
        </div>
      </div>
    </div>
  );
}
window.FestivalHeader = FestivalHeader;
