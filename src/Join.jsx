/* global React, DS, Icon, NKicker, PHOTO, CLUB, JOIN_STEPS */
// Real flow: JoinForm collects name/phone/email/etc → we request a real
// Supabase email-OTP code for that email → user enters the code we sent →
// on success we ensure_member() (link/create the row) then
// complete_member_signup(name, phone) (sets name/phone, roster-checks
// status) → then a follow-up update() saves birthday/heard/interests,
// which complete_member_signup doesn't handle.

function EmailVerify({ email, onVerified, onBack }) {
  const { Input, Button } = window.DS;
  const [code, setCode] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [resent, setResent] = React.useState(false);
  const digits = code.replace(/\D/g, "");

  const verify = async () => {
    setBusy(true); setErr("");
    const { error } = await window.sb.auth.verifyOtp({ email, token: digits, type: "email" });
    setBusy(false);
    if (error) { setErr("That code didn't work — check it and try again."); return; }
    onVerified();
  };

  const resend = async () => {
    setResent(false);
    await window.sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setResent(true);
  };

  return (
    <div style={{ background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: 28, maxWidth: 480, margin: "0 auto" }}>
      <div style={{ width: 52, height: 52, borderRadius: "var(--radius-full)", background: "var(--orange-100)", color: "var(--orange-500)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <Icon name="mail-check" size={24} />
      </div>
      <div style={{ font: "var(--text-title-lg)", fontWeight: 800, color: "#fff" }}>Verify your email</div>
      <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "6px 0 20px" }}>
        We emailed a 6-digit code to <strong style={{ color: "#fff" }}>{email}</strong>. Enter it to confirm your spot.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="6-digit code" placeholder="000000" value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
          error={err} helper="Check your inbox (and spam folder)." icon={<Icon name="key-round" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
        <Button variant="primary" size="lg" style={{ width: "100%" }} disabled={digits.length < 6 || busy} onClick={verify}>{busy ? "Verifying…" : "Verify & finish"}</Button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", font: "var(--text-label-md)", color: "var(--navy-200)", padding: 8 }}>
            ← Edit my details
          </button>
          <button onClick={resend} style={{ background: "none", border: "none", cursor: "pointer", font: "var(--text-label-md)", color: "var(--accent-primary)", padding: 8 }}>
            {resent ? "Code resent" : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Join() {
  const [member, setMember] = React.useState(null);
  const [checking, setChecking] = React.useState(true);
  const [pending, setPending] = React.useState(null); // form data awaiting email verification
  const [busy, setBusy] = React.useState(false);
  const [authErr, setAuthErr] = React.useState("");

  const loadMember = React.useCallback(async () => {
    const { data: sess } = await window.sb.auth.getSession();
    if (!sess.session) { setMember(null); setChecking(false); return; }
    const { data, error } = await window.sb.rpc("ensure_member");
    if (error) { console.error(error); setMember(null); setChecking(false); return; }
    setMember(data);
    setChecking(false);
  }, []);

  React.useEffect(() => {
    loadMember();
    const { data: sub } = window.sb.auth.onAuthStateChange(() => loadMember());
    return () => sub.subscription.unsubscribe();
  }, [loadMember]);

  const onFormSubmit = async (formData) => {
    setBusy(true); setAuthErr("");
    const { error } = await window.sb.auth.signInWithOtp({ email: formData.email, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) { setAuthErr("Couldn't send a code to that email — check it and try again."); return; }
    setPending(formData);
  };

  const onVerified = async () => {
    const { error: e1 } = await window.sb.rpc("ensure_member");
    if (e1) { console.error(e1); return; }
    const { error: e2 } = await window.sb.rpc("complete_member_signup", { p_name: pending.name, p_phone: pending.phone });
    if (e2) { console.error(e2); return; }
    const { data: userData } = await window.sb.auth.getUser();
    if (userData && userData.user) {
      await window.sb.from("members").update({
        birthday: pending.birthday || null, heard_about: pending.heard || null, interests: pending.activities,
      }).eq("auth_id", userData.user.id);
    }
    setPending(null);
    loadMember();
  };

  return (
    <section id="join" className="section dark" style={{ position: "relative", overflow: "hidden" }}>
      <img src={PHOTO("group-stretch-pitch")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.14 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--navy-950) 0%, rgba(5,7,13,0.9) 100%)" }} />
      <div className="wrap" style={{ position: "relative" }}>
        <div className="grid" style={{ gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "flex-start" }}>
          {/* How to join — numbered steps */}
          <div className="reveal">
            <NKicker n="04" style={{ color: "#fff" }}>How to join</NKicker>
            <h2 className="d-big" style={{ margin: "20px 0 14px", color: "#fff" }}>How to join our community.</h2>
            <p className="lede" style={{ color: "var(--navy-100)", margin: "0 0 36px", maxWidth: 460 }}>
              Four small steps between you and your first Saturday. It's free, and every fitness level is welcome.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {JOIN_STEPS.map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 20, padding: "20px 0", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle-dark)" }}>
                  <div className="step-num">{s.n}</div>
                  <div>
                    <div style={{ font: "var(--text-title-lg)", fontWeight: 800, color: "#fff" }}>{s.title}</div>
                    <div style={{ font: "var(--text-body-md)", color: "var(--navy-200)", marginTop: 4 }}>{s.blurb}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 28, color: "var(--accent-primary)" }}>
              <Icon name="users" size={22} />
              <span style={{ font: "var(--text-title-md)", fontWeight: 700, color: "#fff" }}>Join {CLUB.members}+ members who already call this club home.</span>
            </div>
          </div>

          {/* Join form → real email verification → member nudge */}
          <div className="reveal">
            {checking ? (
              <p style={{ textAlign: "center", color: "var(--navy-300)" }}>Loading…</p>
            ) : member ? (
              <div style={{ background: "var(--navy-800)", border: "1px solid var(--accent-primary)", borderRadius: "var(--radius-lg)", padding: 28, textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", margin: "0 auto 14px", background: "var(--green-400)", color: "var(--navy-950)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={28} /></div>
                <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>You're in, {member.name.split(" ")[0]}!</div>
                <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", marginTop: 6 }}>
                  Email verified. Log in to the members area to track your streak, RSVP and see the leaderboard.
                </p>
                <a href="Hybrid Sports Club Members.html" className="btn-pill"><window.DS.Button variant="primary" size="md" icon={<Icon name="arrow-up-right" size={16} />} iconPosition="right" style={{ marginTop: 16, borderRadius: "var(--radius-full)" }}>Log in to the members area</window.DS.Button></a>
                <p style={{ font: "var(--text-body-sm)", color: "var(--navy-400)", marginTop: 12 }}>Use this same email to log in.</p>
              </div>
            ) : pending ? (
              <EmailVerify email={pending.email} onBack={() => setPending(null)} onVerified={onVerified} />
            ) : (
              <div>
                <window.JoinForm onJoined={onFormSubmit} />
                {busy && <p style={{ font: "var(--text-body-sm)", color: "var(--navy-300)", textAlign: "center", marginTop: 10 }}>Sending your code…</p>}
                {authErr && <p style={{ font: "var(--text-body-sm)", color: "var(--danger)", textAlign: "center", marginTop: 10 }}>{authErr}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
window.Join = Join;
