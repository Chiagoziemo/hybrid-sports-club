/* global React, Icon */
function SiteFooter() {
  const events = window.useSupaEvents();
  const ev = events.find((e) => e.featured);
  const socials = [
  { icon: "at-sign", label: "Instagram", handle: "@hybridsportsclub" },
  { icon: "message-circle", label: "WhatsApp", handle: "Join the community" }];

  return (
    <footer className="dark" style={{ borderTop: "1px solid var(--border-subtle-dark)" }}>
      <div className="wrap" style={{ padding: "48px 20px 40px" }}>
        <div className="grid cols-2" style={{ gap: 32, alignItems: "flex-start" }}>
          <div>
            <window.Logo height={44} dark />
            <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", maxWidth: 340, marginTop: 16 }}>
              {ev ? ev.tagline : ""}
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <a href="#join" style={{ display: "inline-flex", alignItems: "center", gap: 8, font: "var(--text-label-md)", color: "#fff", padding: "8px 14px", borderRadius: "var(--radius-full)", background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)" }}>
                <Icon name="calendar-days" size={15} style={{ color: "var(--accent-primary)" }} />Every Saturday, 7am · Members only · Join us
              </a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {socials.map((s) =>
            <div key={s.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Icon name={s.icon} size={20} style={{ color: "var(--accent-primary)", marginTop: 2 }} />
                <div>
                  <div style={{ font: "var(--text-label-md)", color: "var(--navy-300)" }}>{s.label}</div>
                  <div style={{ font: "var(--text-title-md)", color: "#fff" }}>{s.handle}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border-subtle-dark)", marginTop: 34, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-dark)" }}>© 2026 Hybrid Sports Club · Lagos, Nigeria</span>
          <a href="Hybrid Sports Club Admin.html" style={{ font: "var(--text-body-sm)", color: "var(--text-tertiary-dark)" }}>Organizer dashboard</a>
        </div>
      </div>
    </footer>);

}
window.SiteFooter = SiteFooter;
