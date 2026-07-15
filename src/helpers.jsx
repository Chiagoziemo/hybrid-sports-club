/* global React */
const DS = window.HybridSportsClubDesignSystem_dd63ac;
const PHOTO = (n) => `assets/photography/${n}.jpeg`;

// ---- Club-wide facts (permanent, not tied to any one event) ----
const CLUB = {
  members: 700,
  founded: 2025,
  sessionsRun: 52,
  avgWeeklyAttendance: 128,
};

// Events now live in Supabase (public.events) — see src/data.jsx for
// mapEventRow()/useSupaEvents(). EVENT_FILTERS mirrors the DB's
// events.category CHECK constraint exactly.
const EVENT_FILTERS = ["Weekly Sessions", "Special Events", "Padel Nights", "Social"];

// ---- Shared festival registration vocabulary — used by both the RSVP
// modal (site-wide) and the Festival page's Register form, so the two
// stay in lockstep. Mirrors rsvps.guest_type's CHECK constraint. ----
const GUEST_TYPES = [
  "Hybrid Sports Club member",
  "Member of an invited community",
  "Personally invited guest",
  "General guest",
  "Corporate or partner guest",
  "Media or content creator",
  "Other",
];
const FESTIVAL_ACTIVITIES = [
  "Cardio", "5K run", "Field games", "Food", "Music", "Cocktails",
  "Wellness & recovery", "Yoga", "Swimming", "Gym session", "Live performances", "Other",
];
const BANK = { name: "Hybrid Sports Club", bank: "GTBank", number: "3004408132" };

// ---- Lucide icon wrapper ----
function Icon({ name, size = 24, style, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons();
    const svg = el.querySelector("svg");
    if (svg) { svg.setAttribute("width", size); svg.setAttribute("height", size); }
  }, [name, size]);
  return <span ref={ref} className={className} style={{ display: "inline-flex", lineHeight: 0, ...style }} />;
}

// ---- Countdown hook ----
function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, done: diff === 0 };
  };
  const [t, setT] = React.useState(calc);
  React.useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

// ---- Reveal-on-scroll hook ----
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

// Opens the Anniversary Festival RSVP modal from anywhere on the site —
// components dispatch/listen via a plain custom event so they don't need
// to share React state.
function openRsvpModal() {
  window.dispatchEvent(new CustomEvent("open-rsvp-modal"));
}

// ---- Data ----
const ACTIVITIES = [
  { title: "Group runs", icon: "footprints", blurb: "Sunrise road runs with Èkó Runners." },
  { title: "HIIT circuits", icon: "flame", blurb: "Pitch-side circuits that wreck you (kindly)." },
  { title: "Yoga & mobility", icon: "person-standing", blurb: "Slow flows on the grass to open the day." },
  { title: "Archery", icon: "target", blurb: "Steady hands, quiet focus, real arrows." },
  { title: "Beach volleyball", icon: "volleyball", blurb: "Sand, sun, and a competitive streak." },
  { title: "Padel", icon: "circle-dot", blurb: "Fast rallies on the Play Padel courts." },
  { title: "5-a-side football", icon: "goal", blurb: "Small sides, big bragging rights." },
  { title: "Basketball", icon: "circle-dashed", blurb: "Pickup runs on the full court." },
  { title: "Swimming", icon: "waves", blurb: "Laps and cool-downs in the pool." },
  { title: "Kayaking", icon: "sailboat", blurb: "Paddle out on the Epe lagoon." },
  { title: "Social nights", icon: "utensils", blurb: "Potlucks, playlists, and slow hangs." },
];

const FEATURED = [
  { title: "Yoga & mobility", tag: "Wellness", photo: "session-yoga-pair", desc: "Slow morning flows on the grass to open up the week." },
  { title: "Archery", tag: "Precision", photo: "archery", desc: "Steady hands, quiet focus, real arrows downrange." },
  { title: "Beach volleyball", tag: "Team sport", photo: "beach-volleyball", desc: "Sand, sun and a friendly, competitive streak." },
  { title: "Kayaking", tag: "On the water", photo: "kayaking", desc: "Paddle out on the calm Epe lagoon at sunrise." },
];

const ROLES = [
  { title: "Planning & Production", icon: "clipboard-list", blurb: "Event production and project support." },
  { title: "Community Outreach", icon: "megaphone", blurb: "Invite and mobilise communities to join." },
  { title: "Sponsorship & Partnerships", icon: "handshake", blurb: "Manage sponsors, secure new partners." },
  { title: "Content, Media & Publicity", icon: "camera", blurb: "Capture and publish the story." },
  { title: "Merch, Fashion & Retail", icon: "shirt", blurb: "Source and sell anniversary merch." },
  { title: "Registration & Guest Experience", icon: "user-check", blurb: "RSVPs, check-in and guest support." },
  { title: "Fitness, Wellness & Stage Ops", icon: "activity", blurb: "Sessions, instructors, MCs, schedule." },
  { title: "Sports, Races & Field Games", icon: "trophy", blurb: "Races, competitions and scoring." },
  { title: "Brand Village, Hospitality & Protocol", icon: "tent", blurb: "Booths, VIP and protocol." },
  { title: "Logistics, Safety & Welfare", icon: "shield-check", blurb: "Setup, security, first-aid, welfare." },
];

const SPONSORS = [
  { name: "i-Fitness", logo: "i-fitness" },
  { name: "Madala", logo: "madala" },
  { name: "Pocari Sweat", logo: "pocari-sweat" },
  { name: "Papilon", logo: "papilon" },
  { name: "Play Padel", logo: "play-padel" },
  { name: "Volta", logo: "volta" },
  { name: "First Ally Capital", logo: "first-ally-capital" },
  { name: "Èkó Runners Club", logo: "eko-runners-club" },
  { name: "Eden Lifestyle", logo: "eden-lifestyle" },
  { name: "Alaro City", logo: "alaro-city" },
];

