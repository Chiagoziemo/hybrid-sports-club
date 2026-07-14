/* global React, Icon, DS */
const TABS = [
  { key: "dashboard", label: "Home", icon: "home" },
  { key: "events", label: "Events", icon: "calendar-days" },
  { key: "volunteer", label: "Volunteer", icon: "handshake" },
  { key: "profile", label: "Profile", icon: "user" },
];

function MembersBottomNav({ active, onChange }) {
  const { BottomTabBar } = window.DS;
  return (
    <BottomTabBar
      active={active}
      onChange={onChange}
      items={TABS.map((t) => ({ key: t.key, label: t.label, icon: <Icon name={t.icon} size={21} /> }))}
    />
  );
}
window.MembersBottomNav = MembersBottomNav;
