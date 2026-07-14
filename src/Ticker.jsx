/* global React, TICKER_TAGS */
// Auto-scrolling marquee of activities. Deliberately loud: a condensed
// "energetic" display face (Anton) and a rotating range of the brand's
// accent colors — green, orange and sun-yellow — rather than green alone.
// Sized ~50% smaller than the section it replaced.
const TICK_FILLS = [
  { background: "var(--green-400)", color: "var(--navy-950)" },
  { background: "var(--orange-400)", color: "var(--navy-950)" },
  { background: "var(--yellow-400)", color: "var(--navy-950)" },
  { background: "transparent", color: "var(--paper-50)", border: "1px solid var(--border-default-dark)" },
];

function Ticker() {
  // Repeat the tag set several times per track so each track always
  // exceeds the viewport width — guarantees a seamless, gapless loop
  // (two tracks translating -100% in lockstep, forever).
  const row = (keyPrefix) =>
    Array.from({ length: 4 }).flatMap((_, rep) =>
      TICKER_TAGS.map((t, i) => (
        <span key={`${keyPrefix}-${rep}-${t}`} className="tick" style={{ ...TICK_FILLS[i % TICK_FILLS.length], flexShrink: 0 }}>{t}</span>
      ))
    );
  return (
    <section aria-label="What we run every week" className="blk-navy" style={{ padding: "11px 0", overflow: "hidden" }}>
      <div className="marquee">
        <div className="marquee__track">{row("a")}</div>
        <div className="marquee__track" aria-hidden="true">{row("b")}</div>
      </div>
    </section>
  );
}
window.Ticker = Ticker;
