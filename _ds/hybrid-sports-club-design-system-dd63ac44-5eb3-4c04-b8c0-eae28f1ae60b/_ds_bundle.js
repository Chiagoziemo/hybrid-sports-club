/* @ds-bundle: {"format":4,"namespace":"HybridSportsClubDesignSystem_dd63ac","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BottomTabBar","sourcePath":"components/navigation/BottomTabBar.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Sheet","sourcePath":"components/surfaces/Sheet.jsx"},{"name":"Toast","sourcePath":"components/surfaces/Toast.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"e2d6b68f7e81","components/core/Button.jsx":"d45af41fdfc0","components/core/IconButton.jsx":"b0246218001f","components/core/Tag.jsx":"758465811a53","components/data/Avatar.jsx":"3cca3cd5f03e","components/forms/Checkbox.jsx":"910185a5675b","components/forms/Input.jsx":"4b170c63317d","components/forms/Radio.jsx":"8334fa0626c1","components/forms/Select.jsx":"4c7d2b78f05d","components/forms/Switch.jsx":"c3507299601a","components/navigation/BottomTabBar.jsx":"2ce775e1163e","components/navigation/NavBar.jsx":"68378ad28586","components/navigation/Tabs.jsx":"b3055b533c8e","components/surfaces/Card.jsx":"48cd90fe00a9","components/surfaces/Sheet.jsx":"d3278d0a2b2d","components/surfaces/Toast.jsx":"1f51c035c0b5","ui_kits/app/FeedScreen.jsx":"b5b2064262a1","ui_kits/app/HomeScreen.jsx":"3bad98cdab96","ui_kits/app/PhoneFrame.jsx":"844b1ceef480","ui_kits/app/ScheduleScreen.jsx":"d649ccd35030","ui_kits/app/SessionDetailScreen.jsx":"a2dd7b6a888a","ui_kits/website/CommunityStrip.jsx":"942849aa9dca","ui_kits/website/Footer.jsx":"3b9456d278f2","ui_kits/website/Hero.jsx":"66e21c649d75","ui_kits/website/SessionGrid.jsx":"d6280e69dcd2","ui_kits/website/SessionPage.jsx":"7fb7069e91b1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HybridSportsClubDesignSystem_dd63ac = window.HybridSportsClubDesignSystem_dd63ac || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/** Small status/category pill. Solid (filled accent) or subtle (tinted) tone. */
function Badge({
  children,
  tone = "green",
  variant = "subtle",
  style
}) {
  const tones = {
    green: {
      fg: "var(--green-400)",
      bg: "var(--green-100)",
      solidFg: "var(--text-on-accent)",
      solidBg: "var(--green-400)"
    },
    orange: {
      fg: "var(--orange-500)",
      bg: "var(--orange-100)",
      solidFg: "var(--text-on-accent)",
      solidBg: "var(--orange-400)"
    },
    yellow: {
      fg: "var(--yellow-500)",
      bg: "var(--yellow-100)",
      solidFg: "var(--text-on-accent)",
      solidBg: "var(--yellow-400)"
    },
    neutral: {
      fg: "var(--navy-600)",
      bg: "var(--navy-100)",
      solidFg: "#fff",
      solidBg: "var(--navy-500)"
    }
  };
  const t = tones[tone] || tones.green;
  const isSolid = variant === "solid";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "var(--radius-full)",
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-wide-label)",
      textTransform: "uppercase",
      background: isSolid ? t.solidBg : t.bg,
      color: isSolid ? t.solidFg : t.fg,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primary UI action. Filled (accent) / secondary (outline) / ghost (text-only),
 * three sizes, optional icon, loading + disabled states.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 14px",
      font: "var(--text-label-md)",
      radius: "var(--radius-md)",
      gap: 6
    },
    md: {
      padding: "12px 20px",
      font: "var(--text-label-lg)",
      radius: "var(--radius-md)",
      gap: 8
    },
    lg: {
      padding: "16px 26px",
      font: "var(--text-label-lg)",
      radius: "var(--radius-lg)",
      gap: 8
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--accent-primary)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-glow-green)"
    },
    secondary: {
      background: "var(--accent-secondary)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent",
      boxShadow: "var(--shadow-glow-orange)"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary-dark)",
      border: "1px solid var(--border-default-dark)",
      boxShadow: "none"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary-dark)",
      border: "1px solid transparent",
      boxShadow: "none"
    }
  };
  const v = variants[variant] || variants.primary;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    padding: s.padding,
    font: s.font,
    borderRadius: s.radius,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : loading ? 0.7 : 1,
    transition: "transform var(--duration-fast) var(--ease-bounce), opacity var(--duration-fast) var(--ease-out), background var(--duration-base) var(--ease-out)",
    fontFamily: "var(--font-body)",
    ...v,
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: disabled || loading ? undefined : onClick,
    disabled: disabled || loading,
    style: base,
    onMouseDown: e => {
      if (!disabled && !loading) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, rest), icon && iconPosition === "left" ? icon : null, loading ? "â€¦" : children, icon && iconPosition === "right" ? icon : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small circular icon-only tappable control (nav actions, card overlays). */
