/* global React, ReactDOM */
// Real Supabase Auth session lifecycle. A member row's `phone` starts as
// the placeholder 'auth:<uid>' (set by ensure_member()) until
// complete_member_signup() runs — that's the signal we use to know
// whether SignupScreen still needs to collect name/phone, mirroring the
// backend's own convention rather than a separate local flag.

async function loadFullAccount(memberRow) {
  if (memberRow.status !== "confirmed") {
    return {
      id: memberRow.id, name: memberRow.name, phone: memberRow.phone, email: memberRow.email,
      status: memberRow.status === "rejected" ? "rejected" : "pending",
      currentRsvpEventId: null, showOnLeaderboard: memberRow.show_on_leaderboard !== false,
      streak: { current: 0, longest: 0, totalSessions: 0 }, history: [], badges: [],
    };
  }

  const [{ data: checkins }, { data: rsvps }, { count: volCount }] = await Promise.all([
    window.sb.from("check_ins").select("checked_in_at, events ( title )").eq("member_id", memberRow.id).order("checked_in_at", { ascending: false }),
    window.sb.from("rsvps").select("created_at, events ( slug )").eq("member_id", memberRow.id).order("created_at", { ascending: false }).limit(1),
    window.sb.from("volunteers").select("id", { count: "exact", head: true }).eq("member_id", memberRow.id),
  ]);

  const history = (checkins || []).map((c) => ({
    date: new Date(c.checked_in_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" }),
    event: c.events ? c.events.title : "Session",
  }));

  const streakEntries = window.computeLeaderboard(
    (checkins || []).map((c) => ({ member_id: memberRow.id, name: memberRow.name, avatar_url: memberRow.avatar_url, checked_in_at: c.checked_in_at }))
  );
  const mine = streakEntries[0] || { streak: 0, longest: 0, sessions: 0, totalSessions: 0 };
  const volunteered = (volCount || 0) > 0;

  return {
    id: memberRow.id, name: memberRow.name, phone: memberRow.phone, email: memberRow.email,
    status: "active",
    currentRsvpEventId: rsvps && rsvps[0] && rsvps[0].events ? rsvps[0].events.slug : null,
    showOnLeaderboard: memberRow.show_on_leaderboard !== false,
    streak: { current: mine.streak, longest: mine.longest, totalSessions: mine.totalSessions },
    history,
    badges: [
      { key: "first", label: "First session", icon: "sparkle", earned: mine.totalSessions >= 1 },
      { key: "five", label: "5 sessions", icon: "flame", earned: mine.totalSessions >= 5 },
      { key: "ten", label: "10 sessions", icon: "medal", earned: mine.totalSessions >= 10 },
      { key: "fifty", label: "50 sessions", icon: "trophy", earned: mine.totalSessions >= 50 },
      { key: "volunteered", label: "Volunteered", icon: "handshake", earned: volunteered },
    ],
  };
}

function MembersApp() {
  const [booting, setBooting] = React.useState(true);
  const [account, setAccount] = React.useState(null);
  const [needsSignup, setNeedsSignup] = React.useState(false);
  const [authStep, setAuthStep] = React.useState("email"); // email | otp
  const [pendingEmail, setPendingEmail] = React.useState("");
  const [authError, setAuthError] = React.useState("");
  const [authBusy, setAuthBusy] = React.useState(false);
  const [tab, setTab] = React.useState("dashboard");
  const [shareEventId, setShareEventId] = React.useState(null);
  const [showHistory, setShowHistory] = React.useState(false);

  const goTab = (t) => { setShowHistory(false); setTab(t); };

  const bootstrap = React.useCallback(async () => {
    const { data: sess } = await window.sb.auth.getSession();
    if (!sess.session) { setAccount(null); setNeedsSignup(false); setBooting(false); return; }
    const { data: memberRow, error } = await window.sb.rpc("ensure_member");
    if (error || !memberRow) { console.error(error); setAccount(null); setBooting(false); return; }
    if (memberRow.phone && memberRow.phone.startsWith("auth:")) {
      setNeedsSignup(true); setAccount(null); setBooting(false); return;
    }
    setNeedsSignup(false);
    const full = await loadFullAccount(memberRow);
    setAccount(full);
    setBooting(false);
  }, []);

  React.useEffect(() => {
    bootstrap();
    const { data: sub } = window.sb.auth.onAuthStateChange(() => bootstrap());
    return () => sub.subscription.unsubscribe();
  }, [bootstrap]);

  const requestCode = async (email) => {
    setAuthBusy(true); setAuthError("");
    const { error } = await window.sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setAuthBusy(false);
    if (error) { setAuthError("Couldn't send a code — check the email and try again."); return; }
    setPendingEmail(email);
    setAuthStep("otp");
  };

  const onSignupResolved = async ({ name, phone, birthday, heard, activities }) => {
    const { error } = await window.sb.rpc("complete_member_signup", { p_name: name, p_phone: phone });
    if (error) { console.error(error); return { error }; }
    const { data: userData } = await window.sb.auth.getUser();
    if (userData && userData.user) {
      await window.sb.from("members").update({
        birthday: birthday || null, heard_about: heard || null, interests: activities || [],
      }).eq("auth_id", userData.user.id);
    }
    await bootstrap();
    return { error: null };
  };

  const onRsvp = async (eventId) => {
    const ev = window.getEventsSnapshot().find((e) => e.id === eventId);
    if (!ev || !account) return;
    const { error } = await window.sb.from("rsvps").insert({
      event_id: ev.dbId, member_id: account.id, name: account.name, phone: account.phone, email: account.email, interests: [],
    });
    if (error) { console.error(error); return; }
    setAccount((a) => ({ ...a, currentRsvpEventId: eventId }));
    setShareEventId(eventId);
  };

  const onShare = (eventId) => setShareEventId(eventId);

  const onLogout = async () => {
    await window.sb.auth.signOut();
    setAccount(null); setNeedsSignup(false); setAuthStep("email"); setPendingEmail(""); setTab("dashboard");
  };

  const onToggleLeaderboard = async (v) => {
    setAccount((a) => ({ ...a, showOnLeaderboard: v }));
    if (account) await window.sb.from("members").update({ show_on_leaderboard: v }).eq("id", account.id);
  };

  if (booting) {
    return (
      <div className="app-shell">
        <div className="app-scroll" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--navy-300)" }}>Loading…</div>
      </div>
    );
  }

  let screen;
  let chromeless = false;
  if (!account && !needsSignup) {
    chromeless = true;
    if (authStep === "email") screen = <window.EmailScreen onSubmit={requestCode} error={authError} busy={authBusy} />;
    else screen = <window.EmailOtpScreen email={pendingEmail} onVerified={bootstrap} onBack={() => setAuthStep("email")} />;
  } else if (needsSignup) {
    chromeless = true;
    screen = <window.SignupScreen onResolved={onSignupResolved} />;
  } else if (account.status === "pending") {
    chromeless = true;
    screen = <window.PendingScreen name={account.name} />;
  } else if (account.status === "rejected") {
    chromeless = true;
    screen = <window.RejectedScreen onLogout={onLogout} />;
  } else if (shareEventId) {
    chromeless = true;
    screen = <window.ShareCard account={account} eventId={shareEventId} onDone={() => { setShareEventId(null); setTab("events"); }} />;
  } else if (tab === "dashboard") {
    screen = <window.Dashboard account={account} onRsvp={onRsvp} onShare={onShare} onGoTab={goTab} />;
  } else if (tab === "events") {
    screen = <window.EventsList account={account} onRsvp={onRsvp} />;
  } else if (tab === "volunteer") {
    screen = <window.MembersVolunteer account={account} />;
  } else if (showHistory) {
    screen = <window.CheckinHistory account={account} onBack={() => setShowHistory(false)} />;
  } else {
    screen = <window.Profile account={account} onLogout={onLogout} onViewHistory={() => setShowHistory(true)} onToggleLeaderboard={onToggleLeaderboard} />;
  }

  if (chromeless) {
    return (
      <div className="app-shell">
        <div className="app-scroll">{screen}</div>
      </div>
    );
  }

  return (
    <window.MembersShell account={account} tab={tab} onChange={goTab} onLogout={onLogout}>
      {screen}
    </window.MembersShell>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<MembersApp />);
