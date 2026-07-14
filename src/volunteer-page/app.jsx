/* global React, ReactDOM, DS, Icon, PHOTO */
// Real session check — this page is festival-scoped (matches its original
// design intent: CrewPicker only ever showed the festival's crew). If
// there's no session at all, we point to the public site's real Join
// flow rather than duplicating a second copy of the OTP UI here.
function VolunteerPage() {
  const [checking, setChecking] = React.useState(true);
  const [member, setMember] = React.useState(null);
  const events = window.useSupaEvents();
  const featured = events.find((e) => e.featured);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: sess } = await window.sb.auth.getSession();
      if (!sess.session) { if (!cancelled) { setMember(null); setChecking(false); } return; }
      const { data, error } = await window.sb.rpc("ensure_member");
      if (cancelled) return;
      if (error || !data) { setMember(null); setChecking(false); return; }
      setMember(data);
      setChecking(false);
    })();
    return () => { cancelled = true; };
  }, []);

  let body;
  if (checking || !featured) {
    body = <p style={{ textAlign: "center", color: "var(--navy-300)" }}>Loading…</p>;
  } else if (!member) {
    body = (
      <div style={{ textAlign: "center" }}>
        <a href="Hybrid Sports Club.html#join" className="btn-pill">
          <window.DS.Button variant="primary" size="lg" icon={<Icon name="arrow-up-right" size={18} />} iconPosition="right" style={{ borderRadius: "var(--radius-full)" }}>Join the club first</window.DS.Button>
        </a>
      </div>
    );
  } else if (member.phone && member.phone.startsWith("auth:")) {
    body = <p style={{ textAlign: "center", color: "var(--navy-300)" }}>Finish setting up your account in the members area first, then come back here.</p>;
  } else if (member.status !== "confirmed") {
    body = (
      <div style={{ background: "var(--navy-800)", border: "1px solid var(--orange-400)", borderRadius: "var(--radius-lg)", padding: 20, maxWidth: 560, margin: "0 auto", display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "var(--radius-full)", background: "var(--orange-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="hourglass" size={20} />
        </div>
        <div>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Verification pending</div>
          <p style={{ font: "var(--text-body-md)", color: "var(--navy-100)", margin: "6px 0 0" }}>An organizer will confirm you're part of the crew, then come back here to sign up.</p>
        </div>
      </div>
    );
  } else {
    body = <window.CrewPicker member={member} event={featured} />;
  }

  return (
    <div className="dark" style={{ minHeight: "100vh" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(5,7,13,0.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border-subtle-dark)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="Hybrid Sports Club.html" style={{ display: "flex", alignItems: "center" }}>
            <window.Logo height={30} dark />
          </a>
          <a href="Hybrid Sports Club.html" style={{ display: "flex", alignItems: "center", gap: 6, font: "var(--text-label-md)", color: "var(--navy-200)" }}>
            <Icon name="arrow-left" size={15} />Back to site
          </a>
        </div>
      </div>

      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={PHOTO("group-photo-pitch")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.16 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--navy-950) 0%, rgba(5,7,13,0.9) 100%)" }} />
        <div className="wrap" style={{ position: "relative", padding: "56px 20px 72px" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 36px" }}>
            <div className="kicker">Members' crew</div>
            <h1 style={{ font: "var(--text-display-md)", margin: "12px 0 12px", color: "#fff", letterSpacing: "-0.02em" }}>
              Help us run Hybrid.
            </h1>
            <p style={{ font: "var(--text-body-lg)", color: "var(--navy-100)", margin: 0 }}>
              {member && member.status === "confirmed"
                ? `Welcome back, ${member.name.split(" ")[0]}. Pick a crew and we'll loop you in.`
                : "Volunteering is a members' thing. Join the club first, then pick your crew."}
            </p>
          </div>

          {body}
        </div>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<VolunteerPage />);
