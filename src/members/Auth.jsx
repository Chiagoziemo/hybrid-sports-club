/* global React, Icon */
// Email → real 6-digit Supabase email-OTP code (returning members,
// primary path), plus a signup form (collects name + phone) for members
// ensure_member() just created and complete_member_signup() hasn't
// resolved yet, and a pending/rejected state driven by members.status.

function AuthShell({ kicker, title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <window.Logo height={34} dark />
        </div>
        {kicker && <div className="kicker" style={{ color: "var(--accent-primary)" }}>{kicker}</div>}
        <h1 className="screen-title" style={{ margin: "10px 0 8px" }}>{title}</h1>
        {subtitle && <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: 0 }}>{subtitle}</p>}
      </div>
      {children}
    </div>);

}

// Returning-member login (primary): enter email → real code emailed.
function EmailScreen({ onSubmit, error, busy }) {
  const { Input, Button } = window.DS;
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState("");
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const go = () => {
    if (!valid) { setErr("Add the email you signed up with."); return; }
    onSubmit(email.trim());
  };
  return (
    <AuthShell kicker="Members' area" title="Log in with your email" subtitle="We'll email you a 6-digit code — no password needed.">
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Email address" type="email" placeholder="you@email.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          error={err || error} icon={<Icon name="mail" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={busy} onClick={go}>{busy ? "Sending…" : "Email me a code"}</Button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", font: "var(--text-body-sm)", color: "var(--navy-400)", marginTop: 2 }}>
          <Icon name="message-circle" size={13} />Login by WhatsApp code is coming soon.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
          <span style={{ height: 1, flex: 1, background: "var(--border-subtle-dark)" }} />
          <span style={{ font: "var(--text-body-sm)", color: "var(--navy-400)" }}>new here?</span>
          <span style={{ height: 1, flex: 1, background: "var(--border-subtle-dark)" }} />
        </div>
        <a href="Hybrid Sports Club.html#join" style={{ textDecoration: "none" }}>
          <Button variant="outline" size="lg" className="pillbtn" style={{ width: "100%" }} icon={<Icon name="arrow-up-right" size={16} />} iconPosition="right">Join the club</Button>
        </a>
      </div>
    </AuthShell>);

}

function EmailOtpScreen({ email, onVerified, onBack }) {
  const { Input, Button } = window.DS;
  const [code, setCode] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const digits = code.replace(/\D/g, "");

  const verify = async () => {
    setBusy(true); setErr("");
    const { error } = await window.sb.auth.verifyOtp({ email, token: digits, type: "email" });
    setBusy(false);
    if (error) { setErr("That code didn't work — check it and try again."); return; }
    onVerified();
  };

  return (
    <AuthShell kicker="Check your inbox" title="Enter the code" subtitle={`We emailed a 6-digit code to ${email}.`}>
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="6-digit code" placeholder="000000" value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
          error={err} helper="Check your inbox (and spam folder)." icon={<Icon name="key-round" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={digits.length < 6 || busy} onClick={verify}>{busy ? "Verifying…" : "Verify"}</Button>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", font: "var(--text-label-md)", color: "var(--navy-200)", padding: 8 }}>
          ← Use a different email
        </button>
      </div>
    </AuthShell>);

}

// Signup completion — member row already exists (ensure_member() created
// it) but still has the placeholder phone, meaning complete_member_signup
// hasn't run yet. Collect name + phone to finish it.
function SignupScreen({ onResolved }) {
  const { Input, Button } = window.DS;
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [err, setErr] = React.useState({});
  const [busy, setBusy] = React.useState(false);
  const go = async () => {
    const e = {};
    if (!name.trim()) e.name = "Add your name.";
    if (!/[0-9]{7,}/.test(phone.replace(/\s/g, ""))) e.phone = "Add a valid WhatsApp number.";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await onResolved({ name: name.trim(), phone: phone.trim() });
    setBusy(false);
  };
  return (
    <AuthShell kicker="Join the crew" title="Set up your account" subtitle="We'll use your phone number to add you to the WhatsApp community, and this email to log you in from now on.">
      <div style={{ maxWidth: 360, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Full name" placeholder="e.g. Ada Obi" value={name} onChange={(e) => { setName(e.target.value); setErr((p) => ({ ...p, name: "" })); }} error={err.name} />
        <Input label="Phone / WhatsApp number" placeholder="+234 800 000 0000" value={phone} onChange={(e) => { setPhone(e.target.value); setErr((p) => ({ ...p, phone: "" })); }}
          error={err.phone} icon={<Icon name="phone" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={busy} onClick={go}>{busy ? "Saving…" : "Create my account"}</Button>
      </div>
    </AuthShell>);

}

function PendingScreen({ name }) {
  return (
    <AuthShell>
      <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <div style={{
          background: "var(--navy-800)", border: "1px solid var(--orange-400)", borderRadius: "var(--radius-lg)",
          padding: 22, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "var(--shadow-md)"
        }}>
          <div style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: "var(--radius-full)",
            background: "var(--orange-400)", color: "var(--navy-950)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}><Icon name="hourglass" size={22} /></div>
          <div>
            <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Verification pending</div>
            <p style={{ font: "var(--text-body-md)", color: "var(--navy-100)", margin: "6px 0 0" }}>
              We couldn't find <strong>{name}</strong> on the member list yet. An organizer will confirm you're
              part of the crew, usually within a day. We'll ping you on WhatsApp the moment you're in.
            </p>
          </div>
        </div>
      </div>
    </AuthShell>);

}

function RejectedScreen({ onLogout }) {
  const { Button } = window.DS;
  return (
    <AuthShell>
      <div style={{ maxWidth: 400, margin: "0 auto", width: "100%", textAlign: "center" }}>
        <div style={{
          background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-lg)", padding: 22,
        }}>
          <div style={{ font: "var(--text-title-lg)", color: "#fff" }}>Membership not approved</div>
          <p style={{ font: "var(--text-body-md)", color: "var(--navy-100)", margin: "6px 0 0" }}>
            If you think this is a mistake, reach out to the team on WhatsApp.
          </p>
        </div>
        <Button variant="outline" size="md" style={{ marginTop: 16 }} onClick={onLogout}>Log out</Button>
      </div>
    </AuthShell>);

}

Object.assign(window, { EmailScreen, EmailOtpScreen, SignupScreen, PendingScreen, RejectedScreen });
