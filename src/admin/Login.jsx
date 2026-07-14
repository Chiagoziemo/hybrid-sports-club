/* global React, Icon, DS */
// Real organizer sign-in — Supabase Auth (email + password) gated by the
// is_organizer() check (profiles table). A valid Supabase account that
// isn't an organizer gets signed back out immediately with a clear error,
// rather than landing on a dashboard where every query silently returns
// nothing (RLS).

function AdminLogin({ onLogin, error, busy }) {
  const { Input, Button } = window.DS;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState({});

  const submit = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Add a valid email.";
    if (!password) e.password = "Add your password.";
    setErr(e);
    if (Object.keys(e).length) return;
    onLogin(email, password);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--navy-950)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <window.Logo height={34} dark />
        </div>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="kicker" style={{ color: "var(--accent-primary)" }}>Organizer dashboard</div>
          <h1 style={{ font: "800 clamp(28px, 7vw, 38px)/1 var(--font-display)", letterSpacing: "-0.03em", color: "#fff", margin: "10px 0 8px" }}>Sign in to manage Hybrid</h1>
          <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: 0 }}>Organizer access only.</p>
        </div>

        <div style={{
          background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)",
          borderRadius: "var(--radius-lg)", padding: 24, display: "flex", flexDirection: "column", gap: 16,
        }}>
          <Input label="Email" placeholder="you@hybridsports.club" value={email}
            onChange={(e) => { setEmail(e.target.value); setErr((x) => ({ ...x, email: null })); }}
            error={err.email} icon={<Icon name="mail" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
          <Input label="Password" type="password" placeholder="••••••••" value={password}
            onChange={(e) => { setPassword(e.target.value); setErr((x) => ({ ...x, password: null })); }}
            error={err.password} icon={<Icon name="lock" size={16} style={{ color: "var(--text-tertiary-dark)" }} />} />
          <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={busy} onClick={submit}>{busy ? "Signing in…" : "Log in"}</Button>
          {error && <p style={{ font: "var(--text-body-sm)", color: "var(--danger)", margin: 0, textAlign: "center" }}>{error}</p>}
        </div>

        <a href="Hybrid Sports Club.html" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22,
          font: "var(--text-label-md)", color: "var(--navy-300)",
        }}>
          <Icon name="arrow-left" size={15} /> Back to public site
        </a>
      </div>
    </div>
  );
}
window.AdminLogin = AdminLogin;
