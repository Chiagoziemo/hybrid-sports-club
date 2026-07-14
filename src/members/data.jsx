/* global window */
// Members-area static copy. Roster, profiles, leaderboard and per-event
// volunteer roles all now live in Supabase (member_roster, members,
// leaderboard_checkins(), event_volunteer_roles) — see src/data.jsx and
// src/members/app.jsx. This file only keeps content with no DB table
// behind it: share-card copy, keyed by event slug.

const SHARE_LINES = {
  "saturday-session": "I'm in for Hybrid's Saturday session ✅",
  "wednesday-padel": "I'm in for Wednesday padel night ✅",
  "anniversary-festival": "I'm in for the Anniversary Festival ✅",
};

const SHARE_TITLES = {
  "saturday-session": "Saturday Session",
  "wednesday-padel": "Padel Night",
  "anniversary-festival": "Anniversary Festival",
};

Object.assign(window, { SHARE_LINES, SHARE_TITLES });
