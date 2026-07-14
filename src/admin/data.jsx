/* global window */
// Everything that used to be hardcoded seed data here (RSVPs, volunteers,
// sponsors, calendar, member-interest stats) now comes from live Supabase
// queries — see src/admin/app.jsx, Overview.jsx and Members.jsx. This file
// only keeps a purely decorative, static lookup with no DB table behind it.

const EVENT_COLORS = {
  "One-Year Anniversary Festival": "var(--accent-secondary)",
  "Saturday Session": "var(--accent-primary)",
  "Wednesday Padel Night": "var(--green-600)",
};

Object.assign(window, { EVENT_COLORS });
