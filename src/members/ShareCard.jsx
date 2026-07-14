/* global React, Icon, DS, PHOTO, SHARE_LINES, SHARE_TITLES */
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height, tr = w / h;
  let sw, sh, sx, sy;
  if (ir > tr) { sh = img.height; sw = sh * tr; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / tr; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "", curY = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + " ";
    if (ctx.measureText(test).width > maxWidth && line) { ctx.fillText(line, x, curY); line = words[i] + " "; curY += lineHeight; }
    else line = test;
  }
  ctx.fillText(line, x, curY);
  return curY;
}
// Rounded-rect path — only the requested corners are rounded (others 0),
// so a "sheet" can round its top edge only.
function roundedRectPath(ctx, x, y, w, h, r) {
  const { tl = 0, tr = 0, br = 0, bl = 0 } = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}
function pillPath(ctx, x, y, w, h) { roundedRectPath(ctx, x, y, w, h, h / 2); }
function drawCheckBadge(ctx, cx, cy, r) {
  ctx.save();
  ctx.shadowColor = "rgba(61,220,122,0.55)";
  ctx.shadowBlur = r * 0.9;
  ctx.fillStyle = "#3ddc7a";
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = "#05070d";
  ctx.lineWidth = Math.max(2.5, r * 0.16);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.48, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.12, cy + r * 0.38);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.34);
  ctx.stroke();
}
function drawDashedRule(ctx, x, y, w, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([2, 14]);
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.stroke();
  ctx.restore();
}

