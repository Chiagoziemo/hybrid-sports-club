/* global React */
// Live Supabase data layer — shared by every page. A small hand-rolled
// cache+subscriber per query shape means multiple components on one page
// (Hero, Events, SiteFooter, RsvpModal, …) share a single fetch instead of
// each re-querying independently.

function mapEventRow(row) {
  const featured = row.spotlight_order != null;
  const badge = featured
    ? "Featured event"
    : (row.category === "Weekly Sessions" || row.category === "Padel Nights")
    ? "Every week"
    : row.category === "Social"
    ? "Social"
    : "Monthly";

  let dateLabel = row.schedule;
  let timeLabel = null;
  let target;
  if (row.date) {
    const d = new Date(row.date);
    dateLabel = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" });
    timeLabel = "Gates " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" });
    target = d.getTime();
  }

  return {
    id: row.slug,
    dbId: row.id,
    featured,
    category: row.category,
    type: row.type,
    badge,
    name: row.title,
    cadence: row.schedule,
    dateLabel,
    timeLabel,
    place: row.location,
    tagline: row.description,
    desc: row.description,
    target,
    photo: row.photo,
    cta: featured ? "RSVP for the festival" : undefined,
    volunteeringEnabled: !!row.volunteering_enabled,
  };
}

let _eventsCache = null;
let _eventsPromise = null;
const _eventsListeners = new Set();
function _notifyEvents() { _eventsListeners.forEach((fn) => fn()); }

function loadEvents(force) {
  if (_eventsPromise && !force) return _eventsPromise;
  _eventsPromise = window.sb.from("events").select("*").then(({ data, error }) => {
    if (error) { console.error("[data] events fetch failed", error); _eventsCache = []; }
    else {
      const mapped = (data || []).map(mapEventRow);
      mapped.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
      _eventsCache = mapped;
    }
    _notifyEvents();
    return _eventsCache;
  });
  return _eventsPromise;
}

// Reactive read of the shared events cache. Returns [] until the first
// fetch resolves, then the live array — every consumer re-renders together.
function useSupaEvents() {
  const [, bump] = React.useState(0);
  React.useEffect(() => {
    if (_eventsCache == null) loadEvents();
    const listener = () => bump((n) => n + 1);
    _eventsListeners.add(listener);
    return () => _eventsListeners.delete(listener);
  }, []);
  return _eventsCache || [];
}

function refreshEvents() { return loadEvents(true); }

// Non-hook snapshot for use in plain callbacks (React hooks can only be
// called inside component render). Same cache as useSupaEvents().
function getEventsSnapshot() { return _eventsCache || []; }

// ---- Volunteer roles + sponsors, fetched per event on demand ----
function iconForRole(roleName) {
  const s = (roleName || "").toLowerCase();
  if (s.includes("planning") || s.includes("production")) return "clipboard-list";
  if (s.includes("outreach")) return "megaphone";
  if (s.includes("sponsor") || s.includes("partnership")) return "handshake";
  if (s.includes("media") || s.includes("publicity") || s.includes("content")) return "camera";
  if (s.includes("merch") || s.includes("fashion") || s.includes("retail")) return "shirt";
  if (s.includes("registration") || s.includes("guest")) return "user-check";
  if (s.includes("fitness") || s.includes("wellness") || s.includes("stage")) return "activity";
  if (s.includes("sports") || s.includes("race") || s.includes("field")) return "trophy";
  if (s.includes("village") || s.includes("hospitality") || s.includes("protocol")) return "tent";
  if (s.includes("logistics") || s.includes("safety") || s.includes("welfare")) return "shield-check";
  if (s.includes("setup") || s.includes("pitch")) return "flag-triangle-right";
  if (s.includes("warm")) return "activity";
  if (s.includes("check-in") || s.includes("new faces")) return "user-check";
  if (s.includes("photo") || s.includes("story")) return "camera";
  if (s.includes("court")) return "flag-triangle-right";
  if (s.includes("coach") || s.includes("beginner")) return "circle-dot";
  return "star";
}