function IconButton({
  icon,
  size = 40,
  variant = "ghost",
  onClick,
  style,
  ...rest
}) {
  const variants = {
    ghost: {
      background: "rgba(228,232,245,0.08)",
      color: "var(--text-primary-dark)"
    },
    solid: {
      background: "var(--surface-card-dark)",
      color: "var(--text-primary-dark)"
    },
    scrim: {
      background: "rgba(5,7,13,0.45)",
      color: "#fff",
      backdropFilter: "blur(6px)"
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "transform var(--duration-fast) var(--ease-bounce)",
      ...v,
      ...style
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.9)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1)"
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/** Interactive filter/category chip â€” selectable, optionally removable. */
function Tag({
  children,
  selected = false,
  onClick,
  onRemove,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: "var(--radius-full)",
      font: "var(--text-label-md)",
      cursor: onClick ? "pointer" : "default",
      background: selected ? "var(--accent-primary)" : "rgba(228,232,245,0.08)",
      color: selected ? "var(--text-on-accent)" : "var(--text-secondary-dark)",
      border: selected ? "1px solid transparent" : "1px solid var(--border-subtle-dark)",
      transition: "all var(--duration-base) var(--ease-out)",
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      opacity: 0.7
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
/** Circular member avatar with optional online/attending ring accent. */
function Avatar({
  src,
  name,
  size = 40,
  ring = false
}) {
  const initials = (name || "").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--navy-600)",
      color: "var(--text-primary-dark)",
      font: "var(--text-label-md)",
      boxShadow: ring ? "0 0 0 2px var(--navy-950), 0 0 0 4px var(--accent-primary)" : "none",
      flexShrink: 0
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 20,
      height: 20,
      borderRadius: 6,
      background: checked ? "var(--accent-primary)" : "transparent",
      border: `1.5px solid ${checked ? "var(--accent-primary)" : "var(--border-default-dark)"}`,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all var(--duration-fast) var(--ease-out)"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-on-accent)",
      fontSize: 13,
      fontWeight: 700
    }
  }, "\u2713")), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-primary-dark)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
