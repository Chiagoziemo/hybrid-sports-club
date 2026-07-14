/* global React, Icon, BANK */
function Support() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(BANK.number); } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const row = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderTop: "1px solid var(--border-default-light)" }}>
      <span style={{ font: "var(--text-label-md)", color: "var(--text-tertiary-light)" }}>{label}</span>
      <span style={{ font: "var(--text-title-md)", fontWeight: 700, color: "var(--navy-950)" }}>{value}</span>
    </div>
  );

  return (
    <section className="section blk-paper">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 620, marginBottom: 36 }}>
          <NKicker n="05">Support the movement</NKicker>
          <h2 className="d-big" style={{ margin: "20px 0 0", color: "var(--navy-950)" }}>Your donations keep the community moving.</h2>
        </div>
        <div className="reveal" style={{ maxWidth: 440, background: "var(--paper-0)", border: "1px solid var(--border-default-light)", borderRadius: "var(--radius-lg)", padding: "24px 26px" }}>
          {row("Account name", BANK.name)}
          {row("Bank", BANK.bank)}
          {row("Account number", BANK.number)}
          <div className="btn-pill" style={{ marginTop: 20 }}>
            <window.DS.Button variant={copied ? "secondary" : "outline"} size="md" icon={<Icon name={copied ? "check" : "copy"} size={16} />} style={{ width: "100%", borderRadius: "var(--radius-full)", color: copied ? undefined : "var(--navy-900)", borderColor: copied ? undefined : "var(--border-default-light)" }} onClick={copy}>
              {copied ? "Copied" : "Copy account number"}
            </window.DS.Button>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Support = Support;
