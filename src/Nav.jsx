/* global React, DS, Icon */
function Nav() {
  const { Button } = window.DS;
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
  ["About", "#about"], ["Events", "#events"],
  ["Join", "#join"], ["Gallery", "#gallery"]];


  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: (scrolled || mobileOpen) ? "var(--paper-50)" : "transparent",
      borderBottom: (scrolled || mobileOpen) ? "1px solid var(--border-default-light)" : "1px solid transparent",
      boxShadow: (scrolled || mobileOpen) ? "0 6px 24px rgba(10,15,28,0.08)" : "none",
      transition: "background var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)"
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <a href="#top" style={{ display: "flex", alignItems: "center" }}>
          <window.Logo height={34} dark={!(scrolled || mobileOpen)} data-comment-anchor="3d7c776315-img-17-7" />
        </a>
        <nav className="nav-links">
          {links.map(([label, href]) =>
          <a key={href} href={href} style={{
            font: "var(--text-label-md)", fontWeight: 700, color: scrolled ? "var(--navy-700)" : "#fff", whiteSpace: "nowrap",
            textTransform: "uppercase", letterSpacing: "0.02em", fontSize: 12.5,
            textShadow: scrolled ? "none" : "0 1px 8px rgba(5,7,13,0.45)",
            transition: "color var(--duration-base) var(--ease-out)",
          }} onMouseEnter={(e) => e.currentTarget.style.color = scrolled ? "var(--green-700)" : "var(--green-300)"}
          onMouseLeave={(e) => e.currentTarget.style.color = scrolled ? "var(--navy-700)" : "#fff"}>{label}</a>
          )}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="Hybrid Sports Club Members.html" className="nav-login" style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: "var(--radius-full)",
            font: "var(--text-label-md)", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
            color: scrolled ? "var(--navy-800)" : "#fff",
            border: "1px solid " + (scrolled ? "var(--border-default-light)" : "rgba(255,255,255,0.55)"),
            background: scrolled ? "transparent" : "rgba(5,7,13,0.28)",
            textShadow: scrolled ? "none" : "0 1px 8px rgba(5,7,13,0.45)",
            transition: "color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = scrolled ? "var(--navy-700)" : "#fff"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = scrolled ? "var(--border-default-light)" : "rgba(255,255,255,0.55)"}>
            <Icon name="log-in" size={15} />Log in
          </a>
          <a href="#join" className="btn-pill"><window.DS.Button variant="primary" size="sm" icon={<Icon name="arrow-up-right" size={16} />} iconPosition="right" style={{ borderRadius: "var(--radius-full)" }}>Join</window.DS.Button></a>
          <button className="nav-hamburger" onClick={() => setMobileOpen((o) => !o)} aria-label={mobileOpen ? "Close menu" : "Open menu"} style={{
            display: "none", border: "none", background: "none", cursor: "pointer", padding: 4,
            color: (scrolled || mobileOpen) ? "var(--navy-800)" : "#fff",
          }}>
            <Icon name={mobileOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="nav-mobile-menu" style={{
          background: "var(--paper-50)", borderTop: "1px solid var(--border-default-light)",
          padding: "8px 24px 20px", display: "flex", flexDirection: "column",
        }}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              padding: "14px 0", borderBottom: "1px solid var(--border-subtle-light)",
              font: "var(--text-label-lg)", fontWeight: 700, color: "var(--navy-800)",
              textTransform: "uppercase", letterSpacing: "0.02em",
            }}>{label}</a>
          ))}
        </nav>
      )}
    </div>);

}
window.Nav = Nav;
