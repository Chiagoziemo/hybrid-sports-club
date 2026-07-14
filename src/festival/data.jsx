/* global React */
const FESTIVAL_HIGHLIGHTS = [
  { icon: "dumbbell", title: "Fitness workouts", desc: "Group classes and open-gym sessions." },
  { icon: "footprints", title: "5K run", desc: "Timed fun runs for every pace." },
  { icon: "party-popper", title: "Games & entertainment", desc: "Contests, prizes and good chaos." },
  { icon: "trophy", title: "Sports & field games", desc: "Team competitions on the pitch." },
  { icon: "utensils", title: "Food, music & community", desc: "Live music and great food." },
  { icon: "heart-pulse", title: "Wellness & recovery", desc: "Yoga, meditation and massage therapy." },
];

const ITINERARY = [
  { time: "7:00 am", title: "Arrival, check-in & warm-up", desc: "Collect your wristband, meet your team, warm up together." },
  { time: "8:00 am", title: "5K run", desc: "Timed routes for racers, a relaxed pace group for everyone else." },
  { time: "9:00 am", title: "Fitness workouts & field games", desc: "Coach-led circuits, football, volleyball and relays." },
  { time: "10:30 am", title: "Yoga, pilates & mobility", desc: "Guided recovery for flexibility, balance and calm." },
  { time: "12:00 pm", title: "Recreation, networking & celebration", desc: "Community hangs and live performances." },
];

// GUEST_TYPES, FESTIVAL_ACTIVITIES and BANK now live in helpers.jsx (shared
// with the site-wide RSVP modal) — this file only keeps festival-page-only data.
Object.assign(window, { FESTIVAL_HIGHLIGHTS, ITINERARY });