const GALLERY = [
  "drone-group-workout", "group-photo-pitch", "session-yoga-pair", "archery",
  "beach-volleyball", "kayaking", "group-stretch-pitch", "group-lie-down-stretch", "group-stretch",
];

// ---- Hero trust chips (compact proof, alongside the countdown) ----
const HERO_STATS = [
  { value: "700+", label: "Members who call this home" },
  { value: "1", label: "Year of Saturdays" },
  { value: "4+", label: "Sports every week" },
];

// ---- "What You'll Gain With Us" — warm, benefit-led ----
const BENEFITS = [
  { icon: "calendar-days", title: "Weekly Saturday sessions", blurb: "Every Saturday at 7am, same pitch, same warm welcome. Your week finally has an anchor." },
  { icon: "users", title: "Community & friendships", blurb: "Come for the workout, stay for the people. Most members leave with a whole new group chat." },
  { icon: "shuffle", title: "Try every sport", blurb: "Jogging, HIIT, yoga, archery, volleyball, padel — sample it all without switching gyms." },
  { icon: "heart-pulse", title: "Wellness & movement", blurb: "Move outdoors in real Lagos daylight, at whatever pace feels good to you that day." },
  { icon: "party-popper", title: "Events & experiences", blurb: "Festivals, paddle-outs and socials that turn a workout into a whole day worth remembering." },
  { icon: "hand-heart", title: "Volunteer & belong", blurb: "Want to help run things? There's a place for you on the crew — and it feels good to have one." },
];

// ---- "How to Join Our Community" — numbered steps ----
const JOIN_STEPS = [
  { n: "01", title: "Fill in the quick form", blurb: "Tell us your name, your number and the sports you're curious about. Takes a minute." },
  { n: "02", title: "Join the WhatsApp group", blurb: "We add you to the community chat, where every session and event gets posted." },
  { n: "03", title: "Show up Saturday, 7am", blurb: "Come exactly as you are — every fitness level welcome. Your first session is on us." },
  { n: "04", title: "Keep showing up", blurb: "Find your people, try new sports, and become part of the crew that makes Lagos move." },
];

// ---- Scrolling activity ticker (marquee below the hero) ----
const TICKER_TAGS = [
  "Light Jogs", "Walks", "HIIT", "Yoga", "Archery",
  "Volleyball", "Sack Races", "Padel", "Potluck Nights",
];

// ---- Community & Collabs milestones (editorial photo cards) ----
const COLLABS = [
  {
    photo: "group-photo-pitch",
    tag: "Community x community",
    stat: "@zer0runclub",
    line: "We hosted @zer0runclub for one joint session — two crews, one sunrise on the pitch.",
  },
  {
    photo: "drone-group-workout",
    tag: "Brand collab",
    stat: "Pocari Sweat",
    line: "Powered the Pocari Sweat Community Attack — a full morning of movement and hydration.",
  },
  {
    photo: "group-stretch",
    tag: "Recognition",
    stat: "Best Fitness Community",
    line: "Voted Best Fitness Community at the 2025 Nigerian Fitness Awards.",
  },
];

// ---- Member testimonials (real-sounding community sentiment) ----
const TESTIMONIALS = [
  { name: "Tomiwa", quote: "Eight months of Saturdays now. I don't debate it anymore — I show up at 7 and the crew is already there." },
  { name: "Amara", quote: "I was the least fit person on the pitch my first week. Nobody made me feel it. Now I run with the front group." },
  { name: "Ife", quote: "It's the one thing in my week that's actually consistent. Same pitch, same time, same people who became friends." },
  { name: "Chidi", quote: "Came for the workout, stayed for the potluck nights. This is a community first, a sports club second." },
];

function NKicker({ n, children, style }) {
  return (
    <span className="nkicker" style={style}>
      <span className="nk-num">{n}</span>{children}
    </span>
  );
}

// Shared "Add to calendar" pair (Google + downloadable .ics for Apple/
// Outlook). Only renders when the event has a real one-off date/time —
// window.addToCalendarLinks (src/data.jsx) returns null for recurring
// weekly sessions with no single instant to add.
function AddToCalendarButtons({ event, dark }) {
  const links = window.addToCalendarLinks(event);
  if (!links) return null;
  const btnStyle = {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--radius-full)",
    font: "var(--text-label-md)", fontWeight: 700, textDecoration: "none",
    border: "1px solid " + (dark ? "var(--border-subtle-dark)" : "var(--border-default-light)"),
    color: dark ? "#fff" : "var(--navy-800)",
    background: dark ? "var(--navy-800)" : "transparent",
  };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <a href={links.google} target="_blank" rel="noreferrer" style={btnStyle}>
        <Icon name="calendar-plus" size={15} />Google Calendar
      </a>
      <a href={links.icsHref} download="hybrid-sports-club-event.ics" style={btnStyle}>
        <Icon name="calendar-plus" size={15} />Apple / Outlook (.ics)
      </a>
    </div>
  );
}

Object.assign(window, {
  DS, Icon, NKicker, useCountdown, useReveal, openRsvpModal, PHOTO,
  CLUB, EVENT_FILTERS, ACTIVITIES, FEATURED, ROLES, SPONSORS, GALLERY,
  GUEST_TYPES, FESTIVAL_ACTIVITIES, BANK,
  HERO_STATS, BENEFITS, JOIN_STEPS, TICKER_TAGS, COLLABS, TESTIMONIALS,
  AddToCalendarButtons,
});
