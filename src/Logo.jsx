/* global React */
// Real brand logo (from hybrid_logo_bg.png, tightly cropped, alpha-preserved).
// Always render the FULL lockup (mark + "hybrid" + "sports club") per brand
// guidelines — do not crop/trim it, just scale by height.
// hybrid-logo-navy.png = ink-navy on transparent (light surfaces).
// hybrid-logo-white-cropped.png = knockout white on transparent (dark surfaces).
const LOGO_ASPECT = 893 / 289;

function Logo({ height = 32, dark = true, ...rest }) {
  const src = dark ? "assets/logos/hybrid-logo-white-cropped.png" : "assets/logos/hybrid-logo-navy.png";
  return <img src={src} alt="Hybrid Sports Club" style={{ height, width: "auto", display: "block" }} {...rest} />;
}
window.Logo = Logo;
window.LOGO_ASPECT = LOGO_ASPECT;
