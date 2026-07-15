/* global React, Icon, DS */
// The missing link the old localStorage prototype never had: a real way
// for an organizer to approve or reject pending member signups
// (public.members.status). Without this screen, complete_member_signup's
// roster-check auto-confirms recognized names but anyone else would be
// stuck "pending" forever with no path to "confirmed".

// Parses pasted roster rows (tab- or comma-separated, optional header row
// in any column order). Kept deliberately simple — no quoted-field/embedded
// delimiter handling — since this is meant for a straight paste out of a
// spreadsheet, not arbitrary CSV files.
function parseImportText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const delim = lines[0].includes("\t") ? "\t" : ",";
  const splitLine = (l) => l.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
  const rows = lines.map(splitLine);

  let nameIdx = 0, emailIdx = 1, phoneIdx = 2, dataRows = rows;
  const header = rows[0].map((c) => c.toLowerCase());
  if (header.includes("name") || header.includes("email") || header.includes("phone")) {
    nameIdx = header.indexOf("name"); if (nameIdx === -1) nameIdx = 0;
    emailIdx = header.indexOf("email"); if (emailIdx === -1) emailIdx = 1;
    phoneIdx = header.indexOf("phone"); if (phoneIdx === -1) phoneIdx = 2;
    dataRows = rows.slice(1);
  }

  return dataRows.map((cols, i) => {
    const name = (cols[nameIdx] || "").trim();
    const email = (cols[emailIdx] || "").trim();
    const phone = (cols[phoneIdx] || "").trim();
    const errors = [];
    if (!name) errors.push("missing name");
    if (!/[0-9]{7,}/.test(phone.replace(/\s/g, ""))) errors.push("invalid phone");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("invalid email");
    return { line: i + 1, name, email, phone, errors };
  });
}