/** Text input with optional label, helper text, and error state. */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  helper,
  icon,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-md)",
      color: "var(--text-secondary-dark)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 14px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-sunken-dark)",
      border: `1px solid ${error ? "var(--danger)" : "var(--border-default-dark)"}`
    }
  }, icon, /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      color: "var(--text-primary-dark)",
      font: "var(--text-body-md)"
    }
  })), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: error ? "var(--danger)" : "var(--text-tertiary-dark)"
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(),
    style: {
      width: 20,
      height: 20,
      borderRadius: "var(--radius-full)",
      border: `1.5px solid ${checked ? "var(--accent-primary)" : "var(--border-default-dark)"}`,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "var(--radius-full)",
      background: "var(--accent-primary)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-primary-dark)"
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Native-backed select with the same visual shell as Input. */
function Select({
  label,
  value,
  onChange,
  options = [],
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label-md)",
      color: "var(--text-secondary-dark)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    style: {
      width: "100%",
      appearance: "none",
      padding: "12px 14px",
      borderRadius: "var(--radius-md)",
      background: "var(--surface-sunken-dark)",
      border: "1px solid var(--border-default-dark)",
      color: "var(--text-primary-dark)",
      font: "var(--text-body-md)"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-tertiary-dark)",
      pointerEvents: "none"
    }
  }, "\u25BE")));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 44,
      height: 26,
      borderRadius: "var(--radius-full)",
      background: checked ? "var(--accent-primary)" : "rgba(228,232,245,0.16)",
      display: "inline-flex",
      alignItems: "center",
      padding: 3,
      cursor: "pointer",
      transition: "background var(--duration-base) var(--ease-out)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: "var(--radius-full)",
      background: "#fff",
      transform: checked ? "translateX(18px)" : "translateX(0)",
      transition: "transform var(--duration-base) var(--ease-bounce)",
      boxShadow: "var(--shadow-sm)"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomTabBar.jsx
try { (() => {
/** Fixed bottom tab bar for the mobile app â€” floating pill highlights the active tab. */
function BottomTabBar({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "10px 12px calc(10px + env(safe-area-inset-bottom, 0px))",
      background: "rgba(10,15,28,0.85)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid var(--border-subtle-dark)"
    }
  }, items.map(item => {
    const isActive = item.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.key,
      onClick: () => onChange && onChange(item.key),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: "var(--radius-full)",
        color: isActive ? "var(--accent-primary)" : "var(--text-tertiary-dark)",
        transition: "color var(--duration-base) var(--ease-out)"
      }
    }, item.icon, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--text-label-sm)",
        textTransform: "none",
        letterSpacing: 0
      }
    }, item.label));
  }));
}
Object.assign(__ds_scope, { BottomTabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomTabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
/** Slim sticky top nav for the marketing website. */
function NavBar({
  logo,
  links = [],
  cta
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px var(--space-8)",
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(251,249,244,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-subtle-light)"
    }
  }, /*#__PURE__*/React.createElement("div", null, logo), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-8)",
      alignItems: "center"
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      font: "var(--text-label-lg)",
      color: "var(--text-secondary-light)",
      textDecoration: "none"
    }
  }, l)), cta));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Horizontal tab switcher (e.g. Upcoming / Past on Schedule). */
function Tabs({
  items,
  active,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      ...style
    }
  }, items.map(item => {
    const isActive = item === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => onChange && onChange(item),
      style: {
        padding: "8px 18px",
        borderRadius: "var(--radius-full)",
        border: "none",
        cursor: "pointer",
        font: "var(--text-label-md)",
        background: isActive ? "var(--accent-primary)" : "transparent",
        color: isActive ? "var(--text-on-accent)" : "var(--text-secondary-dark)",
        transition: "all var(--duration-base) var(--ease-out)"
      }
    }, item);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
/**
 * Session/content card. `photo` variant is full-bleed image with a bottom
 * scrim + overlay text (the primary session-discovery pattern). `plain`
 * variant is a flat navy-800 surface for list rows / info cards.
 */
function Card({
  variant = "plain",
  image,
  children,
  style,
  onClick
}) {
  if (variant === "photo") {
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      style: {
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        boxShadow: "var(--shadow-md)",
        minHeight: 220,
        background: `linear-gradient(to top, rgba(5,7,13,0.85) 0%, rgba(5,7,13,0.15) 55%, rgba(5,7,13,0) 100%), url(${image}) center/cover`,
        display: "flex",
        alignItems: "flex-end",
        padding: "var(--space-5)",
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%"
      }
    }, children));
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: "var(--surface-card-dark)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)",
      boxShadow: "var(--shadow-sm)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Sheet.jsx