async function fetchVolunteerRoles(eventDbId) {
  const { data, error } = await window.sb
    .from("event_volunteer_roles")
    .select("*")
    .eq("event_id", eventDbId)
    .eq("enabled", true);
  if (error) { console.error("[data] volunteer roles fetch failed", error); return []; }
  return (data || []).map((r) => ({
    dbId: r.id, title: r.role, icon: iconForRole(r.role), blurb: r.description || "", spots: r.spots,
  }));
}

async function fetchEventSponsors(eventDbId) {
  const { data, error } = await window.sb
    .from("event_sponsors")
    .select("id, tier, status, sponsors ( name, logo, contact_person, contact_email, contact_phone )")
    .eq("event_id", eventDbId);
  if (error) { console.error("[data] sponsors fetch failed", error); return []; }
  return (data || []).map((row) => ({
    dbId: row.id,
    name: row.sponsors ? row.sponsors.name : "",
    tier: row.tier,
    status: row.status,
    contact: row.sponsors ? row.sponsors.contact_person : "",
    email: row.sponsors ? row.sponsors.contact_email : "",
    phone: row.sponsors ? row.sponsors.contact_phone : "",
    logo: row.sponsors ? row.sponsors.logo : null,
  }));
}

// ---- ISO-week based streak math over raw check-in timestamps. Current
// streak allows a one-week grace (so a Saturday-only member isn't zeroed
// out mid-week); longest streak scans the full history. `delta` (rank
// movement vs last month) needs a historical snapshot we don't keep, so
// it's always 0 — the "biggest mover" callout simply won't fire. ----
function isoWeekKey(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return date.getUTCFullYear() * 53 + week;
}

function computeLeaderboard(rows) {
  const byMember = new Map();
  (rows || []).forEach((r) => {
    if (!byMember.has(r.member_id)) byMember.set(r.member_id, { name: r.name, avatar_url: r.avatar_url, dates: [] });
    byMember.get(r.member_id).dates.push(new Date(r.checked_in_at));
  });

  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const entries = [];

  byMember.forEach((m, memberId) => {
    const weekIndex = Array.from(new Set(m.dates.map(isoWeekKey))).sort((a, b) => a - b);
    const weekSet = new Set(weekIndex);

    let currentStreak = 0;
    let cursor = isoWeekKey(now);
    if (!weekSet.has(cursor)) {
      const prev = new Date(now); prev.setDate(prev.getDate() - 7);
      cursor = isoWeekKey(prev);
    }
    while (weekSet.has(cursor)) { currentStreak++; cursor--; }

    let longestStreak = weekIndex.length ? 1 : 0, run = 1;
    for (let i = 1; i < weekIndex.length; i++) {
      run = weekIndex[i] === weekIndex[i - 1] + 1 ? run + 1 : 1;
      longestStreak = Math.max(longestStreak, run);
    }

    const sessionsThisMonth = m.dates.filter((d) => `${d.getFullYear()}-${d.getMonth()}` === thisMonthKey).length;
    entries.push({
      memberId, name: m.name, avatarUrl: m.avatar_url,
      streak: currentStreak, longest: longestStreak,
      sessions: sessionsThisMonth, totalSessions: m.dates.length, delta: 0,
    });
  });

  entries.sort((a, b) => b.streak - a.streak || b.sessions - a.sessions);
  return entries;
}

async function fetchLeaderboard() {
  const { data, error } = await window.sb.rpc("leaderboard_checkins");
  if (error) { console.error("[data] leaderboard fetch failed", error); return []; }
  return computeLeaderboard(data);
}

function slugify(s) {
  return (s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "event-" + Date.now();
}

Object.assign(window, {
  mapEventRow, useSupaEvents, loadEvents, refreshEvents, getEventsSnapshot,
  fetchVolunteerRoles, fetchEventSponsors, fetchLeaderboard, computeLeaderboard,
  iconForRole, slugify,
});