// Card-specific photo picks (dropped via the "swap for this card" slot)
// and the member's own profile photo both live in the image-slot sidecar
// — read it directly rather than mounting hidden slots.
async function readSlotPhoto(id) {
  try {
    const res = await fetch(".image-slots.state.json", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const v = json[id];
    if (!v) return null;
    const u = typeof v === "string" ? v : v.u;
    return u && /^data:image\//i.test(u) ? u : null;
  } catch (_) { return null; }
}

const FORMATS = {
  story: { key: "story", label: "Story", w: 1080, h: 1920 },
  square: { key: "square", label: "Square", w: 1080, h: 1080 },
};

function ShareCard({ account, eventId, onDone }) {
  const canvasRef = React.useRef(null);
  const cardSlotRef = React.useRef(null);
  const events = window.useSupaEvents();
  const event = events.find((e) => e.id === eventId) || events[0];
  const [ready, setReady] = React.useState(false);
  const [format, setFormat] = React.useState("story");
  const [photoSrc, setPhotoSrc] = React.useState(null); // resolved default (profile photo or event photo fallback)
  const cardSlotId = event ? `card-photo-${event.id}` : "card-photo-pending";

  // Resolve which photo this card should default to: a previous per-card
  // pick, else the member's profile photo, else the event photo.
  React.useEffect(() => {
    if (!event) return;
    let cancelled = false;
    (async () => {
      const [cardPick, profilePic] = await Promise.all([readSlotPhoto(cardSlotId), readSlotPhoto("member-photo")]);
      if (cancelled) return;
      setPhotoSrc(cardPick || profilePic || PHOTO(event.photo));
    })();
    return () => { cancelled = true; };
  }, [cardSlotId, event]);

  // Redraw whenever the format changes or the user drops a new photo into
  // this card's own slot (data-filled toggles on the light-DOM host).
  const [swapTick, setSwapTick] = React.useState(0);
  React.useEffect(() => {
    const el = cardSlotRef.current;
    if (!el) return;
    const mo = new MutationObserver(async () => {
      const pick = await readSlotPhoto(cardSlotId);
      if (pick) { setPhotoSrc(pick); setSwapTick((t) => t + 1); }
    });
    mo.observe(el, { attributes: true, attributeFilter: ["data-filled"] });
    return () => mo.disconnect();
  }, [cardSlotId]);

  React.useEffect(() => {
    let cancelled = false;
    if (!photoSrc || !event) return;
    setReady(false);
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w: W, h: H } = FORMATS[format];
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      const [photo, logo] = await Promise.all([
        loadImage(photoSrc).catch(() => loadImage(PHOTO(event.photo))),
        loadImage("assets/logos/hybrid-logo-white-cropped.png"),
      ]);
      if (cancelled) return;

      const isStory = format === "story";
      const sideMargin = 64;
      const topSafe = isStory ? 168 : 56;   // clear of Stories' own profile/icon row
      const bottomSafe = isStory ? 210 : 56; // clear of the reply bar

      // ---- Background photo, full bleed ----
      drawCover(ctx, photo, 0, 0, W, H);
      // A faint uniform brand wash unifies any source photo with the navy
      // shell so the card reads as "designed", not a raw snapshot.
      ctx.fillStyle = "rgba(5,7,13,0.16)";
      ctx.fillRect(0, 0, W, H);
      // Soft top scrim so the floating badge stays legible on a bright sky.
      const topGrad = ctx.createLinearGradient(0, 0, 0, topSafe + 140);
      topGrad.addColorStop(0, "rgba(5,7,13,0.6)");
      topGrad.addColorStop(1, "rgba(5,7,13,0)");
      ctx.fillStyle = topGrad; ctx.fillRect(0, 0, W, topSafe + 140);

      // ---- Bottom "sheet" — rounded top corners, mirrors the app's own
      // Sheet component, gives the overlay a designed edge instead of a
      // flat scrim cutoff. A soft lift shadow + thin accent hairline sell
      // the elevation. ----
      const sheetTop = isStory ? H - 620 : H - 430;
      const sheetR = 44;
      ctx.save();
      ctx.shadowColor = "rgba(5,7,13,0.55)";
      ctx.shadowBlur = 60;
      ctx.shadowOffsetY = -8;
      ctx.fillStyle = "rgba(5,7,13,0.93)";
      roundedRectPath(ctx, -4, sheetTop, W + 8, H - sheetTop + 20, { tl: sheetR, tr: sheetR, br: 0, bl: 0 });
      ctx.fill();
      ctx.restore();
      // A soft photo-to-sheet blend just above the seam, so the join
      // never looks like a hard crop even where the shadow doesn't reach.
      const seamGrad = ctx.createLinearGradient(0, sheetTop - 160, 0, sheetTop + 4);
      seamGrad.addColorStop(0, "rgba(5,7,13,0)");
      seamGrad.addColorStop(1, "rgba(5,7,13,0.7)");
      ctx.fillStyle = seamGrad; ctx.fillRect(0, sheetTop - 160, W, 164);
      ctx.strokeStyle = "rgba(61,220,122,0.55)";
      ctx.lineWidth = 3;
      roundedRectPath(ctx, 1.5, sheetTop, W - 3, H - sheetTop + 20, { tl: sheetR, tr: sheetR, br: 0, bl: 0 });
      ctx.stroke();

      // ---- Floating brand badge, top-left, glass-pill style ----
      await Promise.all([
        document.fonts.load('800 60px "Plus Jakarta Sans"'),
        document.fonts.load('700 24px "Inter"'),
        document.fonts.load('700 22px "Inter"'),
        document.fonts.load('600 30px "Inter"'),
        document.fonts.load('600 24px "Inter"'),
        document.fonts.load('500 24px "Inter"'),
      ]).catch(() => {});
      if (cancelled) return;

      const badgeH = 60, badgeLogoH = 26, badgeLogoW = badgeLogoH * (893 / 289);
      const badgePadX = 20;
      const badgeW = badgeLogoW + badgePadX * 2;
      ctx.fillStyle = "rgba(5,7,13,0.5)";
      ctx.strokeStyle = "rgba(228,232,245,0.22)";
      ctx.lineWidth = 1.5;
      pillPath(ctx, sideMargin, topSafe, badgeW, badgeH);
      ctx.fill(); ctx.stroke();
      ctx.drawImage(logo, sideMargin + badgePadX, topSafe + (badgeH - badgeLogoH) / 2, badgeLogoW, badgeLogoH);

      // ---- Sheet content ----
      const padX = sideMargin;
      const textW = W - padX * 2;
      let y = sheetTop + (isStory ? 84 : 68);

      // Status row: check badge + "YOU'RE IN"
      const badgeR = isStory ? 26 : 22;
      drawCheckBadge(ctx, padX + badgeR, y - badgeR * 0.62, badgeR);
      ctx.fillStyle = "#7bec9f";
      ctx.font = '700 24px "Inter"';
      try { ctx.letterSpacing = "2.5px"; } catch (_) {}
      ctx.fillText("YOU'RE IN", padX + badgeR * 2 + 16, y - badgeR * 0.62 + 8);
      try { ctx.letterSpacing = "0px"; } catch (_) {}

      // Headline: the session name, big and bold — the poster's hero line.
      y += isStory ? 76 : 62;
      ctx.fillStyle = "#ffffff";
      const headlineSize = isStory ? 78 : 62;
      ctx.font = `800 ${headlineSize}px "Plus Jakarta Sans"`;
      const title = SHARE_TITLES[event.id] || event.name;
      y = wrapText(ctx, `I'm going to ${title}`, padX, y, textW, headlineSize * 1.06);

      // Meta: date/time · place
      y += isStory ? 50 : 40;
      ctx.fillStyle = "#c2cbe3";
      ctx.font = '600 30px "Inter"';
      y = wrapText(ctx, `${event.dateLabel}${event.timeLabel ? " · " + event.timeLabel : ""}`, padX, y, textW, 38);
      y += 38;
      ctx.fillStyle = "#8b9cc4";
      ctx.font = '500 26px "Inter"';
      ctx.fillText(event.place, padX, y);

      // Streak chip, only when the member has one going.
      if (account.streak && account.streak.current > 0) {
        y += isStory ? 54 : 44;
        const chipText = `🔥 ${account.streak.current}-week streak`;
        ctx.font = '600 28px "Inter"';
        const chipPad = 18, chipH = 50;
        const chipW = ctx.measureText(chipText).width + chipPad * 2;
        ctx.fillStyle = "rgba(255,122,61,0.18)";
        pillPath(ctx, padX, y - chipH + 16, chipW, chipH);
        ctx.fill();
        ctx.fillStyle = "#ffa06e";
        ctx.fillText(chipText, padX + chipPad, y + 16 - (chipH - 34));
      }

      // Divider + footer (logo lockup left, member byline right) — a
      // ticket-stub info line anchored to the very bottom of the sheet.
      const footerY = H - bottomSafe;
      drawDashedRule(ctx, padX, footerY - 46, textW, "rgba(228,232,245,0.18)");
      const footerLogoH = isStory ? 30 : 26, footerLogoW = footerLogoH * (893 / 289);
      ctx.drawImage(logo, padX, footerY - footerLogoH + 4, footerLogoW, footerLogoH);
      ctx.fillStyle = "#8b9cc4";
      ctx.font = '500 24px "Inter"';
      ctx.textAlign = "right";
      ctx.fillText(`— ${account.name.split(" ")[0]}`, W - padX, footerY - 4);
      ctx.textAlign = "left";

      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, [eventId, format, photoSrc, swapTick, event]);

  const toPngBlob = () => new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));

  const save = async () => {
    const blob = await toPngBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `hybrid-im-in-${format}.png`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const share = async () => {
    const blob = await toPngBlob();
    const file = new File([blob], `hybrid-im-in-${format}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: (event && SHARE_LINES[event.id]) || "" }); return; } catch (_) {}
    }
    save();
  };

  const { Button } = window.DS;
  const fmt = FORMATS[format];
  const previewMaxW = format === "story" ? 300 : 340;

  if (!event) {
    return <div style={{ padding: "52px 20px", textAlign: "center", color: "var(--navy-300)" }}>Loading…</div>;
  }

  return (
    <div style={{ padding: "52px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="kicker" style={{ color: "var(--accent-primary)", alignSelf: "flex-start" }}>You're in ✅</div>
      <div className="screen-title" style={{ marginTop: 4, alignSelf: "flex-start" }}>Share the news.</div>
      <p style={{ font: "var(--text-body-md)", color: "var(--navy-200)", margin: "6px 0 18px", alignSelf: "flex-start" }}>
        Sized for Instagram Stories & WhatsApp status — or post the square to your feed.
      </p>

      <div style={{ display: "flex", gap: 8, alignSelf: "flex-start", marginBottom: 18 }}>
        {Object.values(FORMATS).map((f) => (
          <button key={f.key} onClick={() => setFormat(f.key)} style={{
            padding: "7px 16px", borderRadius: "var(--radius-full)", cursor: "pointer",
            font: "var(--text-label-md)", border: "1px solid " + (format === f.key ? "var(--accent-primary)" : "var(--border-default-dark)"),
            background: format === f.key ? "var(--accent-primary)" : "transparent",
            color: format === f.key ? "var(--navy-950)" : "var(--navy-200)",
          }}>{f.label} · {f.w}×{f.h}</button>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: previewMaxW, aspectRatio: `${fmt.w} / ${fmt.h}`, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)", background: "var(--navy-800)", position: "relative" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", opacity: ready ? 1 : 0, transition: "opacity var(--duration-base) var(--ease-out)" }} />
        {!ready && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--navy-300)" }}>
            <Icon name="loader-circle" size={26} />
          </div>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: previewMaxW, marginTop: 18, display: "flex", gap: 12, alignItems: "center", background: "var(--navy-800)", border: "1px solid var(--border-subtle-dark)", borderRadius: "var(--radius-md)", padding: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", overflow: "hidden", flexShrink: 0 }}>
          <image-slot ref={cardSlotRef} id={cardSlotId} shape="rounded" radius="10"
            src={photoSrc || ""} placeholder="Photo" style={{ width: "100%", height: "100%" }}></image-slot>
        </div>
        <div>
          <div style={{ font: "var(--text-label-md)", color: "#fff" }}>This card's photo</div>
          <div style={{ font: "var(--text-body-sm)", color: "var(--navy-300)" }}>Defaults to your profile photo — drop a different one just for this card.</div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: previewMaxW, display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
        <Button variant="primary" size="lg" className="pillbtn" style={{ width: "100%" }} icon={<Icon name="share" size={17} />} disabled={!ready} onClick={share}>Share</Button>
        <Button variant="outline" size="lg" className="pillbtn" style={{ width: "100%" }} icon={<Icon name="download" size={17} />} disabled={!ready} onClick={save}>Save image</Button>
        <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", font: "var(--text-label-md)", color: "var(--navy-200)", padding: 8 }}>
          Done
        </button>
      </div>
    </div>
  );
}
window.ShareCard = ShareCard;