try { (() => {
/** Bottom sheet / modal â€” scrim + slide-up panel, used for booking confirmation, filters, etc. */
function Sheet({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--overlay-scrim)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "flex-end",
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      background: "var(--navy-800)",
      borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
      padding: "var(--space-6)",
      boxShadow: "var(--shadow-lg)",
      animation: "hsc-sheet-in var(--duration-slow) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: "var(--radius-full)",
      background: "var(--border-default-dark)",
      margin: "0 auto var(--space-4)"
    }
  }), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-title-lg)",
      color: "var(--text-primary-dark)",
      margin: "0 0 var(--space-4)"
    }
  }, title), children), /*#__PURE__*/React.createElement("style", null, `@keyframes hsc-sheet-in { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Toast.jsx
try { (() => {
/** Transient confirmation toast â€” success/info/error tone, auto-styled pill. */
function Toast({
  message,
  tone = "success",
  visible = true
}) {
  if (!visible) return null;
  const tones = {
    success: {
      bg: "var(--green-400)",
      fg: "var(--text-on-accent)"
    },
    info: {
      bg: "var(--navy-700)",
      fg: "var(--text-primary-dark)"
    },
    error: {
      bg: "var(--danger)",
      fg: "#fff"
    }
  };
  const t = tones[tone] || tones.success;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: 24,
      transform: "translateX(-50%)",
      background: t.bg,
      color: t.fg,
      padding: "12px 20px",
      borderRadius: "var(--radius-full)",
      font: "var(--text-label-lg)",
      boxShadow: "var(--shadow-lg)",
      whiteSpace: "nowrap",
      zIndex: 60,
      animation: "hsc-toast-in var(--duration-base) var(--ease-bounce)"
    }
  }, message, /*#__PURE__*/React.createElement("style", null, `@keyframes hsc-toast-in { from { transform: translate(-50%, 12px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }`));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Toast.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/FeedScreen.jsx
try { (() => {
const POSTS = [{
  id: 1,
  name: "Chidi Okafor",
  time: "2h",
  image: "../../assets/photography/drone-group-workout.jpeg",
  caption: "Saturday crew from above ðŸ”¥ 128 of us showed up today.",
  likes: 84
}, {
  id: 2,
  name: "Zainab Kadiri",
  time: "1d",
  image: "../../assets/photography/group-lie-down-stretch.jpeg",
  caption: "Cooldown never felt this good. Same time next week?",
  likes: 51
}, {
  id: 3,
  name: "Femi Balogun",
  time: "3d",
  image: "../../assets/photography/kayaking.jpeg",
  caption: "First time on the lagoon â€” not the last.",
  likes: 63
}];
function FeedScreen({
  Avatar,
  IconButton
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px 0 100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-display-sm)",
      color: "var(--text-primary-dark)",
      padding: "0 var(--space-5)",
      marginBottom: "var(--space-4)"
    }
  }, "Community"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)"
    }
  }, POSTS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 var(--space-5)",
      marginBottom: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-md)",
      color: "var(--text-primary-dark)"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-tertiary-dark)"
    }
  }, p.time, " ago"))), /*#__PURE__*/React.createElement("img", {
    src: p.image,
    style: {
      width: "100%",
      height: 260,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-3) var(--space-5) 0",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: 32,
    icon: /*#__PURE__*/React.createElement("span", null, "\u2661")
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: 32,
    icon: /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCAC")
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "ghost",
    size: 32,
    icon: /*#__PURE__*/React.createElement("span", null, "\u2197")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-5)",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-md)",
      color: "var(--text-primary-dark)"
    }
  }, p.likes, " likes"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-secondary-dark)",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("b", null, p.name.split(" ")[0]), " ", p.caption))))));
}
window.FeedScreen = FeedScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/FeedScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/HomeScreen.jsx
try { (() => {
const SESSIONS = [{
  id: 1,
  title: "Yoga on the grass",
  sport: "Yoga",
  time: "Sat Â· 7:00am",
  place: "Lekki Turf",
  spots: "6 spots left",
  image: "../../assets/photography/session-yoga-pair.jpeg",
  tone: "green"
}, {
  id: 2,
  title: "Archery basics",
  sport: "Archery",
  time: "Sat Â· 9:00am",
  place: "Freedom Park Range",
  spots: "3 spots left",
  image: "../../assets/photography/archery.jpeg",
  tone: "orange"
}, {
  id: 3,
  title: "Beach volleyball",
  sport: "Volleyball",
  time: "Sun Â· 4:00pm",
  place: "Landmark Beach",
  spots: "Full",
  image: "../../assets/photography/beach-volleyball.jpeg",
  tone: "neutral"
}, {
  id: 4,
  title: "Lagoon kayaking",
  sport: "Kayaking",
  time: "Sun Â· 8:00am",
  place: "Five Cowries",
  spots: "8 spots left",
  image: "../../assets/photography/kayaking.jpeg",
  tone: "green"
}];
function HomeScreen({
  onOpenSession,
  Card,
  Badge,
  Tag,
  Avatar
}) {
  const [filter, setFilter] = React.useState("All");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px var(--space-5) var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-wide-label)",
      textTransform: "uppercase",
      color: "var(--accent-primary)"
    }
  }, "THIS WEEK'S SESSIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-display-sm)",
      color: "var(--text-primary-dark)",
      marginTop: 4
    }
  }, "Saturday, 7am.")), /*#__PURE__*/React.createElement(Avatar, {
    name: "Tomi Adeyemi",
    ring: true,
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      overflowX: "auto",
      paddingBottom: 4
    }
  }, ["All", "Yoga", "Archery", "Volleyball", "Kayaking"].map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    selected: filter === f,
    onClick: () => setFilter(f)
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)"
    }
  }, SESSIONS.filter(s => filter === "All" || s.sport === filter).map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    variant: "photo",
    image: s.image,
    onClick: () => onOpenSession(s)
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone,
    variant: "solid"
  }, s.spots), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-title-lg)",
      color: "#fff",
      marginTop: 8
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--navy-100)",
      marginTop: 2
    }
  }, s.time, " \xB7 ", s.place)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-6) var(--space-5) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-tertiary-dark)"
    }
  }, "128 people already said yes to this Saturday.")));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PhoneFrame.jsx
try { (() => {
/** iPhone-ish frame + fixed content area used to preview app screens in the kit's index.html. */
function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      borderRadius: 44,
      background: "var(--navy-950)",
      border: "10px solid #000",
      boxShadow: "var(--shadow-lg)",
      overflow: "hidden",
      position: "relative",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 120,
      height: 28,
      background: "#000",
      borderRadius: "0 0 18px 18px",
      zIndex: 100
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      overflowY: "auto"
    }
  }, children));
}
window.PhoneFrame = PhoneFrame;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ScheduleScreen.jsx
try { (() => {
const DAYS = [{
  day: "Sat",
  date: "12",
  sessions: [{
    time: "7:00am",
    title: "Yoga on the grass",
    place: "Lekki Turf"
  }, {
    time: "9:00am",
    title: "Archery basics",
    place: "Freedom Park"
  }]
}, {
  day: "Sun",
  date: "13",
  sessions: [{
    time: "8:00am",
    title: "Lagoon kayaking",
    place: "Five Cowries"
  }, {
    time: "4:00pm",
    title: "Beach volleyball",
    place: "Landmark Beach"
  }]
}];
function ScheduleScreen({
  Tabs,
  Card
}) {
  const [tab, setTab] = React.useState("Upcoming");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px var(--space-5) 100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-display-sm)",
      color: "var(--text-primary-dark)",
      marginBottom: "var(--space-4)"
    }
  }, "Schedule"), /*#__PURE__*/React.createElement(Tabs, {
    items: ["Upcoming", "Past"],
    active: tab,
    onChange: setTab,
    style: {
      marginBottom: "var(--space-5)"
    }
  }), tab === "Upcoming" ? DAYS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.day,
    style: {
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-lg)",
      color: "var(--text-tertiary-dark)",
      marginBottom: "var(--space-3)"
    }
  }, d.day, " \xB7 ", d.date), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3)"
    }
  }, d.sessions.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    variant: "plain",
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-title-md)",
      color: "var(--text-primary-dark)"
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-tertiary-dark)",
      marginTop: 2
    }
  }, s.place)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-md)",
      color: "var(--accent-primary)"
    }
  }, s.time)))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-tertiary-dark)",
      textAlign: "center",
      marginTop: 40
    }
  }, "No past sessions yet \u2014 see you Saturday."));
}
window.ScheduleScreen = ScheduleScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SessionDetailScreen.jsx
try { (() => {
function SessionDetailScreen({
  session,
  onBack,
  Badge,
  IconButton,
  Avatar
}) {
  if (!session) return null;
  const attendees = ["Tomi A.", "Chidi O.", "Zainab K.", "Femi B."];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 320,
      position: "relative",
      background: `linear-gradient(to top, var(--navy-950) 0%, rgba(5,7,13,0.1) 60%, rgba(5,7,13,0.35) 100%), url(${session.image}) center/cover`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 56,
      left: 20,
      right: 20,
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "scrim",
    icon: /*#__PURE__*/React.createElement("span", null, "\u2190"),
    onClick: onBack
  }), /*#__PURE__*/React.createElement(IconButton, {
    variant: "scrim",
    icon: /*#__PURE__*/React.createElement("span", null, "\u2661")
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      marginTop: -40,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: session.tone,
    variant: "solid"
  }, session.spots), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-display-sm)",
      color: "var(--text-primary-dark)",
      marginTop: 10
    }
  }, session.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-secondary-dark)",
      marginTop: 6
    }
  }, session.time, " \xB7 ", session.place), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, attendees.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      marginLeft: i === 0 ? 0 : -10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a,
    size: 32
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-tertiary-dark)"
    }
  }, "+124 going")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-secondary-dark)",
      marginTop: "var(--space-5)",
      lineHeight: 1.6,
      paddingBottom: 90
    }
  }, "Same crew, same pitch, every week. Bring water, a mat if you have one \u2014 we've got spares. Show up 10 minutes early to meet the group before we start.")));
}
window.SessionDetailScreen = SessionDetailScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SessionDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CommunityStrip.jsx
try { (() => {
function CommunityStrip() {
  const photos = ["../../assets/photography/group-photo-pitch.jpeg", "../../assets/photography/group-stretch-pitch.jpeg", "../../assets/photography/kayaking.jpeg", "../../assets/photography/group-lie-down-stretch.jpeg"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-app)",
      padding: "var(--space-16) var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-display-md)",
      color: "var(--text-primary-dark)",
      marginBottom: "var(--space-2)"
    }
  }, "128 people already said yes to this one."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-lg)",
      color: "var(--text-secondary-dark)",
      marginBottom: "var(--space-8)"
    }
  }, "Found on Instagram. Stayed for the community."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-4)"
    }
  }, photos.map(p => /*#__PURE__*/React.createElement("img", {
    key: p,
    src: p,
    style: {
      width: "100%",
      height: 200,
      objectFit: "cover",
      borderRadius: "var(--radius-md)"
    }
  }))));
}
window.CommunityStrip = CommunityStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CommunityStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-site)",
      borderTop: "1px solid var(--border-subtle-light)",
      padding: "var(--space-10) var(--space-8)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/hybrid-logo.svg",
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-6)",
      font: "var(--text-body-sm)",
      color: "var(--text-secondary-light)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Instagram"), /*#__PURE__*/React.createElement("span", null, "WhatsApp"), /*#__PURE__*/React.createElement("span", null, "Lagos, Nigeria")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
function Hero({
  Button
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 640,
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photography/drone-group-workout.jpeg",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(5,7,13,0.92) 10%, rgba(5,7,13,0.25) 60%, rgba(5,7,13,0.1) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "0 var(--space-8) var(--space-16)",
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-wide-label)",
      textTransform: "uppercase",
      color: "var(--accent-primary)"
    }
  }, "LAGOS \xB7 EVERY SATURDAY, 7AM"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-display-xl)",
      color: "#fff",
      margin: "var(--space-3) 0"
    }
  }, "Same pitch, new PR."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-lg)",
      color: "var(--navy-100)",
      maxWidth: 480,
      marginBottom: "var(--space-6)"
    }
  }, "Yoga, archery, volleyball, kayaking \u2014 one club, a new sport every week. Find your Saturday crew."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Join a session"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "lg"
  }, "See this week's schedule"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SessionGrid.jsx
try { (() => {
const SESSIONS = [{
  title: "Yoga on the grass",
  time: "Sat Â· 7:00am Â· Lekki Turf",
  image: "../../assets/photography/session-yoga-pair.jpeg",
  tone: "green",
  tag: "6 spots left"
}, {
  title: "Archery basics",
  time: "Sat Â· 9:00am Â· Freedom Park",
  image: "../../assets/photography/archery.jpeg",
  tone: "orange",
  tag: "3 spots left"
}, {
  title: "Beach volleyball",
  time: "Sun Â· 4:00pm Â· Landmark Beach",
  image: "../../assets/photography/beach-volleyball.jpeg",
  tone: "neutral",
  tag: "Full"
}];
function SessionGrid({
  Card,
  Badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-16) var(--space-8)",
      background: "var(--bg-site)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-wide-label)",
      textTransform: "uppercase",
      color: "var(--green-600)",
      marginBottom: "var(--space-2)"
    }
  }, "THIS WEEK'S SESSIONS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-display-md)",
      color: "var(--text-primary-light)",
      margin: "0 0 var(--space-8)"
    }
  }, "This week: yoga, archery, and a paddle out on the lagoon."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-5)"
    }
  }, SESSIONS.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    variant: "photo",
    image: s.image,
    style: {
      minHeight: 280
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone,
    variant: "solid"
  }, s.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-title-lg)",
      color: "#fff",
      marginTop: 8
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--navy-100)",
      marginTop: 2
    }
  }, s.time)))));
}
window.SessionGrid = SessionGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SessionGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SessionPage.jsx
try { (() => {
function SessionPage({
  Button,
  Badge,
  Avatar
}) {
  const attendees = ["Tomi A.", "Chidi O.", "Zainab K.", "Femi B.", "Ada N."];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bg-site)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 420
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/photography/archery.jpeg",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, var(--bg-site) 0%, rgba(5,7,13,0.15) 60%, rgba(5,7,13,0.35) 100%)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "-60px auto 0",
      position: "relative",
      background: "var(--bg-site-elevated)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-8)",
      boxShadow: "var(--shadow-md)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "orange",
    variant: "solid"
  }, "3 spots left"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-display-lg)",
      color: "var(--text-primary-light)",
      margin: "var(--space-3) 0"
    }
  }, "Archery basics"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-lg)",
      color: "var(--text-secondary-light)",
      marginBottom: "var(--space-6)"
    }
  }, "Saturday \xB7 9:00am \xB7 Freedom Park Range"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, attendees.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      marginLeft: i === 0 ? 0 : -10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: a,
    size: 36
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-tertiary-light)"
    }
  }, "+123 going")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-lg)",
      color: "var(--text-secondary-light)",
      lineHeight: 1.6,
      marginBottom: "var(--space-8)"
    }
  }, "No experience needed \u2014 bows and gear provided by our partner range. Bring closed-toe shoes and water. Show up 10 minutes early to meet the group."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Save your spot")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 60
    }
  }));
}
window.SessionPage = SessionPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SessionPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BottomTabBar = __ds_scope.BottomTabBar;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

})();