// Bulk-imports an existing roster (e.g. from a Google Sheet) as confirmed
// members, matched by phone. ensure_member() already claims an unclaimed
// row by email on first login, so a real member just logs in with their
// email/OTP as normal and lands straight on the dashboard — no
// SignupScreen, no pending review. auth_id is deliberately left out of
// the upsert payload so re-importing never unlinks an already-logged-in
// member's account.
function ImportMembersSheet({ open, onClose, onImported }) {
  const { Sheet, Button } = window.DS;
  const [text, setText] = React.useState("");
  const [rows, setRows] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const reset = () => { setText(""); setRows(null); setResult(null); };
  const close = () => { reset(); onClose(); };

  const validRows = rows ? rows.filter((r) => r.errors.length === 0) : [];
  const invalidCount = rows ? rows.length - validRows.length : 0;

  const doImport = async () => {
    setBusy(true);
    // Dedupe by phone — Postgres upsert errors if the same conflict
    // target appears twice in one statement, e.g. two rows sharing a
    // number by copy-paste mistake. Last occurrence in the sheet wins.
    const byPhone = new Map();
    validRows.forEach((r) => byPhone.set(r.phone, { name: r.name, phone: r.phone, email: r.email || null, status: "confirmed" }));
    const payload = Array.from(byPhone.values());
    const { error } = await window.sb.from("members").upsert(payload, { onConflict: "phone" });
    setBusy(false);
    if (error) { setResult({ error: error.message }); return; }
    setResult({ count: payload.length });
    onImported();
  };

  return (
    <Sheet open={open} onClose={close} title="Bulk import members">
      {!rows ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", margin: 0 }}>
            Paste rows from your roster — Name, Email, Phone (tab or comma separated; a header row is fine, any order). These are marked <strong>confirmed</strong> so real members can log straight in via email — matched automatically by phone number.
          </p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10}
            placeholder={"Name\tEmail\tPhone\nAda Obi\tada@email.com\t+2348001234567"}
            style={{ font: "13px monospace", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default-light)", resize: "vertical" }} />
          <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} disabled={!text.trim()} onClick={() => setRows(parseImportText(text))}>
            Preview
          </Button>
        </div>
      ) : result ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {result.error ? (
            <p style={{ color: "var(--danger)" }}>{result.error}</p>
          ) : (
            <p style={{ font: "var(--text-title-lg)", color: "var(--navy-900)" }}>Imported {result.count} member{result.count === 1 ? "" : "s"}.</p>
          )}
          <Button variant="outline" size="md" onClick={reset}>Import more</Button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)", margin: 0 }}>
            {validRows.length} ready to import{invalidCount ? `, ${invalidCount} skipped (see errors below)` : ""}.
          </p>
          <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--border-subtle-light)", borderRadius: "var(--radius-md)" }}>
            {rows.map((r) => (
              <div key={r.line} style={{
                display: "flex", gap: 10, padding: "8px 12px", borderBottom: "1px solid var(--border-subtle-light)",
                font: "var(--text-body-sm)", color: r.errors.length ? "var(--danger)" : "var(--navy-800)",
              }}>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name || "—"}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.email || "—"}</span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.phone || "—"}</span>
                <span style={{ flex: 1, fontSize: 12 }}>{r.errors.join(", ")}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" size="md" onClick={() => setRows(null)}>Back</Button>
            <Button variant="primary" size="lg" className="pillbtn" style={{ flex: 1 }} disabled={busy || validRows.length === 0} onClick={doImport}>
              {busy ? "Importing…" : `Import ${validRows.length} member${validRows.length === 1 ? "" : "s"}`}
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function MembersPanel() {
  const [members, setMembers] = React.useState(null);
  const [filter, setFilter] = React.useState("pending_verification");
  const [busy, setBusy] = React.useState(null);
  const [importing, setImporting] = React.useState(false);

  const load = React.useCallback(() => {
    window.sb.from("members").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) { console.error(error); setMembers([]); return; }
      setMembers(data || []);
    });
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const setStatus = async (id, status) => {
    setBusy(id);
    const { error } = await window.sb.from("members").update({ status }).eq("id", id);
    setBusy(null);
    if (error) { console.error(error); return; }
    load();
  };

  // No email/SMS infra yet — WhatsApp is already the club's channel (see
  // the "we'll ping you on WhatsApp" copy elsewhere), so the pragmatic
  // notification path is a one-click pre-filled message the organizer
  // sends themselves, rather than building automated messaging.
  const WHATSAPP_MESSAGES = {
    confirmed: (name) => `Hey ${name}! You're confirmed for Hybrid Sports Club 🎉 Welcome to the crew — see you Saturday!`,
    rejected: (name) => `Hey ${name}, thanks for your interest in Hybrid Sports Club. We're not able to confirm your membership right now — reach out if you have questions.`,
    pending_verification: (name) => `Hey ${name}, thanks for signing up for Hybrid Sports Club! We're reviewing your application and will confirm you soon.`,
  };
  const whatsappLink = (m) => {
    const digits = m.phone.replace(/\D/g, "");
    const msg = (WHATSAPP_MESSAGES[m.status] || WHATSAPP_MESSAGES.pending_verification)(m.name.split(" ")[0]);
    return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  };

  if (members == null) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-tertiary-light)" }}>Loading…</div>;
  }

  const rows = members.filter((m) => filter === "all" || m.status === filter);
  const tabs = [["pending_verification", "Pending"], ["confirmed", "Confirmed"], ["rejected", "Rejected"], ["all", "All"]];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <window.PageHead title="Members" subtitle="Approve new signups or manage the roster." />
        <button onClick={() => setImporting(true)} style={{
          display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border-default-light)",
          cursor: "pointer", padding: "9px 16px", borderRadius: "var(--radius-full)", background: "transparent",
          color: "var(--navy-700)", font: "var(--text-label-md)", fontWeight: 700, marginBottom: 24,
        }}><Icon name="upload" size={15} />Import members</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "var(--radius-full)",
            font: "var(--text-label-md)", fontWeight: 700,
            background: filter === key ? "var(--navy-950)" : "var(--paper-100)",
            color: filter === key ? "#fff" : "var(--navy-700)",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ background: "var(--paper-0)", border: "1px solid var(--border-subtle-light)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        {rows.length === 0 && <div style={{ padding: 28, textAlign: "center", color: "var(--text-tertiary-light)" }}>No members here.</div>}
        {rows.map((m) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--border-subtle-light)", flexWrap: "wrap" }}>
            <div>
              <div style={{ font: "var(--text-label-lg)", color: "var(--navy-900)" }}>{m.name}</div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--text-secondary-light)" }}>
                {m.email || "—"} · {m.phone && !m.phone.startsWith("auth:") ? m.phone : "no phone yet"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <span style={{
                font: "var(--text-label-sm)", padding: "4px 10px", borderRadius: "var(--radius-full)",
                background: m.status === "confirmed" ? "var(--green-100)" : m.status === "rejected" ? "var(--paper-200)" : "var(--yellow-100)",
                color: m.status === "confirmed" ? "var(--green-700)" : m.status === "rejected" ? "var(--text-tertiary-light)" : "#8a6a00",
              }}>{m.status.replace("_", " ")}</span>
              {m.phone && !m.phone.startsWith("auth:") &&
                <a href={whatsappLink(m)} target="_blank" rel="noreferrer" title="Message on WhatsApp" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30,
                  borderRadius: "var(--radius-full)", background: "var(--green-100)", color: "var(--green-700)",
                }}><Icon name="message-circle" size={15} /></a>
              }
              {m.status !== "confirmed" &&
                <button disabled={busy === m.id} onClick={() => setStatus(m.id, "confirmed")} style={{ border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: "var(--radius-full)", background: "var(--green-500)", color: "#fff", font: "var(--text-label-sm)", fontWeight: 700 }}>Confirm</button>
              }
              {m.status !== "rejected" &&
                <button disabled={busy === m.id} onClick={() => setStatus(m.id, "rejected")} style={{ border: "1px solid var(--border-default-light)", cursor: "pointer", padding: "6px 12px", borderRadius: "var(--radius-full)", background: "transparent", color: "var(--navy-700)", font: "var(--text-label-sm)" }}>Reject</button>
              }
            </div>
          </div>
        ))}
      </div>
      <ImportMembersSheet open={importing} onClose={() => setImporting(false)} onImported={() => { setFilter("all"); load(); }} />
    </div>
  );
}
window.MembersPanel = MembersPanel;
