/* global React, ReactDOM, Icon */
function AdminApp() {
  const [screen, setScreen] = React.useState("overview");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [session, setSession] = React.useState(undefined); // undefined = checking, null = logged out
  const [authError, setAuthError] = React.useState("");
  const [authBusy, setAuthBusy] = React.useState(false);
  const [rsvps, setRsvps] = React.useState([]);
  const [volunteers, setVolunteers] = React.useState([]);
  const [sponsors, setSponsors] = React.useState([]);

  const eventsRaw = window.useSupaEvents();
  const events = eventsRaw.map((e) => ({
    id: e.id, dbId: e.dbId, name: e.name, cadence: e.cadence, place: e.place,
    featured: e.featured, category: e.category, tagline: e.tagline || "",
    volunteeringEnabled: e.volunteeringEnabled, date: e.date,
  }));

  const loadOrgData = React.useCallback(async () => {
    const [{ data: rsvpRows }, { data: volRows }, { data: sponsorRows }] = await Promise.all([
      window.sb.from("rsvps").select("*, events ( title )"),
      window.sb.from("volunteers").select("*, events ( title )"),
      window.sb.from("event_sponsors").select("id, tier, status, events ( title ), sponsors ( name, contact_person, contact_email, contact_phone, logo )"),
    ]);
    setRsvps((rsvpRows || []).map((r) => ({
      ...r, event: r.events ? r.events.title : "", activity: (r.interests || []).join(", "), checkedIn: r.checked_in,
    })));
    setVolunteers((volRows || []).map((v) => ({
      ...v, event: v.events ? v.events.title : "",
      status: v.status === "confirmed" ? "Confirmed" : v.status === "rejected" ? "Rejected" : "Pending",
    })));
    setSponsors((sponsorRows || []).map((s) => ({
      dbId: s.id,
      name: s.sponsors ? s.sponsors.name : "",
      tier: s.tier, status: s.status,
      contact: s.sponsors ? s.sponsors.contact_person : "",
      email: s.sponsors ? s.sponsors.contact_email : "",
      phone: s.sponsors ? s.sponsors.contact_phone : "",
      event: s.events ? s.events.title : "",
    })));
  }, []);

  const checkOrganizer = async () => {
    const { data, error } = await window.sb.rpc("is_organizer");
    return !error && data === true;
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await window.sb.auth.getSession();
      if (!mounted) return;
      if (!data.session) { setSession(null); return; }
      const isOrg = await checkOrganizer();
      if (!isOrg) { await window.sb.auth.signOut(); if (mounted) { setSession(null); setAuthError("That account isn't set up as an organizer."); } return; }
      setSession(data.session);
      loadOrgData();
    })();
    const { data: sub } = window.sb.auth.onAuthStateChange((_event, newSession) => {
      if (!newSession) setSession(null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [loadOrgData]);

  const login = async (email, password) => {
    setAuthBusy(true); setAuthError("");
    const { error } = await window.sb.auth.signInWithPassword({ email, password });
    if (error) { setAuthBusy(false); setAuthError(error.message); return; }
    const isOrg = await checkOrganizer();
    if (!isOrg) { await window.sb.auth.signOut(); setAuthBusy(false); setAuthError("That account isn't set up as an organizer."); return; }
    const { data } = await window.sb.auth.getSession();
    setAuthBusy(false);
    setSession(data.session);
    loadOrgData();
  };
  const logout = async () => { await window.sb.auth.signOut(); setSession(null); };

  if (session === undefined) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy-950)", color: "#fff" }}>Loading…</div>;
  }
  if (!session) {
    return <window.AdminLogin onLogin={login} error={authError} busy={authBusy} />;
  }

  const { Sidebar } = window;
  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", background: "var(--bg-site)" }}>
      <div className={"admin-overlay" + (sidebarOpen ? " show" : "")} onClick={() => setSidebarOpen(false)} />
      <Sidebar screen={screen} setScreen={setScreen} onLogout={logout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div className="admin-topbar">
          <window.Logo height={26} dark />
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" style={{ border: "none", background: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            <Icon name="menu" size={22} />
          </button>
        </div>
        <main className="admin-main" style={{ flex: 1 }}>
          <div style={{ maxWidth: 1100 }}>
          {screen === "overview" && <window.Overview />}
          {screen === "members" && <window.MembersPanel />}
          {screen === "events" && (
            <window.EventsScreen
              events={events} rsvps={rsvps} setRsvps={setRsvps}
              volunteers={volunteers} setVolunteers={setVolunteers}
              sponsors={sponsors} setSponsors={setSponsors}
            />
          )}
          {screen === "calendar" && <window.CalendarScreen events={events} />}
          </div>
        </main>
      </div>
    </div>);

}
ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
